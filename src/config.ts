export type AppMode = "public" | "course";

const VALID_MODES: AppMode[] = ["public", "course"];

/** Hosts that always load the Schlummerwerkstatt (course) experience. */
const COURSE_HOST_PATTERNS = ["schlummerwerkstatt"];

/** Hosts that always load the free/public Mimi experience. */
const PUBLIC_HOST_PATTERNS = ["schlafkompass"];

function getHostname(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.hostname.toLowerCase();
}

function isCourseHost(): boolean {
  const host = getHostname();
  return COURSE_HOST_PATTERNS.some((pattern) => host.includes(pattern));
}

function isPublicHost(): boolean {
  const host = getHostname();
  return (
    PUBLIC_HOST_PATTERNS.some((pattern) => host.includes(pattern)) &&
    !isCourseHost()
  );
}

function modeFromEnv(): AppMode | undefined {
  const raw = import.meta.env.VITE_MIMI_MODE;
  if (typeof raw !== "string" || raw.trim() === "") {
    return undefined;
  }

  const envMode = raw as AppMode;
  return VALID_MODES.includes(envMode) ? envMode : undefined;
}

/**
 * Resolve app mode at runtime.
 *
 * Priority:
 * 1. Schlummerwerkstatt hostnames (e.g. mimi-schlummerwerkstatt.netlify.app)
 * 2. Public hostnames (e.g. mimi-schlafkompass.netlify.app)
 * 3. VITE_MIMI_MODE (set at build time via Netlify URL or env)
 * 4. public (default)
 */
export function resolveAppMode(): AppMode {
  if (isCourseHost()) {
    return "course";
  }

  if (isPublicHost()) {
    return "public";
  }

  return modeFromEnv() ?? "public";
}

export function isPublicMode(): boolean {
  return resolveAppMode() === "public";
}

export function isCourseMode(): boolean {
  return resolveAppMode() === "course";
}

/** @deprecated Use resolveAppMode() – kept for backwards compatibility */
export const MODE: AppMode = resolveAppMode();
