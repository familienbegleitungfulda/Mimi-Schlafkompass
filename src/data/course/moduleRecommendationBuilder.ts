import type { ResolvedCourseModule } from "./courseSelector";

export interface ModuleRecommendationDetail {
  focusTitle: string;
  whyFits: string;
  problemSolved: string;
  priorityRank: number;
  priorityReason: string;
}

interface FocusMatcher {
  moduleId: string;
  keywords: string[];
  focusTitle: string;
  problemSolved: string;
}

const FOCUS_MATCHERS: FocusMatcher[] = [
  {
    moduleId: "schlafassoziationen",
    keywords: ["federwiege", "wippe", "wippt", "schaukel"],
    focusTitle: "Federwiege liebevoll abgewöhnen",
    problemSolved:
      "Die Abhängigkeit von Bewegung beim Einschlafen und bei nächtlichen Übergängen behutsam reduzieren.",
  },
  {
    moduleId: "schlafassoziationen",
    keywords: ["brust", "still"],
    focusTitle: "Stillen als Einschlafhilfe",
    problemSolved:
      "Verstehen, wann und wie sich eine Einschlafhilfe am Busen bindungsorientiert verändern lässt.",
  },
  {
    moduleId: "schlafassoziationen",
    keywords: ["flasche"],
    focusTitle: "Flasche als Einschlafhilfe",
    problemSolved:
      "Die Rolle der Flasche beim Einschlafen einordnen und mögliche Veränderungen planen.",
  },
  {
    moduleId: "schlafassoziationen",
    keywords: ["tragen", "trag"],
    focusTitle: "Tragen als Einschlafhilfe",
    problemSolved:
      "Die Abhängigkeit vom Tragen beim Einschlafen und nachts behutsam abbauen.",
  },
  {
    moduleId: "schlafassoziationen",
    keywords: ["schnuller"],
    focusTitle: "Schnuller als Schlafanker",
    problemSolved:
      "Die Rolle des Schnullers beim Einschlafen und nachts verstehen und bei Bedarf anpassen.",
  },
  {
    moduleId: "struktur",
    keywords: ["struktur", "routine", "wachzeit", "wachphase", "übermüd", "unterforder"],
    focusTitle: "Schlafstruktur optimieren",
    problemSolved:
      "Wachzeiten, Routinen und Tagesablauf so anpassen, dass ausreichend Schlafdruck und Vorhersehbarkeit entstehen.",
  },
  {
    moduleId: "reizverarbeitung",
    keywords: ["reiz", "überreiz", "nervensystem", "sensibel", "high need"],
    focusTitle: "Reizverarbeitung & Nervensystem",
    problemSolved:
      "Reize dosieren und das Nervensystem regulieren, damit Einschlafen und Durchschlafen leichter werden.",
  },
  {
    moduleId: "schlafdruck",
    keywords: ["schlafdruck", "wachzeit", "schläfchen", "nap"],
    focusTitle: "Schlafdruck aufbauen",
    problemSolved:
      "Altersgerechten Schlafdruck durch passende Wachzeiten und Tagschlaf schaffen.",
  },
  {
    moduleId: "tagschlaf",
    keywords: ["tagschlaf", "schläfchen", "nap", "kurz"],
    focusTitle: "Tagschlaf stabilisieren",
    problemSolved:
      "Anzahl, Länge und Verteilung der Tagschläfchen so anpassen, dass der Nachtschlaf entlastet wird.",
  },
  {
    moduleId: "nachtschlaf",
    keywords: ["nacht", "aufwach", "wachphase"],
    focusTitle: "Nachtschlaf verstehen",
    problemSolved:
      "Häufiges nächtliches Erwachen einordnen und gezielt begleiten.",
  },
  {
    moduleId: "abendroutine",
    keywords: ["abend", "routine", "einschlaf"],
    focusTitle: "Abendroutine gestalten",
    problemSolved:
      "Eine beruhigende, vorhersehbare Abendroutine aufbauen, die den Übergang in den Schlaf erleichtert.",
  },
  {
    moduleId: "schlafbereitschaft",
    keywords: ["müde", "schlafbereit", "übermüd", "aktiv"],
    focusTitle: "Schlafbereitschaft erkennen",
    problemSolved:
      "Die richtigen Müdigkeitssignale erkennen und den Schlaf zum passenden Zeitpunkt beginnen.",
  },
  {
    moduleId: "bezugspersonen",
    keywords: ["papa", "mama", "bezug", "wechsel"],
    focusTitle: "Bezugspersonen & Schlaf",
    problemSolved:
      "Die Rolle verschiedener Bezugspersonen beim Einschlafen und nachts verstehen.",
  },
];

