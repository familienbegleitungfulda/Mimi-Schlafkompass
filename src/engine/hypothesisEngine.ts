import {
  CAUTIOUS_ASSOCIATION_HINT,
  hasNervousSystemIssues,
  hasStructureIssues,
  isPossibleSleepAssociation,
  isUnder6Months,
} from "./associationEngine";

export interface Hypothesis {
  title: string;
  confidence: number;
  reason: string;
}

export function buildHypotheses(memory: any): Hypothesis[] {
  const hypotheses: Hypothesis[] = [];

  if (memory.wakeWindows && /(4|5|6|7)/.test(memory.wakeWindows)) {
    hypotheses.push({
      title: "Schlafdruck / Wachzeiten",
      confidence: 85,
      reason:
        "Die Wachzeiten könnten für das angegebene Alter eventuell nicht optimal passen.",
    });
  }

  if (memory.napLength && /(20|25|30)/.test(memory.napLength)) {
    hypotheses.push({
      title: "Tagschlaf / Übermüdung",
      confidence: 80,
      reason:
        "Die Schläfchen wirken möglicherweise auffallend kurz – das könnte den Schlafdruck beeinflussen.",
    });
  }

  if (hasStructureIssues(memory)) {
    hypotheses.push({
      title: "Schlafstruktur",
      confidence: 82,
      reason:
        "Schlafdruck, Wachzeiten oder Tagschlaf könnten aktuell eine wichtigere Rolle spielen als andere Faktoren.",
    });
  }

  if (hasNervousSystemIssues(memory)) {
    hypotheses.push({
      title: "Nervensystem / Reizverarbeitung",
      confidence: 78,
      reason:
        "Temperament oder aktuelle Veränderungen könnten das Nervensystem zusätzlich beanspruchen.",
    });
  }

  if (memory.temperament && /(high|fomo|gefühls|sensibel|reiz)/i.test(memory.temperament)) {
    hypotheses.push({
      title: "Temperament",
      confidence: 75,
      reason:
        "Das Temperament könnte einen großen Einfluss auf den Schlaf haben.",
    });
  }

  if (isPossibleSleepAssociation(memory)) {
    hypotheses.push({
      title: "Mögliche Schlafassoziation",
      confidence: 35,
      reason: CAUTIOUS_ASSOCIATION_HINT,
    });
  }

  if (isUnder6Months(memory)) {
    return hypotheses
      .filter((h) => h.title !== "Mögliche Schlafassoziation")
      .sort((a, b) => b.confidence - a.confidence);
  }

  return hypotheses.sort((a, b) => b.confidence - a.confidence);
}
