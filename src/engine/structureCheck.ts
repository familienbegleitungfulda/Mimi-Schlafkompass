import { parseChildAgeMonths } from "../data/childAge";
import { findSleepNeedRow, type SleepNeedRow } from "../data/sleepNeeds";
import { isPossibleSleepAssociation } from "./associationEngine";

/**
 * Deterministische Altersprüfung von Wachphasen und Tagschlaf.
 * Das Ergebnis wird Mimi (Chat) und der PDF-Auswertung als verbindliche
 * Einordnung mitgegeben, damit die KI nicht gegen die eigenen Richtwerte
 * argumentiert.
 */

export type RangeStatus =
  | "unbekannt"
  | "im Bereich"
  | "knapp darunter"
  | "knapp darüber"
  | "deutlich darunter"
  | "deutlich darüber";

export interface StructureCheck {
  ageMonths: number | null;
  row: SleepNeedRow | undefined;
  wakeValues: number[];
  wakeStatus: RangeStatus;
  napCount: number | null;
  napStatus: RangeStatus;
  overtiredSigns: string[];
  overstimulatedSigns: string[];
  nightIssues: string[];
  /** Dieselbe Einschlafhilfe abends und nachts erkannt. */
  sleepAssociation: boolean;
  /** Wachphasen und Schläfchenanzahl passen (mindestens im Rahmen). */
  structureAgeAppropriate: boolean;
  /** Wachphasen dürfen als möglicher Schwerpunkt genannt werden. */
  wakeMayBeFocus: boolean;
}

const NUMBER_WORDS: Record<string, string> = {
  eineinhalb: "1.5",
  anderthalb: "1.5",
  zweieinhalb: "2.5",
  dreieinhalb: "3.5",
  viereinhalb: "4.5",
  fünfeinhalb: "5.5",
  einen: "1",
  eine: "1",
  einem: "1",
  ein: "1",
  eins: "1",
  zwei: "2",
  drei: "3",
  vier: "4",
  fünf: "5",
  sechs: "6",
  sieben: "7",
};

function normalize(text: string): string {
  let out = ` ${text.toLowerCase()} `.replace(/(\d),(\d)/g, "$1.$2");
  out = out.replace(/(\d+)\s*(?:std\.?|stunden?|h)\s*(?:und\s*)?(\d+)\s*(?:minuten|min\.?)/g, (_, h, m) =>
    `${(parseInt(h, 10) + parseInt(m, 10) / 60).toFixed(2)} stunden`
  );
  out = out.replace(/(\d+)\s*(?:1\/2|½)/g, (_, h) => `${parseInt(h, 10) + 0.5}`);
  out = out.replace(/(\d+)\s*(?:std\.?|stunden?|h)?\s*(?:und\s*)?(?:eine\s*)?halbe?\s*stunden?/g, (_, h) =>
    `${parseInt(h, 10) + 0.5} stunden`
  );
  for (const [word, value] of Object.entries(NUMBER_WORDS)) {
    out = out.replace(new RegExp(`(^|[^a-zäöüß])${word}(?=[^a-zäöüß])`, "g"), `$1${value}`);
  }
  return out;
}

const NUM = "(\\d+(?:\\.\\d+)?)";
const RANGE_SEP = "\\s*(?:-|–|bis)\\s*";
const HOURS = "\\s*(?:std\\.?|stunden?|h)\\b";
const MINUTES = "\\s*(?:min\\.?|minuten)\\b";

