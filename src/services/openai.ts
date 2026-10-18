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
import { buildProductReasons } from "../engine/productSelection";
import { courseKnowledgeBase, courseModules } from "../data/course";

/**
 * All OpenAI requests go through the Netlify Function, which holds the API key
 * and fixes model, temperature and limits on the server.
 * Locally, run `netlify dev` so the function is available.
 */
const CHAT_ENDPOINT = "/.netlify/functions/chat";

async function chat(messages: Message[] | { role: string; content: string }[]) {
  const response = await fetch(CHAT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

/** Latest extracted sleep profile (e.g. the age parents named at the start). */
export function getMimiMemory(): Record<string, unknown> {
  return ((globalThis as Record<string, unknown>).__mimiMemory ?? {}) as Record<
    string,
    unknown
  >;
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
  /** 2–4 persönliche Gründe zur Produktkarte. */
  productReasons: string[];
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

  // Schlafkompass: Produkt immer mitschicken, sobald eins gewählt wurde.
  // Anzeige in der UI erst bei ### ANALYSE BEENDET ###.
  const recommendedProducts =
    recommendation.mode === "public" && recommendation.product
      ? [recommendation.product]
      : [];

  // Schlummerwerkstatt: Module nur bei vollständiger Analyse.
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
    productReasons: recommendedProducts[0]
      ? buildProductReasons(recommendedProducts[0].id, memory)
      : [],
    modules: recommendedModules,
    mode,
  };
}
