import { products } from "../data/products";
import { parseChildAgeMonths, schlummerwerkstattIdForAge } from "../data/childAge";
import {
  detectSupportType,
  getBedtimeSupport,
  hasComplexHealthTopic,
  isPossibleSleepAssociation,
  isUnclearSleepAssociation,
} from "./associationEngine";

/**
 * Produktwahl im Schlafkompass (Chat-Karte, PDF und Brevo-Attribut EMPFEHLUNG):
 *
 * 1. 1:1-Beratung bei gesundheitlichen/sehr komplexen Themen oder wenn viele
 *    Themen gleichzeitig zusammenkommen.
 * 2. Papa-Kurs, wenn Papa/Mama-Entlastung der deutlichste Punkt ist (Hauptproblem).
 * 3. Schlummerwerkstatt 1/2 NUR bei eindeutiger Schlafassoziation.
 * 4. Papa-Kurs, wenn das Thema sonst im Gespräch vorkommt.
 * 5. Standard: Mini-Kurs Struktur & Überreizung.
 */

export type PublicProductId =
  | "beratung"
  | "papa"
  | "schlummerwerkstatt1"
  | "schlummerwerkstatt2"
  | "struktur";

export type Product = (typeof products)[number];

function text(memory: any, ...keys: string[]): string {
  return keys
    .map((key) => memory?.[key])
    .filter((v): v is string => typeof v === "string" && v.trim() !== "")
    .join(" | ");
}

const PAPA = "(papa|vater|papi|partner|mann)";
const PAPA_REJECTED = new RegExp(
  `${PAPA}[^.!?|]{0,40}(weint|schreit|lehnt|abgelehnt|klappt nicht|geht nicht|nicht beruhig|will nicht|nicht ein)|(weint|schreit|lehnt|nicht)[^.!?|]{0,30}(bei|mit|von|den|dem) ${PAPA}`,
  "i"
);
const ONLY_MAMA = /nur (bei|mit|von|an|auf) (der )?(mama|mutter|mami)\b/i;
const MAMA_RELIEF =
  /entlast|(mama|mutter|ich)[^.!?|]{0,25}(erschöpft|am ende|kann nicht mehr|keine kraft|ausgelaugt|brauche (eine )?pause)/i;

export function papaTopic(memory: any): { onlyMama: boolean; rejectsPapa: boolean; relief: boolean } {
  const all = text(memory, "mainProblem", "caregivers", "bedtimeSupport", "nightSupport", "familyBurden");
  return {
    onlyMama: ONLY_MAMA.test(all),
    rejectsPapa: PAPA_REJECTED.test(all),
    relief: MAMA_RELIEF.test(text(memory, "mainProblem", "caregivers", "familyBurden")),
  };
}

function hasPapaTopic(memory: any): boolean {
  const t = papaTopic(memory);
  return t.onlyMama || t.rejectsPapa || t.relief;
}

function papaIsMainProblem(memory: any): boolean {
  const main = text(memory, "mainProblem");
  return ONLY_MAMA.test(main) || PAPA_REJECTED.test(main) || MAMA_RELIEF.test(main);
}

const OVERSTIMULATION =
  /aufgedreht|überdreht|aufgekratzt|tobt|überreiz|reizüberflut|übermüd|hochsensib|high.?need|sensibel|kommt nicht zur ruhe|schwer zur ruhe/i;

export function hasOverstimulationSigns(memory: any): boolean {
  return OVERSTIMULATION.test(
    text(memory, "mainProblem", "temperament", "bedtimeDuration", "bedtimeRoutine", "sleepReadiness")
  );
}

const NO_ANSWER = /^\s*(nein|nö|keine?|nichts|gesund|unauffällig|alles (ok|gut|in ordnung))(?![a-zäöüß])/i;

function hasHealthMention(memory: any): boolean {
  const health = text(memory, "health");
  return health !== "" && !NO_ANSWER.test(health);
}

