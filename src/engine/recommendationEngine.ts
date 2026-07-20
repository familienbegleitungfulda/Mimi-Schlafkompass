import type { AppMode } from "../config";
import {
  buildCourseModuleRecommendation,
  formatModuleRecommendationsForPrompt,
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
} from "./associationEngine";

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
      "Mögliche Schlafassoziation – nur zurückhaltend erwähnen, nicht als Hauptproblem"
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

function buildPublicRecommendation(memory: any): PublicRecommendation {
  const context = buildAnalysisContext(memory);
  const cause = detectMainCause(memory);

  if (cause.id === "sleepPressure" || hasStructureIssues(memory)) {
    const product = products.find((p) => p.id === "struktur");

    return {
      mode: "public",
      ...context,
      product,
      courseFocus: [
        "altersgerechte Wachzeiten",
        "Schlafdruck aufbauen",
        "Reize besser dosieren",
        "Tagesablauf strukturieren",
        "Tagschlaf anpassen",
        "leichter in den Schlaf finden",
      ],
      guidance: `
Schreibe 2–4 personalisierte Sätze, die die erkannten Herausforderungen der Familie konkret aufgreifen – besonders Wachzeiten, Schlafdruck, Tagschlaf oder Tagesstruktur.

Stelle den Zusammenhang her, dass genau diese Themen im empfohlenen Angebot behandelt werden – z. B. wie der Tagesablauf strukturiert wird, Reize besser dosiert werden und das Kind leichter in den Schlaf findet.

${
  isPossibleSleepAssociation(memory)
    ? "Falls eine mögliche Schlafassoziation erkennbar ist: höchstens kurz erwähnen, dass das erst später relevant werden könnte – Fokus bleibt auf Schlafstruktur."
    : ""
}

Beende mit: "Genau deshalb könnte dieses Angebot aktuell besonders gut zu euch passen."
      `.trim(),
    };
  }

  if (cause.id === "overstimulation" || hasNervousSystemIssues(memory)) {
    const product = products.find((p) => p.id === "struktur");

    return {
      mode: "public",
      ...context,
      product,
      courseFocus: [
        "Reizüberflutung reduzieren",
        "sensorische Pausen einbauen",
        "Nervensystem regulieren",
        "Über- oder Unterforderung erkennen",
        "Tagesstruktur anpassen",
      ],
      guidance: `
Schreibe 2–4 personalisierte Sätze, die die erkannten Herausforderungen der Familie konkret aufgreifen – besonders Reizverarbeitung, Überreizung oder Nervensystem-Belastung.

Stelle den Zusammenhang her, dass genau diese Themen im empfohlenen Angebot behandelt werden – z. B. wie Reize besser dosiert werden und das Kind dabei unterstützt wird, leichter zur Ruhe zu kommen.

Beende mit: "Genau deshalb könnte dieses Angebot aktuell besonders gut zu euch passen."
      `.trim(),
    };
  }

  if (memory.health && /reflux|zungenband|allerg|schmerz|atm/i.test(memory.health)) {
    const product = products.find((p) => p.id === "beratung");

    return {
      mode: "public",
      ...context,
      product,
      courseFocus: [
        "individuelle Schlafsituation",
        "gesundheitliche Besonderheiten",
        "bindungsorientierte Begleitung",
        "maßgeschneiderte Lösungen",
      ],
      guidance: `
Schreibe 2–4 personalisierte Sätze, die die gesundheitlichen Hinweise und die Schlafherausforderungen der Familie konkret aufgreifen.

Stelle den Zusammenhang her, dass eine individuelle, persönliche Begleitung bei dieser Komplexität sinnvoll sein könnte.

Beende mit: "Genau deshalb könnte dieses Angebot aktuell besonders gut zu euch passen."
      `.trim(),
    };
  }

  const product = products.find((p) => p.id === "schlummerwerkstatt");

  return {
    mode: "public",
    ...context,
    product,
    courseFocus: [
      "Schlafstruktur und Tagesgestaltung",
      "mehrere Schlafbaustellen gemeinsam betrachten",
      "bindungsorientierte Begleitung",
      "individuelle Schwerpunkte setzen",
    ],
    guidance: `
Schreibe 2–4 personalisierte Sätze, die die verschiedenen erkannten Herausforderungen der Familie konkret aufgreifen.

Stelle den Zusammenhang her, dass ein umfassender Blick auf die Schlafsituation sinnvoll sein könnte – mit Fokus auf Schlafstruktur und Nervensystem, bevor einzelne Baustellen isoliert betrachtet werden.

Beende mit: "Das passende Angebot findest du direkt unter dieser Analyse."
    `.trim(),
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
        module.recommendation?.focusTitle ?? module.title
    ),
    guidance: `
Die Familie hat bereits Zugang zur Schlummerwerkstatt. Verkaufe KEINE externen Kurse oder Produkte.

Empfehle IMMER konkrete Module aus der Schlummerwerkstatt – niemals allgemein "ein Angebot" oder "etwas könnte passen".

Empfohlene Module mit Begründung (erscheinen automatisch als Karten unter der Analyse):

${moduleGuidance}

Schreibe am Ende der Analyse für JEDES empfohlene Modul einzeln:

1. Fasse zuerst das Gesamtbild zusammen:
   "Ich glaube, ich habe inzwischen ein gutes Gesamtbild."
   "Mir fallen aktuell vor allem folgende Bereiche auf: …"

2. Empfehle dann konkret und nummeriert nach Priorität, z. B.:
   "Als Erstes würde ich dir das Modul [Modultitel] empfehlen – Schwerpunkt: [Fokus]."
   Erkläre für jedes Modul:
   - warum genau dieses Modul zu den Antworten passt
   - welches Problem dadurch adressiert werden soll
   - warum es diese Priorität hat

3. Wenn Strukturprobleme UND eine Einschlafhilfe (z. B. Federwiege) erkennbar sind:
   Empfehle zuerst Schlafstruktur/Reizverarbeitung und erkläre ausdrücklich:
   "Erst wenn die Schlafstruktur stabil ist, lohnt sich eine behutsame Veränderung der Federwiege."

4. Gib 2–4 konkrete Handlungsschritte für HEUTE.

5. Nenne optional Kapitel, PDFs oder Übungen aus den empfohlenen Modulen.

VERBOTEN:
- "ein Angebot könnte passen"
- "Genau deshalb könnte dieses Angebot …"
- "Das passende Angebot findest du …"
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
