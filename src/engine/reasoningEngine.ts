export function shouldAnalyse(memory: any) {
    const required = [
      "age",
      "mainProblem",
      "duration",
      "bedtime",
      "bedtimeRoutine",
      "fallAsleepHelp",
      "napCount",
      "daySleepTotal",
      "wakeWindows",
      "nightWakeups",
      "nightHelp",
      "sleepPlace",
      "feeding",
      "health",
      "temperament",
      "changes",
    ];
  
    const missing = required.filter(
      (key) => !memory[key]
    );
  
    return {
      ready: missing.length <= 1,
      missing,
    };
  }