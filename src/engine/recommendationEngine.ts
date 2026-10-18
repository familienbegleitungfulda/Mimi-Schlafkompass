import type { AppMode } from "../config";
import {
  buildCourseModuleRecommendation,
  formatModuleRecommendationsForPrompt,
  formatOfficialModuleList,
  getTodayActionTexts,
  type ResolvedCourseModule,
} from "../data/course";
import { products } from "../data/products";
import { detectMainCause } from "./analysisEngine";
import {
  getBedtimeSupport,
  getNightSupport,
  hasNervousSystemIssues,
  hasStructureIssues,
  isPossibleSleepAssociation,
  isUnclearSleepAssociation,
} from "./associationEngine";
import { findProduct, selectPublicProductId, type PublicProductId } from "./productSelection";

export interface AnalysisContext {
  detectedIssues: string[];
  courseFocus: string[];
  causeId: string;
}

export interface PublicRecommendation extends AnalysisContext {
  mode: "public";
  product: (typeof products)[number] | undefined;
  guidance: string;
}

export interface CourseRecommendation extends AnalysisContext {
  mode: "course";
  modules: ResolvedCourseModule[];
  guidance: string;
  todaySteps: string[];
}

export type ModeRecommendation = PublicRecommendation | CourseRecommendation;

function collectDetectedIssues(memory: any): string[] {
  const issues: string[] = [];

  if (memory.mainProblem) issues.push(`Hauptproblem: ${memory.mainProblem}`);
  if (memory.age) issues.push(`Alter: ${memory.age}`);
  if (memory.wakeWindows) issues.push(`Wachzeiten: ${memory.wakeWindows}`);
  if (memory.napCount || memory.naps) {
    issues.push(`Tagschläfchen: ${memory.napCount || memory.naps}`);
  }
  if (memory.napLength) issues.push(`Schläfchendauer: ${memory.napLength}`);
  if (memory.daySleepTotal) {
    issues.push(`Gesamter Tagschlaf: ${memory.daySleepTotal}`);
  }
  if (memory.nightWakeups) {
    issues.push(`Nächtliches Aufwachen: ${memory.nightWakeups}`);
  }
  if (memory.bedtimeRoutine) {
    issues.push(`Abendroutine: ${memory.bedtimeRoutine}`);
  }

  const bedtime = getBedtimeSupport(memory);
  if (bedtime) issues.push(`Einschlafbegleitung: ${bedtime}`);

  const night = getNightSupport(memory);
  if (night) issues.push(`Hilfe nachts: ${night}`);

  if (memory.temperament) issues.push(`Temperament: ${memory.temperament}`);
  if (memory.changes) issues.push(`Veränderungen: ${memory.changes}`);
  if (memory.health) issues.push(`Gesundheit: ${memory.health}`);

  if (hasStructureIssues(memory)) {
    issues.push(
      "Hinweise auf unpassende Schlafstruktur (Wachzeiten, Schlafdruck oder Tagschlaf)"
    );
  }

  if (hasNervousSystemIssues(memory)) {
    issues.push(
      "Hinweise auf Reizüberflutung oder beanspruchtes Nervensystem"
    );
  }

  if (isPossibleSleepAssociation(memory)) {
    issues.push(
      "Einschlafassoziation erkannt (dieselbe Einschlafhilfe abends und nachts) – Schwerpunkt dieser Analyse, behutsam benennen"
    );
  }

  return issues;
}

function buildAnalysisContext(memory: any): AnalysisContext {
  const cause = detectMainCause(memory);

  return {
    detectedIssues: collectDetectedIssues(memory),
    causeId: cause.id,
    courseFocus: [],
  };
}

