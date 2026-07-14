export interface Score {
    title: string;
    score: number;
    explanation: string;
  }
  
  export function buildScores(memory: any): Score[] {
    const scores: Score[] = [];
  
    // Schlafdruck
  
    let sleepPressure = 5;
  
    if (memory.wakeWindows?.match(/4|5|6/))
      sleepPressure = 2;
  
    if (memory.napLength?.match(/20|25|30/))
      sleepPressure = 3;
  
    scores.push({
      title: "Schlafdruck",
      score: sleepPressure,
      explanation:
        sleepPressure <= 2
          ? "Der Schlafdruck wirkt aktuell wahrscheinlich nicht optimal."
          : "Der Schlafdruck wirkt insgesamt passend.",
    });
  
    // Einschlafassoziation
  
    let association = 5;
  
    if (
      memory.bedtimeSupport?.match(
        /brust|tragen|flasche|ball/i
      )
    ) {
      association = 2;
    }
  
    scores.push({
      title: "Einschlafassoziationen",
      score: association,
      explanation:
        association <= 2
          ? "Zum Einschlafen scheint aktuell eine feste Unterstützung nötig zu sein. Schlafassoziationen können häufig zu häufigem nächtlichen Aufwachen führen."
          : "Es zeigen sich nur wenige Hinweise auf starke Einschlafassoziationen.",
    });
  
    // Tagschlaf
  
    let naps = 5;
  
    if (
      memory.napLength?.match(/20|25|30/)
    ) {
      naps = 3;
    }
  
    scores.push({
      title: "Tagschlaf",
      score: naps,
      explanation:
        naps <= 3
          ? "Die Schläfchen wirken eher kurz."
          : "Der Tagschlaf wirkt insgesamt passend.",
    });
  
    // Schlafumgebung
  
    let environment = 5;
  
    if (!memory.light) environment = 4;
  
    scores.push({
      title: "Schlafumgebung",
      score: environment,
      explanation:
        environment < 5
          ? "Hier könnten noch kleine Optimierungen möglich sein."
          : "Die Schlafumgebung wirkt passend.",
    });
  
    return scores;
  }