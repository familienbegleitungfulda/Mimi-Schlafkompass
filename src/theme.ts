import type { AppMode } from "./config";
import { resolveAppMode } from "./config";

export interface MimiTheme {
  pageBackground: string;
  headingColor: string;
  headingSubline: string;
  accent: string;
  accentHover: string;
  accentMuted: string;
  userBubble: string;
  userText: string;
  assistantBubble: string;
  assistantText: string;
  cardBackground: string;
  cardBorder: string;
  cardShadow: string;
  mutedText: string;
  bodyText: string;
  inputBorder: string;
  inputFocusBorder: string;
  sectionBackground: string;
  goldAccent: string;
}

const publicTheme: MimiTheme = {
  pageBackground: "#f6f4ef",
  headingColor: "white",
  headingSubline: "",
  accent: "#9DB38E",
  accentHover: "#94af83",
  accentMuted: "#A6BE95",
  userBubble: "#A6BE95",
  userText: "#333",
  assistantBubble: "#ffffff",
  assistantText: "#333",
  cardBackground: "white",
  cardBorder: "#e8e8e8",
  cardShadow: "0 8px 20px rgba(0,0,0,.08)",
  mutedText: "#666",
  bodyText: "#333",
  inputBorder: "#DDD",
  inputFocusBorder: "#94af83",
  sectionBackground: "white",
  goldAccent: "#9DB38E",
};

const courseTheme: MimiTheme = {
  pageBackground: "linear-gradient(165deg, #1a2838 0%, #243b4a 45%, #2d4a5e 100%)",
  headingColor: "#e8dcc8",
  headingSubline: "#c4a574",
  accent: "#3d6b7a",
  accentHover: "#2d5a68",
  accentMuted: "#4a8494",
  userBubble: "#2d4a5e",
  userText: "#e8dcc8",
  assistantBubble: "#f5f0e8",
  assistantText: "#1a2838",
  cardBackground: "#faf7f2",
  cardBorder: "rgba(196, 165, 116, 0.25)",
  cardShadow: "0 12px 32px rgba(10, 20, 30, 0.18)",
  mutedText: "#5a6a72",
  bodyText: "#243b4a",
  inputBorder: "rgba(196, 165, 116, 0.35)",
  inputFocusBorder: "#c4a574",
  sectionBackground: "rgba(245, 240, 232, 0.97)",
  goldAccent: "#c4a574",
};

export function getMimiTheme(mode: AppMode = resolveAppMode()): MimiTheme {
  return mode === "course" ? courseTheme : publicTheme;
}
