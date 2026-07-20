import type { AppMode } from "../config";
import { schlummerwerkstattModules } from "../data/courseModules";
import type { CourseModule } from "../data/courseModules";
import { products } from "../data/products";
import { detectMainCause } from "./analysisEngine";
import {
  getBedtimeSupport,
  getNightSupport,
  hasNervousSystemIssues,
  hasStructureIssues,
  isPossibleSleepAssociation,
  isUnder6Months,
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
  modules: CourseModule[];
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

function scoreModule(module: CourseModule, memory: any, context: AnalysisContext): number {
  let score = 0;
  const issueText = context.detectedIssues.join(" ").toLowerCase();

  module.when.forEach((tag) => {
    if (issueText.includes(tag.toLowerCase())) score += 3;
  });

  if (module.id === "schlafdruck" && hasStructureIssues(memory)) score += 5;
  if (module.id === "tagesstruktur" && hasStructureIssues(memory)) score += 4;
  if (module.id === "reizverarbeitung" && hasNervousSystemIssues(memory)) score += 5;
  if (module.id === "tagschlaf" && (memory.napLength || memory.napCount || memory.naps)) {
    score += 4;
  }
  if (module.id === "abendroutine" && memory.bedtimeRoutine) score += 4;
  if (module.id === "nachtschlaf" && memory.nightWakeups) score += 4;
  if (
    module.id === "einschlafbegleitung" &&
    isPossibleSleepAssociation(memory) &&
    !isUnder6Months(memory)
  ) {
    score += 2;
  }

  if (module.id === "einschlafbegleitung" && isUnder6Months(memory)) {
    score = 0;
  }

  return score;
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

function buildCourseRecommendation(memory: any): CourseRecommendation {
  const context = buildAnalysisContext(memory);

  const rankedModules = schlummerwerkstattModules
    .map((module) => ({
      module,
      score: scoreModule(module, memory, context),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const modules =
    rankedModules.length > 0
      ? rankedModules.slice(0, 3).map((entry) => entry.module)
      : [
          schlummerwerkstattModules.find((m) => m.id === "schlafdruck")!,
          schlummerwerkstattModules.find((m) => m.id === "tagesstruktur")!,
        ];

  const todaySteps = modules.flatMap((module) => module.todayActions).slice(0, 4);

  const moduleList = modules
    .map(
      (module) =>
        `• ${module.title} (${module.chapter}${module.timestamp ? `, ${module.timestamp}` : ""}): ${module.description}`
    )
    .join("\n");

  return {
    mode: "course",
    ...context,
    modules,
    todaySteps,
    courseFocus: modules.map((module) => module.title),
    guidance: `
Die Familie hat bereits Zugang zur Schlummerwerkstatt. Verkaufe KEINE Kurse oder externen Produkte.

Empfohlene Module (erscheinen automatisch als Karten unter der Analyse):

${moduleList}

Schreibe am Ende der Analyse:

1. Erkläre in 2–4 Sätzen, warum genau diese Module zu den Antworten der Familie passen – mit Bezug auf die erkannten Herausforderungen.
2. Gib 2–4 konkrete Handlungsschritte für HEUTE (aus den empfohlenen Modulen).
3. Nenne optional Kapitel oder Zeitmarken aus der Schlummerwerkstatt.
4. Verkaufe keine Kurse. Die Familie ist bereits in der Schlummerwerkstatt.

Heutige Schritte als Orientierung (passe sie an die Familie an):

${todaySteps.map((step) => `• ${step}`).join("\n")}
    `.trim(),
  };
}

export function buildRecommendation(
  memory: any,
  mode: AppMode
): ModeRecommendation {
  if (mode === "course") {
    return buildCourseRecommendation(memory);
  }

  return buildPublicRecommendation(memory);
}

// Abwärtskompatibilität
export type Recommendation = ModeRecommendation;
