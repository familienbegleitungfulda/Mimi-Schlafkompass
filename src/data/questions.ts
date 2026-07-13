export interface Question {
    id: string;
    title: string;
    question: string;
    required: boolean;
  }
  
  export const questions: Question[] = [
    // =====================
    // PFLICHT
    // =====================
  
    {
      id: "age",
      title: "Alter",
      question:
        "Wie alt ist dein Kind aktuell? Bitte möglichst genau (z. B. 7 Wochen, 5 Monate oder 2 Jahre).",
      required: true,
    },
  
    {
      id: "problem",
      title: "Hauptproblem",
      question:
        "Was belastet euch aktuell beim Schlaf am meisten?",
      required: true,
    },
  
    {
      id: "duration",
      title: "Seit wann",
      question:
        "Seit wann besteht dieses Schlafproblem ungefähr?",
      required: true,
    },
  
    // =====================
    // EINSCHLAFEN
    // =====================
  
    {
      id: "fallAsleep",
      title: "Einschlafen",
      question:
        "Wie läuft das Einschlafen momentan ganz genau ab? Beschreibe den Ablauf Schritt für Schritt.",
      required: true,
    },
  
    {
      id: "sleepSupport",
      title: "Einschlafhilfe",
      question:
        "Wie schläft dein Kind aktuell ein? Zum Beispiel an der Brust, mit Flasche, Tragen, Pezziball, Kinderwagen, Schnuller oder Kuscheln?",
      required: true,
    },
  
    {
      id: "fallAsleepTime",
      title: "Einschlafdauer",
      question:
        "Wie lange dauert das Einschlafen ungefähr?",
      required: true,
    },
  
    // =====================
    // ABENDROUTINE
    // =====================
  
    {
      id: "routine",
      title: "Abendroutine",
      question:
        "Wie sieht eure Abendroutine ganz genau aus? Was macht ihr nacheinander bis dein Kind schläft?",
      required: true,
    },
  
    {
      id: "light",
      title: "Licht",
      question:
        "Ist das Zimmer beim Einschlafen abgedunkelt oder eher hell?",
      required: false,
    },
  
    {
      id: "noise",
      title: "Geräusche",
      question:
        "Schläft dein Kind mit Geräuschen (White Noise) oder ist es eher ruhig?",
      required: false,
    },
  
    // =====================
    // TAGSCHLAF
    // =====================
  
    {
      id: "naps",
      title: "Tagschlaf",
      question:
        "Wie viele Schläfchen macht dein Kind tagsüber?",
      required: true,
    },
  
    {
      id: "wakeWindows",
      title: "Wachphasen",
      question:
        "Wie lange sind die Wachphasen ungefähr zwischen den Schläfchen?",
      required: true,
    },
  
    {
      id: "napDuration",
      title: "Schlafdauer",
      question:
        "Wie lange dauern die einzelnen Schläfchen ungefähr?",
      required: true,
    },
  
    {
      id: "napPlace",
      title: "Schlafort tagsüber",
      question:
        "Wo schläft dein Kind tagsüber meistens?",
      required: true,
    },
  
    // =====================
    // NACHT
    // =====================
  
    {
      id: "nightWakeups",
      title: "Nächte",
      question:
        "Wie oft wacht dein Kind nachts ungefähr auf?",
      required: true,
    },
  
    {
      id: "nightHelp",
      title: "Einschlafen nachts",
      question:
        "Was braucht dein Kind nachts, um wieder einzuschlafen?",
      required: true,
    },
  
    // =====================
    // SCHLAFORT
    // =====================
  
    {
      id: "sleepPlace",
      title: "Schlafort",
      question:
        "Wo schläft dein Kind nachts?",
      required: true,
    },
  
    // =====================
    // STILLEN
    // =====================
  
    {
      id: "feeding",
      title: "Stillen",
      question:
        "Wird dein Kind aktuell gestillt, bekommt es die Flasche oder isst es nachts bereits ohne Milch?",
      required: true,
    },
  
    // =====================
    // ENTWICKLUNG
    // =====================
  
    {
      id: "changes",
      title: "Veränderungen",
      question:
        "Gab es in den letzten Wochen Veränderungen wie Krankheit, Zahnen, Urlaub, Kita oder einen Entwicklungsschritt?",
      required: true,
    },
  
    {
      id: "health",
      title: "Gesundheit",
      question:
        "Gibt es gesundheitliche Besonderheiten, Allergien, Reflux oder Medikamente?",
      required: true,
    },
  
    {
      id: "temperament",
      title: "Temperament",
      question:
        "Wie würdest du dein Kind beschreiben? Eher sensibel, gefühlsstark, sehr aktiv oder ganz entspannt?",
      required: true,
    }
  ];