export interface RoadmapChapter {
  id: string;
  title: string;
  timestamp?: string;
  description?: string;
}

export interface RoadmapPdf {
  id: string;
  title: string;
  filename: string;
}

export interface RoadmapBonus {
  id: string;
  title: string;
  description: string;
}

export interface RoadmapExercise {
  id: string;
  title: string;
  description: string;
}

export interface ModuleRoadmap {
  moduleId: string;
  chapters: RoadmapChapter[];
  pdfs: RoadmapPdf[];
  bonus: RoadmapBonus[];
  exercises: RoadmapExercise[];
}

export const moduleRoadmaps: ModuleRoadmap[] = [
  {
    moduleId: "schlafdruck",
    chapters: [
      {
        id: "sd-1",
        title: "Was ist Schlafdruck?",
        timestamp: "Kapitel 2.1",
        description: "Grundlagen des Schlafdrucks und altersgerechter Wachzeiten.",
      },
      {
        id: "sd-2",
        title: "Müdigkeitszeichen erkennen",
        timestamp: "Kapitel 2.3",
        description: "Frühe und späte Müdigkeitszeichen deuten.",
      },
    ],
    pdfs: [
      {
        id: "sd-pdf-1",
        title: "Wachzeiten-Übersicht",
        filename: "schlafdruck-wachzeiten.pdf",
      },
    ],
    bonus: [
      {
        id: "sd-bonus-1",
        title: "Müdigkeitszeichen-Checkliste",
        description: "Zum Ausdrucken und Beobachten über mehrere Tage.",
      },
    ],
    exercises: [
      {
        id: "sd-ex-1",
        title: "Wachzeit-Protokoll",
        description: "Notiere drei Tage lang Wachzeiten und Müdigkeitszeichen.",
      },
    ],
  },
  {
    moduleId: "tagesstruktur",
    chapters: [
      {
        id: "ts-1",
        title: "Vorhersehbarkeit schaffen",
        timestamp: "Kapitel 3.1",
        description: "Wiederkehrende Abläufe im Familienalltag etablieren.",
      },
      {
        id: "ts-2",
        title: "Übergänge planbar machen",
        timestamp: "Kapitel 3.2",
        description: "Sanfte Übergänge zwischen Aktivität und Ruhe.",
      },
    ],
    pdfs: [
      {
        id: "ts-pdf-1",
        title: "Tagesstruktur-Vorlage",
        filename: "tagesstruktur-vorlage.pdf",
      },
    ],
    bonus: [
      {
        id: "ts-bonus-1",
        title: "Visualisierung für den Tag",
        description: "Einfache Bildkarten für wiederkehrende Tagesabschnitte.",
      },
    ],
    exercises: [
      {
        id: "ts-ex-1",
        title: "Tagesplan skizzieren",
        description: "Erstelle einen groben Tagesplan und markiere feste Ankerpunkte.",
      },
    ],
  },
  {
    moduleId: "reizverarbeitung",
    chapters: [
      {
        id: "rv-1",
        title: "Reize dosieren",
        timestamp: "Kapitel 4.1",
        description: "Sensorische Reize altersgerecht reduzieren und staffeln.",
      },
      {
        id: "rv-2",
        title: "Ruheinseln im Alltag",
        timestamp: "Kapitel 4.2",
        description: "Bewusste Pausen für ein reguliertes Nervensystem.",
      },
    ],
    pdfs: [
      {
        id: "rv-pdf-1",
        title: "Reiz-Tagebuch",
        filename: "reizverarbeitung-tagebuch.pdf",
      },
    ],
    bonus: [
      {
        id: "rv-bonus-1",
        title: "Ruhe-Ecken-Ideen",
        description: "Inspiration für sensorische Rückzugsorte zuhause.",
      },
    ],
    exercises: [
      {
        id: "rv-ex-1",
        title: "Reiz-Audit",
        description: "Gehe deinen Tagesablauf durch und markiere Reiz-Spitzen.",
      },
    ],
  },
  {
    moduleId: "tagschlaf",
    chapters: [
      {
        id: "tg-1",
        title: "Tagschlaf verstehen",
        timestamp: "Kapitel 5.1",
        description: "Anzahl und Länge der Schläfchen altersgerecht einordnen.",
      },
    ],
    pdfs: [
      {
        id: "tg-pdf-1",
        title: "Schläfchen-Protokoll",
        filename: "tagschlaf-protokoll.pdf",
      },
    ],
    bonus: [],
    exercises: [
      {
        id: "tg-ex-1",
        title: "Schläfchen-Tracking",
        description: "Dokumentiere eine Woche lang alle Tagschläfchen.",
      },
    ],
  },
  {
    moduleId: "abendroutine",
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
  {
    moduleId: "nachtschlaf",
    chapters: [
      {
        id: "ns-1",
        title: "Nächtliches Aufwachen einordnen",
        timestamp: "Kapitel 7.1",
        description: "Normal vs. belastend – und was dahinterstecken könnte.",
      },
    ],
    pdfs: [
      {
        id: "ns-pdf-1",
        title: "Nacht-Protokoll",
        filename: "nachtschlaf-protokoll.pdf",
      },
    ],
    bonus: [],
    exercises: [
      {
        id: "ns-ex-1",
        title: "Nacht-Beobachtung",
        description: "Notiere drei Nächte lang Aufwachzeiten und Hilfe.",
      },
    ],
  },
  {
    moduleId: "einschlafbegleitung",
    chapters: [
      {
        id: "eb-1",
        title: "Einschlafhilfen verstehen",
        timestamp: "Kapitel 8.1",
        description: "Was Einschlafbegleitung bedeutet – ohne Bewertung.",
      },
      {
        id: "eb-2",
        title: "Bindungsorientiert begleiten",
        timestamp: "Kapitel 8.3",
        description: "Erst Struktur, dann Einschlafbegleitung betrachten.",
      },
    ],
    pdfs: [
      {
        id: "eb-pdf-1",
        title: "Einschlaf-Protokoll",
        filename: "einschlafbegleitung-protokoll.pdf",
      },
    ],
    bonus: [],
    exercises: [
      {
        id: "eb-ex-1",
        title: "Hilfe-Beobachtung",
        description: "Dokumentiere eine Woche lang Einschlaf- und Nacht-Hilfe.",
      },
    ],
  },
];

export const moduleRoadmapMap = Object.fromEntries(
  moduleRoadmaps.map((roadmap) => [roadmap.moduleId, roadmap])
) as Record<string, ModuleRoadmap>;

export function getRoadmapForModule(moduleId: string): ModuleRoadmap | undefined {
  return moduleRoadmapMap[moduleId];
}
