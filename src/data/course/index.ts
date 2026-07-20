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

/** @deprecated Use ModuleTodayAction from `./modules` */
export type TodayAction = import("./modules").ModuleTodayAction & {
  moduleId: string;
};

export const courseMatchingPrinciples = `
Module der Schlummerwerkstatt werden anhand derselben Analyseergebnisse ausgewählt wie die öffentliche Empfehlung.

Priorität:
1. Schlafstruktur (Schlafdruck, Wachzeiten, Tagschlaf, Tagesstruktur)
2. Nervensystem (Reizverarbeitung, Überreizung, Temperament)
3. Abend- und Nachtschlaf
4. Einschlafbegleitung nur zurückhaltend und nicht unter 6 Monaten bei Stillen/Flasche

Es werden maximal drei Module empfohlen.
`.trim();
