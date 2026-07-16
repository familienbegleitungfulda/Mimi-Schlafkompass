import { products } from "../data/products";
import { detectMainCause } from "./analysisEngine";
import {
  getBedtimeSupport,
  getNightSupport,
  hasNervousSystemIssues,
  hasStructureIssues,
  isPossibleSleepAssociation,
} from "./associationEngine";

export interface Recommendation {
  product: (typeof products)[number] | undefined;
  detectedIssues: string[];
  courseFocus: string[];
  guidance: string;
}

function collectDetectedIssues(memory: any): string[] {
  const issues: string[] = [];

  if (memory.mainProblem) {
    issues.push(`Hauptproblem: ${memory.mainProblem}`);
  }

  if (memory.age) {
    issues.push(`Alter: ${memory.age}`);
  }

  if (memory.wakeWindows) {
    issues.push(`Wachzeiten: ${memory.wakeWindows}`);
  }

  if (memory.napCount || memory.naps) {
    issues.push(`Tagschläfchen: ${memory.napCount || memory.naps}`);
  }

  if (memory.napLength) {
    issues.push(`Schläfchendauer: ${memory.napLength}`);
  }

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
  if (bedtime) {
    issues.push(`Einschlafbegleitung: ${bedtime}`);
  }

  const night = getNightSupport(memory);
  if (night) {
    issues.push(`Hilfe nachts: ${night}`);
  }

  if (memory.temperament) {
    issues.push(`Temperament: ${memory.temperament}`);
  }

  if (memory.changes) {
    issues.push(`Veränderungen: ${memory.changes}`);
  }

  if (memory.health) {
    issues.push(`Gesundheit: ${memory.health}`);
  }

  if (hasStructureIssues(memory)) {
    issues.push("Hinweise auf unpassende Schlafstruktur (Wachzeiten, Schlafdruck oder Tagschlaf)");
  }

  if (hasNervousSystemIssues(memory)) {
    issues.push("Hinweise auf Reizüberflutung oder beanspruchtes Nervensystem");
  }

  if (isPossibleSleepAssociation(memory)) {
    issues.push("Mögliche Schlafassoziation – nur zurückhaltend erwähnen, nicht als Hauptproblem");
  }

  return issues;
}

export function buildRecommendation(memory: any): Recommendation {
  const cause = detectMainCause(memory);
  const detectedIssues = collectDetectedIssues(memory);

  if (cause.id === "sleepPressure" || hasStructureIssues(memory)) {
    const product = products.find((p) => p.id === "struktur");

    return {
      product,
      detectedIssues,
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
      product,
      detectedIssues,
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
      product,
      detectedIssues,
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
    product,
    detectedIssues,
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
