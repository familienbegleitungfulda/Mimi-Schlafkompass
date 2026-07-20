import type { CourseModuleDefinition } from "./types";

export const einschlafbegleitungModule: CourseModuleDefinition = {
  id: "einschlafbegleitung",
  title: "Einschlafbegleitung (zurückhaltend)",
  description:
    "Einschlafhilfen verstehen – erst nach Schlafstruktur und Nervensystem betrachten.",
  order: 8,
  todayActions: [
    {
      id: "einschlafbegleitung-1",
      text: "Beobachte heute nur: Welche Hilfe braucht dein Kind zum Einschlafen – und welche nachts?",
      priority: 1,
    },
    {
      id: "einschlafbegleitung-2",
      text: "Verändere noch nichts – sammle erst ein klares Bild über mehrere Tage.",
      priority: 2,
    },
  ],
  roadmap: {
    chapters: [
      {
        id: "eb-1",
        title: "Einschlafhilfen verstehen",
        timestamp: "Kapitel 8.1",
        description: "Was Einschlafbegleitung bedeutet – ohne Bewertung.",
      },
      {
        id: "eb-2",
        title: "Bindungsorientiert begleiten",
        timestamp: "Kapitel 8.3",
        description: "Erst Struktur, dann Einschlafbegleitung betrachten.",
      },
    ],
    pdfs: [
      {
        id: "eb-pdf-1",
        title: "Einschlaf-Protokoll",
        filename: "einschlafbegleitung-protokoll.pdf",
      },
    ],
    bonus: [],
    exercises: [
      {
        id: "eb-ex-1",
        title: "Hilfe-Beobachtung",
        description: "Dokumentiere eine Woche lang Einschlaf- und Nacht-Hilfe.",
      },
    ],
  },
};
