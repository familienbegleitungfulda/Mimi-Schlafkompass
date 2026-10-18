import { knowledge } from "../../src/data/knowledge";
import { mayaKnowledge } from "../../src/data/mayaKnowledge";
import { mayaMethods } from "../../src/data/mayaMethods";
import { sleepPressure } from "../../src/data/sleepPressure";
import { sleepNeeds } from "../../src/data/sleepNeeds";
import { sleepRules } from "../../src/data/sleepRules";
import { ageProfiles } from "../../src/data/ageProfiles";
import { ageKnowledge } from "../../src/data/ageKnowledge";
import { redFlags } from "../../src/data/redFlags";
import { WAKE_NAP_RULES } from "../../src/engine/structureCheck";
import { callOpenAI, redactSecrets, type ChatMessage } from "./guards";

export const REPORT_DISCLAIMER =
  "Diese Auswertung gibt dir eine erste Orientierung und ersetzt keine individuelle Schlafberatung oder ärztliche Untersuchung.";

export type ReportProduct = {
  id: string;
  title: string;
  description: string;
  url: string;
  /** 2–4 persönliche Gründe für die Empfehlung (Karte im PDF). */
  reasons?: string[];
};

export type Report = {
  kindAlter: string;
  schwerpunkt: string;
  zusammenfassung: string;
  ursachen: string[];
  tipps: { titel: string; text: string }[];
  empfehlungBegruendung: string;
};

function buildReportPrompt(product: ReportProduct, age: string, sleepAssociation: boolean): string {
  return `
Du bist Mimi, die virtuelle Assistentin von Maya Löbel (Familienbegleitung Fulda).

Du hast mit Eltern gerade eine Schlafanalyse im Chat geführt. Jetzt schreibst du daraus eine ausführliche, schriftliche Auswertung (ca. 1–2 Seiten), die die Eltern als PDF bekommen.

Es gelten exakt dieselben Regeln wie im Chat:
- bindungsorientiert, warm, ruhig, empathisch, niemals wertend
- KEIN Schlaftraining, KEINE Ferber-Methode, kein kontrolliertes Schreienlassen, kein "Weinen lassen", kein Abstillen als Tipp
${
  sleepAssociation
    ? `- Im Gespräch wurde eine Einschlafassoziation erkannt (dieselbe Einschlafhilfe zum Einschlafen und nachts zum Weiterschlafen). Sie ist der Schwerpunkt dieser Auswertung: behutsam und wertfrei benennen, keine Schritt-für-Schritt-Anleitung zum Auflösen. Ergänze passende Hinweise zu Schlafstruktur und Tagesablauf.`
    : `- Schlafassoziationen niemals als Hauptproblem, keine Anleitung zum Auflösen
- Fokus auf Schlafstruktur, Schlafdruck, Wachzeiten, Tagesstruktur und Nervensystem`
}
- sicherer Schlaf hat immer Vorrang (Rückenlage, eigene Schlaffläche oder sicheres Familienbett, keine Kissen/Decken/Nestchen bei Babys, rauchfreie Umgebung, keine Überhitzung)
- bei Hinweisen auf gesundheitliche Ursachen: freundlich zur kinderärztlichen Abklärung raten
- Sprich den Elternteil durchgehend in der 2. Person Singular an ("du", "dein Kind", "probier", "achte") – niemals "ihr", "euer Kind" oder "versucht". "Eure Schlafsituation" als Formulierung für die Familie ist erlaubt. Schreibe ausschließlich Deutsch. Keine Emojis.
- Erfinde keine Informationen, die nicht im Gespräch vorkommen.
- Nutze ausschließlich Mayas Wissen unten als fachliche Grundlage.

Alter des Kindes laut Gespräch: ${age || "bitte aus dem Gespräch entnehmen"}

Die passende Empfehlung steht bereits fest (nicht ändern, keinen anderen Kurs nennen):
Titel: ${product.title}
Beschreibung: ${product.description}

Antworte ausschließlich als gültiges JSON in genau diesem Schema:

{
  "kindAlter": "Alter des Kindes, kurz, z. B. '8 Monate'",
  "schwerpunkt": "kurzer Schwerpunkt, maximal 6 Wörter, z. B. 'Schlafdruck und Wachphasen'",
  "zusammenfassung": "kurze Zusammenfassung eurer Schlafsituation mit Alter des Kindes (4–6 Sätze)",
  "ursachen": ["2–4 mögliche Ursachen, je 1–3 Sätze, vorsichtig formuliert"],
  "tipps": [{ "titel": "kurzer Titel", "text": "konkreter, sofort umsetzbarer Tipp für die nächsten Tage, 2–4 Sätze, direkt auf die Familie bezogen" }],
  "empfehlungBegruendung": "1–2 Sätze, warum ${product.title} jetzt gut weiterhilft und die Tipps vertieft"
}

"tipps" enthält 3 bis 5 Einträge.

${WAKE_NAP_RULES}

MAYAS WISSEN:

${knowledge}

${mayaKnowledge}

${mayaMethods}

${sleepPressure}

${sleepNeeds}

${sleepRules}

${ageProfiles}

${ageKnowledge}

${redFlags}
  `.trim();
}

function asText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function generateReport(
  messages: ChatMessage[],
  product: ReportProduct,
  age: string,
  options: { sleepAssociation?: boolean } = {}
): Promise<Report> {
  const response = await callOpenAI({
    temperature: 0.4,
    max_tokens: 2500,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildReportPrompt(product, age, options.sleepAssociation === true) },
      ...messages,
      {
        role: "user",
        content:
          "Bitte erstelle jetzt meine ausführliche Auswertung als JSON nach dem vorgegebenen Schema.",
      },
    ],
  });

  if (!response.ok) {
    throw new Error(`OpenAI error ${response.status}: ${redactSecrets(await response.text())}`);
  }

  const data = await response.json();
  const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}");

  const schwerpunkt = asText(parsed.schwerpunkt, 80)
    .split(/\s+/)
    .slice(0, 6)
    .join(" ");

  const tipps = Array.isArray(parsed.tipps)
    ? parsed.tipps
        .map((tip: Record<string, unknown>) => ({
          titel: asText(tip?.titel, 120),
          text: asText(tip?.text, 1200),
        }))
        .filter((tip: { text: string }) => tip.text)
        .slice(0, 5)
    : [];

  const ursachen = Array.isArray(parsed.ursachen)
    ? parsed.ursachen
        .map((cause: unknown) => asText(cause, 800))
        .filter(Boolean)
        .slice(0, 4)
    : [];

  const report: Report = {
    kindAlter: asText(parsed.kindAlter, 60) || age.slice(0, 60),
    schwerpunkt,
    zusammenfassung: asText(parsed.zusammenfassung, 2000),
    ursachen,
    tipps,
    empfehlungBegruendung: asText(parsed.empfehlungBegruendung, 1000),
  };

  if (!report.zusammenfassung || report.tipps.length === 0) {
    throw new Error("Report generation returned incomplete content");
  }

  return report;
}
