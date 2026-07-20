import type { CourseModuleDefinition } from "./types";

export const schlafbereitschaftModule: CourseModuleDefinition = {
  id: "schlafbereitschaft",

  title: "Schlafbereitschaft erkennen",

  description:
    "Dieses Modul hilft dabei zu erkennen, wann ein Kind wirklich schlafbereit ist. Es erklärt Müdigkeitsanzeichen, Wachzeiten, den Einfluss von Reizen und wie Wachphasen sinnvoll gestaltet werden können.",

  shortDescription:
    "Müdigkeitsanzeichen, Wachzeiten und Schlafbereitschaft richtig einschätzen.",

  order: 4,

  recommendWhen: [
    "Das Kind schläft trotz Müdigkeit nicht ein.",
    "Es zeigt keine Müdigkeitsanzeichen.",
    "Unsicherheit bezüglich Wachzeiten.",
    "Fragen zu Müdigkeitsanzeichen.",
    "Das Kind wirkt plötzlich wieder hellwach.",
    "Lange Einschlafbegleitungen.",
    "Das Kind ist abends sehr aufgedreht.",
    "Fragen zur Gestaltung der Wachphasen."
  ],

  learningGoals: [
    "Frühe, mittlere und späte Müdigkeitsanzeichen unterscheiden.",
    "Verstehen, warum Müdigkeit durch Reize überdeckt werden kann.",
    "Wachzeiten als Orientierung statt als starre Vorgabe nutzen.",
    "Wachphasen sinnvoll gestalten.",
    "Ruhe und Aktivität ausgewogen kombinieren.",
    "Den Übergang in den Schlaf erleichtern."
  ],

  relatedKnowledge: [
    "muedigkeitsanzeichen",
    "fruehe-muedigkeitsanzeichen",
    "spaete-muedigkeitsanzeichen",
    "reizueberdeckte-muedigkeit",
    "wachzeiten",
    "wachphasen"
  ],

  nextModules: [
    "schlafdruck",
    "reizverarbeitung",
    "tagschlaf"
  ],

  priority: 4,

  prerequisites: [
    "grundlagen",
    "schlafentwicklung",
    "struktur"
  ],

  todayActions: [
    {
      id: "schlafbereit-1",
      text: "Beobachte heute bewusst die ersten Müdigkeitsanzeichen deines Kindes.",
      priority: 1
    },
    {
      id: "schlafbereit-2",
      text: "Baue während der Wachphase mindestens eine ruhige Pause ein.",
      priority: 2
    },
    {
      id: "schlafbereit-3",
      text: "Reduziere im letzten Drittel der Wachphase bewusst die Reize.",
      priority: 3
    },
    {
      id: "schlafbereit-4",
      text: "Nutze Wachzeiten als Orientierung und beobachte gleichzeitig dein Kind.",
      priority: 4
    }
  ],

  roadmap: {
    chapters: [
      {
        id: "muedigkeit",
        title: "Müdigkeitsanzeichen",
        description:
          "Frühe, mittlere und späte Müdigkeitsanzeichen erkennen."
      },
      {
        id: "reizueberdeckung",
        title: "Wenn Müdigkeit überdeckt wird",
        description:
          "Warum Babys manchmal keine Müdigkeit zeigen."
      },
      {
        id: "wachzeiten",
        title: "Wachzeiten",
        description:
          "Orientierungswerte richtig nutzen."
      },
      {
        id: "wachphasen",
        title: "Wachphasen gestalten",
        description:
          "Aktivität, Bindung, Pausen und Schlafvorbereitung."
      }
    ],

    pdfs: [],

    bonus: [],

    exercises: [
      {
        id: "schlafprotokoll",
        title: "Eigenes Schlafprotokoll",
        description:
          "Notiere mehrere Tage lang Müdigkeitsanzeichen, Wachzeiten und Einschlafzeitpunkte, um individuelle Muster zu erkennen."
      }
    ]
  }
};

export default schlafbereitschaftModule;