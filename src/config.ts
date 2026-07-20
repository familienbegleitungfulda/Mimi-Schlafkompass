export type AppMode = "public" | "course";

const envMode = import.meta.env.VITE_MIMI_MODE as AppMode | undefined;

export const MODE: AppMode =
  envMode === "course" || envMode === "public" ? envMode : "public";

export function isPublicMode(): boolean {
  return MODE === "public";
}

export function isCourseMode(): boolean {
  return MODE === "course";
}