const MODULE_PRIORITY_TIER: Record<string, number> = {
  grundlagen: 10,
  schlafentwicklung: 10,
  struktur: 20,
  schlafbereitschaft: 20,
  schlafdruck: 20,
  tagesstruktur: 20,
  tagschlaf: 25,
  reizverarbeitung: 25,
  abendroutine: 30,
  nachtschlaf: 30,
  praktischeTipps: 30,
  bezugspersonen: 35,
  einschlafbegleitung: 40,
  schlafassoziationen: 40,
};

const ASSOCIATION_MODULE_IDS = new Set([
  "schlafassoziationen",
  "einschlafbegleitung",
]);

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
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function findFocusMatcher(
  moduleId: string,
  issueText: string
): FocusMatcher | undefined {
  return FOCUS_MATCHERS.find(
    (matcher) =>
      matcher.moduleId === moduleId &&
      matcher.keywords.some((keyword) => issueText.includes(keyword))
  );
}

function defaultFocusTitle(module: ResolvedCourseModule): string {
  return (
    module.primaryChapter?.title ??
    module.roadmap.chapters[0]?.title ??
    module.title
  );
}

function buildWhyFits(
  module: ResolvedCourseModule,
  focusTitle: string,
  issueText: string,
  detectedIssues: string[]
): string {
  const relevantIssues = detectedIssues.slice(0, 3).join("; ");
  if (relevantIssues) {
    return `Passt zu euren Angaben (${relevantIssues}) und adressiert im Modul „${module.title}“ konkret: ${focusTitle}.`;
  }

  if (issueText.trim()) {
    return `Passt zu dem, was ihr beschrieben habt, und fokussiert auf: ${focusTitle}.`;
  }

  return `Passt zum Gesamtbild eurer Schlafsituation und vertieft: ${focusTitle}.`;
}

function buildPriorityReason(
  module: ResolvedCourseModule,
  priorityRank: number,
  hasStructureModule: boolean,
  isAssociationModule: boolean
): string {
  if (isAssociationModule && hasStructureModule && priorityRank > 1) {
    return "Erst wenn Schlafstruktur und Reizverarbeitung stabil sind, lohnt sich eine behutsame Veränderung der Einschlafhilfe.";
  }

  if (
    (module.id === "struktur" || module.id === "reizverarbeitung") &&
    priorityRank === 1
  ) {
    return "Schlafstruktur und Reizverarbeitung sind fast immer die erste Stellschraube – sie wirken oft stärker als das Arbeiten an Einschlafhilfen.";
  }

  if (module.id === "schlafdruck" && priorityRank === 1) {
    return "Ohne passenden Schlafdruck verbessern sich Einschlafen und Durchschlafen selten nachhaltig.";
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
  return MODULE_PRIORITY_TIER[moduleId] ?? 30;
}

export function enrichModuleRecommendations(
  modules: ResolvedCourseModule[],
  memory: Record<string, unknown>,
  detectedIssues: string[]
): Array<ResolvedCourseModule & { recommendation: ModuleRecommendationDetail }> {
  const issueText = collectIssueText(memory, detectedIssues);
  const hasStructureModule = modules.some((module) =>
    ["struktur", "schlafdruck", "tagesstruktur", "reizverarbeitung"].includes(
      module.id
    )
  );

  const sorted = [...modules].sort(
    (a, b) => getModulePriorityTier(a.id) - getModulePriorityTier(b.id)
  );

  return sorted.map((module, index) => {
    const priorityRank = index + 1;
    const focusMatcher = findFocusMatcher(module.id, issueText);
    const focusTitle = focusMatcher?.focusTitle ?? defaultFocusTitle(module);
    const isAssociationModule = ASSOCIATION_MODULE_IDS.has(module.id);

    return {
      ...module,
      primaryChapter:
        module.roadmap.chapters.find((chapter) =>
          chapter.title.toLowerCase().includes(focusTitle.toLowerCase())
        ) ?? module.primaryChapter,
      recommendation: {
        focusTitle,
        whyFits: buildWhyFits(module, focusTitle, issueText, detectedIssues),
        problemSolved:
          focusMatcher?.problemSolved ?? defaultProblemSolved(module),
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
  return modules
    .map((module) => {
      const { recommendation: rec } = module;
      return [
        `Priorität ${rec.priorityRank}: ${module.title}`,
        `Fokus: ${rec.focusTitle}`,
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
    })
    .join("\n\n");
}
