export type {
  CourseModule,
  CourseModuleDefinition,
  ModuleRoadmap,
  ModuleRoadmapContent,
  ModuleTodayAction,
  RoadmapBonus,
  RoadmapChapter,
  RoadmapExercise,
  RoadmapPdf,
} from "./modules";

export {
  allCourseModuleDefinitions,
  courseModuleMap,
  courseModules,
  getModuleDefinition,
  getRoadmapForModule,
  getTodayActionTexts,
  getTodayActionsForModule,
  moduleRoadmapMap,
  moduleRoadmaps,
  todayActions,
} from "./modules";

export {
  courseKnowledgeBase,
  durchschlafenKnowledge,
  familienbettKnowledge,
  schlaftrainingKnowledge,
  sidsKnowledge,
} from "./knowledge";

export type { AnalysisSignal, ModuleMatchRule } from "./recommendationRules";
export { defaultModuleIds, moduleMatchRules } from "./recommendationRules";

export type { CourseSelectionContext, ResolvedCourseModule } from "./courseSelector";
export {
  buildCourseModuleRecommendation,
  resolveCourseModule,
  resolveCourseModules,
  selectModuleIds,
} from "./courseSelector";

export {
  enrichModuleRecommendations,
  formatModuleRecommendationsForPrompt,
  getModulePriorityTier,
  getOfficialTitle,
} from "./moduleRecommendationBuilder";
export type { ModuleRecommendationDetail } from "./moduleRecommendationBuilder";

export {
  formatOfficialModuleList,
  getOfficialModuleTitle,
  OFFICIAL_MODULE_TITLES,
  OFFICIAL_RECOMMENDABLE_MODULE_IDS,
} from "./officialModules";
export type { OfficialModuleId } from "./officialModules";

/** @deprecated Use ModuleTodayAction from `./modules` */
export type TodayAction = import("./modules").ModuleTodayAction & {
  moduleId: string;
};

export const courseMatchingPrinciples = `
Module der Schlummerwerkstatt werden anhand derselben Analyseergebnisse ausgewählt wie die öffentliche Empfehlung.

Es werden ausschließlich die offiziellen Module 1–8 empfohlen:
Modul 1 – Grundlagen Babyschlaf
Modul 2 – Entwicklung und Schlaftypen
Modul 3 – Struktur
Modul 4 – Schlafbereitschaft
Modul 5 – Gewohnheiten verändern
Modul 6 – Bezugsperson
Modul 7 – Praktische Tipps
Modul 8 – Notfalltipps

Priorität:
1. Modul 3 – Struktur (Schlafdruck, Wachzeiten, Tagesstruktur, Reizverarbeitung)
2. Modul 4 – Schlafbereitschaft
3. Modul 5 – Gewohnheiten verändern (nur zurückhaltend, nicht unter 6 Monaten bei Stillen/Flasche)
4. Modul 6 – Bezugsperson bei Bedarf

Es werden maximal vier Module empfohlen.
`.trim();
