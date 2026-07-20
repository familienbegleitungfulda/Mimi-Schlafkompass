import type { CourseModuleDefinition } from "./types";

export const tagesstrukturModule: CourseModuleDefinition = {
  id: "tagesstruktur",
  title: "Tagesstruktur & Vorhersehbarkeit",
  description:
    "Einen vorhersehbaren Tagesablauf gestalten und Übergänge für dein Kind planbar machen.",
  shortDescription:
    "Einen vorhersehbaren Tagesablauf gestalten und Übergänge planbar machen.",
  order: 3,
  recommendWhen: [
    "Der Tagesablauf wirkt unvorhersehbar oder chaotisch.",
    "Übergänge zwischen Aktivitäten sind schwierig.",
    "Das Kind reagiert empfindlich auf Veränderungen im Alltag.",
    "Schlaf- und Essenszeiten variieren stark.",
  ],
  learningGoals: [
    "Einen altersgerechten Tagesrhythmus gestalten.",
    "Ankerpunkte im Tag etablieren.",
    "Übergänge für das Kind planbar machen.",
    "Vorhersehbarkeit als Schlüssel für Regulation nutzen.",
  ],
  relatedKnowledge: [],
  nextModules: ["schlafdruck", "reizverarbeitung", "tagschlaf"],
  priority: 3,
  prerequisites: ["grundlagen"],
  todayActions: [
    {
      id: "tagesstruktur-1",
      text: "Skizziere den heutigen Tagesablauf in groben Blöcken – Schlaf, Essen, Spiel, Ruhe.",
      priority: 1,
    },
    {
      id: "tagesstruktur-2",
      text: "Markiere eine Stelle, an der ein fester, wiederkehrender Ablauf schon heute eingeführt werden könnte.",
      priority: 2,
    },
  ],
  roadmap: {
    chapters: [
      {
        id: "ts-1",
        title: "Vorhersehbarkeit schaffen",
        timestamp: "Kapitel 3.1",
        description: "Wiederkehrende Abläufe im Familienalltag etablieren.",
      },
      {
        id: "ts-2",
        title: "Übergänge planbar machen",
        timestamp: "Kapitel 3.2",
        description: "Sanfte Übergänge zwischen Aktivität und Ruhe.",
      },
    ],
    pdfs: [
      {
        id: "ts-pdf-1",
        title: "Tagesstruktur-Vorlage",
        filename: "tagesstruktur-vorlage.pdf",
      },
    ],
    bonus: [
      {
        id: "ts-bonus-1",
        title: "Visualisierung für den Tag",
        description: "Einfache Bildkarten für wiederkehrende Tagesabschnitte.",
      },
    ],
    exercises: [
      {
        id: "ts-ex-1",
        title: "Tagesplan skizzieren",
        description: "Erstelle einen groben Tagesplan und markiere feste Ankerpunkte.",
      },
    ],
  },
};
