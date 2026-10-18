/**
 * Robust age parsing for product selection (Schlummerwerkstatt 1 vs. 2).
 * Handles e.g. "14 Wochen", "8 Monate", "1,5 Jahre", "1 Jahr und 7 Monate",
 * "eineinhalb Jahre", "zwei Jahre".
 */

const NUMBER_WORDS: Record<string, string> = {
  eineinhalb: "1.5",
  anderthalb: "1.5",
  zweieinhalb: "2.5",
  dreieinhalb: "3.5",
  einem: "1",
  einen: "1",
  ein: "1",
  eins: "1",
  zwei: "2",
  drei: "3",
  vier: "4",
  fünf: "5",
  sechs: "6",
  sieben: "7",
  acht: "8",
  neun: "9",
  zehn: "10",
  elf: "11",
  zwölf: "12",
};

export const SCHLUMMERWERKSTATT_2_FROM_MONTHS = 18;

export function parseChildAgeMonths(age?: string): number | null {
  if (!age) return null;

  let text = ` ${age.toLowerCase()} `.replace(/(\d),(\d)/g, "$1.$2");

  if (/neugeboren|newborn/.test(text)) return 0;

  for (const [word, value] of Object.entries(NUMBER_WORDS)) {
    text = text.replace(new RegExp(`(^|[^a-zäöüß])${word}(?=[^a-zäöüß])`, "g"), `$1${value}`);
  }

  const num = "(\\d+(?:\\.\\d+)?)";
  let months = 0;
  let found = false;

  const years = text.match(new RegExp(`${num}\\s*(?:jahr|jahre|jahren|j\\b)`));
  if (years) {
    months += parseFloat(years[1]) * 12;
    found = true;
  }

  const monthMatch = text.match(new RegExp(`${num}\\s*(?:monat|monate|monaten|mon\\b|m\\b)`));
  if (monthMatch) {
    months += parseFloat(monthMatch[1]);
    found = true;
  }

  if (!found) {
    const weeks = text.match(new RegExp(`${num}\\s*(?:woche|wochen|w\\b)`));
    if (weeks) return parseFloat(weeks[1]) / 4.345;
  }

  if (!found) {
    const plain = text.trim().match(/^(\d+(?:\.\d+)?)$/);
    if (plain) return parseFloat(plain[1]);
  }

  return found ? months : null;
}

/** Unknown age falls back to Schlummerwerkstatt 1. */
export function schlummerwerkstattIdForAge(
  age?: string
): "schlummerwerkstatt1" | "schlummerwerkstatt2" {
  const months = parseChildAgeMonths(age);
  return months !== null && months >= SCHLUMMERWERKSTATT_2_FROM_MONTHS
    ? "schlummerwerkstatt2"
    : "schlummerwerkstatt1";
}
