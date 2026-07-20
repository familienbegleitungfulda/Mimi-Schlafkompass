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
  recommendation: Extract<ModeRecommendation, { mode: "course" }>,
  analysisReady: boolean
): string {
  if (!analysisReady || recommendation.modules.length === 0) {
    return `
MODUL-EMPFEHLUNG (Schlummerwerkstatt-Kurs-Modus)

Analyse noch nicht vollständig.

Empfehle KEINE Module.

Sage stattdessen:
"Ich würde gerne noch ein paar Dinge verstehen, bevor ich eine Einschätzung abgebe."

Stelle dann ein bis zwei gezielte Rückfragen zu fehlenden Bereichen.
`.trim();
  }

  const moduleDetails = recommendation.modules
    .map((module) => {
      const chapter = module.primaryChapter;
      const chapterLine = chapter
        ? `Kapitel: ${chapter.title}${chapter.timestamp ? ` (${chapter.timestamp})` : ""}`
        : "";

      const pdfs =
        module.roadmap.pdfs.length > 0
          ? `PDFs: ${module.roadmap.pdfs.map((pdf) => pdf.title).join(", ")}`
          : "";

      const exercises =
        module.roadmap.exercises.length > 0
          ? `Übungen: ${module.roadmap.exercises.map((exercise) => exercise.title).join(", ")}`
          : "";

      const bonus =
        module.roadmap.bonus.length > 0
          ? `Bonus: ${module.roadmap.bonus.map((item) => item.title).join(", ")}`
          : "";

      return [
        `Modul: ${module.title}`,
        `Beschreibung: ${module.description}`,
        chapterLine,
        pdfs,
        exercises,
        bonus,
      ]
        .filter(Boolean)
        .join("\n");
    })
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

VOR der Modulempfehlung IMMER zusammenfassen:

"Ich glaube, ich habe inzwischen ein gutes Gesamtbild."
"Mir fallen aktuell vor allem folgende Bereiche auf: …"
"Deshalb würde ich dir zuerst diese Module empfehlen."

WICHTIG:

- Empfehle Module nur, wenn mehrere Hinweise zusammenpassen
- Erkläre immer, warum genau diese Module passen – nicht nur Modulnamen nennen
- Gib 2–4 konkrete Handlungsschritte für HEUTE
- Nenne optional Kapitel, PDFs, Bonusmaterial oder Übungen
- Modultitel dürfen im Fließtext genannt werden
`.trim();
}

export function buildModeOutputPrompt(
  recommendation: ModeRecommendation,
  analysisReady: boolean
): string {
  if (recommendation.mode === "course") {
    return buildCourseOutputPrompt(recommendation, analysisReady);
  }

  return buildPublicOutputPrompt(recommendation);
}

export function buildAnalysisEndInstructions(
  recommendation: ModeRecommendation,
  analysisReady: boolean
): string {
  if (!analysisReady) {
    return `
Analyse noch NICHT erlaubt.

→ Schreibe KEINE Analyse.
→ Empfehle KEIN Produkt und keine Module.
→ Sage: "Ich würde gerne noch ein paar Dinge verstehen, bevor ich eine Einschätzung abgebe."
→ Stelle ein bis zwei gezielte Rückfragen zu den fehlenden Bereichen.
→ Beende die Antwort OHNE ### ANALYSE BEENDET ###
    `.trim();
  }

  if (recommendation.mode === "course") {
    return `
Nach der vollständigen Analyse:

→ Fasse zuerst das Gesamtbild zusammen.
→ Nenne die wichtigsten Bereiche, die dir aufgefallen sind.
→ Empfehle passende Module der Schlummerwerkstatt (siehe MODUL-EMPFEHLUNG) und erkläre warum.
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
