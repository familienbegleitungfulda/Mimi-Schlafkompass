export interface TodayAction {
  id: string;
  moduleId: string;
  text: string;
  priority: number;
}

export const todayActions: TodayAction[] = [
  {
    id: "schlafdruck-1",
    moduleId: "schlafdruck",
    text: "Beobachte heute die Müdigkeitszeichen deines Kindes und notiere, wann sie zum ersten Mal sichtbar werden.",
    priority: 1,
  },
  {
    id: "schlafdruck-2",
    moduleId: "schlafdruck",
    text: "Miss grob die Wachzeit vor dem nächsten Schlaf – ohne sie zu verändern.",
    priority: 2,
  },
  {
    id: "tagesstruktur-1",
    moduleId: "tagesstruktur",
    text: "Skizziere den heutigen Tagesablauf in groben Blöcken – Schlaf, Essen, Spiel, Ruhe.",
    priority: 1,
  },
  {
    id: "tagesstruktur-2",
    moduleId: "tagesstruktur",
    text: "Markiere eine Stelle, an der ein fester, wiederkehrender Ablauf schon heute eingeführt werden könnte.",
    priority: 2,
  },
  {
    id: "reizverarbeitung-1",
    moduleId: "reizverarbeitung",
    text: "Baue heute mindestens eine bewusste Ruhepause von 10–15 Minuten in den Tag ein.",
    priority: 1,
  },
  {
    id: "reizverarbeitung-2",
    moduleId: "reizverarbeitung",
    text: "Reduziere für den Rest des Tages einen Reiz – z. B. Geräusche, Licht oder zu viele Angebote gleichzeitig.",
    priority: 2,
  },
  {
    id: "tagschlaf-1",
    moduleId: "tagschlaf",
    text: "Notiere heute Dauer und Uhrzeit jedes Schläfchens.",
    priority: 1,
  },
  {
    id: "tagschlaf-2",
    moduleId: "tagschlaf",
    text: "Achte darauf, ob dein Kind nach dem Aufwachen eher ausgeruht oder überdreht wirkt.",
    priority: 2,
  },
  {
    id: "abendroutine-1",
    moduleId: "abendroutine",
    text: "Schreibe die heutige Abendroutine Schritt für Schritt auf – ohne sie zu verändern.",
    priority: 1,
  },
  {
    id: "abendroutine-2",
    moduleId: "abendroutine",
    text: "Beobachte, welcher Schritt dein Kind besonders beruhigt oder besonders reizt.",
    priority: 2,
  },
  {
    id: "nachtschlaf-1",
    moduleId: "nachtschlaf",
    text: "Notiere heute Nacht: Wann wacht dein Kind auf und wie lange dauert das Wiedereinschlafen?",
    priority: 1,
  },
  {
    id: "nachtschlaf-2",
    moduleId: "nachtschlaf",
    text: "Achte darauf, welche Hilfe nachts aktuell angeboten wird – ohne sie zu verändern.",
    priority: 2,
  },
  {
    id: "einschlafbegleitung-1",
    moduleId: "einschlafbegleitung",
    text: "Beobachte heute nur: Welche Hilfe braucht dein Kind zum Einschlafen – und welche nachts?",
    priority: 1,
  },
  {
    id: "einschlafbegleitung-2",
    moduleId: "einschlafbegleitung",
    text: "Verändere noch nichts – sammle erst ein klares Bild über mehrere Tage.",
    priority: 2,
  },
];

export function getTodayActionsForModule(moduleId: string): TodayAction[] {
  return todayActions
    .filter((action) => action.moduleId === moduleId)
    .sort((a, b) => a.priority - b.priority);
}

export function getTodayActionTexts(moduleIds: string[]): string[] {
  return moduleIds.flatMap((moduleId) =>
    getTodayActionsForModule(moduleId).map((action) => action.text)
  );
}
