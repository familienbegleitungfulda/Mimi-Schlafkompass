import type { ResolvedCourseModule } from "./courseSelector";
import {
  getOfficialModuleTitle,
  OFFICIAL_MODULE_TITLES,
  type OfficialModuleId,
} from "./officialModules";

export interface ModuleRecommendationDetail {
  /** Interner Schwerpunkt – kein Modulname für Eltern */
  topicHint: string;
  whyFits: string;
  problemSolved: string;
  priorityRank: number;
  priorityReason: string;
}

interface TopicMatcher {
  moduleId: OfficialModuleId;
  keywords: string[];
  topicHint: string;
  problemSolved: string;
}

const TOPIC_MATCHERS: TopicMatcher[] = [
  {
    moduleId: "schlafassoziationen",
    keywords: ["federwiege", "wippe", "wippt", "schaukel"],
    topicHint: "Federwiege oder Bewegung beim Einschlafen",
    problemSolved:
      "Die Abhängigkeit von Bewegung beim Einschlafen und bei nächtlichen Übergängen behutsam reduzieren.",
  },
  {
    moduleId: "schlafassoziationen",
    keywords: ["brust", "still"],
    topicHint: "Stillen als Einschlafhilfe",
    problemSolved:
      "Verstehen, wann und wie sich eine Einschlafhilfe am Busen bindungsorientiert verändern lässt.",
  },
  {
    moduleId: "schlafassoziationen",
    keywords: ["flasche"],
    topicHint: "Flasche als Einschlafhilfe",
    problemSolved:
      "Die Rolle der Flasche beim Einschlafen einordnen und mögliche Veränderungen planen.",
  },
  {
    moduleId: "schlafassoziationen",
    keywords: ["tragen", "trag"],
    topicHint: "Tragen als Einschlafhilfe",
    problemSolved:
      "Die Abhängigkeit vom Tragen beim Einschlafen und nachts behutsam abbauen.",
  },
  {
    moduleId: "schlafassoziationen",
    keywords: ["schnuller"],
    topicHint: "Schnuller als Schlafanker",
    problemSolved:
      "Die Rolle des Schnullers beim Einschlafen und nachts verstehen und bei Bedarf anpassen.",
  },
  {
    moduleId: "struktur",
    keywords: [
      "schlafdruck",
      "wachzeit",
      "wachphase",
      "übermüd",
      "unterforder",
    ],
    topicHint: "Schlafdruck und Wachzeiten",
    problemSolved:
      "Altersgerechten Schlafdruck durch passende Wachzeiten und Tagesstruktur schaffen.",
  },
  {
    moduleId: "struktur",
    keywords: ["tagesstruktur", "vorhersehbar", "routine", "struktur"],
    topicHint: "Tagesstruktur und Vorhersehbarkeit",
    problemSolved:
      "Einen vorhersehbaren Tagesablauf aufbauen, der Schlaf und Wachphasen stützt.",
  },
  {
    moduleId: "struktur",
    keywords: ["reiz", "überreiz", "nervensystem", "sensibel", "high need"],
    topicHint: "Reizverarbeitung und Nervensystem",
    problemSolved:
      "Reize dosieren und das Nervensystem regulieren, damit Einschlafen und Durchschlafen leichter werden.",
  },
  {
    moduleId: "struktur",
    keywords: ["tagschlaf", "schläfchen", "nap", "kurz"],
    topicHint: "Tagschlaf und Schläfchen",
    problemSolved:
      "Anzahl, Länge und Verteilung der Tagschläfchen so anpassen, dass der Nachtschlaf entlastet wird.",
  },
  {
    moduleId: "struktur",
    keywords: ["nacht", "aufwach", "wachphase"],
    topicHint: "Nächtliches Aufwachen",
    problemSolved:
      "Häufiges nächtliches Erwachen einordnen und gezielt begleiten.",
  },
  {
    moduleId: "struktur",
    keywords: ["abend", "routine", "einschlaf"],
    topicHint: "Abendroutine und Tagesstruktur",
    problemSolved:
      "Eine beruhigende, vorhersehbare Abendroutine in den Tagesablauf einbetten.",
  },
  {
    moduleId: "schlafbereitschaft",
    keywords: ["müde", "schlafbereit", "übermüd", "müdigkeitsfenster", "aktiv"],
    topicHint: "Müdigkeitsfenster und Schlafbereitschaft",
    problemSolved:
      "Die richtigen Müdigkeitssignale erkennen und den Schlaf zum passenden Zeitpunkt beginnen.",
  },
  {
    moduleId: "bezugspersonen",
    keywords: ["papa", "mama", "oma", "opa", "bezug", "wechsel"],
    topicHint: "Bezugspersonen beim Einschlafen",
    problemSolved:
      "Die Rolle verschiedener Bezugspersonen beim Einschlafen und nachts verstehen.",
  },
  {
    moduleId: "notfalltipps",
    keywords: ["notfall", "krise", "nichts mehr", "überfordert", "erschöpft"],
    topicHint: "Akute Schlafkrise",
    problemSolved:
      "Kurzfristige Entlastung und praktische Strategien für besonders schwierige Phasen.",
  },
];

const MODULE_PRIORITY_TIER: Record<OfficialModuleId, number> = {
  grundlagen: 10,
  schlafentwicklung: 10,
  struktur: 20,
  schlafbereitschaft: 25,
  "praktische-tipps": 30,
  bezugspersonen: 35,
  notfalltipps: 35,
  schlafassoziationen: 40,
};

