export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
}

export const courseModules: CourseModule[] = [
  {
    id: "schlafdruck",
    title: "Schlafdruck & Wachzeiten",
    description:
      "Altersgerechte Wachzeiten erkennen, Schlafdruck aufbauen und Müdigkeitszeichen besser deuten.",
    order: 2,
  },
  {
    id: "tagesstruktur",
    title: "Tagesstruktur & Vorhersehbarkeit",
    description:
      "Einen vorhersehbaren Tagesablauf gestalten und Übergänge für dein Kind planbar machen.",
    order: 3,
  },
  {
    id: "reizverarbeitung",
    title: "Reizverarbeitung & Nervensystem",
    description:
      "Reize dosieren, sensorische Pausen einbauen und ein reguliertes Nervensystem unterstützen.",
    order: 4,
  },
  {
    id: "tagschlaf",
    title: "Tagschlaf & Schläfchen",
    description:
      "Anzahl, Länge und Verteilung der Tagschläfchen altersgerecht anpassen.",
    order: 5,
  },
  {
    id: "abendroutine",
    title: "Abendroutine & Einschlafen",
    description:
      "Eine passende Abendroutine gestalten und den Übergang in den Nachtschlaf unterstützen.",
    order: 6,
  },
  {
    id: "nachtschlaf",
    title: "Nachtschlaf & nächtliches Aufwachen",
    description:
      "Nächtliches Aufwachen einordnen und bindungsorientiert begleiten.",
    order: 7,
  },
  {
    id: "einschlafbegleitung",
    title: "Einschlafbegleitung (zurückhaltend)",
    description:
      "Einschlafhilfen verstehen – erst nach Schlafstruktur und Nervensystem betrachten.",
    order: 8,
  },
];

export const courseModuleMap = Object.fromEntries(
  courseModules.map((module) => [module.id, module])
) as Record<string, CourseModule>;
