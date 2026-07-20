export interface CourseModule {
  id: string;
  title: string;
  description: string;
  when: string[];
  chapter: string;
  timestamp?: string;
  todayActions: string[];
}

export const schlummerwerkstattModules: CourseModule[] = [
  {
    id: "schlafdruck",
    title: "Schlafdruck & Wachzeiten",
    description:
      "Altersgerechte Wachzeiten erkennen, Schlafdruck aufbauen und Müdigkeitszeichen besser deuten.",
    when: [
      "Schlafdruck",
      "Wachphasen",
      "Wachzeiten",
      "Übermüdung",
      "Unterforderung",
      "Tagesstruktur",
    ],
    chapter: "Modul 2 – Schlafdruck verstehen",
    timestamp: "Kapitel 2.3",
    todayActions: [
      "Beobachte heute die Müdigkeitszeichen deines Kindes und notiere, wann sie zum ersten Mal sichtbar werden.",
      "Miss grob die Wachzeit vor dem nächsten Schlaf – ohne sie zu verändern.",
    ],
  },
  {
    id: "tagesstruktur",
    title: "Tagesstruktur & Vorhersehbarkeit",
    description:
      "Einen vorhersehbaren Tagesablauf gestalten und Übergänge für dein Kind planbar machen.",
    when: [
      "Tagesstruktur",
      "Vorhersehbarkeit",
      "Routine",
      "Tagschlaf",
      "Schlafstruktur",
    ],
    chapter: "Modul 3 – Tagesstruktur",
    timestamp: "Kapitel 3.1",
    todayActions: [
      "Skizziere den heutigen Tagesablauf in groben Blöcken – Schlaf, Essen, Spiel, Ruhe.",
      "Markiere eine Stelle, an der ein fester, wiederkehrender Ablauf schon heute eingeführt werden könnte.",
    ],
  },
  {
    id: "reizverarbeitung",
    title: "Reizverarbeitung & Nervensystem",
    description:
      "Reize dosieren, sensorische Pausen einbauen und ein reguliertes Nervensystem unterstützen.",
    when: [
      "Überreizung",
      "Reizüberflutung",
      "Reizverarbeitung",
      "Nervensystem",
      "Temperament",
      "High Need",
    ],
    chapter: "Modul 4 – Reizverarbeitung",
    timestamp: "Kapitel 4.2",
    todayActions: [
      "Baue heute mindestens eine bewusste Ruhepause von 10–15 Minuten in den Tag ein.",
      "Reduziere für den Rest des Tages einen Reiz – z. B. Geräusche, Licht oder zu viele Angebote gleichzeitig.",
    ],
  },
  {
    id: "tagschlaf",
    title: "Tagschlaf & Schläfchen",
    description:
      "Anzahl, Länge und Verteilung der Tagschläfchen altersgerecht anpassen.",
    when: ["Tagschlaf", "Schläfchen", "Nap", "kurze Schläfchen", "Übermüdung"],
    chapter: "Modul 5 – Tagschlaf",
    timestamp: "Kapitel 5.1",
    todayActions: [
      "Notiere heute Dauer und Uhrzeit jedes Schläfchens.",
      "Achte darauf, ob dein Kind nach dem Aufwachen eher ausgeruht oder überdreht wirkt.",
    ],
  },
  {
    id: "abendroutine",
    title: "Abendroutine & Einschlafen",
    description:
      "Eine passende Abendroutine gestalten und den Übergang in den Nachtschlaf unterstützen.",
    when: [
      "Abendroutine",
      "Einschlafen",
      "Einschlafbegleitung",
      "Bettzeit",
      "Abend",
    ],
    chapter: "Modul 6 – Abendroutine",
    timestamp: "Kapitel 6.2",
    todayActions: [
      "Schreibe die heutige Abendroutine Schritt für Schritt auf – ohne sie zu verändern.",
      "Beobachte, welcher Schritt dein Kind besonders beruhigt oder besonders reizt.",
    ],
  },
  {
    id: "nachtschlaf",
    title: "Nachtschlaf & nächtliches Aufwachen",
    description:
      "Nächtliches Aufwachen einordnen und bindungsorientiert begleiten.",
    when: [
      "Nachtschlaf",
      "nächtliches Aufwachen",
      "Wachphasen nachts",
      "Hilfe nachts",
    ],
    chapter: "Modul 7 – Nachtschlaf",
    timestamp: "Kapitel 7.1",
    todayActions: [
      "Notiere heute Nacht: Wann wacht dein Kind auf und wie lange dauert das Wiedereinschlafen?",
      "Achte darauf, welche Hilfe nachts aktuell angeboten wird – ohne sie zu verändern.",
    ],
  },
  {
    id: "einschlafbegleitung",
    title: "Einschlafbegleitung (zurückhaltend)",
    description:
      "Einschlafhilfen verstehen – erst nach Schlafstruktur und Nervensystem betrachten.",
    when: [
      "Einschlafassoziation",
      "Schlafassoziation",
      "Einschlafhilfe",
      "Einschlafbegleitung",
    ],
    chapter: "Modul 8 – Einschlafbegleitung",
    timestamp: "Kapitel 8.3",
    todayActions: [
      "Beobachte heute nur: Welche Hilfe braucht dein Kind zum Einschlafen – und welche nachts?",
      "Verändere noch nichts – sammle erst ein klares Bild über mehrere Tage.",
    ],
  },
];
