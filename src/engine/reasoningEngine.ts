import type { AppMode } from "../config";

export interface AnalysisArea {
  keys: string[];
  label: string;
}

/** Vollständige Analyse – nur Schlummerwerkstatt */
export const COURSE_ANALYSIS_AREAS: AnalysisArea[] = [
  { keys: ["age"], label: "Alter des Kindes" },
  { keys: ["mainProblem"], label: "Hauptproblem" },
  { keys: ["naps", "napCount"], label: "Tagschlaf – Anzahl" },
  { keys: ["napLength"], label: "Tagschlaf – Dauer" },
  { keys: ["bedtimeDuration"], label: "Einschlafdauer" },
  { keys: ["nightWakeups"], label: "Häufigkeit des nächtlichen Erwachens" },
  { keys: ["bedtime"], label: "Nachtschlaf – Uhrzeiten" },
  { keys: ["wakeWindows"], label: "Wachzeiten" },
  { keys: ["sleepReadiness"], label: "Schlafbereitschaft" },
  { keys: ["light", "noise", "sleepPlace"], label: "Schlafumgebung" },
  { keys: ["bedtimeSupport"], label: "Einschlafhilfe" },
  { keys: ["nightSupport"], label: "Hilfe nachts" },
  { keys: ["feeding"], label: "Nachtnahrung / Ernährung" },
  { keys: ["changes", "development"], label: "Entwicklung / Veränderungen" },
  { keys: ["health"], label: "Gesundheit" },
  { keys: ["temperament"], label: "Temperament" },
  { keys: ["caregivers"], label: "Bezugspersonen" },
  { keys: ["duration"], label: "Seit wann das Problem besteht" },
  { keys: ["bedtimeRoutine"], label: "Abendroutine" },
  { keys: ["familyBurden"], label: "Belastung der Familie" },
];

/** Kompakte Analyse – kostenloser Schlafkompass (wie bisher) */
export const PUBLIC_ANALYSIS_AREAS: AnalysisArea[] = [
  { keys: ["age"], label: "Alter des Kindes" },
  { keys: ["mainProblem"], label: "Hauptproblem" },
  { keys: ["duration"], label: "Seit wann" },
  { keys: ["bedtimeSupport"], label: "Einschlafhilfe" },
  { keys: ["bedtimeDuration"], label: "Einschlafdauer" },
  { keys: ["bedtimeRoutine"], label: "Abendroutine" },
  { keys: ["bedtime"], label: "Bettzeit" },
  { keys: ["naps", "napCount"], label: "Tagschläfchen" },
  { keys: ["wakeWindows"], label: "Wachzeiten" },
  { keys: ["sleepPlace"], label: "Schlafort nachts" },
  { keys: ["nightWakeups"], label: "Nächtliches Aufwachen" },
  { keys: ["nightSupport"], label: "Hilfe nachts" },
  { keys: ["feeding"], label: "Ernährung" },
  { keys: ["temperament"], label: "Temperament" },
  { keys: ["health"], label: "Gesundheit" },
  { keys: ["changes"], label: "Veränderungen" },
];

function getAreasForMode(mode: AppMode): AnalysisArea[] {
  return mode === "course" ? COURSE_ANALYSIS_AREAS : PUBLIC_ANALYSIS_AREAS;
}

function hasArea(memory: Record<string, unknown>, area: AnalysisArea): boolean {
  return area.keys.some((key) => {
    const value = memory[key];
    return value !== undefined && value !== null && value !== "";
  });
}

export function getMissingAreas(
  memory: Record<string, unknown>,
  mode: AppMode = "public"
): string[] {
  return getAreasForMode(mode)
    .filter((area) => !hasArea(memory, area))
    .map((area) => area.label);
}

export function shouldAnalyse(
  memory: Record<string, unknown>,
  mode: AppMode = "public"
) {
  const missing = getMissingAreas(memory, mode);

  if (mode === "course") {
    return {
      ready: missing.length === 0,
      missing,
    };
  }

  return {
    ready: missing.length <= 2,
    missing,
  };
}

export const ANALYSIS_ORDER_PROMPT = `
INTERNE ANALYSE-REIHENFOLGE (nur Schlummerwerkstatt)

Denke immer ungefähr in dieser Reihenfolge:

1. Alter
2. Entwicklung
3. Gesundheit
4. Schlafmenge (Tagschlaf + Nachtschlaf)
5. Wachzeiten
6. Schlafbereitschaft
7. Struktur
8. Reizverarbeitung
9. Schlafassoziationen – erst ganz am Ende und nur zurückhaltend
10. Bezugspersonen
11. Schlafumgebung
12. Ernährung

Springe nicht sofort auf Schlafassoziationen.
Empfehle nicht sofort Module.
`.trim();
