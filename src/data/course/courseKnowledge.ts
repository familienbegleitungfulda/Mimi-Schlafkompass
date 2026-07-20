export type AnalysisSignal =
  | "causeSleepPressure"
  | "causeOverstimulation"
  | "causeGeneral"
  | "structureIssues"
  | "nervousSystemIssues"
  | "possibleAssociation"
  | "under6Months"
  | "nightWakeups"
  | "napIssues"
  | "bedtimeRoutine"
  | "bedtimeSupport"
  | "nightSupport"
  | "temperament"
  | "changes"
  | "health";

export interface ModuleMatchRule {
  moduleId: string;
  signals: AnalysisSignal[];
  keywords?: string[];
  score: number;
  excludeWhen?: AnalysisSignal[];
}

export const courseMatchingPrinciples = `
Module der Schlummerwerkstatt werden anhand derselben Analyseergebnisse ausgewählt wie die öffentliche Empfehlung.

Priorität:
1. Schlafstruktur (Schlafdruck, Wachzeiten, Tagschlaf, Tagesstruktur)
2. Nervensystem (Reizverarbeitung, Überreizung, Temperament)
3. Abend- und Nachtschlaf
4. Einschlafbegleitung nur zurückhaltend und nicht unter 6 Monaten bei Stillen/Flasche

Es werden maximal drei Module empfohlen.
`.trim();

export const moduleMatchRules: ModuleMatchRule[] = [
  {
    moduleId: "schlafdruck",
    signals: ["structureIssues", "causeSleepPressure"],
    keywords: ["schlafdruck", "wachzeit", "wachphase", "übermüdung", "unterforderung"],
    score: 5,
  },
  {
    moduleId: "tagesstruktur",
    signals: ["structureIssues", "causeSleepPressure"],
    keywords: ["tagesstruktur", "vorhersehbar", "routine", "schlafstruktur"],
    score: 4,
  },
  {
    moduleId: "reizverarbeitung",
    signals: ["nervousSystemIssues", "causeOverstimulation", "temperament"],
    keywords: ["reiz", "überreiz", "nervensystem", "high need", "sensibel"],
    score: 5,
  },
  {
    moduleId: "tagschlaf",
    signals: ["napIssues", "structureIssues"],
    keywords: ["tagschlaf", "schläfchen", "nap", "kurz"],
    score: 4,
  },
  {
    moduleId: "abendroutine",
    signals: ["bedtimeRoutine", "bedtimeSupport"],
    keywords: ["abendroutine", "einschlafen", "bettzeit", "abend"],
    score: 4,
  },
  {
    moduleId: "nachtschlaf",
    signals: ["nightWakeups", "nightSupport"],
    keywords: ["nacht", "aufwachen", "wachphase"],
    score: 4,
  },
  {
    moduleId: "einschlafbegleitung",
    signals: ["possibleAssociation", "bedtimeSupport", "nightSupport"],
    keywords: ["einschlaf", "assoziation", "hilfe"],
    score: 2,
    excludeWhen: ["under6Months"],
  },
];

export const defaultModuleIds = ["schlafdruck", "tagesstruktur"];
