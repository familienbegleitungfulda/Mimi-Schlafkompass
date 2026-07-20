import {
  getBedtimeSupport,
  getNightSupport,
  hasNervousSystemIssues,
  hasStructureIssues,
  isPossibleSleepAssociation,
  isUnder6Months,
} from "../../engine/associationEngine";
import {
  defaultModuleIds,
  moduleMatchRules,
  type AnalysisSignal,
} from "./courseKnowledge";
import { courseModuleMap } from "./modules";
import { getRoadmapForModule, type ModuleRoadmap, type RoadmapChapter } from "./moduleRoadmaps";
import { getTodayActionsForModule } from "./todayActions";

export interface CourseSelectionContext {
  detectedIssues: string[];
  causeId: string;
}

export interface ResolvedCourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  todayActions: string[];
  primaryChapter?: RoadmapChapter;
  roadmap: ModuleRoadmap;
}

function collectAnalysisSignals(
  memory: any,
  context: CourseSelectionContext
): Set<AnalysisSignal> {
  const signals = new Set<AnalysisSignal>();

  if (context.causeId === "sleepPressure") signals.add("causeSleepPressure");
  if (context.causeId === "overstimulation") signals.add("causeOverstimulation");
  if (context.causeId === "general") signals.add("causeGeneral");

  if (hasStructureIssues(memory)) signals.add("structureIssues");
  if (hasNervousSystemIssues(memory)) signals.add("nervousSystemIssues");
  if (isPossibleSleepAssociation(memory)) signals.add("possibleAssociation");
  if (isUnder6Months(memory)) signals.add("under6Months");

  if (memory.nightWakeups) signals.add("nightWakeups");
  if (memory.napLength || memory.napCount || memory.naps) signals.add("napIssues");
  if (memory.bedtimeRoutine) signals.add("bedtimeRoutine");
  if (getBedtimeSupport(memory)) signals.add("bedtimeSupport");
  if (getNightSupport(memory)) signals.add("nightSupport");
  if (memory.temperament) signals.add("temperament");
  if (memory.changes) signals.add("changes");
  if (memory.health) signals.add("health");

  return signals;
}

function scoreModuleByRules(
  rule: (typeof moduleMatchRules)[number],
  signals: Set<AnalysisSignal>,
  issueText: string
): number {
  if (rule.excludeWhen?.some((signal) => signals.has(signal))) {
    return 0;
  }

  let score = 0;

  rule.signals.forEach((signal) => {
    if (signals.has(signal)) score += rule.score;
  });

  rule.keywords?.forEach((keyword) => {
    if (issueText.includes(keyword.toLowerCase())) score += 3;
  });

  return score;
}

export function selectModuleIds(
  memory: any,
  context: CourseSelectionContext,
  limit = 3
): string[] {
  const signals = collectAnalysisSignals(memory, context);
  const issueText = context.detectedIssues.join(" ").toLowerCase();

  const ranked = moduleMatchRules
    .map((rule) => ({
      moduleId: rule.moduleId,
      score: scoreModuleByRules(rule, signals, issueText),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length > 0) {
    return ranked.slice(0, limit).map((entry) => entry.moduleId);
  }

  return defaultModuleIds.slice(0, limit);
}

export function resolveCourseModule(moduleId: string): ResolvedCourseModule | undefined {
  const module = courseModuleMap[moduleId];
  const roadmap = getRoadmapForModule(moduleId);

  if (!module || !roadmap) return undefined;

  return {
    id: module.id,
    title: module.title,
    description: module.description,
    order: module.order,
    todayActions: getTodayActionsForModule(moduleId).map((action) => action.text),
    primaryChapter: roadmap.chapters[0],
    roadmap,
  };
}

export function resolveCourseModules(moduleIds: string[]): ResolvedCourseModule[] {
  return moduleIds
    .map((moduleId) => resolveCourseModule(moduleId))
    .filter((module): module is ResolvedCourseModule => module !== undefined);
}

export function buildCourseModuleRecommendation(
  memory: any,
  context: CourseSelectionContext
): ResolvedCourseModule[] {
  const moduleIds = selectModuleIds(memory, context);
  return resolveCourseModules(moduleIds);
}
