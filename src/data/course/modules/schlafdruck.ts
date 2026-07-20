import type { CourseModuleDefinition } from "./types";

export const schlafdruckModule: CourseModuleDefinition = {
  id: "schlafdruck",
  title: "Schlafdruck & Wachzeiten",
  description:
    "Altersgerechte Wachzeiten erkennen, Schlafdruck aufbauen und Müdigkeitszeichen besser deuten.",
  order: 2,
  todayActions: [
    {
      id: "schlafdruck-1",
      text: "Beobachte heute die Müdigkeitszeichen deines Kindes und notiere, wann sie zum ersten Mal sichtbar werden.",
      priority: 1,
    },
    {
      id: "schlafdruck-2",
      text: "Miss grob die Wachzeit vor dem nächsten Schlaf – ohne sie zu verändern.",
      priority: 2,
    },
  ],
  roadmap: {
    chapters: [
      {
        id: "sd-1",
        title: "Was ist Schlafdruck?",
        timestamp: "Kapitel 2.1",
        description: "Grundlagen des Schlafdrucks und altersgerechter Wachzeiten.",
      },
      {
        id: "sd-2",
        title: "Müdigkeitszeichen erkennen",
        timestamp: "Kapitel 2.3",
        description: "Frühe und späte Müdigkeitszeichen deuten.",
      },
    ],
    pdfs: [
      {
        id: "sd-pdf-1",
        title: "Wachzeiten-Übersicht",
        filename: "schlafdruck-wachzeiten.pdf",
      },
    ],
    bonus: [
      {
        id: "sd-bonus-1",
        title: "Müdigkeitszeichen-Checkliste",
        description: "Zum Ausdrucken und Beobachten über mehrere Tage.",
      },
    ],
    exercises: [
      {
        id: "sd-ex-1",
        title: "Wachzeit-Protokoll",
        description: "Notiere drei Tage lang Wachzeiten und Müdigkeitszeichen.",
      },
    ],
  },
};
