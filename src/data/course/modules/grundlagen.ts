import type { CourseModuleDefinition } from "./types";

export const grundlagenModule: CourseModuleDefinition = {
  id: "grundlagen",
  title: "Grundlagen des Babyschlafs",
  description:
    "Die biologischen Grundlagen des Babyschlafs verstehen, häufige Mythen einordnen und eine sichere sowie bindungsorientierte Schlafbegleitung kennenlernen.",
  shortDescription:
    "Die biologischen Grundlagen des Babyschlafs verstehen, häufige Mythen einordnen und eine sichere sowie bindungsorientierte Schlafbegleitung kennenlernen.",
  order: 1,
  recommendWhen: [
    "Die Eltern möchten den Babyschlaf grundsätzlich besser verstehen.",
    "Fragen zum Durchschlafen.",
    "Fragen zum Einschlafen.",
    "Fragen zur Einschlafbegleitung.",
    "Fragen zum Familienbett.",
    "Fragen zum plötzlichen Kindstod.",
    "Fragen zur sicheren Schlafumgebung.",
    "Fragen zu Schlaftraining.",
    "Die Eltern sorgen sich, ihr Kind durch Nähe zu verwöhnen.",
  ],
  learningGoals: [
    "Verstehen, warum Schlaf für Babys wichtig ist.",
    "Den Schlaf-Wach-Rhythmus von Säuglingen verstehen.",
    "Die Schlafphasen und Schlafzyklen kennen.",
    "Den individuellen Schlafbedarf besser einordnen.",
    "Verstehen, warum Einschlafbegleitung biologisch normal ist.",
    "Durchschlafen realistisch einordnen.",
    "Die wichtigsten Empfehlungen zur Prävention des plötzlichen Kindstods kennen.",
    "Ein sicheres Familienbett gestalten können.",
    "Schlaftraining und bindungsorientierte Alternativen unterscheiden können.",
  ],
  relatedKnowledge: [
    "durchschlafen",
    "familienbett",
    "sids",
    "schlaftraining",
  ],
  nextModules: ["schlafdruck", "reizverarbeitung", "tagesstruktur", "abendroutine"],
  priority: 1,
  prerequisites: [],
  todayActions: [
    {
      id: "grundlagen-1",
      text: "Eigene Erwartungen an den Babyschlaf überprüfen.",
      priority: 1,
    },
    {
      id: "grundlagen-2",
      text: "Die Schlafumgebung anhand der aktuellen Empfehlungen kontrollieren.",
      priority: 2,
    },
    {
      id: "grundlagen-3",
      text: "Nächtliches Erwachen zunächst als normale Entwicklung betrachten.",
      priority: 3,
    },
    {
      id: "grundlagen-4",
      text: "Keine Veränderungen aus gesellschaftlichem Druck heraus vornehmen.",
      priority: 4,
    },
  ],
  roadmap: {
    chapters: [
      {
        id: "gl-1",
        title: "Warum Babys schlafen",
        timestamp: "Kapitel 1.1",
        description: "Biologische Grundlagen und individueller Schlafbedarf.",
      },
      {
        id: "gl-2",
        title: "Schlafzyklen und Einschlafbegleitung",
        timestamp: "Kapitel 1.3",
        description: "Schlafphasen verstehen und Einschlafhilfe einordnen.",
      },
    ],
    pdfs: [
      {
        id: "gl-pdf-1",
        title: "Grundlagen-Übersicht",
        filename: "grundlagen-uebersicht.pdf",
      },
    ],
    bonus: [
      {
        id: "gl-bonus-1",
        title: "Mythen vs. Fakten",
        description: "Häufige Schlafmythen im Überblick.",
      },
    ],
    exercises: [
      {
        id: "gl-ex-1",
        title: "Erwartungs-Check",
        description: "Notiere deine Erwartungen an den Schlaf deines Kindes.",
      },
    ],
  },
};

export default grundlagenModule;
