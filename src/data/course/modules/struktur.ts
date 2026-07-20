import type { CourseModuleDefinition } from "./types";

export const strukturModule: CourseModuleDefinition = {
  id: "struktur",

  title: "Modul 3 – Struktur",

  description:
    "Dieses Modul zeigt, wie Tagesstruktur, Routinen und Schlafvorbereitung den Babyschlaf unterstützen. Außerdem lernst du, Übermüdung und Überreizung zu erkennen und typische Strukturprobleme richtig einzuordnen.",

  shortDescription:
    "Struktur, Routinen, Übermüdung, Überreizung und typische Schlafprobleme verstehen.",

  order: 3,

  recommendWhen: [
    "Das Einschlafen dauert sehr lange.",
    "Das Kind wacht häufig nachts auf.",
    "Es gibt keine feste Tagesstruktur.",
    "Unsicherheit bezüglich Routinen.",
    "Verdacht auf Übermüdung.",
    "Verdacht auf Überreizung.",
    "Frühes Erwachen.",
    "Kein Tag-Nacht-Rhythmus.",
    "Das Kind schläft tagsüber sehr unregelmäßig.",
    "Es gibt häufiges Weinen vor dem Einschlafen."
  ],

  learningGoals: [
    "Den Unterschied zwischen Struktur und Routinen verstehen.",
    "Eine altersgerechte Tagesstruktur aufbauen.",
    "Hilfreiche Schlafroutinen entwickeln.",
    "Übermüdung erkennen.",
    "Überreizung erkennen.",
    "Typische Strukturprobleme richtig einordnen.",
    "Vorhersehbarkeit und Sicherheit schaffen."
  ],

  relatedKnowledge: [
    "struktur",
    "routinen",
    "abendroutine",
    "schlafroutine",
    "uebermuedung",
    "ueberreizung",
    "fruehes-erwachen",
    "haeufiges-erwachen",
    "lange-einschlafbegleitung",
    "dauernuckeln"
  ],

  nextModules: [
    "schlafdruck",
    "reizverarbeitung",
    "nachtschlaf"
  ],

  priority: 3,

  prerequisites: [
    "grundlagen",
    "schlafentwicklung"
  ],

  todayActions: [
    {
      id: "struktur-1",
      text: "Lege eine möglichst konstante Aufstehzeit fest.",
      priority: 1,
    },
    {
      id: "struktur-2",
      text: "Führe eine kurze Schlafroutine vor jedem Tagschlaf ein.",
      priority: 2,
    },
    {
      id: "struktur-3",
      text: "Beobachte heute bewusst Anzeichen von Überreizung oder Übermüdung.",
      priority: 3,
    },
    {
      id: "struktur-4",
      text: "Plane mindestens eine ruhige Pause ohne neue Reize ein.",
      priority: 4,
    },
  ],

  roadmap: {
    chapters: [
      {
        id: "struktur",
        title: "Was bedeutet Struktur?",
        description:
          "Warum Vorhersehbarkeit den Schlaf unterstützt."
      },
      {
        id: "routinen",
        title: "Schlafroutinen",
        description:
          "Abendroutine, Tagschlafroutine und Einschlafrituale."
      },
      {
        id: "uebermuedung",
        title: "Übermüdung",
        description:
          "Erkennen, verstehen und vorbeugen."
      },
      {
        id: "ueberreizung",
        title: "Überreizung",
        description:
          "Wie Reize den Schlaf beeinflussen."
      },
      {
        id: "probleme",
        title: "Typische Strukturprobleme",
        description:
          "Frühes Erwachen, häufiges Erwachen, lange Einschlafbegleitungen und Dauernuckeln richtig einordnen."
      }
    ],

    pdfs: [],

    bonus: [],

    exercises: [
      {
        id: "struktur-check",
        title: "Struktur-Check",
        description:
          "Überprüfe euren Tagesablauf auf wiederkehrende Abläufe, Routinen und ausreichend Ruhephasen."
      }
    ]
  }
};

export default strukturModule;