export interface Hypothesis {
    title: string;
    confidence: number;
    reason: string;
  }
  
  export function buildHypotheses(memory: any): Hypothesis[] {
    const hypotheses: Hypothesis[] = [];
  
    if (
      memory.wakeWindows &&
      /(4|5|6)/.test(memory.wakeWindows)
    ) {
      hypotheses.push({
        title: "Schlafdruck",
        confidence: 80,
        reason:
          "Die Wachphasen wirken für das angegebene Alter eher lang."
      });
    }
  
    if (
      memory.napLength &&
      /(20|25|30)/.test(memory.napLength)
    ) {
      hypotheses.push({
        title: "Übermüdung",
        confidence: 75,
        reason:
          "Die Schläfchen wirken auffallend kurz."
      });
    }
  
    if (
      memory.bedtimeSupport &&
      /(brust|flasche|tragen|ball)/i.test(memory.bedtimeSupport)
    ) {
      hypotheses.push({
        title: "Einschlafassoziation",
        confidence: 70,
        reason:
          "Zum Einschlafen wird aktuell eine feste Unterstützung benötigt. Das kann häufig zu nächtlichem Aufwachen führen."
      });
    }
  
    if (
      memory.temperament &&
      /(high|fomo|gefühls|sensibel)/i.test(memory.temperament)
    ) {
      hypotheses.push({
        title: "Temperament",
        confidence: 85,
        reason:
          "Das Temperament könnte einen großen Einfluss auf den Schlaf haben."
      });
    }
  
    return hypotheses.sort(
      (a, b) => b.confidence - a.confidence
    );
  }