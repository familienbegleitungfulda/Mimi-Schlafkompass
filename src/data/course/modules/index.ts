import { abendroutineModule } from "./abendroutine";
import { einschlafbegleitungModule } from "./einschlafbegleitung";
import { grundlagenModule } from "./grundlagen";
import { nachtschlafModule } from "./nachtschlaf";
import { reizverarbeitungModule } from "./reizverarbeitung";
import { schlafdruckModule } from "./schlafdruck";
import { tagschlafModule } from "./tagschlaf";
import { tagesstrukturModule } from "./tagesstruktur";
import type {
  CourseModule,
  CourseModuleDefinition,
  ModuleRoadmap,
  ModuleTodayAction,
} from "./types";

export const allCourseModuleDefinitions: CourseModuleDefinition[] = [
  grundlagenModule,
  schlafdruckModule,
  tagesstrukturModule,
  reizverarbeitungModule,
  tagschlafModule,
  abendroutineModule,
  nachtschlafModule,
  einschlafbegleitungModule,
];

function toCourseModule(module: CourseModuleDefinition): CourseModule {
  return {
    id: module.id,
    title: module.title,
    description: module.description,
    shortDescription: module.shortDescription,
    order: module.order,
    recommendWhen: module.recommendWhen,
    learningGoals: module.learningGoals,
    relatedKnowledge: module.relatedKnowledge,
    nextModules: module.nextModules,
    priority: module.priority,
    prerequisites: module.prerequisites,
  };
}

export const courseModules: CourseModule[] =
  allCourseModuleDefinitions.map(toCourseModule);

export const courseModuleMap = Object.fromEntries(
  allCourseModuleDefinitions.map((module) => [module.id, module])
) as Record<string, CourseModuleDefinition>;

export const moduleRoadmaps: ModuleRoadmap[] = allCourseModuleDefinitions.map(
  (module) => ({
    moduleId: module.id,
    ...module.roadmap,
  })
);

export const moduleRoadmapMap = Object.fromEntries(
  moduleRoadmaps.map((roadmap) => [roadmap.moduleId, roadmap])
) as Record<string, ModuleRoadmap>;

export const todayActions: Array<ModuleTodayAction & { moduleId: string }> =
  allCourseModuleDefinitions.flatMap((module) =>
    module.todayActions.map((action) => ({
      moduleId: module.id,
      ...action,
    }))
  );

export function getModuleDefinition(
  moduleId: string
): CourseModuleDefinition | undefined {
  return courseModuleMap[moduleId];
}

export function getRoadmapForModule(moduleId: string): ModuleRoadmap | undefined {
  return moduleRoadmapMap[moduleId];
}

export function getTodayActionsForModule(moduleId: string): ModuleTodayAction[] {
  const module = courseModuleMap[moduleId];
  if (!module) return [];

  return [...module.todayActions].sort((a, b) => a.priority - b.priority);
}

export function getTodayActionTexts(moduleIds: string[]): string[] {
  return moduleIds.flatMap((moduleId) =>
    getTodayActionsForModule(moduleId).map((action) => action.text)
  );
}

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
} from "./types";
