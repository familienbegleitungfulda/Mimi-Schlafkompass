import { buildScores } from "./scoreEngine";

export interface Finding {
  title: string;
  explanation: string;
  priority: number;
}

export function analyse(memory: any): Finding[] {
  const findings: Finding[] = [];

  const scores = buildScores(memory);

  scores.forEach((score) => {
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

  return findings.sort(
    (a, b) => b.priority - a.priority
  );
}

export function detectMainCause(memory: any) {
  // Schlafdruck
  if (
    memory.daySleepTotal &&
    memory.wakeWindows &&
    memory.nightWakeups &&
    memory.napCount
  ) {
    return {
      id: "sleepPressure",
      title: "Wahrscheinlichste Ursache",
      explanation:
        "Die Angaben sprechen dafür, dass Schlafdruck, Wachphasen und Tagesstruktur gemeinsam einen wichtigen Einfluss auf den Schlaf haben könnten.",
    };
  }

  // Einschlafhilfe
  if (
    memory.fallAsleepHelp &&
    memory.nightHelp
  ) {
    return {
      id: "association",
      title: "Wahrscheinlichste Ursache",
      explanation:
        "Die Einschlafbegleitung scheint aktuell eine wichtige Rolle zu spielen. Ob sie tatsächlich die Ursache oder eher eine Folge anderer Schlafbaustellen ist, sollte jedoch immer im Gesamtkontext betrachtet werden.",
    };
  }

  // Überreizung
  if (
    memory.temperament &&
    memory.changes
  ) {
    return {
      id: "overstimulation",
      title: "Wahrscheinlichste Ursache",
      explanation:
        "Temperament und aktuelle Veränderungen könnten das Nervensystem zusätzlich beanspruchen und den Schlaf beeinflussen.",
    };
  }

  return {
    id: "general",
    title: "Wahrscheinlichste Ursache",
    explanation:
      "Im Moment zeigen sich mehrere mögliche Einflussfaktoren. Deshalb würde ich zunächst weitere Zusammenhänge betrachten, bevor einzelne Maßnahmen im Vordergrund stehen.",
  };
}