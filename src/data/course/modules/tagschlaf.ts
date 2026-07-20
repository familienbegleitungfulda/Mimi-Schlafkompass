import type { CourseModuleDefinition } from "./types";

export const tagschlafModule: CourseModuleDefinition = {
  id: "tagschlaf",
  title: "Tagschlaf & Schläfchen",
  description:
    "Anzahl, Länge und Verteilung der Tagschläfchen altersgerecht anpassen.",
  shortDescription:
    "Anzahl, Länge und Verteilung der Tagschläfchen altersgerecht anpassen.",
  order: 5,
  recommendWhen: [
    "Die Schläfchen sind sehr kurz oder unregelmäßig.",
    "Die Anzahl der Tagschläfchen passt möglicherweise nicht zum Alter.",
    "Das Kind wirkt nach dem Aufwachen überdreht.",
    "Der Tagschlaf beeinflusst den Nachtschlaf spürbar.",
  ],
  learningGoals: [
    "Tagschlaf altersgerecht einordnen.",
    "Anzahl und Länge der Schläfchen bewerten.",
    "Zusammenhang zwischen Tagschlaf und Nachtschlaf verstehen.",
    "Übermüdung durch unpassenden Tagschlaf erkennen.",
  ],
  relatedKnowledge: ["durchschlafen"],
  nextModules: ["schlafdruck", "nachtschlaf", "abendroutine"],
  priority: 5,
  prerequisites: ["grundlagen", "schlafdruck"],
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
