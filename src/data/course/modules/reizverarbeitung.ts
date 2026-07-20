import type { CourseModuleDefinition } from "./types";

export const reizverarbeitungModule: CourseModuleDefinition = {
  id: "reizverarbeitung",
  title: "Reizverarbeitung & Nervensystem",
  description:
    "Reize dosieren, sensorische Pausen einbauen und ein reguliertes Nervensystem unterstützen.",
  order: 4,
  todayActions: [
    {
      id: "reizverarbeitung-1",
      text: "Baue heute mindestens eine bewusste Ruhepause von 10–15 Minuten in den Tag ein.",
      priority: 1,
    },
    {
      id: "reizverarbeitung-2",
      text: "Reduziere für den Rest des Tages einen Reiz – z. B. Geräusche, Licht oder zu viele Angebote gleichzeitig.",
      priority: 2,
    },
  ],
  roadmap: {
    chapters: [
      {
        id: "rv-1",
        title: "Reize dosieren",
        timestamp: "Kapitel 4.1",
        description: "Sensorische Reize altersgerecht reduzieren und staffeln.",
      },
      {
        id: "rv-2",
        title: "Ruheinseln im Alltag",
        timestamp: "Kapitel 4.2",
        description: "Bewusste Pausen für ein reguliertes Nervensystem.",
      },
    ],
    pdfs: [
      {
        id: "rv-pdf-1",
        title: "Reiz-Tagebuch",
        filename: "reizverarbeitung-tagebuch.pdf",
      },
    ],
    bonus: [
      {
        id: "rv-bonus-1",
        title: "Ruhe-Ecken-Ideen",
        description: "Inspiration für sensorische Rückzugsorte zuhause.",
      },
    ],
    exercises: [
      {
        id: "rv-ex-1",
        title: "Reiz-Audit",
        description: "Gehe deinen Tagesablauf durch und markiere Reiz-Spitzen.",
      },
    ],
  },
};
