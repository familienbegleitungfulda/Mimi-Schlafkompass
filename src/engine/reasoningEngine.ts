export function shouldAnalyse(memory: any) {
    const required = [
      "age",
      "mainProblem",
      "duration",
      "bedtime",
      "bedtimeRoutine",
      "bedtimeSupport",
      "napCount",
      "daySleepTotal",
      "wakeWindows",
      "nightWakeups",
      "nightSupport",
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