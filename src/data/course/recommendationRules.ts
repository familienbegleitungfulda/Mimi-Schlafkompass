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
  | "health"
  | "familyBurden"
  | "sleepReadiness"
  | "caregivers";

export interface ModuleMatchRule {
  moduleId: string;
  signals: AnalysisSignal[];
  keywords?: string[];
  score: number;
  excludeWhen?: AnalysisSignal[];
  requiredSignals?: AnalysisSignal[];
  minTotalScore?: number;
}

export const MIN_MODULE_SCORE = 6;

export const defaultModuleIds = ["grundlagen", "schlafdruck"];

export const moduleMatchRules: ModuleMatchRule[] = [
  {
    moduleId: "grundlagen",
    signals: ["causeGeneral"],
    keywords: ["verstehen", "mythen", "sids", "familienbett", "schlaftraining"],
    score: 3,
    minTotalScore: 4,
  },
  {
    moduleId: "schlafdruck",
    signals: ["structureIssues", "causeSleepPressure", "sleepReadiness"],
    keywords: ["schlafdruck", "wachzeit", "wachphase", "übermüdung", "unterforderung", "schlafbereitschaft"],
    score: 5,
    minTotalScore: 6,
  },
  {
    moduleId: "tagesstruktur",
    signals: ["structureIssues", "causeSleepPressure"],
    keywords: ["tagesstruktur", "vorhersehbar", "routine", "schlafstruktur"],
    score: 4,
    minTotalScore: 6,
  },
  {
    moduleId: "reizverarbeitung",
    signals: ["nervousSystemIssues", "causeOverstimulation", "temperament"],
    keywords: ["reiz", "überreiz", "nervensystem", "high need", "sensibel"],
    score: 5,
    minTotalScore: 6,
  },
  {
    moduleId: "tagschlaf",
    signals: ["napIssues", "structureIssues"],
    keywords: ["tagschlaf", "schläfchen", "nap", "kurz"],
    score: 4,
    minTotalScore: 6,
  },
  {
    moduleId: "abendroutine",
    signals: ["bedtimeRoutine", "bedtimeSupport"],
    keywords: ["abendroutine", "einschlafen", "bettzeit", "abend"],
    score: 4,
    minTotalScore: 6,
  },
  {
    moduleId: "nachtschlaf",
    signals: ["nightWakeups", "nightSupport"],
    keywords: ["nacht", "aufwachen", "wachphase"],
    score: 4,
    minTotalScore: 6,
  },
  {
    moduleId: "einschlafbegleitung",
    signals: [
      "possibleAssociation",
      "nightWakeups",
      "structureIssues",
      "familyBurden",
    ],
    keywords: ["assoziation", "belastend", "immer"],
    score: 3,
    excludeWhen: ["under6Months"],
    requiredSignals: [
      "possibleAssociation",
      "nightWakeups",
      "structureIssues",
      "familyBurden",
    ],
    minTotalScore: 10,
  },
];
