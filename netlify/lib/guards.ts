import { createHash } from "node:crypto";
import { getStore } from "@netlify/blobs";

/** Fixed server-side model settings – never taken from the browser. */
export const OPENAI_MODEL = "gpt-4.1-mini";
export const CHAT_TEMPERATURE = 0.4;

export const LIMITS = {
  /** Max. messages (user + assistant) per conversation. */
  maxConversationMessages: 80,
  /** Max. characters of a single parent message. */
  maxUserMessageChars: 2000,
  /** Max. characters of a single Mimi answer sent back to the server. */
  maxAssistantMessageChars: 12000,
  /** Mimi's system prompt is built in the browser and is large (~80k chars). */
  maxSystemPromptChars: 150000,
  maxTotalChars: 300000,
};

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function errorResponse(message: string, status: number): Response {
  return jsonResponse({ error: { message } }, status);
}

/**
 * Validates a conversation. Returns an error text or null if everything is fine.
 * `allowSystem` permits exactly one system message at the very beginning.
 */
export function validateMessages(
  messages: unknown,
  allowSystem: boolean
): { error: string } | { messages: ChatMessage[] } {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { error: "Keine Nachrichten übermittelt." };
  }

  const clean: ChatMessage[] = [];
  let conversationCount = 0;
  let totalChars = 0;

  for (const [index, raw] of messages.entries()) {
    if (!raw || typeof raw !== "object") return { error: "Ungültige Nachricht." };

    const { role, content } = raw as Record<string, unknown>;
    if (typeof content !== "string") return { error: "Ungültige Nachricht." };

    if (role === "system") {
      if (!allowSystem || index !== 0) {
        return { error: "System-Nachrichten sind hier nicht erlaubt." };
      }
      if (content.length > LIMITS.maxSystemPromptChars) {
        return { error: "System-Prompt ist zu lang." };
      }
    } else if (role === "user") {
      if (content.length > LIMITS.maxUserMessageChars) {
        return {
          error: `Nachricht ist zu lang (max. ${LIMITS.maxUserMessageChars} Zeichen).`,
        };
      }
      conversationCount++;
    } else if (role === "assistant") {
      if (content.length > LIMITS.maxAssistantMessageChars) {
        return { error: "Antwort ist zu lang." };
      }
      conversationCount++;
    } else {
      return { error: "Ungültige Rolle." };
    }

    totalChars += content.length;
    clean.push({ role, content });
  }

  if (conversationCount > LIMITS.maxConversationMessages) {
    return { error: "Das Gespräch ist zu lang geworden. Bitte starte neu." };
  }

  if (totalChars > LIMITS.maxTotalChars) {
    return { error: "Das Gespräch ist zu lang geworden. Bitte starte neu." };
  }

  return { messages: clean };
}

/**
 * Simple fixed-window rate limit per visitor (hashed IP), stored in Netlify Blobs.
 * Returns true if the request is allowed.
 */
export async function checkRateLimit(
  scope: string,
  ip: string | undefined,
  limitPerHour: number
): Promise<boolean> {
  try {
    const visitor = createHash("sha256")
      .update(`${process.env.SITE_ID ?? "mimi"}:${ip ?? "unknown"}`)
      .digest("hex")
      .slice(0, 32);
    const hour = Math.floor(Date.now() / 3_600_000);
    const key = `${scope}/${hour}/${visitor}`;

    const store = getStore({ name: "rate-limits", consistency: "strong" });
    const current = (await store.get(key, { type: "json" })) as
      | { count: number }
      | null;
    const count = current?.count ?? 0;

    if (count >= limitPerHour) return false;

    await store.setJSON(key, { count: count + 1 });
    return true;
  } catch (error) {
    // Never block real parents because the limiter itself had a hiccup.
    console.error("Rate limit check failed", error);
    return true;
  }
}

/**
 * Prefers the site's own OpenAI key. Modern Netlify Functions additionally get
 * Netlify AI Gateway credentials injected as OPENAI_API_KEY + OPENAI_BASE_URL
 * when no own OPENAI_API_KEY is set – those are only used as a fallback.
 */
function getOpenAIConfig(): { key: string; url: string } {
  const gatewayBase = process.env.OPENAI_BASE_URL;
  const ownKey = gatewayBase
    ? process.env.VITE_OPENAI_API_KEY
    : (process.env.OPENAI_API_KEY ?? process.env.VITE_OPENAI_API_KEY);

  if (ownKey) {
    return { key: ownKey, url: "https://api.openai.com/v1/chat/completions" };
  }

  return {
    key: process.env.OPENAI_API_KEY ?? "",
    url: `${(gatewayBase ?? "https://api.openai.com/v1").replace(/\/$/, "")}/chat/completions`,
  };
}

/** Entfernt (auch maskierte) API-Schlüssel aus Fehlertexten, bevor sie geloggt werden. */
export function redactSecrets(text: string): string {
  return text.replace(/\b(sk|xkeysib|nf)[-_][A-Za-z0-9*_\-.]{4,}/g, "[entfernt]");
}

export function getOpenAIKey(): string {
  return getOpenAIConfig().key;
}

export async function callOpenAI(body: Record<string, unknown>): Promise<Response> {
  const { key, url } = getOpenAIConfig();
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ model: OPENAI_MODEL, ...body }),
  });
}