const PUBLIC_ANALYSIS_END_FLOW = `
ABLAUF AM ENDE DER ANALYSE (Schlafkompass):

1. Gib zuerst 3–5 konkrete, individuelle Impulse und erste Empfehlungen auf Basis der Antworten.
   - Nummeriere die Tipps klar.
   - Jeder Tipp soll sofort umsetzbar sein und echten Mehrwert bieten.
   - Beziehe jeden Tipp direkt auf das, was die Familie geschrieben hat.

2. Erst danach (2–3 Sätze) erkläre, warum das empfohlene Angebot diese Tipps ergänzen und vertiefen würde – nicht ersetzen.
   - Die Eltern sollen spüren: Sie haben bereits Unterstützung erhalten.
   - Formuliere, dass die Tipps ein guter erster Schritt sind und im Angebot Themen tiefer, strukturierter oder Schritt für Schritt bearbeitet werden.
   - Nenne KEINEN Kursnamen und KEINEN Produkttitel.

Die Produktkarte erscheint automatisch unter der Analyse.
`.trim();

function buildPublicProductBridge(contextHint: string): string {
  return `
${PUBLIC_ANALYSIS_END_FLOW}

Schwerpunkt für die Tipps und die Brücke zum Angebot: ${contextHint}
  `.trim();
}

const PUBLIC_FOCUS: Record<PublicProductId, { courseFocus: string[]; hint: string }> = {
  beratung: {
    courseFocus: [
      "individuelle Schlafsituation",
      "gesundheitliche Besonderheiten",
      "bindungsorientierte Begleitung",
      "maßgeschneiderte Lösungen",
    ],
    hint: "Gesundheitliche Besonderheiten oder mehrere Themen gleichzeitig – wann persönliche Begleitung sinnvoll ist.",
  },
  schlummerwerkstatt1: {
    courseFocus: [
      "Einschlafassoziation verstehen",
      "Einschlafhilfe behutsam und bindungsorientiert verändern",
      "Schlafstruktur passend dazu gestalten",
      "nachts leichter weiterschlafen",
    ],
    hint: "Einschlafassoziation: Das Kind braucht abends und nachts dieselbe Einschlafhilfe. Benenne das behutsam als Schwerpunkt (ohne Schritt-für-Schritt-Anleitung zum Abgewöhnen) und ergänze passende Hinweise zur Schlafstruktur.",
  },
  schlummerwerkstatt2: {
    courseFocus: [
      "Einschlafassoziation verstehen",
      "Einschlafhilfe behutsam und bindungsorientiert verändern",
      "Schlafstruktur passend dazu gestalten",
      "nachts leichter weiterschlafen",
    ],
    hint: "Einschlafassoziation: Das Kind braucht abends und nachts dieselbe Einschlafhilfe. Benenne das behutsam als Schwerpunkt (ohne Schritt-für-Schritt-Anleitung zum Abgewöhnen) und ergänze passende Hinweise zur Schlafstruktur.",
  },
  papa: {
    courseFocus: [
      "Einschlafen auch mit Papa",
      "schrittweise Übernahme durch eine weitere Bezugsperson",
      "Entlastung für Mama",
    ],
    hint: "Das Einschlafen klappt bisher vor allem mit Mama bzw. Mama braucht Entlastung. Gib Impulse, wie Papa behutsam mehr Anteil an der Einschlafbegleitung bekommen kann.",
  },
  struktur: {
    courseFocus: [
      "altersgerechte Wachzeiten",
      "Schlafdruck aufbauen",
      "Reize besser dosieren",
      "Tagesablauf strukturieren",
      "Tagschlaf anpassen",
      "leichter in den Schlaf finden",
    ],
    hint: "Wachzeiten, Schlafdruck, Tagschlaf, Tagesstruktur, Überreizung und Übermüdung.",
  },
};

function buildPublicRecommendation(memory: any): PublicRecommendation {
  const context = buildAnalysisContext(memory);
  const productId = selectPublicProductId(memory);
  const focus = PUBLIC_FOCUS[productId];

  if (isUnclearSleepAssociation(memory)) {
    context.detectedIssues.push(
      "Einschlafhilfe genannt, aber noch offen, ob das Kind nachts dieselbe Hilfe zum Weiterschlafen braucht. Falls die Analyse noch nicht erlaubt ist, frage behutsam danach. Sprich NICHT von einer Schlafassoziation, solange das nicht klar ist."
    );
  }

  return {
    mode: "public",
    ...context,
    product: findProduct(productId),
    courseFocus: focus.courseFocus,
    guidance: buildPublicProductBridge(focus.hint),
  };
}

