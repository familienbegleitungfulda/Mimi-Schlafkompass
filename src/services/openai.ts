import type { Message } from "../chat/conversation";
import { resolveAppMode, type AppMode } from "../config";
import { extractionPrompt } from "../engine/extractionPrompt";
import { buildRecommendation } from "../engine/recommendationEngine";
import { buildAnalysisEndInstructions } from "../engine/outputPrompts";
import { buildPrompt } from "../engine/promptBuilder";
import { knowledge } from "../data/knowledge";
import { ageKnowledge } from "../data/ageKnowledge";
import { redFlags } from "../data/redFlags";
import { mayaKnowledge } from "../data/mayaKnowledge";
import { sleepRules } from "../data/sleepRules";
import { ageProfiles } from "../data/ageProfiles";
import { mayaMethods } from "../data/mayaMethods";
import { sleepPressure } from "../data/sleepPressure";
import { conversationRules } from "../data/conversationRules";
import { updateMemory } from "../engine/memoryEngine";
import { sleepNeeds } from "../data/sleepNeeds";
import { shouldAnalyse } from "../engine/reasoningEngine";
import type { ResolvedCourseModule } from "../data/course";
import { products } from "../data/products";
import { courseKnowledgeBase, courseModules } from "../data/course";

const DEV_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;

/** Production uses Netlify Function so the key is read at runtime on the server. */
const CHAT_ENDPOINT = import.meta.env.PROD
  ? "/.netlify/functions/chat"
  : "https://api.openai.com/v1/chat/completions";

async function chat(messages: Message[] | { role: string; content: string }[]) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (!import.meta.env.PROD) {
    if (!DEV_API_KEY) {
      throw new Error(
        "Missing VITE_OPENAI_API_KEY in .env for local development."
      );
    }
    headers.Authorization = `Bearer ${DEV_API_KEY}`;
  }

  const response = await fetch(CHAT_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      temperature: 0.4,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

function buildCoursePromptSection(): string {
  return `
${courseKnowledgeBase}

Verfügbare Kursmodule:

${JSON.stringify(courseModules, null, 2)}
  `.trim();
}

export type MimiResponse = {
  message: string;
  products: (typeof products)[number][];
  modules: ResolvedCourseModule[];
  mode: AppMode;
};

export async function askMimi(messages: Message[]): Promise<MimiResponse> {
  const mode = resolveAppMode();

  const extraction = await chat([
    { role: "system", content: extractionPrompt },
    ...messages,
  ]);

  let extracted: Record<string, unknown> = {};

  try {
    extracted = JSON.parse(extraction.choices[0].message.content);
  } catch {
    extracted = {};
  }

  const previousMemory =
    (globalThis as Record<string, unknown>).__mimiMemory ?? {};

  const memory = updateMemory(previousMemory, extracted);
  (globalThis as Record<string, unknown>).__mimiMemory = memory;

  const reasoning = shouldAnalyse(memory, mode);
  const recommendation = buildRecommendation(memory, mode, reasoning.ready);

  const recommendedProducts =
    recommendation.mode === "public" &&
    reasoning.ready &&
    recommendation.product
      ? [recommendation.product]
      : [];

  const recommendedModules =
    recommendation.mode === "course" && reasoning.ready
      ? recommendation.modules
      : [];

  const courseSection = mode === "course" ? buildCoursePromptSection() : "";

  const prompt = `
${knowledge}

${courseSection}

${mayaKnowledge}

${conversationRules}

${mayaMethods}

${sleepPressure}

${sleepNeeds}

${sleepRules}

${ageProfiles}

${ageKnowledge}

${redFlags}

${buildPrompt(memory, recommendation, reasoning.ready)}

WICHTIG

Analyse erlaubt:

${reasoning.ready ? "JA" : "NEIN"}

Fehlende Informationen:

${reasoning.missing.join(", ") || "keine"}

${buildAnalysisEndInstructions(recommendation, reasoning.ready)}
  `.trim();

  const response = await chat([
    { role: "system", content: prompt },
    ...messages,
  ]);

  return {
    message: response.choices[0].message.content ?? "",
    products: recommendedProducts,
    modules: recommendedModules,
    mode,
  };
}