/** Die Themen, die im Gespräch klar erkennbar sind (für "viele Themen"). */
export function collectTopics(memory: any): string[] {
  const topics: string[] = [];
  if (isPossibleSleepAssociation(memory)) topics.push("Einschlafhilfe");
  if (hasPapaTopic(memory)) topics.push("Einschlafen mit Papa");
  if (hasOverstimulationSigns(memory)) topics.push("Überreizung");
  if (hasHealthMention(memory)) topics.push("Gesundheit");
  if (text(memory, "changes") && !NO_ANSWER.test(text(memory, "changes"))) topics.push("Veränderungen");
  if (MAMA_RELIEF.test(text(memory, "familyBurden"))) topics.push("hohe Belastung");
  return topics;
}

const MANY_TOPICS = 4;

export function selectPublicProductId(memory: any): PublicProductId {
  if (hasComplexHealthTopic(memory) || collectTopics(memory).length >= MANY_TOPICS) {
    return "beratung";
  }
  if (papaIsMainProblem(memory)) return "papa";
  if (isPossibleSleepAssociation(memory)) return schlummerwerkstattIdForAge(memory?.age);
  if (hasPapaTopic(memory)) return "papa";
  return "struktur";
}

export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

// --- Begründungen ----------------------------------------------------------

const SUPPORT_PHRASES: Record<string, string> = {
  brust: "beim Stillen",
  flasche: "mit der Flasche",
  tragen: "beim Tragen",
  ball: "beim Wippen oder Schaukeln",
  federwiege: "in der Federwiege",
  kuscheln: "mit viel Körperkontakt",
};

function ageLabel(memory: any): string {
  const months = parseChildAgeMonths(typeof memory?.age === "string" ? memory.age : "");
  if (months === null) return "";
  if (months < 3) return `${Math.max(1, Math.round(months * 4.345))} Wochen`;
  return `${Math.round(months)} Monaten`;
}

const LONG_FALLING_ASLEEP = /lange|ewig|über (eine|1) stunde|stunde|[3-9]\d\s*min/i;

function schlummerwerkstattReasons(memory: any, id: "schlummerwerkstatt1" | "schlummerwerkstatt2"): string[] {
  const reasons: string[] = [];
  const number = id === "schlummerwerkstatt2" ? 2 : 1;
  const support = SUPPORT_PHRASES[detectSupportType(getBedtimeSupport(memory)) ?? ""] ?? "mit einer bestimmten Hilfe";
  const age = ageLabel(memory);

  reasons.push(
    `Ihr habt erzählt, dass euer Kind nur ${support} einschläft und nachts dieselbe Hilfe zum Weiterschlafen braucht. In der Schlummerwerkstatt ${number} lernt ihr, diese Einschlafhilfe bindungsorientiert und in eurem Tempo zu verändern.`
  );

  if (age) {
    reasons.push(
      number === 2
        ? `Mit ${age} spielt oft die Autonomiephase mit hinein. Auch das ist Teil des Kurses.`
        : `Mit ${age} verändert sich der Schlaf noch stark. Im Kurs erfahrt ihr, was in diesem Alter entwicklungsbedingt dazugehört.`
    );
  }

  if (text(memory, "wakeWindows", "naps", "napCount", "napLength")) {
    reasons.push(
      "Ihr schaut euch auch Wachphasen, Tagschlaf und Schlafdruck an, damit jede Veränderung auf einer passenden Schlafstruktur aufbaut."
    );
  }

  reasons.push("Ihr bekommt einen klaren Plan für Abende und Nächte statt einzelner Tipps.");
  return reasons;
}

