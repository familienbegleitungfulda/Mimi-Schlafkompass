import type { CourseModuleDefinition } from "./types";

export const schlafassoziationenModule: CourseModuleDefinition = {
  id: "schlafassoziationen",

  title: "Schlafassoziationen verstehen und verändern",

  description:
    "In diesem Modul erfährst du, was Schlafassoziationen sind, wann sie überhaupt verändert werden sollten und welche bindungsorientierten Möglichkeiten es gibt, sie Schritt für Schritt anzupassen.",

  shortDescription:
    "Schlafassoziationen erkennen und bindungsorientiert verändern.",

  order: 6,

  recommendWhen: [
    "Das Kind schläft nur an der Brust ein.",
    "Das Kind schläft nur mit der Flasche ein.",
    "Das Kind schläft nur in Bewegung ein.",
    "Das Kind wacht häufig auf und benötigt immer dieselbe Einschlafhilfe.",
    "Die bisherige Einschlafhilfe belastet die Familie.",
    "Die Familie möchte eine Schlafassoziation verändern.",
    "Das Kind schläft nur in der Federwiege.",
    "Das Kind kneift oder zwickt beim Einschlafen."
  ],

  learningGoals: [
    "Verstehen, was Schlafassoziationen sind.",
    "Erkennen, wann eine Veränderung sinnvoll ist.",
    "Struktur vor Schlafassoziationen überprüfen.",
    "Verschiedene Methoden zum Lösen von Schlafassoziationen kennenlernen.",
    "Veränderungen bindungsorientiert begleiten.",
    "Typische Stolperfallen vermeiden."
  ],

  relatedKnowledge: [
    "schlafassoziationen",
    "bewegung-einschlafen",
    "stillen-assoziation",
    "flasche-assoziation",
    "abdocken",
    "raeumliche-trennung",
    "zeitliche-beschraenkung",
    "geraeuschanker",
    "federwiege",
    "kneifen-zwicken",
    "paradoxe-intervention"
  ],

  nextModules: [
    "nachtschlaf",
    "tagschlaf"
  ],

  priority: 6,

  prerequisites: [
    "grundlagen",
    "schlafentwicklung",
    "struktur",
    "schlafbereitschaft",
    "schlafdruck"
  ],

  todayActions: [
    {
      id: "asso-1",
      text: "Überlege, welche Einschlafhilfe dein Kind aktuell nutzt und ob sie euch wirklich belastet.",
      priority: 1
    },
    {
      id: "asso-2",
      text: "Prüfe zuerst eure Schlafstruktur, bevor du eine Schlafassoziation verändern möchtest.",
      priority: 2
    },
    {
      id: "asso-3",
      text: "Falls ihr eine Veränderung plant, entscheide dich für eine Methode und bleibe möglichst konsequent dabei.",
      priority: 3
    },
    {
      id: "asso-4",
      text: "Schaffe dir tagsüber Entlastung und plane zusätzliche Co-Regulation für die ersten Nächte ein.",
      priority: 4
    }
  ],

  roadmap: {
    chapters: [
      {
        id: "grundlagen",
        title: "Was sind Schlafassoziationen?",
        description:
          "Verstehen, wie Schlafassoziationen entstehen und warum sie nicht grundsätzlich problematisch sind."
      },
      {
        id: "wann",
        title: "Wann sollte man sie verändern?",
        description:
          "Alter, Entwicklung, Belastung und Schlafstruktur richtig einordnen."
      },
      {
        id: "methoden",
        title: "Methoden zur Veränderung",
        description:
          "An- und Abdocken, räumliche Trennung, zeitliche Beschränkung und weitere Möglichkeiten."
      },
      {
        id: "besondere",
        title: "Besondere Schlafassoziationen",
        description:
          "Bewegung, Federwiege, Geräuschanker sowie Kneifen und Zwicken."
      },
      {
        id: "paradox",
        title: "Paradoxe Intervention",
        description:
          "Was du tun kannst, wenn Veränderungen vorübergehend nicht möglich sind."
      },
      {
        id: "stolperfallen",
        title: "Typische Stolperfallen",
        description:
          "Wann Veränderungen besser verschoben werden sollten und worauf du achten kannst."
      }
    ],

    pdfs: [],

    bonus: [],

    exercises: [
      {
        id: "asso-check",
        title: "Schlafassoziations-Check",
        description:
          "Beantworte für dich: Besteht überhaupt eine Schlafassoziation? Belastet sie euch? Und ist jetzt der richtige Zeitpunkt für eine Veränderung?"
      }
    ]
  }
};

export default schlafassoziationenModule;