/**
 * RICHTWERTE FÜR WACHPHASEN UND TAGSCHLAF PRO ALTER
 *
 * Diese Tabelle ist die einzige Quelle für die Richtwerte. Mimis Schlafwissen
 * (Text unten) und die automatische Altersprüfung (structureCheck.ts) lesen
 * beide daraus – Änderungen hier wirken also überall.
 *
 * fromMonths/toMonths: Altersbereich in Monaten (toMonths exklusiv).
 * wakeHours: übliche Wachphase in Stunden [von, bis] – null = sehr individuell.
 * naps: übliche Anzahl Tagschläfchen [von, bis] – null = mehrere/individuell.
 */
export interface SleepNeedRow {
  label: string;
  fromMonths: number;
  toMonths: number;
  wakeLabel: string;
  wakeHours: [number, number] | null;
  /** Wachphase, wenn das Kind keinen Tagschlaf mehr macht (nur 2–3 Jahre). */
  wakeHoursWithoutNap?: [number, number];
  napLabel: string;
  naps: [number, number] | null;
  daySleepLabel?: string;
  nightSleepLabel?: string;
  note?: string;
}

const SHORT_NAPS_NOTE = "kurze Schläfchen mit jeweils 30 Minuten können normal sein!";

/** Ab 4 Monaten: Mayas offizielle Werte. Wachzeit = Dauer einer einzelnen Wachphase. */
export const sleepNeedTable: SleepNeedRow[] = [
  { label: "0-6 Wochen", fromMonths: 0, toMonths: 1.4, wakeLabel: "ca. 45-60 Minuten", wakeHours: [0.75, 1], napLabel: "mehrere Schläfchen", naps: null },
  { label: "6-12 Wochen", fromMonths: 1.4, toMonths: 3, wakeLabel: "ca. 60-90 Minuten", wakeHours: [1, 1.5], napLabel: "mehrere Schläfchen", naps: null },
  { label: "3 Monate", fromMonths: 3, toMonths: 4, wakeLabel: "ca. 1,5-2 Stunden", wakeHours: [1.5, 2], napLabel: "4-5 Schläfchen", naps: [4, 5], note: SHORT_NAPS_NOTE },
  { label: "4-5 Monate", fromMonths: 4, toMonths: 6, wakeLabel: "ca. 1-2,5 Stunden", wakeHours: [1, 2.5], napLabel: "3-4 Nickerchen", naps: [3, 4], daySleepLabel: "3-4 Stunden", nightSleepLabel: "11-12 Stunden", note: SHORT_NAPS_NOTE },
  { label: "6-7 Monate", fromMonths: 6, toMonths: 8, wakeLabel: "ca. 2-3,5 Stunden", wakeHours: [2, 3.5], napLabel: "3-4 Nickerchen", naps: [3, 4], daySleepLabel: "2-4 Stunden", nightSleepLabel: "11-12 Stunden", note: SHORT_NAPS_NOTE },
  { label: "8-9 Monate", fromMonths: 8, toMonths: 10, wakeLabel: "ca. 3-3,5 Stunden", wakeHours: [3, 3.5], napLabel: "2-3 Nickerchen", naps: [2, 3], daySleepLabel: "2-3 Stunden", nightSleepLabel: "11-12 Stunden" },
  { label: "10-12 Monate", fromMonths: 10, toMonths: 13, wakeLabel: "ca. 3-4 Stunden", wakeHours: [3, 4], napLabel: "2 Nickerchen", naps: [2, 2], daySleepLabel: "2-3 Stunden", nightSleepLabel: "10-12 Stunden" },
  { label: "13-14 Monate", fromMonths: 13, toMonths: 15, wakeLabel: "ca. 3-5 Stunden", wakeHours: [3, 5], napLabel: "1-2 Nickerchen", naps: [1, 2], daySleepLabel: "2-3 Stunden", nightSleepLabel: "10-12 Stunden", note: "Übergang auf einen Mittagsschlaf häufig möglich." },
  { label: "15-18 Monate", fromMonths: 15, toMonths: 19, wakeLabel: "ca. 5-6 Stunden", wakeHours: [5, 6], napLabel: "1-2 Nickerchen", naps: [1, 2], daySleepLabel: "2-3 Stunden", nightSleepLabel: "10-12 Stunden" },
  { label: "19-24 Monate", fromMonths: 19, toMonths: 25, wakeLabel: "ca. 5-7 Stunden", wakeHours: [5, 7], napLabel: "1 Nickerchen", naps: [1, 1], daySleepLabel: "1-2 Stunden", nightSleepLabel: "10-12 Stunden" },
  { label: "25-36 Monate", fromMonths: 25, toMonths: 37, wakeLabel: "ca. 6-7 Stunden bei 1 Nickerchen, bis ca. 12 Stunden ohne Nickerchen", wakeHours: [6, 7], wakeHoursWithoutNap: [6, 12], napLabel: "0-1 Nickerchen", naps: [0, 1], daySleepLabel: "0-2 Stunden", nightSleepLabel: "9-12 Stunden", note: "Viele Kinder machen noch einen Mittagsschlaf.\n\nAndere benötigen keinen mehr.\n\nBeides kann normal sein." },
  { label: "3-5 Jahre", fromMonths: 37, toMonths: 72, wakeLabel: "Sehr individuell.", wakeHours: null, napLabel: "", naps: null, note: "Viele Kinder schlafen tagsüber nicht mehr." },
];

