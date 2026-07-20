/**
 * @deprecated Import from `./course` instead.
 */
export type { ResolvedCourseModule } from "./course";
export {
  buildCourseModuleRecommendation,
  courseModules as schlummerwerkstattModules,
  resolveCourseModules,
} from "./course";

/** @deprecated Use ResolvedCourseModule from `./course` */
export type CourseModule = import("./course").ResolvedCourseModule;
