import type { CourseModuleDefinition } from "./types";

export const schlafentwicklungModule: CourseModuleDefinition = {
  id: "schlafentwicklung",

  title: "Modul 2 – Entwicklung und Schlaftypen",

  description:
    "Dieses Modul erklärt die normale Schlafentwicklung in den ersten zwei Lebensjahren. Es zeigt, welche Veränderungen biologisch normal sind, warum Schlaf sich immer wieder verändert und weshalb sogenannte Schlafregressionen meist Entwicklungsschritte darstellen.",

  shortDescription:
    "Schlafentwicklung, Entwicklungsschritte, Schlafregressionen und Chronotypen verstehen.",

  order: 2,

  recommendWhen: [
    "Das Schlafverhalten hat sich plötzlich verändert.",
    "Das Kind schläft plötzlich schlechter.",
    "Fragen zu Schlafregressionen.",
    "Fragen zur Viermonatsregression.",
    "Fragen zur Achtmonatsregression.",
    "Fragen zur Schlafentwicklung.",
    "Unsicherheit darüber, ob das Verhalten altersgerecht ist.",
    "Das Kind verweigert plötzlich Tagschlaf.",
    "Das Kind benötigt plötzlich deutlich mehr Nähe.",
    "Fragen zum Chronotyp."
  ],

  learningGoals: [
    "Die normale Schlafentwicklung der ersten 24 Monate verstehen.",
    "Entwicklungsbedingte Schlafveränderungen erkennen.",
    "Schlafregressionen richtig einordnen.",
    "Verstehen, warum Entwicklung häufig den Schlaf beeinflusst.",
    "Den individuellen Chronotyp kennenlernen.",
    "Mehr Sicherheit im Umgang mit vorübergehenden Schlafphasen gewinnen."
  ],

  relatedKnowledge: [
    "schlafentwicklung-0-4",
    "schlafentwicklung-4-12",
    "schlafentwicklung-12-24",
    "regressionen",
    "viermonatsregression",
    "sechsmonatsregression",
    "achtmonatsregression",
    "zwoelfmonatsregression",
    "chronotypen"
  ],

  nextModules: [
    "schlafdruck",
    "reizverarbeitung",
    "tagesstruktur"
  ],

  priority: 2,

  prerequisites: [
    "grundlagen"
  ],

  todayActions: [
    {
      id: "entwicklung-1",
      text: "Ordne die aktuelle Schlafphase zunächst als möglichen Entwicklungsschritt ein.",
      priority: 1
    },
    {
      id: "entwicklung-2",
      text: "Verzichte während einer Entwicklungsphase möglichst auf große Schlafveränderungen.",
      priority: 2
    },
    {
      id: "entwicklung-3",
      text: "Plane tagsüber bewusst Ruheinseln und ausreichend Bindungszeit ein.",
      priority: 3
    },
    {
      id: "entwicklung-4",
      text: "Beobachte mehrere Tage den natürlichen Rhythmus deines Kindes, bevor du Wachzeiten veränderst.",
      priority: 4
    }
  ],

  roadmap: {
    chapters: [
      {
        id: "entwicklung-0-4",
        title: "0–4 Monate",
        description:
          "Physiologische Frühgeburt, Tag-Nacht-Rhythmus, Hexenstunden und viel Körperkontakt."
      },
      {
        id: "entwicklung-4-12",
        title: "4–12 Monate",
        description:
          "Schlafzyklen verändern sich, Entwicklungsschritte, Fremdeln und Reizverarbeitung."
      },
      {
        id: "entwicklung-12-24",
        title: "12–24 Monate",
        description:
          "Motorische Entwicklung, Autonomie und neue Herausforderungen beim Schlaf."
      },
      {
        id: "regressionen",
        title: "Schlafregressionen",
        description:
          "Warum Regressionen eigentlich Entwicklungsschritte sind."
      },
      {
        id: "chronotypen",
        title: "Chronotypen",
        description:
          "Lerche, Taube und Eule – der individuelle Schlaf-Wach-Rhythmus."
      }
    ],

    pdfs: [],

    bonus: [],

    exercises: [
      {
        id: "entwicklung-check",
        title: "Entwicklungs-Check",
        description:
          "Überlege, welche neuen Fähigkeiten dein Kind aktuell lernt und ob diese den Schlaf beeinflussen könnten."
      }
    ]
  }
};

export default schlafentwicklungModule;