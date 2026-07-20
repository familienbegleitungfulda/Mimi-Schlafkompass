import type { CourseModuleDefinition } from "./types";

export const bezugspersonenModule: CourseModuleDefinition = {
  id: "bezugspersonen",

  title: "Weitere Bezugspersonen integrieren",

  description:
    "In diesem Modul lernst du, warum Kinder Bezugspersonen unterschiedlich bevorzugen, wie weitere Bezugspersonen Schritt für Schritt eingebunden werden können und wie Veränderungen bindungsorientiert gelingen.",

  shortDescription:
    "Weitere Bezugspersonen bindungsorientiert in die Schlafbegleitung integrieren.",

  order: 7,

  recommendWhen: [
    "Das Kind akzeptiert nur eine Bezugsperson beim Einschlafen.",
    "Der Papa soll die Einschlafbegleitung übernehmen.",
    "Eine andere Bezugsperson soll den Nachtschlaf begleiten.",
    "Das Kind lehnt den Papa oder eine andere Bezugsperson ab.",
    "Die Hauptbezugsperson benötigt Entlastung.",
    "Stillen erschwert scheinbar die Übernahme durch eine andere Bezugsperson."
  ],

  learningGoals: [
    "Verstehen, warum Kinder Bezugspersonen unterschiedlich bevorzugen.",
    "Die Bezugspersonen-Hierarchie verstehen.",
    "Weitere Bezugspersonen im Alltag stärken.",
    "Die Schlafbegleitung schrittweise übertragen.",
    "Weinen bindungsorientiert begleiten.",
    "Typische Fehler vermeiden."
  ],

  relatedKnowledge: [
    "bezugspersonen",
    "bezugspersonen-hierarchie",
    "papa",
    "mama",
    "schrittweise-uebernahme",
    "weinen-bezugsperson",
    "reaktionspyramide",
    "stillen-und-papa"
  ],

  nextModules: [],

  priority: 7,

  prerequisites: [
    "grundlagen",
    "schlafentwicklung",
    "struktur",
    "schlafbereitschaft",
    "schlafassoziationen"
  ],

  todayActions: [
    {
      id: "bezug-1",
      text: "Plane täglich 15–30 Minuten exklusive Zeit zwischen Kind und weiterer Bezugsperson ein.",
      priority: 1
    },
    {
      id: "bezug-2",
      text: "Überlegt gemeinsam, wer künftig welche Schlafsituation übernehmen soll.",
      priority: 2
    },
    {
      id: "bezug-3",
      text: "Beginnt mit dem stabilsten Tagschlaf, bevor ihr den Nachtschlaf verändert.",
      priority: 3
    },
    {
      id: "bezug-4",
      text: "Lasst jeder Bezugsperson Raum, ihren eigenen Weg der Co-Regulation zu finden.",
      priority: 4
    }
  ],

  roadmap: {
    chapters: [
      {
        id: "warum",
        title: "Warum werden Bezugspersonen abgelehnt?",
        description:
          "Bindung, sensible Phasen und die Bezugspersonen-Hierarchie verstehen."
      },
      {
        id: "alltag",
        title: "Vorbereitung im Alltag",
        description:
          "Wie weitere Bezugspersonen Sicherheit und Bindung aufbauen."
      },
      {
        id: "uebernahme",
        title: "Schrittweise Schlafbegleitung",
        description:
          "Vom Tagschlaf bis zur kompletten Nacht."
      },
      {
        id: "weinen",
        title: "Weinen begleiten",
        description:
          "Bindungsorientierter Umgang mit Gefühlen während der Veränderung."
      },
      {
        id: "tipps",
        title: "Tipps und Stolperfallen",
        description:
          "Was Veränderungen erleichtert und was sie erschweren kann."
      }
    ],

    pdfs: [],

    bonus: [],

    exercises: [
      {
        id: "plan",
        title: "Übernahmeplan erstellen",
        description:
          "Lege gemeinsam fest, wer welche Schlafsituation übernimmt und wann ihr eine Veränderung unterbrecht."
      }
    ]
  }
};

export default bezugspersonenModule;