export interface CourseModuleDefinition {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  order: number;
  recommendWhen: string[];
  learningGoals: string[];
  relatedKnowledge: string[];
  nextModules: string[];
  priority?: number;
  prerequisites?: string[];
  todayActions: ModuleTodayAction[];
  roadmap: ModuleRoadmapContent;
}

export interface ModuleTodayAction {
  id: string;
  text: string;
  priority: number;
}

export interface RoadmapChapter {
  id: string;
  title: string;
  timestamp?: string;
  description?: string;
}

export interface RoadmapPdf {
  id: string;
  title: string;
  filename: string;
}

export interface RoadmapBonus {
  id: string;
  title: string;
  description: string;
}

export interface RoadmapExercise {
  id: string;
  title: string;
  description: string;
}

export interface ModuleRoadmapContent {
  chapters: RoadmapChapter[];
  pdfs: RoadmapPdf[];
  bonus: RoadmapBonus[];
  exercises: RoadmapExercise[];
}

export interface ModuleRoadmap extends ModuleRoadmapContent {
  moduleId: string;
}

export type CourseModule = Pick<
  CourseModuleDefinition,
  | "id"
  | "title"
  | "description"
  | "shortDescription"
  | "order"
  | "recommendWhen"
  | "learningGoals"
  | "relatedKnowledge"
  | "nextModules"
  | "priority"
  | "prerequisites"
>;
