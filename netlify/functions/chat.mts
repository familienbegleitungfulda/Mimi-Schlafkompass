import type { Context } from "@netlify/functions";
import {
  CHAT_TEMPERATURE,
  callOpenAI,
  checkRateLimit,
  errorResponse,
  getOpenAIKey,
  redactSecrets,
  validateMessages,
} from "../lib/guards";

/** Each chat turn needs two calls (extraction + answer). */
const CHAT_REQUESTS_PER_HOUR = 150;
const CHAT_MAX_TOKENS = 3000;

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (!getOpenAIKey()) {
    return errorResponse(
      "Missing OpenAI API key in Netlify environment (OPENAI_API_KEY).",
      500
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Ungültige Anfrage.", 400);
  }

  const validated = validateMessages(body.messages, true);
  if ("error" in validated) {
    return errorResponse(validated.error, 400);
  }

  if (!(await checkRateLimit("chat", context.ip, CHAT_REQUESTS_PER_HOUR))) {
    return errorResponse(
      "Zu viele Anfragen in kurzer Zeit. Bitte versuch es später noch einmal.",
      429
    );
  }

  // Model and temperature are fixed here – values from the browser are ignored.
  const response = await callOpenAI({
    temperature: CHAT_TEMPERATURE,
    max_tokens: CHAT_MAX_TOKENS,
    messages: validated.messages,
  });

  if (!response.ok) {
    console.error(`chat: OpenAI error ${response.status}: ${redactSecrets(await response.text())}`);
    return errorResponse("Mimi ist gerade nicht erreichbar. Bitte versuch es gleich noch einmal.", 502);
  }

  return new Response(await response.text(), {
    status: response.status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
};
