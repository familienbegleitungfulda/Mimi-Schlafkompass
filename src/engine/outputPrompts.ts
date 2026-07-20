import type { ModeRecommendation } from "./recommendationEngine";
import { formatModuleRecommendationsForPrompt } from "../data/course/moduleRecommendationBuilder";
import type { ResolvedCourseModule } from "../data/course";

function formatDetectedIssues(recommendation: ModeRecommendation): string {
  return recommendation.detectedIssues.length > 0
    ? recommendation.detectedIssues.map((issue) => `• ${issue}`).join("\n")
    : "• Keine spezifischen Hinweise";
}

export function buildPublicOutputPrompt(
  recommendation: Extract<ModeRecommendation, { mode: "public" }>
): string {
  return `
PRODUKTEMPFEHLUNG (Öffentlicher Modus – Schlafkompass)

Unter deiner Antwort erscheint automatisch genau EIN Angebot als Produktkarte.
Die Produktkarte wird NUR angezeigt, wenn deine Antwort mit ### ANALYSE BEENDET ### endet.

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

Du empfiehlst KEINE Module der Schlummerwerkstatt – nur das automatisch angezeigte Produkt.

Schreibe keine allgemeine Werbebeschreibung. Beziehe dich immer auf die individuellen Antworten der Familie.

Verkaufe nicht. Erkläre den persönlichen Bezug.

Beende die Analyse IMMER mit der Zeile ### ANALYSE BEENDET ### – sonst erscheint keine Produktkarte.
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

  const moduleGuidance = formatModuleRecommendationsForPrompt(
    recommendation.modules as Array<
      ResolvedCourseModule & {
        recommendation: NonNullable<ResolvedCourseModule["recommendation"]>;
      }
    >
  );

  return `
MODUL-EMPFEHLUNG (Schlummerwerkstatt – nur Kursmodule)

Die Familie hat bereits Zugang zur Schlummerwerkstatt.

Verkaufe KEINE externen Kurse oder Produkte. Empfehle ausschließlich konkrete Module aus der Schlummerwerkstatt.
Empfehle NIEMALS Produkte aus dem öffentlichen Schlafkompass (Mini-Kurs, 1:1 Beratung usw.).

Die Modulkarten werden NUR angezeigt, wenn deine Antwort mit ### ANALYSE BEENDET ### endet.

Empfohlene Module mit Begründung (erscheinen automatisch als Karten unter der Analyse):

${moduleGuidance}

Aus den Antworten erkannte Herausforderungen:

${formatDetectedIssues(recommendation)}

Anleitung für den Fließtext am Ende deiner Analyse:

${recommendation.guidance}

PFLICHTFORMAT für die Modulempfehlung:

1. Gesamtbild zusammenfassen.
2. Für jedes Modul einzeln und nummeriert nach Priorität:
   - Modultitel und konkreter Fokus (z. B. "Federwiege liebevoll abgewöhnen")
   - Warum es zu den Antworten passt
   - Welches Problem es lösen soll
   - Warum es diese Priorität hat
3. Bei Strukturproblemen + Einschlafhilfe: erst Struktur/Reizverarbeitung, dann Einschlafhilfe.

STRENG VERBOTEN:
- "ein Angebot könnte passen"
- "Genau deshalb könnte dieses Angebot …"
- "Das passende Angebot findest du …"
- Allgemeine Werbung statt konkreter Modulnamen
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
    if (recommendation.mode === "course") {
      return `
Analyse noch NICHT erlaubt.

→ Schreibe KEINE Analyse.
→ Empfehle KEINE Module.
→ Sage: "Ich würde gerne noch ein paar Dinge verstehen, bevor ich eine Einschätzung abgebe."
→ Stelle ein bis zwei gezielte Rückfragen zu den fehlenden Bereichen.
→ Beende die Antwort OHNE ### ANALYSE BEENDET ###
      `.trim();
    }

    return `
Analyse noch NICHT erlaubt.

→ Schreibe KEINE Analyse.
→ Empfehle KEIN Produkt.
→ Stelle genau EINE gezielte Rückfrage zu den fehlenden Bereichen.
→ Beende die Antwort OHNE ### ANALYSE BEENDET ###
    `.trim();
  }

  if (recommendation.mode === "course") {
    return `
Nach der vollständigen Analyse:

→ Fasse zuerst das Gesamtbild zusammen.
→ Empfehle konkrete Module der Schlummerwerkstatt – mit Modultitel, Fokus, Begründung, Problem und Priorität.
→ Erkläre die Reihenfolge (z. B. erst Schlafstruktur, dann Federwiege).
→ Gib konkrete Handlungsschritte für heute.
→ Verwende KEINE allgemeinen Angebots-Formulierungen.
→ Beende die Antwort mit

### ANALYSE BEENDET ###
    `.trim();
  }

  return `
Nach der Analyse:

→ Schreibe 2–4 personalisierte Sätze zur Produktempfehlung (ohne Kursnamen – siehe PRODUKTEMPFEHLUNG).
→ Nenne im Fließtext NIEMALS einen Kursnamen oder Produkttitel.
→ Die Produktkarte erscheint automatisch unter deiner Antwort – du musst den Produktnamen nicht nennen.
→ Beende die Antwort zwingend mit

### ANALYSE BEENDET ###

Ohne diese Zeile wird keine Produktkarte angezeigt.
  `.trim();
}
