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
import { courseKnowledgeBase } from "../data/course";
import { courseModules } from "../data/course";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

async function chat(messages: any[]) {
  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.4,
        messages,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
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
    {
      role: "system",
      content: extractionPrompt,
    },
    ...messages,
  ]);

  let extracted: any = {};

  try {
    extracted = JSON.parse(
      extraction.choices[0].message.content
    );
  } catch {
    extracted = {};
  }

  const previousMemory =
    (globalThis as any).__mimiMemory ?? {};

  const memory = updateMemory(
    previousMemory,
    extracted
  );

  (globalThis as any).__mimiMemory = memory;
  const reasoning = shouldAnalyse(memory, mode);

  const recommendation = buildRecommendation(memory, mode, reasoning.ready);

  const products =
    recommendation.mode === "public" &&
    reasoning.ready &&
    recommendation.product
      ? [recommendation.product]
      : [];

  const modules =
    recommendation.mode === "course" && reasoning.ready
      ? recommendation.modules
      : [];

  const prompt = `
${knowledge}

${courseKnowledgeBase}

${mayaKnowledge}

${conversationRules}

${mayaMethods}

${sleepPressure}

${sleepNeeds}

${sleepRules}

${ageProfiles}

${ageKnowledge}

${redFlags}

Verfügbare Kursmodule:

${JSON.stringify(courseModules, null, 2)}

${buildPrompt(memory, recommendation, reasoning.ready)}

WICHTIG

Analyse erlaubt:

${reasoning.ready ? "JA" : "NEIN"}

Fehlende Informationen:

${reasoning.missing.join(", ") || "keine"}

${buildAnalysisEndInstructions(recommendation, reasoning.ready)}
  `;

  const response = await chat([
    {
      role: "system",
      content: prompt,
    },
    ...messages,
  ]);

  return {
    message: response.choices[0].message.content ?? "",
    products,
    modules,
    mode,
  };
}
