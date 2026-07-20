import type { CourseModuleDefinition } from "./types";

export const praktischeTippsModule: CourseModuleDefinition = {
  id: "praktische-tipps",

  title: "Modul 7 – Praktische Tipps",

  description:
    "Dieses Modul enthält praktische Strategien für typische Schlafsituationen im Alltag – von Schlafankern über Pausen bis hin zu Notfalltipps.",

  shortDescription:
    "Praktische Strategien für entspanntere Schlafsituationen.",

  order: 7,

  recommendWhen: [
    "Die Familie sucht konkrete Alltagstipps.",
    "Das Kind befindet sich in einer Umstellung der Tagschläfchen.",
    "Das Kind zeigt keine Müdigkeitsanzeichen.",
    "Die Einschlafbegleitung ist belastend.",
    "Die Familie benötigt kurzfristige Unterstützung.",
    "Fragen zu Schlafankern oder Abdunkeln.",
    "Unsicherheit bei kurzen Nickerchen."
  ],

  learningGoals: [
    "Tagschlafumstellungen erkennen.",
    "Pausen gezielt einsetzen.",
    "Powernaps sinnvoll nutzen.",
    "Den Sinkflug gestalten.",
    "Schlafanker einsetzen.",
    "Die eigene Rolle als Bezugsperson verstehen.",
    "Praktische Notfallstrategien kennenlernen."
  ],

  relatedKnowledge: [
    "umstellung-tagschlaf",
    "beduerfnis-vs-wunsch",
    "pausen",
    "powernap",
    "sinkflug",
    "rolle-der-bezugsperson",
    "schlafanker",
    "abdunkeln",
    "notfalltipps",
    "mini-reset",
    "entlastungsweinen"
  ],

  nextModules: [],

  priority: 8,

  prerequisites: [
    "grundlagen",
    "schlafentwicklung",
    "struktur",
    "schlafbereitschaft",
    "schlafassoziationen",
    "bezugspersonen"
  ],

  todayActions: [
    {
      id: "praxis-1",
      text: "Plane heute bewusst eine ruhige Pause während der letzten Wachphase ein.",
      priority: 1
    },
    {
      id: "praxis-2",
      text: "Überlege, welcher Schlafanker sich gut in euren Alltag integrieren lässt.",
      priority: 2
    },
    {
      id: "praxis-3",
      text: "Achte heute besonders auf den Sinkflug vor dem Schlafengehen.",
      priority: 3
    },
    {
      id: "praxis-4",
      text: "Überlege, was dir selbst hilft, dein Kind ruhig begleiten zu können.",
      priority: 4
    }
  ],

  roadmap: {
    chapters: [
      {
        id: "umstellung",
        title: "Tagschläfchen umstellen",
        description: "Anzeichen erkennen und sinnvoll begleiten."
      },
      {
        id: "pausen",
        title: "Pausen & Powernaps",
        description: "Reizverarbeitung unterstützen und Wachphasen gestalten."
      },
      {
        id: "sinkflug",
        title: "Der Sinkflug",
        description: "Die letzte Wachphase ruhig ausklingen lassen."
      },
      {
        id: "bezug",
        title: "Die Rolle der Bezugsperson",
        description: "Co-Regulation beginnt bei dir."
      },
      {
        id: "anker",
        title: "Schlafanker",
        description: "Hilfreiche Anker für den Schlaf nutzen."
      },
      {
        id: "notfall",
        title: "Wenn nichts mehr geht",
        description: "Praktische Strategien für schwierige Situationen."
      }
    ],

    pdfs: [],

    bonus: [],

    exercises: [
      {
        id: "praxis-check",
        title: "Alltagscheck",
        description:
          "Suche dir einen praktischen Tipp aus diesem Modul aus und probiere ihn mindestens drei Tage hintereinander aus."
      }
    ]
  }
};

export default praktischeTippsModule;