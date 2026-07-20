import type { ModeRecommendation } from "./recommendationEngine";

function formatDetectedIssues(recommendation: ModeRecommendation): string {
  return recommendation.detectedIssues.length > 0
    ? recommendation.detectedIssues.map((issue) => `• ${issue}`).join("\n")
    : "• Keine spezifischen Hinweise";
}

export function buildPublicOutputPrompt(
  recommendation: Extract<ModeRecommendation, { mode: "public" }>
): string {
  return `
PRODUKTEMPFEHLUNG (Öffentlicher Modus)

Unter deiner Antwort erscheint automatisch genau EIN Angebot als Produktkarte.

Das empfohlene Angebot (NUR für dein Wissen – NIEMALS im Fließtext nennen):

Titel: ${recommendation.product?.title ?? "–"}
Beschreibung: ${recommendation.product?.description ?? "–"}
Schwerpunkte: ${recommendation.courseFocus.join(", ")}

Aus den Antworten erkannte Herausforderungen:

${formatDetectedIssues(recommendation)}

Anleitung für den Fließtext am Ende deiner Analyse:

${recommendation.guidance}

WICHTIG – NIEMALS im Fließtext:

- Keinen Kursnamen nennen (z. B. Schlummerwerkstatt, Mini-Kurs, Schlafbasis, Struktur & Überreizung)
- Keinen Produkttitel nennen
- Keine Formulierung wie "Ich empfehle dir den Kurs..."
- Titel und Beschreibung des Angebots nicht wiederholen – die Produktkarte darunter zeigt das automatisch

Der konkrete Produktname erscheint ausschließlich in der Produktkarte unter der Analyse.

Schreibe keine allgemeine Werbebeschreibung. Beziehe dich immer auf die individuellen Antworten der Familie.

Verkaufe nicht. Erkläre den persönlichen Bezug.
`.trim();
}

export function buildCourseOutputPrompt(
  recommendation: Extract<ModeRecommendation, { mode: "course" }>
): string {
  const moduleDetails = recommendation.modules
    .map(
      (module) =>
        `Modul: ${module.title}
Beschreibung: ${module.description}
Kapitel: ${module.chapter}${module.timestamp ? `\nZeitmarke: ${module.timestamp}` : ""}`
    )
    .join("\n\n");

  return `
MODUL-EMPFEHLUNG (Schlummerwerkstatt-Kurs-Modus)

Die Familie hat bereits Zugang zur Schlummerwerkstatt.

Verkaufe KEINE externen Kurse oder Produkte. Empfehle ausschließlich Module aus der Schlummerwerkstatt.

Empfohlene Module (erscheinen automatisch als Karten unter der Analyse):

${moduleDetails}

Aus den Antworten erkannte Herausforderungen:

${formatDetectedIssues(recommendation)}

Anleitung für den Fließtext am Ende deiner Analyse:

${recommendation.guidance}

WICHTIG:

- Erkläre in 2–4 Sätzen, warum genau diese Module zu den Antworten passen
- Gib 2–4 konkrete Handlungsschritte für HEUTE
- Nenne optional Kapitel oder Zeitmarken aus der Schlummerwerkstatt
- Verkaufe keine Kurse – die Familie ist bereits Teilnehmerin
- Modultitel dürfen im Fließtext genannt werden (im Gegensatz zum öffentlichen Modus)
`.trim();
}

export function buildModeOutputPrompt(recommendation: ModeRecommendation): string {
  if (recommendation.mode === "course") {
    return buildCourseOutputPrompt(recommendation);
  }

  return buildPublicOutputPrompt(recommendation);
}

export function buildAnalysisEndInstructions(
  recommendation: ModeRecommendation
): string {
  if (recommendation.mode === "course") {
    return `
Nach der Analyse:

→ Empfehle passende Module der Schlummerwerkstatt (siehe MODUL-EMPFEHLUNG).
→ Gib konkrete Handlungsschritte für heute.
→ Verkaufe keine externen Kurse oder Produkte.
→ Beende die Antwort mit

### ANALYSE BEENDET ###
    `.trim();
  }

  return `
Nach der Analyse:

→ Schreibe 2–4 personalisierte Sätze zur Produktempfehlung (ohne Kursnamen – siehe PRODUKTEMPFEHLUNG).
→ Nenne im Fließtext NIEMALS einen Kursnamen oder Produkttitel.
→ Beende die Antwort mit

### ANALYSE BEENDET ###
  `.trim();
}
