import type { CourseModuleDefinition } from "./types";

export const tagschlafModule: CourseModuleDefinition = {
  id: "tagschlaf",
  title: "Tagschlaf & Schläfchen",
  description:
    "Anzahl, Länge und Verteilung der Tagschläfchen altersgerecht anpassen.",
  order: 5,
  todayActions: [
    {
      id: "tagschlaf-1",
      text: "Notiere heute Dauer und Uhrzeit jedes Schläfchens.",
      priority: 1,
    },
    {
      id: "tagschlaf-2",
      text: "Achte darauf, ob dein Kind nach dem Aufwachen eher ausgeruht oder überdreht wirkt.",
      priority: 2,
    },
  ],
  roadmap: {
    chapters: [
      {
        id: "tg-1",
        title: "Tagschlaf verstehen",
        timestamp: "Kapitel 5.1",
        description: "Anzahl und Länge der Schläfchen altersgerecht einordnen.",
      },
    ],
    pdfs: [
      {
        id: "tg-pdf-1",
        title: "Schläfchen-Protokoll",
        filename: "tagschlaf-protokoll.pdf",
      },
    ],
    bonus: [],
    exercises: [
      {
        id: "tg-ex-1",
        title: "Schläfchen-Tracking",
        description: "Dokumentiere eine Woche lang alle Tagschläfchen.",
      },
    ],
  },
};
