import type { ModeRecommendation } from "./recommendationEngine";
import { formatModuleRecommendationsForPrompt } from "../data/course/moduleRecommendationBuilder";
import { formatOfficialModuleList } from "../data/course/officialModules";
import type { ResolvedCourseModule } from "../data/course";

function formatDetectedIssues(recommendation: ModeRecommendation): string {
  return recommendation.detectedIssues.length > 0
    ? recommendation.detectedIssues.map((issue) => `• ${issue}`).join("\n")
    : "• Keine spezifischen Hinweise";
}

const HUNDEMUEDE_URL = "https://familienbegleitung-fulda.mytentary.com/p/fmf9YW";

const HUNDEMUEDE_RECOMMENDATION = `
AUSNAHME – KURSEMPFEHLUNG „Hundemüde, aber hellwach“

Bei Regulation und Überreizung empfiehlst du den Kurs „Hundemüde, aber hellwach“ ausdrücklich und warm im Fließtext – passend zur Situation der Familie, z. B.:
"Bei euch klingt vieles nach Überreizung. Genau dafür habe ich den Kurs ‚Hundemüde, aber hellwach‘ entwickelt."

Darum geht es im Kurs: Eltern verstehen, warum ihr Baby todmüde wirkt und trotzdem nicht abschalten kann. Sie finden heraus, ob ihr Kind reizoffen ist, ein FOMO-Baby oder beides. Sie lernen, Überreizung und Übermüdung zu unterscheiden, Pausen in den Tag einzubauen und den Abend als ruhigen Sinkflug zu gestalten. Dazu gibt es einen 7-Tage-Plan mit dem Begleit-Tool „Ruhewoche“ (Pausenfinder und SOS-Tool) und Rückfragen per Mail.

Link zum Kurs (immer vollständig und exakt so ausgeben, nie verändern): ${HUNDEMUEDE_URL}
`.trim();

export function buildPublicOutputPrompt(
  recommendation: Extract<ModeRecommendation, { mode: "public" }>
): string {
  if (recommendation.product?.id === "hundemuede") {
    return `
PRODUKTEMPFEHLUNG (Öffentlicher Modus – Schlafkompass)

Unter deiner Antwort erscheint automatisch eine Produktkarte zum Kurs „Hundemüde, aber hellwach“.
Die Produktkarte wird NUR angezeigt, wenn deine Antwort mit ### ANALYSE BEENDET ### endet.

Aus den Antworten erkannte Herausforderungen:

${formatDetectedIssues(recommendation)}

Anleitung für den Fließtext am Ende deiner Analyse:

${recommendation.guidance}

${HUNDEMUEDE_RECOMMENDATION}

WICHTIG – ABLAUF:

1. Zuerst 3–5 konkrete, individuelle Impulse und erste Empfehlungen – nummeriert und sofort hilfreich.
2. Danach den Kurs „Hundemüde, aber hellwach“ warm und persönlich empfehlen (2–3 Sätze) und den Link exakt so ausgeben: ${HUNDEMUEDE_URL}
3. Eltern sollen spüren, dass sie bereits Unterstützung erhalten haben.

WICHTIG – NIEMALS:

- Keinen Preis nennen. Fragen Eltern danach, verweise auf die Kursseite: ${HUNDEMUEDE_URL}
- Keine anderen Links erfinden oder den Link verändern
- Den Kurs „Schlummerbasis“ gibt es nicht mehr: nie empfehlen, nie als Alternative nennen, nie erwähnen
- Keine anderen Kurse nennen
- Die Analyse NICHT direkt mit der Produktempfehlung beginnen – immer zuerst die Tipps

Beende die Analyse IMMER mit der Zeile ### ANALYSE BEENDET ### – sonst erscheint keine Produktkarte.
`.trim();
  }

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

WICHTIG – ABLAUF:

1. Zuerst 3–5 konkrete, individuelle Impulse und erste Empfehlungen – nummeriert und sofort hilfreich.
2. Erst danach kurz erklären, warum das Angebot die Tipps ergänzen und vertiefen würde – nicht ersetzen.
3. Eltern sollen spüren, dass sie bereits Unterstützung erhalten haben.

WICHTIG – NIEMALS im Fließtext:

- Keinen Kursnamen nennen (z. B. Schlummerwerkstatt, Mini-Kurs)
- Keinen Produkttitel nennen
- Keine Formulierung wie "Ich empfehle dir den Kurs..."
- Titel und Beschreibung des Angebots nicht wiederholen – die Produktkarte darunter zeigt das automatisch
- Die Analyse NICHT direkt mit der Produktempfehlung beenden – immer zuerst die Tipps

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

OFFIZIELLE MODULNAMEN (ausschließlich diese verwenden):

${formatOfficialModuleList()}

VERBOTEN – keine erfundenen Modulbezeichnungen wie:
- Schlafdruck und Wachzeiten
- Tagesstruktur und Vorhersehbarkeit
- Reizverarbeitung und Nervensystem

Themen intern erkennen und dem passenden offiziellen Modul zuordnen.

Die Modulkarten werden NUR angezeigt, wenn deine Antwort mit ### ANALYSE BEENDET ### endet.

Empfohlene Module mit Begründung (erscheinen automatisch als Karten unter der Analyse):

${moduleGuidance}

Aus den Antworten erkannte Herausforderungen:

${formatDetectedIssues(recommendation)}

Anleitung für den Fließtext am Ende deiner Analyse:

${recommendation.guidance}

PFLICHTFORMAT für die Modulempfehlung:

1. Gesamtbild zusammenfassen.
2. 3–5 konkrete Impulse und erste Empfehlungen geben.
3. Für jedes Modul einzeln und nummeriert nach Priorität – ausschließlich mit offiziellen Modulnamen:
   - z. B. "Modul 3 – Struktur" oder "Modul 5 – Gewohnheiten verändern"
   - Warum es zu den Antworten passt
   - Welches Problem es lösen soll
   - Warum es diese Priorität hat
4. Bei Strukturproblemen + Einschlafhilfe: erst Modul 3 – Struktur, dann Modul 5 – Gewohnheiten verändern.

STRENG VERBOTEN:
- Erfundene Modulnamen statt der offiziellen Bezeichnungen
- "ein Angebot könnte passen"
- "Genau deshalb könnte dieses Angebot …"
- Allgemeine Werbung statt konkreter offizieller Modulnamen
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
→ Gib 3–5 konkrete Impulse und erste Empfehlungen.
→ Empfehle Module ausschließlich mit offiziellen Namen (Modul 1–8).
→ Erkläre die Reihenfolge (z. B. erst Modul 3 – Struktur, dann Modul 5 – Gewohnheiten verändern).
→ Gib konkrete Handlungsschritte für heute.
→ Verwende KEINE erfundenen Modulbezeichnungen.
→ Beende die Antwort mit

### ANALYSE BEENDET ###
    `.trim();
  }

  return `
Nach der Analyse:

→ Gib zuerst 3–5 konkrete, individuelle Impulse und erste Empfehlungen (nummeriert).
→ Erst danach kurz erklären, warum das Angebot die Tipps ergänzen würde – nicht ersetzen.
→ Nenne im Fließtext NIEMALS einen Kursnamen oder Produkttitel.
→ Die Produktkarte erscheint automatisch unter deiner Antwort.
→ Beende die Antwort zwingend mit

### ANALYSE BEENDET ###

Ohne diese Zeile wird keine Produktkarte angezeigt.
  `.trim();
}
