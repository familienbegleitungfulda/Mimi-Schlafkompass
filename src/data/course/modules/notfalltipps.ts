import type { CourseModuleDefinition } from "./types";

export const notfalltippsModule: CourseModuleDefinition = {
  id: "notfalltipps",

  title: "Modul 8 – Notfalltipps",

  description:
    "Dieses Modul bietet praktische Strategien für akute Schlafkrisen – wenn nichts mehr geht, die Nächte unerträglich werden oder ihr kurzfristig Entlastung braucht.",

  shortDescription:
    "Strategien für akute Schlafkrisen und besonders belastende Phasen.",

  order: 8,

  recommendWhen: [
    "Die Familie ist akut überfordert oder erschöpft.",
    "Es gibt eine akute Schlafkrise.",
    "Kurzfristige Entlastung wird dringend benötigt.",
    "Nichts scheint mehr zu helfen.",
    "Die Belastung ist sehr hoch und die Familie braucht Soforthilfe."
  ],

  learningGoals: [
    "Notfallstrategien für schwierige Nächte kennenlernen.",
    "Entlastungsweinen und Mini-Resets einordnen.",
    "Kurzfristige Stabilisierung im Alltag umsetzen."
  ],

  relatedKnowledge: ["notfalltipps", "entlastungsweinen", "mini-reset"],

  nextModules: [],

  priority: 8,

  prerequisites: ["grundlagen", "struktur"],

  todayActions: [
    {
      id: "notfall-1",
      text: "Überlege, welche eine Notfallstrategie euch heute Nacht realistisch entlasten könnte.",
      priority: 1,
    },
    {
      id: "notfall-2",
      text: "Plane bewusst eine kurze Erholungspause für dich ein – auch 10 Minuten können helfen.",
      priority: 2,
    },
  ],

  roadmap: {
    chapters: [
      {
        id: "notfall",
        title: "Wenn nichts mehr geht",
        description: "Praktische Strategien für schwierige Situationen.",
      },
      {
        id: "entlastung",
        title: "Entlastung & Mini-Reset",
        description: "Kurzfristige Stabilisierung für dich und euer Kind.",
      },
    ],

    pdfs: [],

    bonus: [],

    exercises: [
      {
        id: "notfall-check",
        title: "Notfallplan",
        description:
          "Wähle eine Strategie aus diesem Modul aus, die ihr in der nächsten schwierigen Nacht ausprobieren könnt.",
      },
    ],
  },
};

export default notfalltippsModule;
