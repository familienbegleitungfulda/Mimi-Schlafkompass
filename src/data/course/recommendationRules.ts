import type { OfficialModuleId } from "./officialModules";

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
  | "caregivers"
  | "developmentQuestions"
  | "practicalTips"
  | "acuteCrisis";

export interface ModuleMatchRule {
  moduleId: OfficialModuleId;
  signals: AnalysisSignal[];
  keywords?: string[];
  score: number;
  excludeWhen?: AnalysisSignal[];
  requiredSignals?: AnalysisSignal[];
  minTotalScore?: number;
}

export const MIN_MODULE_SCORE = 6;

export const defaultModuleIds: OfficialModuleId[] = ["struktur", "grundlagen"];

export const moduleMatchRules: ModuleMatchRule[] = [
  {
    moduleId: "struktur",
    signals: [
      "structureIssues",
      "causeSleepPressure",
      "causeOverstimulation",
      "nervousSystemIssues",
      "napIssues",
      "bedtimeRoutine",
      "nightWakeups",
    ],
    keywords: [
      "struktur",
      "routine",
      "wachzeit",
      "wachphase",
      "übermüd",
      "unterforder",
      "schlafstruktur",
      "schlafdruck",
      "tagesstruktur",
      "vorhersehbar",
      "reiz",
      "überreiz",
      "nervensystem",
      "tagschlaf",
      "schläfchen",
      "nap",
      "abendroutine",
      "nacht",
      "aufwach",
    ],
    score: 4,
    minTotalScore: 5,
  },
  {
    moduleId: "schlafbereitschaft",
    signals: ["sleepReadiness", "structureIssues"],
    keywords: [
      "schlafbereitschaft",
      "müdigkeitsfenster",
      "müde",
      "übermüd",
      "unterforder",
      "einschlafzeitpunkt",
      "schlafbereit",
    ],
    score: 5,
    minTotalScore: 5,
  },
  {
    moduleId: "schlafassoziationen",
    signals: ["possibleAssociation", "bedtimeSupport", "nightSupport"],
    keywords: [
      "federwiege",
      "wippe",
      "bewegung",
      "schaukel",
      "assoziation",
      "tragen",
      "schnuller",
      "brust",
      "still",
      "flasche",
      "gewohnheit",
      "abgewöhn",
    ],
    score: 5,
    excludeWhen: ["under6Months"],
    minTotalScore: 4,
  },
  {
    moduleId: "bezugspersonen",
    signals: ["caregivers"],
    keywords: ["papa", "mama", "oma", "opa", "bezug", "wechsel", "bezugsperson"],
    score: 5,
    minTotalScore: 4,
  },
  {
    moduleId: "grundlagen",
    signals: ["causeGeneral"],
    keywords: [
      "verstehen",
      "mythen",
      "sids",
      "familienbett",
      "schlaftraining",
      "normal",
      "grundlage",
    ],
    score: 4,
    minTotalScore: 4,
  },
  {
    moduleId: "schlafentwicklung",
    signals: ["changes", "developmentQuestions"],
    keywords: [
      "entwicklung",
      "regression",
      "schlafentwicklung",
      "schlaftyp",
      "chronotyp",
      "sprung",
      "zahn",
    ],
    score: 4,
    minTotalScore: 4,
  },
  {
    moduleId: "praktische-tipps",
    signals: ["practicalTips", "bedtimeRoutine"],
    keywords: [
      "schlafanker",
      "abdunkeln",
      "sinkflug",
      "powernap",
      "pause",
      "alltagstipp",
      "praktisch",
    ],
    score: 3,
    minTotalScore: 5,
  },
  {
    moduleId: "notfalltipps",
    signals: ["acuteCrisis", "familyBurden"],
    keywords: [
      "notfall",
      "krise",
      "nichts mehr",
      "überfordert",
      "erschöpft",
      "akut",
      "entlastung",
    ],
    score: 4,
    minTotalScore: 4,
  },
];