function buildCourseRecommendation(
  memory: any,
  analysisReady: boolean
): CourseRecommendation {
  const context = buildAnalysisContext(memory);
  const modules = buildCourseModuleRecommendation(memory, context, analysisReady);
  const todaySteps = getTodayActionTexts(
    modules.map((module) => module.id)
  ).slice(0, 4);

  const moduleGuidance =
    modules.length > 0
      ? formatModuleRecommendationsForPrompt(
          modules as Array<
            ResolvedCourseModule & {
              recommendation: NonNullable<
                ResolvedCourseModule["recommendation"]
              >;
            }
          >
        )
      : "";

  return {
    mode: "course",
    ...context,
    modules,
    todaySteps,
    courseFocus: modules.map(
      (module) =>
        module.recommendation?.topicHint ?? module.title
    ),
    guidance: `
Die Familie hat bereits Zugang zur Schlummerwerkstatt. Verkaufe KEINE externen Kurse oder Produkte.

Empfehle IMMER konkrete Module aus der Schlummerwerkstatt – niemals allgemein "ein Angebot" oder "etwas könnte passen".

OFFIZIELLE MODULNAMEN (ausschließlich diese verwenden – keine erfundenen Bezeichnungen):

${formatOfficialModuleList()}

Themen-Zuordnung (intern erkennen, offiziellen Modulnamen empfehlen):
- Schlafdruck, Wachzeiten, Tagesstruktur, Vorhersehbarkeit, Reizverarbeitung, Nervensystem, Tagschlaf, Abendroutine, Nachtschlaf → Modul 3 – Struktur
- Müdigkeitsfenster, Schlafbereitschaft, Einschlafzeitpunkt → Modul 4 – Schlafbereitschaft
- Einschlafassoziationen, Federwiege, Schnuller, Gewohnheiten verändern → Modul 5 – Gewohnheiten verändern
- Papa, Oma oder andere Bezugspersonen → Modul 6 – Bezugsperson

Empfohlene Module mit Begründung (erscheinen automatisch als Karten unter der Analyse):

${moduleGuidance}

Schreibe am Ende der Analyse:

1. Fasse zuerst das Gesamtbild zusammen:
   "Ich glaube, ich habe inzwischen ein gutes Gesamtbild."
   "Mir fallen aktuell vor allem folgende Bereiche auf: …"

2. Gib 3–5 konkrete, individuelle Impulse und erste Empfehlungen auf Basis der Antworten – nummeriert und sofort hilfreich.

3. Empfehle dann konkret und nummeriert nach Priorität – ausschließlich mit den offiziellen Modulnamen, z. B.:
   "Als Erstes würde ich dir Modul 3 – Struktur empfehlen."
   Erkläre für jedes Modul:
   - warum genau dieses Modul zu den Antworten passt
   - welches Problem dadurch adressiert werden soll
   - warum es diese Priorität hat

4. Wenn Strukturprobleme UND eine Einschlafhilfe (z. B. Federwiege) erkennbar sind:
   Empfehle zuerst Modul 3 – Struktur und erkläre ausdrücklich:
   "Erst wenn die Schlafstruktur stabil ist, lohnt sich eine behutsame Veränderung der Einschlafhilfe in Modul 5 – Gewohnheiten verändern."

5. Gib 2–4 konkrete Handlungsschritte für HEUTE.

6. Nenne optional Kapitel, PDFs oder Übungen aus den empfohlenen Modulen.

VERBOTEN:
- Erfundene Modulbezeichnungen (z. B. "Schlafdruck und Wachzeiten", "Reizverarbeitung und Nervensystem")
- "ein Angebot könnte passen"
- "Genau deshalb könnte dieses Angebot …"
- Allgemeine Produkt- oder Kurswerbung

Heutige Schritte als Orientierung (passe sie an die Familie an):

${todaySteps.map((step) => `• ${step}`).join("\n")}
    `.trim(),
  };
}

export function buildRecommendation(
  memory: any,
  mode: AppMode,
  analysisReady = false
): ModeRecommendation {
  if (mode === "course") {
    return buildCourseRecommendation(memory, analysisReady);
  }

  return buildPublicRecommendation(memory);
}

export type Recommendation = ModeRecommendation;
