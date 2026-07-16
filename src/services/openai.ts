import type { Message } from "../chat/conversation";
import { extractionPrompt } from "../engine/extractionPrompt";
import { buildRecommendation } from "../engine/productEngine";
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

export async function askMimi(messages: Message[]) {
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
  const reasoning = shouldAnalyse(memory);

  const recommendation = buildRecommendation(memory);

  const products = recommendation.product
    ? [recommendation.product]
    : [];

  const prompt = `
${knowledge}

${mayaKnowledge}

${conversationRules}

${mayaMethods}

${sleepPressure}

${sleepNeeds}

${sleepRules}

${ageProfiles}

${ageKnowledge}

${redFlags}

${buildPrompt(
  memory,
  recommendation
)}

WICHTIG

Analyse erlaubt:

${reasoning.ready ? "JA" : "NEIN"}

Fehlende Informationen:

${reasoning.missing.join(", ") || "keine"}

Wenn Analyse erlaubt = NEIN

→ Schreibe KEINE Analyse.

→ Empfiehl KEIN Produkt.

→ Stelle genau EINE weitere Rückfrage.

Wenn Analyse erlaubt = JA

→ Erstelle die Analyse.

→ Schreibe am Ende 2–4 personalisierte Sätze zur Produktempfehlung (ohne Kursnamen – siehe PRODUKTEMPFEHLUNG).

→ Nenne im Fließtext NIEMALS einen Kursnamen oder Produkttitel.

→ Beende die Antwort mit

### ANALYSE BEENDET ###
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
  };
}