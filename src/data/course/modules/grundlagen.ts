import type { CourseModuleDefinition } from "./types";

export const grundlagenModule: CourseModuleDefinition = {
  id: "grundlagen",

  title: "Grundlagen des Babyschlafs",

  description:
    "Dieses Modul vermittelt die biologischen Grundlagen des Babyschlafs. Es erklärt, warum Babys schlafen, wie sich der Schlaf entwickelt, warum nächtliches Erwachen normal ist, welche Empfehlungen zum sicheren Babyschlaf gelten und warum Schlaftraining aus bindungsorientierter Sicht nicht empfohlen wird.",

  shortDescription:
    "Biologische Grundlagen des Babyschlafs, sichere Schlafumgebung und bindungsorientierte Einordnung typischer Schlafmythen.",

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
    "Die Eltern vergleichen ihr Kind häufig mit anderen Kindern.",
    "Unsicherheit darüber, was im ersten Lebensjahr überhaupt normal ist."
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
    "Schlaftraining und bindungsorientierte Alternativen unterscheiden können."
  ],

  relatedKnowledge: [
    "warum-schlafen",
    "schlafzyklen",
    "schlafbedarf",
    "einschlafbegleitung",
    "durchschlafen",
    "sids",
    "familienbett",
    "schlaftraining"
  ],

  nextModules: [
    "schlafdruck",
    "reizverarbeitung",
    "tagesstruktur",
    "abendroutine"
  ],

  priority: 1,

  prerequisites: [],

  todayActions: [
    {
      id: "grundlagen-erwartungen",
      text: "Überprüfe deine Erwartungen an den Babyschlaf und frage dich, ob sie biologisch realistisch sind.",
      priority: 1,
    },
    {
      id: "grundlagen-sicherheit",
      text: "Kontrolliere eure Schlafumgebung anhand der Empfehlungen zum sicheren Babyschlaf.",
      priority: 2,
    },
    {
      id: "grundlagen-durchschlafen",
      text: "Ordne nächtliches Erwachen zunächst als normalen Bestandteil der kindlichen Schlafentwicklung ein.",
      priority: 3,
    },
    {
      id: "grundlagen-druck",
      text: "Vermeide Veränderungen nur deshalb, weil dein Umfeld meint, dein Kind müsse bereits anders schlafen.",
      priority: 4,
    },
  ],

  roadmap: {
    chapters: [
      {
        id: "warum-schlafen",
        title: "Warum schlafen wir?",
        description: "Regeneration, Verarbeitung, Lernen und Immunsystem."
      },
      {
        id: "schlafentwicklung",
        title: "Schlafentwicklung und Schlafzyklen",
        description: "Ultradianer Rhythmus, Schlafphasen und Schlafzyklen."
      },
      {
        id: "schlafbedarf",
        title: "Schlafbedarf",
        description: "Warum Schlafenszeiten individuell sind und Tabellen nur Orientierung bieten."
      },
      {
        id: "einschlafbegleitung",
        title: "Einschlafen und Einschlafbegleitung",
        description: "Warum Begleitung biologisch normal ist und welche Faktoren Einschlafen beeinflussen."
      },
      {
        id: "durchschlafen",
        title: "Durchschlafen",
        description: "Was Durchschlafen bedeutet und warum nächtliches Erwachen normal ist."
      },
      {
        id: "sids",
        title: "Plötzlicher Kindstod",
        description: "Risikofaktoren, Schutzfaktoren und Empfehlungen zum sicheren Babyschlaf."
      },
      {
        id: "familienbett",
        title: "Familienbett",
        description: "Sicheres Bettsharing und wichtige Voraussetzungen."
      },
      {
        id: "schlaftraining",
        title: "Schlaftraining",
        description: "Einordnung verschiedener Schlaftrainings und bindungsorientierte Alternativen."
      }
    ],

    pdfs: [],

    bonus: [],

    exercises: [
      {
        id: "erwartungscheck",
        title: "Erwartungs-Check",
        description:
          "Notiere, welche Erwartungen du bisher an den Schlaf deines Kindes hattest und welche davon möglicherweise gesellschaftlich geprägt sind."
      }
    ]
  }
};

export default grundlagenModule;