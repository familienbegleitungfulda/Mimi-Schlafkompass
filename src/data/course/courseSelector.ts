import {
  getBedtimeSupport,
  getNightSupport,
  hasNervousSystemIssues,
  hasStructureIssues,
  isPossibleSleepAssociation,
  isUnder6Months,
} from "../../engine/associationEngine";
import {
  enrichModuleRecommendations,
  getModulePriorityTier,
  type ModuleRecommendationDetail,
} from "./moduleRecommendationBuilder";
import {
  courseModuleMap,
  getRoadmapForModule,
  getTodayActionsForModule,
  type ModuleRoadmap,
  type RoadmapChapter,
} from "./modules";
import {
  defaultModuleIds,
  MIN_MODULE_SCORE,
  moduleMatchRules,
  type AnalysisSignal,
  type ModuleMatchRule,
} from "./recommendationRules";

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
  recommendation?: ModuleRecommendationDetail;
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
  if (memory.changes || memory.development) signals.add("changes");
  if (memory.health) signals.add("health");
  if (memory.sleepReadiness) signals.add("sleepReadiness");
  if (memory.caregivers) signals.add("caregivers");

  if (
    /entwicklung|regression|schlaftyp|chronotyp|sprung/.test(
      `${memory.mainProblem ?? ""} ${memory.changes ?? ""} ${memory.development ?? ""}`.toLowerCase()
    )
  ) {
    signals.add("developmentQuestions");
  }

  if (
    /schlafanker|abdunkeln|sinkflug|powernap|pause|alltagstipp/.test(
      `${memory.mainProblem ?? ""} ${memory.bedtimeRoutine ?? ""}`.toLowerCase()
    )
  ) {
    signals.add("practicalTips");
  }

  if (
    memory.familyBurden ||
    /belast|erschöpf|anstreng|nicht mehr|überford|krise|akut|notfall/.test(
      `${memory.mainProblem ?? ""} ${memory.duration ?? ""}`.toLowerCase()
    )
  ) {
    signals.add("familyBurden");
  }

  if (
    /krise|notfall|nichts mehr|akut|unerträglich/.test(
      `${memory.mainProblem ?? ""} ${memory.duration ?? ""}`.toLowerCase()
    )
  ) {
    signals.add("acuteCrisis");
  }

  return signals;
}

function scoreModuleByRules(
  rule: ModuleMatchRule,
  signals: Set<AnalysisSignal>,
  issueText: string
): number {
  if (rule.excludeWhen?.some((signal) => signals.has(signal))) {
    return 0;
  }

  if (
    rule.requiredSignals &&
    !rule.requiredSignals.every((signal) => signals.has(signal))
  ) {
    return 0;
  }

  let score = 0;

  rule.signals.forEach((signal) => {
    if (signals.has(signal)) score += rule.score;
  });

  rule.keywords?.forEach((keyword) => {
    if (issueText.includes(keyword.toLowerCase())) score += 2;
  });

  const minScore = rule.minTotalScore ?? MIN_MODULE_SCORE;
  return score >= minScore ? score : 0;
}

export function selectModuleIds(
  memory: any,
  context: CourseSelectionContext,
  limit = 4
): string[] {
  const signals = collectAnalysisSignals(memory, context);
  const issueText = [
    ...context.detectedIssues,
    memory.mainProblem,
    memory.bedtimeSupport,
    memory.nightSupport,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const ranked = moduleMatchRules
    .map((rule) => ({
      moduleId: rule.moduleId,
      score: scoreModuleByRules(rule, signals, issueText),
      tier: getModulePriorityTier(rule.moduleId),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      return b.score - a.score;
    });

  if (ranked.length > 0) {
    const seen = new Set<string>();
    const unique: string[] = [];

    for (const entry of ranked) {
      if (seen.has(entry.moduleId)) continue;
      seen.add(entry.moduleId);
      unique.push(entry.moduleId);
      if (unique.length >= limit) break;
    }

    return unique;
  }

  return defaultModuleIds.slice(0, Math.min(limit, defaultModuleIds.length));
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
  context: CourseSelectionContext,
  analysisReady = false
): ResolvedCourseModule[] {
  if (!analysisReady) return [];

  const moduleIds = selectModuleIds(memory, context);
  const modules = resolveCourseModules(moduleIds);
  return enrichModuleRecommendations(modules, memory, context.detectedIssues);
}