/** Alle Wachphasen-Angaben in Stunden, z. B. "3-4 Stunden" → [3, 4]. */
export function parseWakeHours(text?: unknown): number[] {
  if (typeof text !== "string" || !text.trim()) return [];
  let rest = normalize(text);
  const values: number[] = [];

  const take = (pattern: string, factor: number) => {
    const groups = (pattern.match(/\((?!\?)/g) ?? []).length;
    rest = rest.replace(new RegExp(pattern, "g"), (...m: unknown[]) => {
      for (const n of m.slice(1, 1 + groups)) {
        if (typeof n === "string") values.push(parseFloat(n) * factor);
      }
      return " ";
    });
  };

  take(`${NUM}${RANGE_SEP}${NUM}${HOURS}`, 1);
  take(`${NUM}${RANGE_SEP}${NUM}${MINUTES}`, 1 / 60);
  take(`${NUM}${HOURS}`, 1);
  take(`${NUM}${MINUTES}`, 1 / 60);

  return values.filter((v) => v > 0 && v <= 12);
}

/** Anzahl der Tagschläfchen, z. B. "1", "einen Mittagsschlaf", "keinen". */
export function parseNapCount(...texts: unknown[]): number | null {
  for (const raw of texts) {
    if (typeof raw !== "string" || !raw.trim()) continue;
    const text = normalize(raw);
    if (/\bkein(en|e)?\b|gar nicht|nicht mehr/.test(text)) return 0;
    const explicit = text.match(/(\d+)\s*(?:x\s*)?(?:mal\s*)?(?:schläfchen|nickerchen|naps?|tagschl|mittagsschl)/);
    if (explicit) return parseInt(explicit[1], 10);
    const plain = text.trim().match(/^(\d+)$/);
    if (plain) return parseInt(plain[1], 10);
    if (/mittagsschlaf|1 tagschlaf/.test(text)) return 1;
  }
  return null;
}

/** Minuten aus z. B. "über eine Stunde", "45 Minuten", "1-2 Stunden" (Maximum). */
function parseMaxMinutes(text?: unknown): number | null {
  const hours = parseWakeHours(text);
  return hours.length > 0 ? Math.max(...hours) * 60 : null;
}

function classify(values: number[], range: [number, number], slack: number): RangeStatus {
  if (values.length === 0) return "unbekannt";
  const [lo, hi] = range;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const tolerance = Math.min(0.25, slack / 2);

  if (max > hi + slack) return "deutlich darüber";
  if (min < lo - slack) return "deutlich darunter";
  if (max > hi + tolerance) return "knapp darüber";
  if (min < lo - tolerance) return "knapp darunter";
  return "im Bereich";
}

/** Ab wann eine Abweichung "deutlich" ist – wächst mit dem Alter. */
function wakeSlack(months: number): number {
  if (months < 3) return 0.25;
  if (months < 12) return 0.75;
  return 1;
}

const OVERTIRED_PATTERNS: [RegExp, string][] = [
  [/quengel|weinerlich|nörgel|meckert/, "quengelig / meckert"],
  [/weint schnell|weint sofort|weint viel|schnell weinen|viel weinen/, "weint schnell"],
  [/reibt\s*(sich)?\s*(die)?\s*auge|augen\s*reib/, "reibt die Augen"],
  [/schläft (beim|an der|im) (stillen|brust|auto|kinderwagen|wagen)[^.]*sofort|sofort ein(geschlafen|schlafen)?\b[^.]*(auto|stillen|brust)|im auto sofort/, "schläft beim Stillen oder im Auto sofort ein"],
];

const OVERSTIMULATED_PATTERNS: [RegExp, string][] = [
  [/aufgedreht|überdreht/, "aufgedreht"],
  [/\btobt|turnt|klettert/, "tobt / turnt"],
  [/motorisch unruhig|zappel|unruhig/, "motorisch unruhig"],
  [/kommt (nur )?schwer runter|nicht runterkommen|schwer zur ruhe/, "kommt schwer runter"],
];

function collectSigns(text: string, patterns: [RegExp, string][]): string[] {
  return patterns.filter(([pattern]) => pattern.test(text)).map(([, label]) => label);
}

function memoryText(memory: Record<string, unknown>): string {
  return Object.values(memory)
    .filter((v): v is string => typeof v === "string")
    .join(" | ")
    .toLowerCase();
}

export function checkStructure(memory: Record<string, unknown>): StructureCheck {
  const ageMonths = parseChildAgeMonths(typeof memory.age === "string" ? memory.age : undefined);
  const row = ageMonths !== null ? findSleepNeedRow(ageMonths) : undefined;
  const text = memoryText(memory);

  const napCount = parseNapCount(memory.napCount, memory.naps);

  const wakeValues = parseWakeHours(memory.wakeWindows);
  const wakeRange =
    napCount === 0 && row?.wakeHoursWithoutNap ? row.wakeHoursWithoutNap : row?.wakeHours;
  const wakeStatus =
    wakeRange && ageMonths !== null
      ? classify(wakeValues, wakeRange, wakeSlack(ageMonths))
      : "unbekannt";

  const napStatus: RangeStatus =
    row?.naps && napCount !== null
      ? napCount > row.naps[1]
        ? "deutlich darüber"
        : napCount < row.naps[0]
          ? "deutlich darunter"
          : "im Bereich"
      : "unbekannt";

  const overtiredSigns = collectSigns(text, OVERTIRED_PATTERNS);
  const overstimulatedSigns = collectSigns(text, OVERSTIMULATED_PATTERNS);

  const bedtimeMinutes = parseMaxMinutes(memory.bedtimeDuration);
  if (
    (bedtimeMinutes !== null && bedtimeMinutes >= 30) ||
    /(über|mehr als) (1|eine) stunde|ewig|sehr lange/.test(String(memory.bedtimeDuration ?? "").toLowerCase())
  ) {
    overstimulatedSigns.push("langes Einschlafen");
  }

  const nightIssues: string[] = [];
  const wakeups = normalize(String(memory.nightWakeups ?? ""));
  const wakeupCount = wakeups.match(/(\d+)\s*(?:-\s*\d+\s*)?(?:x|mal)/);
  if (
    /jede(n)? stunde|stündlich|häufig|oft|mehrmals|ständig|sehr viel|alle \d|dauernd/.test(wakeups) ||
    (wakeupCount && parseInt(wakeupCount[1], 10) >= 2)
  ) {
    nightIssues.push("häufiges nächtliches Aufwachen");
  }
  if (overstimulatedSigns.includes("langes Einschlafen")) {
    nightIssues.push("langes Einschlafen am Abend");
  }
  if (/\b(4|5)([:.]\d+)?\s*uhr|sehr früh|früh(es)? (wach|aufwachen|aufstehen)|frühaufsteher/.test(text)) {
    nightIssues.push("sehr frühes Aufwachen");
  }

  const wakeOk = !wakeStatus.startsWith("deutlich");
  const napsOk = napStatus === "im Bereich" || napStatus === "unbekannt";

  return {
    ageMonths,
    row,
    wakeValues,
    wakeStatus,
    napCount,
    napStatus,
    overtiredSigns,
    overstimulatedSigns,
    nightIssues,
    sleepAssociation: isPossibleSleepAssociation(memory),
    structureAgeAppropriate:
      wakeStatus !== "unbekannt" && wakeOk && napsOk,
    wakeMayBeFocus:
      wakeStatus.startsWith("deutlich") ||
      overtiredSigns.length > 0 ||
      overstimulatedSigns.some((s) => s !== "langes Einschlafen"),
  };
}

function formatHours(value: number): string {
  const rounded = Math.round(value * 4) / 4;
  return `${String(rounded).replace(".", ",")} Std.`;
}

/** Allgemeine Regeln – gelten für Chat-Analyse und PDF-Auswertung. */
export const WAKE_NAP_RULES = `
REGELN FÜR WACHPHASEN, TAGSCHLAF UND NÄCHTLICHES AUFWACHEN (verbindlich)

WACHPHASEN
1. Vergleiche jede angegebene Wachphase mit dem altersentsprechenden Bereich aus den Richtwerten. Liegt sie im Bereich (oder nur knapp daneben), bezeichne sie NIE als zu lang oder zu kurz und nenne sie NICHT als Ursache.
2. Eine Wachphase darf nur als möglicher Schwerpunkt genannt werden, wenn sie deutlich außerhalb des Bereichs liegt oder die Eltern klare Anzeichen beschreiben:
   - Übermüdung: quengelig, weint schnell, reibt die Augen, schläft beim Stillen oder im Auto sofort ein
   - Überreizung: aufgedreht, tobt, motorisch unruhig, kommt schwer runter, langes Einschlafen
3. Die Richtwerte sind grobe Durchschnittswerte. Wachzeit = Dauer einer einzelnen Wachphase. Das Verhalten des Kindes zählt mehr als die Zahl. Wachphasen knapp außerhalb des Bereichs sind nie die Hauptursache.

TAGSCHLAF
4. Prüfe Anzahl und Dauer der Schläfchen immer altersbezogen. Ab ca. 15–18 Monaten ist 1 Tagschlaf üblich. Empfiehl Kindern, die altersgerecht bereits 1 Schläfchen machen, NIE ein zweites Schläfchen.
5. Empfiehl einen längeren Tagschlaf nur, wenn klare Übermüdungszeichen beschrieben werden UND der Nachtschlaf nicht betroffen ist. Bei häufigem nächtlichem Aufwachen, langem Einschlafen am Abend oder sehr frühem Aufwachen gilt: Tagschlaf eher NICHT verlängern, sondern prüfen, ob insgesamt zu viel geschlafen wird. Mehr Tagschlaf senkt den Schlafdruck für die Nacht.
6. Setze Tag- und Nachtschlaf immer ins Verhältnis. Betrachte die Gesamtwachzeit innerhalb von 24 Stunden (Wachzeiten am Tag plus nächtliche Wachphasen über 15 Minuten). Sie ist individuell und sollte stabil bei ca. ±30 Minuten liegen. Eine feste Tabelle gibt es dafür nicht.

NÄCHTLICHES AUFWACHEN
7. Erkläre häufiges nächtliches Aufwachen NICHT automatisch mit Wachphasen oder Tagschlaf, wenn beides altersgerecht ist. Prüfe dann andere Ursachen: Einschlafassoziation (z. B. Einschlafstillen, Flasche, Tragen, Wippen, Federwiege, Schnuller, Körperkontakt – wenn das Kind nachts dieselbe Hilfe zum Weiterschlafen braucht), zu wenig Schlafdruck durch zu viel Gesamtschlaf, Reize und Erlebnisse am Tag, Entwicklungsschritte, Autonomie- oder Trennungsthemen. Frage bei Bedarf gezielt nach.

ALLGEMEIN
8. Stelle lieber eine gezielte Rückfrage, als eine Empfehlung zu geben, die nicht zu den Angaben passt.
`.trim();

export function formatStructureCheckForPrompt(check: StructureCheck): string {
  const lines: string[] = ["ALTERSPRÜFUNG WACHPHASEN UND TAGSCHLAF (automatisch berechnet, verbindlich)"];

  if (check.ageMonths === null || !check.row) {
    lines.push("Alter noch unbekannt – bewerte Wachphasen und Tagschlaf noch nicht.");
    return lines.join("\n");
  }

  const row = check.row;
  lines.push(
    `Altersgruppe: ${row.label} – Richtwert Wachphase: ${row.wakeLabel}${row.napLabel ? `, üblich: ${row.napLabel}` : ""}${
      row.daySleepLabel ? `, Tagschlaf gesamt: ${row.daySleepLabel}` : ""
    }${row.nightSleepLabel ? `, Nachtschlaf: ${row.nightSleepLabel}` : ""} (grobe Durchschnittswerte)`
  );

  if (check.wakeStatus === "unbekannt") {
    lines.push("Wachphasen: noch keine verwertbare Angabe – nicht bewerten, ggf. nachfragen.");
  } else {
    const given = check.wakeValues.map(formatHours).join(" / ");
    const verdict: Record<RangeStatus, string> = {
      unbekannt: "",
      "im Bereich": "liegt IM altersüblichen Bereich. Bezeichne sie NICHT als zu lang oder zu kurz und nenne sie NICHT als Ursache.",
      "knapp darunter": "liegt nur knapp unter dem Richtwert – das ist im normalen Rahmen. Bezeichne sie NICHT als zu lang oder zu kurz und nenne sie NICHT als Ursache.",
      "knapp darüber": "liegt nur knapp über dem Richtwert – das ist im normalen Rahmen. Bezeichne sie NICHT als zu lang oder zu kurz und nenne sie NICHT als Ursache.",
      "deutlich darunter": "liegt DEUTLICH unter dem Richtwert. Du darfst sie vorsichtig als möglichen Schwerpunkt nennen (eher zu wenig Schlafdruck), frage aber nach dem Verhalten des Kindes.",
      "deutlich darüber": "liegt DEUTLICH über dem Richtwert. Du darfst sie vorsichtig als möglichen Schwerpunkt nennen (mögliche Übermüdung), frage aber nach dem Verhalten des Kindes.",
    };
    lines.push(`Angegebene Wachphase: ${given} → ${verdict[check.wakeStatus]}`);
  }

  if (check.napStatus === "unbekannt") {
    lines.push("Anzahl Tagschläfchen: unbekannt – keine Annahme treffen.");
  } else if (check.napStatus === "im Bereich") {
    lines.push(`Anzahl Tagschläfchen: ${check.napCount} → altersgerecht.${check.napCount === 1 ? " Empfiehl KEIN zweites Schläfchen." : ""}`);
  } else {
    lines.push(`Anzahl Tagschläfchen: ${check.napCount} → ${check.napStatus === "deutlich darüber" ? "mehr" : "weniger"} als altersüblich (${row.napLabel}). Behutsam einordnen, nicht dramatisieren.`);
  }

  lines.push(
    check.overtiredSigns.length > 0
      ? `Beschriebene Übermüdungszeichen: ${check.overtiredSigns.join(", ")}.`
      : "Beschriebene Übermüdungszeichen: keine."
  );
  lines.push(
    check.overstimulatedSigns.length > 0
      ? `Beschriebene Überreizungszeichen: ${check.overstimulatedSigns.join(", ")}.`
      : "Beschriebene Überreizungszeichen: keine."
  );

  if (check.nightIssues.length > 0) {
    lines.push(`Nachtschlaf betroffen: ${check.nightIssues.join(", ")} → Tagschlaf NICHT verlängern und KEIN zusätzliches Schläfchen empfehlen. Prüfe eher, ob insgesamt zu viel geschlafen wird.`);
  }

  if (check.sleepAssociation) {
    lines.push(
      "EINSCHLAFASSOZIATION ERKANNT: Das Kind braucht zum Einschlafen und nachts zum Weiterschlafen dieselbe Hilfe. Das ist ein Schwerpunkt dieser Analyse – benenne es behutsam und wertfrei (z. B. \"Es wirkt so, als ob …\"), ohne Schritt-für-Schritt-Anleitung zum Abgewöhnen. Das ersetzt die Regel, Schlafassoziationen nie als Hauptproblem darzustellen."
    );
  }

  if (check.structureAgeAppropriate && check.nightIssues.length > 0 && !check.wakeMayBeFocus) {
    lines.push(
      `FAZIT: Wachphasen und Tagschlaf sind altersgerecht. Erkläre das nächtliche Aufwachen NICHT mit Wachphasen oder Tagschlaf. Betrachte stattdessen andere mögliche Ursachen (${check.sleepAssociation ? "vor allem die erkannte Einschlafassoziation" : "Einschlafassoziation"}, Gesamtschlaf in 24 Stunden, Reize und Erlebnisse am Tag, Entwicklungsschritte, Autonomie- oder Trennungsthemen). Fehlt dir dafür eine wichtige Information, stelle zuerst EINE gezielte Rückfrage.`
    );
  } else if (!check.wakeMayBeFocus) {
    lines.push("FAZIT: Wachphasen sind KEIN Schwerpunkt dieser Analyse.");
  }

  return lines.join("\n");
}

export function buildStructurePromptSection(memory: Record<string, unknown>): string {
  return `${WAKE_NAP_RULES}\n\n${formatStructureCheckForPrompt(checkStructure(memory))}`;
}
