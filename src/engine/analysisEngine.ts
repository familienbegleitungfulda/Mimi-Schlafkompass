import { buildScores } from "./scoreEngine";
import {
  CAUTIOUS_ASSOCIATION_HINT,
  hasNervousSystemIssues,
  hasStructureIssues,
  isPossibleSleepAssociation,
} from "./associationEngine";

export interface Finding {
  title: string;
  explanation: string;
  priority: number;
}

export function analyse(memory: any): Finding[] {
  const findings: Finding[] = [];

  const scores = buildScores(memory);

  scores.forEach((score) => {
    if (score.title === "Mögliche Schlafassoziation") return;

    if (score.score <= 3) {
      findings.push({
        title: score.title,
        explanation: score.explanation,
        priority: 6 - score.score,
      });
    }
  });

  const cause = detectMainCause(memory);

  findings.unshift({
    title: cause.title,
    explanation: cause.explanation,
    priority: 100,
  });

  if (isPossibleSleepAssociation(memory) && hasStructureIssues(memory)) {
    findings.push({
      title: "Hinweis",
      explanation:
        "Auch wenn eine mögliche Schlafassoziation erkennbar sein könnte, würde ich zunächst die Schlafstruktur und das Nervensystem im Blick behalten. " +
        CAUTIOUS_ASSOCIATION_HINT,
      priority: 1,
    });
  }

  return findings.sort((a, b) => b.priority - a.priority);
}

export function detectMainCause(memory: any) {
  if (hasStructureIssues(memory)) {
    return {
      id: "sleepPressure",
      title: "Möglicher Schwerpunkt",
      explanation:
        "Es könnte sein, dass Schlafdruck, Wachzeiten, Tagschlaf und Tagesstruktur gemeinsam einen wichtigen Einfluss auf den Schlaf haben. In den meisten Fällen verbessert eine passende Schlafstruktur den Schlaf deutlich stärker als frühes Arbeiten an einer Einschlafassoziation.",
    };
  }

  if (hasNervousSystemIssues(memory)) {
    return {
      id: "overstimulation",
      title: "Möglicher Schwerpunkt",
      explanation:
        "Temperament, Reizverarbeitung oder aktuelle Veränderungen könnten das Nervensystem zusätzlich beanspruchen und den Schlaf beeinflussen. Eine regulierte Tagesgestaltung mit ausreichend Pausen steht dabei meist vor dem Thema Einschlafassoziationen.",
    };
  }

  if (
    memory.daySleepTotal &&
    memory.wakeWindows &&
    memory.nightWakeups &&
    memory.napCount
  ) {
    return {
      id: "sleepPressure",
      title: "Möglicher Schwerpunkt",
      explanation:
        "Die Angaben sprechen dafür, dass Schlafdruck, Wachphasen und Tagesstruktur gemeinsam eine wichtige Rolle spielen könnten.",
    };
  }

  return {
    id: "general",
    title: "Möglicher Schwerpunkt",
    explanation:
      "Im Moment zeigen sich mehrere mögliche Einflussfaktoren. Deshalb würde ich zunächst Schlafstruktur und Nervensystem betrachten, bevor einzelne Maßnahmen im Vordergrund stehen.",
  };
}