export function findSleepNeedRow(months: number): SleepNeedRow | undefined {
  return sleepNeedTable.find((row) => months >= row.fromMonths && months < row.toMonths);
}

function formatRow(row: SleepNeedRow): string {
  return [
    row.label,
    `Wachphase: ${row.wakeLabel}`,
    row.note === SHORT_NAPS_NOTE ? row.note : "",
    row.napLabel,
    row.daySleepLabel ? `Tagschlaf gesamt: ${row.daySleepLabel}` : "",
    row.nightSleepLabel ? `Nachtschlaf: ${row.nightSleepLabel}` : "",
    row.note && row.note !== SHORT_NAPS_NOTE ? row.note : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export const sleepNeeds = `

RICHTWERTE FÜR WACHPHASEN

Diese Werte sind grobe Durchschnittswerte. Wachzeit = Dauer einer einzelnen Wachphase.

Nicht jedes Kind passt exakt hinein. Das Verhalten des Kindes zählt mehr als die Zahl. Setze Tag- und Nachtschlaf immer ins Verhältnis. Wachphasen knapp außerhalb des Bereichs sind nie die Hauptursache.

Temperament, Schlafbedarf, Entwicklung und Tagschlaf müssen immer mit berücksichtigt werden. Orientiere dich nicht zu sehr an den Wachphasen!

------------------------------------------------

${sleepNeedTable.map(formatRow).join("\n\n------------------------------------------------\n\n")}

------------------------------------------------

WICHTIG

Bewerte Wachphasen niemals isoliert und lege deinen Fokus nicht zu sehr auf die Wachphasen.

Berücksichtige immer:

- Schlafbedarf
- Temperament
- Entwicklung
- Tagschlaf
- Schlafqualität
- Familienalltag

Formuliere niemals:

"Das ist zu lang."

Sondern:

"Für viele Kinder in diesem Alter liegen Wachphasen ungefähr in diesem Bereich. Gleichzeitig schaue ich immer auf das Gesamtbild."

Wenn Eltern deutlich außerhalb dieser Bereiche liegen,

frage zuerst nach,

bevor du Empfehlungen gibst.
Beurteile erst Wachzeiten, wenn du weißt, wie sich das Kind in der Einschlafbegleitung verhält. Weint ein Kind in der Einschlafbegleitung oder meckert viel, dann könnte die Wachphase zu lang sein. Wirkt das Kind entspannt oder aufgedreht, tobt, turnt oder klettert, ist die Wachphase eher zu kurz.

`;