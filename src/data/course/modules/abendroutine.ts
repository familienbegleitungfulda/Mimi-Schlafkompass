import type { CourseModuleDefinition } from "./types";

export const abendroutineModule: CourseModuleDefinition = {
  id: "abendroutine",
  title: "Abendroutine & Einschlafen",
  description:
    "Eine passende Abendroutine gestalten und den Übergang in den Nachtschlaf unterstützen.",
  shortDescription:
    "Eine passende Abendroutine gestalten und den Übergang in den Nachtschlaf unterstützen.",
  order: 6,
  recommendWhen: [
    "Das Einschlafen am Abend dauert lange oder ist anstrengend.",
    "Die Abendroutine wirkt unruhig oder zu kurz.",
    "Einzelne Abendschritte reizen das Kind besonders.",
    "Der Übergang in den Nachtschlaf ist schwierig.",
  ],
  learningGoals: [
    "Eine passende Abendroutine gestalten.",
    "Reizniveau und Dauer der Routine einschätzen.",
    "Den Übergang in den Nachtschlaf unterstützen.",
    "Einschlafbegleitung im Abend einordnen.",
  ],
  relatedKnowledge: ["durchschlafen"],
  nextModules: ["nachtschlaf", "einschlafbegleitung"],
  priority: 6,
  prerequisites: ["grundlagen", "schlafdruck"],
  todayActions: [
    {
      id: "abendroutine-1",
      text: "Schreibe die heutige Abendroutine Schritt für Schritt auf – ohne sie zu verändern.",
      priority: 1,
    },
    {
      id: "abendroutine-2",
      text: "Beobachte, welcher Schritt dein Kind besonders beruhigt oder besonders reizt.",
      priority: 2,
    },
  ],
  roadmap: {
    chapters: [
      {
        id: "ar-1",
        title: "Abendroutine gestalten",
        timestamp: "Kapitel 6.1",
        description: "Elemente einer passenden Abendroutine auswählen.",
      },
      {
        id: "ar-2",
        title: "Einschlafbegleitung im Abend",
        timestamp: "Kapitel 6.2",
        description: "Den Übergang in den Nachtschlaf unterstützen.",
      },
    ],
    pdfs: [
      {
        id: "ar-pdf-1",
        title: "Abendroutine-Planer",
        filename: "abendroutine-planer.pdf",
      },
    ],
    bonus: [
      {
        id: "ar-bonus-1",
        title: "Abendritual-Ideen",
        description: "Sanfte Rituale für verschiedene Altersstufen.",
      },
    ],
    exercises: [
      {
        id: "ar-ex-1",
        title: "Abend-Ablauf dokumentieren",
        description: "Schreibe die aktuelle Abendroutine auf und bewerte jeden Schritt.",
      },
    ],
  },
};
