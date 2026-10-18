import {
  CAUTIOUS_ASSOCIATION_HINT,
  hasNervousSystemIssues,
  hasStructureIssues,
  isPossibleSleepAssociation,
  isUnder6Months,
} from "./associationEngine";
import { checkStructure } from "./structureCheck";

export interface Hypothesis {
  title: string;
  confidence: number;
  reason: string;
}

export function buildHypotheses(memory: any): Hypothesis[] {
  const hypotheses: Hypothesis[] = [];

  const structure = checkStructure(memory);

  if (structure.wakeMayBeFocus && structure.wakeStatus !== "unbekannt") {
    hypotheses.push({
      title: "Schlafdruck / Wachzeiten",
      confidence: structure.wakeStatus.startsWith("deutlich") ? 80 : 60,
      reason: structure.wakeStatus.startsWith("deutlich")
        ? `Die Wachphase liegt ${structure.wakeStatus} des altersüblichen Bereichs – vorsichtig einordnen und nach dem Verhalten fragen.`
        : "Die Wachphase liegt im altersüblichen Rahmen, aber die Eltern beschreiben Anzeichen von Übermüdung oder Überreizung – das Verhalten zählt mehr als die Zahl.",
    });
  }

  if (
    memory.napLength &&
    /(20|25|30)/.test(memory.napLength) &&
    (structure.ageMonths === null || structure.ageMonths >= 8)
  ) {
    hypotheses.push({
      title: "Tagschlaf / Übermüdung",
      confidence: 60,
      reason:
        "Die Schläfchen wirken möglicherweise auffallend kurz – nur relevant, wenn auch Übermüdungszeichen beschrieben werden.",
    });
  }

  if (
    hasStructureIssues(memory) &&
    structure.wakeStatus !== "unbekannt" &&
    !structure.structureAgeAppropriate
  ) {
    hypotheses.push({
      title: "Schlafstruktur",
      confidence: 75,
      reason:
        "Wachzeiten oder Anzahl der Tagschläfchen weichen deutlich vom Alter ab und könnten eine Rolle spielen.",
    });
  }

  if (structure.structureAgeAppropriate && structure.nightIssues.length > 0) {
    hypotheses.push({
      title: "Andere Ursachen für das nächtliche Aufwachen",
      confidence: 70,
      reason:
        "Wachphasen und Tagschlaf sind altersgerecht. Mögliche andere Einflüsse: zu viel Gesamtschlaf in 24 Stunden, Reize und Erlebnisse am Tag, Entwicklungsschritte, Autonomie- oder Trennungsthemen, zurückhaltend auch eine Einschlafassoziation.",
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
