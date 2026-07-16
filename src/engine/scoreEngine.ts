import {
  CAUTIOUS_ASSOCIATION_HINT,
  hasNervousSystemIssues,
  hasStructureIssues,
  isPossibleSleepAssociation,
  isUnder6Months,
} from "./associationEngine";

export interface Score {
  title: string;
  score: number;
  explanation: string;
}

export function buildScores(memory: any): Score[] {
  const scores: Score[] = [];

  let sleepPressure = 5;

  if (memory.wakeWindows?.match(/4|5|6|7/)) sleepPressure = 2;

  if (memory.napLength?.match(/20|25|30/)) sleepPressure = 3;

  scores.push({
    title: "Schlafdruck / Wachzeiten",
    score: sleepPressure,
    explanation:
      sleepPressure <= 2
        ? "Schlafdruck und Wachzeiten könnten aktuell eine wichtige Rolle spielen."
        : "Schlafdruck und Wachzeiten wirken insgesamt eher passend.",
  });

  let structure = 5;

  if (hasStructureIssues(memory)) structure = 2;

  scores.push({
    title: "Schlafstruktur",
    score: structure,
    explanation:
      structure <= 2
        ? "Tagesstruktur, Wachzeiten oder Tagschlaf könnten aktuell optimierbar sein."
        : "Die Schlafstruktur wirkt insgesamt eher stimmig.",
  });

  let nervousSystem = 5;

  if (hasNervousSystemIssues(memory)) nervousSystem = 3;

  scores.push({
    title: "Nervensystem / Reizverarbeitung",
    score: nervousSystem,
    explanation:
      nervousSystem <= 3
        ? "Reizverarbeitung, Pausen oder Nervensystem-Regulation könnten eine Rolle spielen."
        : "Es zeigen sich keine starken Hinweise auf Reizüberflutung.",
  });

  let association = 5;

  if (isPossibleSleepAssociation(memory) && !isUnder6Months(memory)) {
    association = 4;
  }

  scores.push({
    title: "Mögliche Schlafassoziation",
    score: association,
    explanation:
      association <= 4
        ? CAUTIOUS_ASSOCIATION_HINT
        : "Es liegen keine ausreichenden Hinweise vor, um eine Schlafassoziation anzunehmen.",
  });

  let naps = 5;

  if (memory.napLength?.match(/20|25|30/)) {
    naps = 3;
  }

  scores.push({
    title: "Tagschlaf",
    score: naps,
    explanation:
      naps <= 3
        ? "Die Schläfchen wirken möglicherweise eher kurz."
        : "Der Tagschlaf wirkt insgesamt passend.",
  });

  let environment = 5;

  if (!memory.light) environment = 4;

  scores.push({
    title: "Schlafumgebung",
    score: environment,
    explanation:
      environment < 5
        ? "Hier könnten eventuell noch kleine Optimierungen möglich sein."
        : "Die Schlafumgebung wirkt passend.",
  });

  return scores;
}
