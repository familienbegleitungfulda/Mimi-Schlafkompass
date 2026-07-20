export type { CourseModule } from "./modules";
export { courseModules, courseModuleMap } from "./modules";

export type { AnalysisSignal, ModuleMatchRule } from "./courseKnowledge";
export {
  courseMatchingPrinciples,
  defaultModuleIds,
  moduleMatchRules,
} from "./courseKnowledge";

export type { TodayAction } from "./todayActions";
export {
  getTodayActionTexts,
  getTodayActionsForModule,
  todayActions,
} from "./todayActions";

export type {
  ModuleRoadmap,
  RoadmapBonus,
  RoadmapChapter,
  RoadmapExercise,
  RoadmapPdf,
} from "./moduleRoadmaps";
export {
  getRoadmapForModule,
  moduleRoadmapMap,
  moduleRoadmaps,
} from "./moduleRoadmaps";

export type { ResolvedCourseModule } from "./courseSelector";
export type { CourseSelectionContext } from "./courseSelector";
export {
  buildCourseModuleRecommendation,
  resolveCourseModule,
  resolveCourseModules,
  selectModuleIds,
} from "./courseSelector";
