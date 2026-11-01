import { products } from "../data/products";
import { parseChildAgeMonths, schlummerwerkstattIdForAge } from "../data/childAge";
import {
  detectSupportType,
  getBedtimeSupport,
  hasComplexHealthTopic,
  isPossibleSleepAssociation,
} from "./associationEngine";

/**
 * Produktwahl im Schlafkompass (Chat-Karte, PDF und Brevo-Attribut EMPFEHLUNG):
 *
 * 1. 1:1-Beratung bei gesundheitlichen/sehr komplexen Themen oder wenn viele
 *    Themen gleichzeitig zusammenkommen.
 * 2. Papa-Kurs, wenn Papa/Mama-Entlastung der deutlichste Punkt ist (Hauptproblem).
 * 3. Schlummerwerkstatt 1/2 bei eindeutiger Schlafassoziation.
 * 4. „Hundemüde, aber hellwach“ NUR bei Anzeichen von Überreizung (reizoffen,
 *    FOMO, müde und kann nicht abschalten, fehlende Pausen, aufgedrehte Abende).
 * 5. Papa-Kurs, wenn das Thema sonst im Gespräch vorkommt.
 * 6. Standard (Schlafdruck, Wachphasen, Tagschlaf ohne Überreizung):
 *    Schlummerwerkstatt 1 (bis 18 Monate) bzw. 2 (18–36 Monate).
 */

export type PublicProductId =
  | "beratung"
  | "papa"
  | "schlummerwerkstatt1"
  | "schlummerwerkstatt2"
  | "hundemuede";

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
  /aufgedreht|überdreht|aufgekratzt|tobt|überreiz|reizüberflut|reizoffen|hochsensib|high.?need|sensibel|kommt nicht zur ruhe|schwer zur ruhe|nicht abschalten|fomo|regulation|reguliert|keine pausen?\b|unruhige?n? abend|abends (sehr |total |ganz )?unruhig/i;

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
  if (hasOverstimulationSigns(memory)) return "hundemuede";
  if (hasPapaTopic(memory)) return "papa";
  return schlummerwerkstattIdForAge(memory?.age);
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
  const hasStructureInfo = text(memory, "wakeWindows", "naps", "napCount", "napLength") !== "";

  if (isPossibleSleepAssociation(memory)) {
    reasons.push(
      `Ihr habt erzählt, dass euer Kind nur ${support} einschläft und nachts dieselbe Hilfe zum Weiterschlafen braucht. In der Schlummerwerkstatt ${number} lernt ihr, diese Einschlafhilfe bindungsorientiert und in eurem Tempo zu verändern.`
    );
  } else {
    reasons.push(
      `In der Schlummerwerkstatt ${number} schaut ihr euch Schlafdruck, Wachphasen und Tagschlaf genau an, damit die Schlafstruktur gut zu eurem Kind passt.`
    );
    if (LONG_FALLING_ASLEEP.test(text(memory, "bedtimeDuration"))) {
      reasons.push(
        "Langes Einschlafen kann ein Zeichen dafür sein, dass Schlafdruck und Einschlafzeitpunkt noch nicht gut zusammenpassen. Genau darum geht es im Kurs."
      );
    }
  }

  if (age) {
    reasons.push(
      number === 2
        ? `Mit ${age} spielt oft die Autonomiephase mit hinein. Auch das ist Teil des Kurses.`
        : `Mit ${age} verändert sich der Schlaf noch stark. Im Kurs erfahrt ihr, was in diesem Alter entwicklungsbedingt dazugehört.`
    );
  }

  if (hasStructureInfo && isPossibleSleepAssociation(memory)) {
    reasons.push(
      "Ihr schaut euch auch Wachphasen, Tagschlaf und Schlafdruck an, damit jede Veränderung auf einer passenden Schlafstruktur aufbaut."
    );
  }

  reasons.push("Ihr bekommt einen klaren Plan für Abende und Nächte statt einzelner Tipps.");
  return reasons;
}

function hundemuedeReasons(): string[] {
  const reasons: string[] = [
    "Bei euch klingt vieles nach Überreizung: Euer Kind wirkt todmüde und kann trotzdem nicht abschalten. Genau dafür hat Maya den Kurs „Hundemüde, aber hellwach“ entwickelt.",
    "Ihr findet heraus, ob euer Kind reizoffen ist, ein FOMO-Baby oder beides, und lernt, Überreizung und Übermüdung zu unterscheiden.",
  ];

  reasons.push("Ihr lernt, Pausen in den Tag einzubauen, damit sich über den Tag weniger Reize ansammeln.");

  reasons.push(
    "Mit dem 7-Tage-Plan und dem Begleit-Tool „Ruhewoche“ (Pausenfinder und SOS-Tool) gestaltet ihr den Abend als ruhigen Sinkflug."
  );
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
          : hundemuedeReasons();
  return reasons.slice(0, 4);
}