function strukturReasons(memory: any): string[] {
  const reasons: string[] = [];
  const age = ageLabel(memory);

  if (hasOverstimulationSigns(memory)) {
    reasons.push(
      "Ihr habt erzählt, dass euer Kind abends schwer zur Ruhe kommt. Im Mini-Kurs lernt ihr, Überreizung und Übermüdung früh zu erkennen und den Tag so zu gestalten, dass euer Kind abends leichter abschalten kann."
    );
  }

  if (LONG_FALLING_ASLEEP.test(text(memory, "bedtimeDuration", "mainProblem"))) {
    reasons.push(
      "Langes Einschlafen kann ein Zeichen dafür sein, dass Schlafdruck und Einschlafzeitpunkt noch nicht gut zusammenpassen. Genau darum geht es im Kurs."
    );
  }

  if (text(memory, "wakeWindows", "naps", "napCount", "napLength")) {
    reasons.push(
      `Ihr bekommt Orientierung, welche Wachphasen und wie viel Tagschlaf${age ? ` mit ${age}` : ""} gut zu eurem Kind passen.`
    );
  }

  if (isUnclearSleepAssociation(memory)) {
    reasons.push(
      "Ihr schaut zuerst auf Struktur und Schlafdruck. Das ist oft die wichtigste Stellschraube, bevor man an der Einschlafhilfe etwas verändert."
    );
  } else if (text(memory, "nightWakeups") && !NO_ANSWER.test(text(memory, "nightWakeups"))) {
    reasons.push(
      "Auch nächtliches Aufwachen hängt oft mit Schlafdruck und Tagesstruktur zusammen. Das schaut ihr euch im Kurs genauer an."
    );
  }

  if (reasons.length < 2) {
    reasons.push("Ihr bekommt einen klaren Überblick über Schlafdruck, Wachphasen und Tagesstruktur statt einzelner Tipps.");
  }
  return reasons;
}

function papaReasons(memory: any): string[] {
  const reasons: string[] = [];
  const topic = papaTopic(memory);

  reasons.push(
    topic.onlyMama || !topic.rejectsPapa
      ? "Ihr habt erzählt, dass das Einschlafen bisher vor allem mit Mama klappt. Im Mini-Kurs geht es genau darum, wie Papa das Einschlafen Schritt für Schritt mit übernehmen kann."
      : "Ihr habt erzählt, dass euer Kind bei Papa noch nicht gut einschläft. Im Mini-Kurs geht es genau darum, wie Papa das Einschlafen Schritt für Schritt mit übernehmen kann."
  );

  if (topic.rejectsPapa) {
    reasons.push(
      "Dass euer Kind bei Papa weint oder ihn ablehnt, ist häufig und kein Zeichen einer schlechten Bindung. Der Kurs zeigt, wie Papa euer Kind dabei liebevoll begleiten kann."
    );
  }

  if (detectSupportType(getBedtimeSupport(memory)) === "brust") {
    reasons.push("Auch wenn ihr stillt, kann Papa einen eigenen Weg zum Einschlafen finden. Das ist Teil des Kurses.");
  }

  reasons.push("So kann Mama abends und nachts mehr Entlastung bekommen.");
  return reasons;
}

function beratungReasons(memory: any): string[] {
  const reasons: string[] = [];

  if (hasComplexHealthTopic(memory)) {
    reasons.push(
      "Ihr habt gesundheitliche Themen erwähnt. In der 1:1-Beratung schaut Maya sich eure Situation individuell an und bezieht das mit ein. Medizinische Fragen klärt ihr dabei weiterhin mit eurer Kinderärztin oder eurem Kinderarzt."
    );
  }

  const topics = collectTopics(memory);
  if (topics.length >= 2) {
    reasons.push(
      `Bei euch kommen mehrere Themen zusammen (${topics.join(", ")}). In der 1:1-Beratung entsteht ein Plan, der genau zu eurer Familie passt.`
    );
  }

  reasons.push("Ihr bekommt persönliche, bindungsorientierte Begleitung statt allgemeiner Kursinhalte.");
  if (reasons.length < 2) {
    reasons.push("Gemeinsam mit Maya schaut ihr, welche Schritte für euch gerade wirklich passen.");
  }
  return reasons;
}

/** 2–4 kurze, persönliche Gründe, warum das Produkt der Familie weiterhilft. */
export function buildProductReasons(productId: string, memory: any): string[] {
  const reasons =
    productId === "schlummerwerkstatt1" || productId === "schlummerwerkstatt2"
      ? schlummerwerkstattReasons(memory, productId)
      : productId === "papa"
        ? papaReasons(memory)
        : productId === "beratung"
          ? beratungReasons(memory)
          : strukturReasons(memory);
  return reasons.slice(0, 4);
}