const ASSOCIATION_MODULE_IDS = new Set<OfficialModuleId>(["schlafassoziationen"]);

function collectIssueText(
  memory: Record<string, unknown>,
  detectedIssues: string[]
): string {
  return [
    ...detectedIssues,
    memory.mainProblem,
    memory.bedtimeSupport,
    memory.nightSupport,
    memory.naps,
    memory.napLength,
    memory.wakeWindows,
    memory.nightWakeups,
    memory.temperament,
    memory.caregivers,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function findTopicMatcher(
  moduleId: string,
  issueText: string
): TopicMatcher | undefined {
  return TOPIC_MATCHERS.find(
    (matcher) =>
      matcher.moduleId === moduleId &&
      matcher.keywords.some((keyword) => issueText.includes(keyword))
  );
}

function defaultTopicHint(module: ResolvedCourseModule): string {
  return (
    module.primaryChapter?.title ??
    module.roadmap.chapters[0]?.title ??
    "Inhalte dieses Moduls"
  );
}

function buildWhyFits(
  module: ResolvedCourseModule,
  topicHint: string,
  issueText: string,
  detectedIssues: string[]
): string {
  const relevantIssues = detectedIssues.slice(0, 3).join("; ");
  if (relevantIssues) {
    return `Passt zu euren Angaben (${relevantIssues}). Im ${module.title} vertieft ihr: ${topicHint}.`;
  }

  if (issueText.trim()) {
    return `Passt zu dem, was ihr beschrieben habt. Schwerpunkt in ${module.title}: ${topicHint}.`;
  }

  return `Passt zum Gesamtbild eurer Schlafsituation. Schwerpunkt in ${module.title}: ${topicHint}.`;
}

function buildPriorityReason(
  module: ResolvedCourseModule,
  priorityRank: number,
  hasStructureModule: boolean,
  isAssociationModule: boolean
): string {
  if (isAssociationModule && hasStructureModule && priorityRank > 1) {
    return "Erst wenn die Schlafstruktur stabil ist, lohnt sich eine behutsame Veränderung der Einschlafhilfe.";
  }

  if (module.id === "struktur" && priorityRank === 1) {
    return "Schlafstruktur ist fast immer die erste Stellschraube – sie wirkt oft stärker als das Arbeiten an Einschlafhilfen.";
  }

  if (priorityRank === 1) {
    return "Dieses Modul adressiert aktuell den größten Hebel in eurer Schlafsituation.";
  }

  return `Priorität ${priorityRank}, weil es einen wichtigen Baustein ergänzt, nachdem die Grundlagen geklärt sind.`;
}

function defaultProblemSolved(module: ResolvedCourseModule): string {
  return module.description;
}

export function getModulePriorityTier(moduleId: string): number {
  return MODULE_PRIORITY_TIER[moduleId as OfficialModuleId] ?? 30;
}

export function enrichModuleRecommendations(
  modules: ResolvedCourseModule[],
  memory: Record<string, unknown>,
  detectedIssues: string[]
): Array<ResolvedCourseModule & { recommendation: ModuleRecommendationDetail }> {
  const issueText = collectIssueText(memory, detectedIssues);
  const hasStructureModule = modules.some((module) => module.id === "struktur");

  const sorted = [...modules].sort(
    (a, b) => getModulePriorityTier(a.id) - getModulePriorityTier(b.id)
  );

  return sorted.map((module, index) => {
    const priorityRank = index + 1;
    const topicMatcher = findTopicMatcher(module.id, issueText);
    const topicHint = topicMatcher?.topicHint ?? defaultTopicHint(module);
    const isAssociationModule = ASSOCIATION_MODULE_IDS.has(
      module.id as OfficialModuleId
    );

    return {
      ...module,
      primaryChapter:
        module.roadmap.chapters.find((chapter) =>
          chapter.title.toLowerCase().includes(topicHint.toLowerCase())
        ) ?? module.primaryChapter,
      recommendation: {
        topicHint,
        whyFits: buildWhyFits(module, topicHint, issueText, detectedIssues),
        problemSolved:
          topicMatcher?.problemSolved ?? defaultProblemSolved(module),
        priorityRank,
        priorityReason: buildPriorityReason(
          module,
          priorityRank,
          hasStructureModule,
          isAssociationModule
        ),
      },
    };
  });
}

export function formatModuleRecommendationsForPrompt(
  modules: Array<ResolvedCourseModule & { recommendation: ModuleRecommendationDetail }>
): string {
  const officialNames = Object.values(OFFICIAL_MODULE_TITLES).join(", ");

  return [
    `Erlaubte Modulnamen (ausschließlich diese im Fließtext verwenden): ${officialNames}`,
    "",
    ...modules.map((module) => {
      const { recommendation: rec } = module;
      return [
        `Priorität ${rec.priorityRank}: ${module.title}`,
        `Thema aus den Antworten (interner Schwerpunkt – NICHT als Modulname nennen): ${rec.topicHint}`,
        `Warum es passt: ${rec.whyFits}`,
        `Welches Problem es löst: ${rec.problemSolved}`,
        `Warum diese Priorität: ${rec.priorityReason}`,
        module.primaryChapter
          ? `Kapitel: ${module.primaryChapter.title}${
              module.primaryChapter.timestamp
                ? ` (${module.primaryChapter.timestamp})`
                : ""
            }`
          : null,
      ]
        .filter(Boolean)
        .join("\n");
    }),
  ].join("\n\n");
}

export function getOfficialTitle(moduleId: string): string {
  return getOfficialModuleTitle(moduleId) ?? moduleId;
}
