import { jsPDF } from "jspdf";
import { REPORT_DISCLAIMER, type Report, type ReportProduct } from "./report";
import { ALLISON_400, AMATIC_SC_700, NUNITO_400, NUNITO_700, NUNITO_800 } from "./pdfFonts";

type RGB = [number, number, number];

// Schlummerweg – helle Variante
const PAGE_BG: RGB = [0xee, 0xf0, 0xf4];
const CARD: RGB = [0xfc, 0xfc, 0xfd];
const CARD_SOFT: RGB = [0xf2, 0xf3, 0xf7];
const LINE: RGB = [0xd6, 0xd9, 0xe3];
const TEXT: RGB = [0x4a, 0x4f, 0x57];
const MUTED: RGB = [0x6b, 0x6f, 0x7b];
const BLUE: RGB = [0x4f, 0x6b, 0x8a];
const BLUE_LIGHT: RGB = [0xdb, 0xe3, 0xec];
const GREEN: RGB = [0x9c, 0xb0, 0x87];
const GREEN_DARK: RGB = [0x55, 0x6b, 0x3f];
const GREEN_LIGHT: RGB = [0xe8, 0xee, 0xdf];
const WHITE: RGB = [255, 255, 255];

const WEBSITE_URL = "https://www.familienbegleitung-fulda.de";
const INSTAGRAM_URL = "https://www.instagram.com/familienbegleitung.fulda/";

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;
const TOP = 20;
const BOTTOM = PAGE_H - 24;
const PAD = 8;
const INNER_W = CONTENT_W - PAD * 2;
const CARD_GAP = 7;
const RADIUS = 5;
const PT = 0.3528; // mm pro Punkt

type Font = "body" | "bold" | "extra" | "title" | "script";
const FONTS: Record<Font, [string, string, string]> = {
  body: ["Nunito-Regular.ttf", "Nunito", NUNITO_400],
  bold: ["Nunito-Bold.ttf", "NunitoBold", NUNITO_700],
  extra: ["Nunito-ExtraBold.ttf", "NunitoExtraBold", NUNITO_800],
  title: ["AmaticSC-Bold.ttf", "AmaticSC", AMATIC_SC_700],
  script: ["Allison-Regular.ttf", "Allison", ALLISON_400],
};

/** Die eingebetteten Schriften decken Latin-1 und Satzzeichen ab – Emojis u. Ä. entfernen. */
function clean(text: string): string {
  return text
    .replace(/[•●▪]/g, "-")
    .replace(/[→➜]/g, "»")
    .replace(/[^\x20-\x7E\xA0-\xFF\n‐-‧‰-⁞€]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/** Ein unteilbarer Baustein innerhalb einer Karte (Höhe inkl. Abstand danach). */
type Block = { h: number; draw: (x: number, y: number) => void; keepWithNext?: boolean };

export function buildReportPdf(input: {
  vorname: string;
  report: Report;
  product: ReportProduct;
  createdAt?: Date;
}): Uint8Array {
  const { vorname, report, product } = input;
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  for (const [file, family, data] of Object.values(FONTS)) {
    doc.addFileToVFS(file, data);
    doc.addFont(file, family, "normal");
  }

  const font = (f: Font, size: number, color: RGB = TEXT) => {
    doc.setFont(FONTS[f][1], "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  const paintBackground = () => {
    doc.setFillColor(...PAGE_BG);
    doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  };

  let y = TOP;
  paintBackground();

  const newPage = () => {
    doc.addPage();
    paintBackground();
    y = TOP;
  };

  // --- Bausteine -----------------------------------------------------------

  /** Text als Zeilen-Bausteine. `keep` hält alle Zeilen zusammen. */
  const textBlocks = (
    text: string,
    opts: { f?: Font; size?: number; color?: RGB; indent?: number; width?: number; gap?: number; keep?: boolean; lineFactor?: number } = {}
  ): Block[] => {
    const f = opts.f ?? "body";
    const size = opts.size ?? 10.5;
    const color = opts.color ?? TEXT;
    const indent = opts.indent ?? 0;
    const lineH = size * PT * (opts.lineFactor ?? 1.55);
    font(f, size, color);
    const lines: string[] = doc.splitTextToSize(clean(text), (opts.width ?? INNER_W) - indent);
    return lines.map((line, i) => ({
      h: lineH + (i === lines.length - 1 ? (opts.gap ?? 3) : 0),
      keepWithNext: opts.keep && i < lines.length - 1,
      draw: (x, by) => {
        font(f, size, color);
        doc.text(line, x + indent, by, { baseline: "top" });
      },
    }));
  };

  const cardTitle = (text: string, color: RGB = BLUE): Block => ({
    h: 26 * PT * 1.05 + 3,
    keepWithNext: true,
    draw: (x, by) => {
      font("title", 26, color);
      doc.text(clean(text), x, by, { baseline: "top" });
    },
  });

  const keepTogether = (blocks: Block[]): Block[] =>
    blocks.map((b, i) => ({ ...b, keepWithNext: i < blocks.length - 1 || b.keepWithNext }));

  /**
   * Zeichnet eine abgerundete Karte. Passt sie nicht mehr auf die Seite, beginnt
   * sie auf der nächsten. Lange Karten (mehr als eine halbe Seite) werden statt-
   * dessen zwischen zwei Bausteinen geteilt – jede Seite bekommt dann eine
   * eigene, geschlossene Karte; Absätze und Tipps bleiben ganz.
   */
  const card = (blocks: Block[], style: { fill?: RGB; border?: RGB; pad?: number } = {}) => {
    const pad = style.pad ?? PAD;
    const total = blocks.reduce((sum, b) => sum + b.h, 0) + pad * 2;
    const remaining = BOTTOM - y;
    const isLong = total > (BOTTOM - TOP) * 0.5;
    if (total > remaining && total <= BOTTOM - TOP && (!isLong || remaining < 60)) newPage();

    let i = 0;
    while (i < blocks.length) {
      const avail = BOTTOM - y - pad * 2;
      const segment: Block[] = [];
      let h = 0;
      while (i < blocks.length) {
        let end = i;
        let groupH = blocks[i].h;
        while (blocks[end].keepWithNext && end + 1 < blocks.length) {
          end++;
          groupH += blocks[end].h;
        }
        const fits = h + groupH <= avail;
        if (!fits && (segment.length > 0 || y > TOP)) break;
        segment.push(...blocks.slice(i, end + 1));
        h += groupH;
        i = end + 1;
      }

      if (segment.length === 0) {
        newPage();
        continue;
      }

      if (style.fill) {
        doc.setFillColor(...style.fill);
        doc.setDrawColor(...(style.border ?? LINE));
        doc.setLineWidth(0.3);
        doc.roundedRect(MARGIN, y, CONTENT_W, h + pad * 2, RADIUS, RADIUS, "FD");
      }
      let by = y + pad;
      for (const block of segment) {
        block.draw(MARGIN + pad, by);
        by += block.h;
      }
      y += h + pad * 2 + CARD_GAP;
      if (i < blocks.length) newPage();
    }
  };

  // --- Titelbereich --------------------------------------------------------

  font("bold", 8, MUTED);
  doc.text("MIMIS SCHLAFKOMPASS · FAMILIENBEGLEITUNG LÖBEL", MARGIN, y, { baseline: "top", charSpace: 0.6 });
  y += 7;

  doc.setFillColor(...GREEN);
  doc.roundedRect(MARGIN, y, 14, 1.2, 0.6, 0.6, "F");
  y += 4;

  font("title", 44, BLUE);
  doc.text("Eure Schlafauswertung", MARGIN, y, { baseline: "top" });
  y += 44 * PT * 1.05 + 3;

  const subtitle = [`Für ${clean(vorname)}`, report.kindAlter ? `Alter deines Kindes: ${clean(report.kindAlter)}` : ""]
    .filter(Boolean)
    .join("  ·  ");
  font("bold", 12, TEXT);
  doc.text(doc.splitTextToSize(subtitle, CONTENT_W)[0] ?? "", MARGIN, y, { baseline: "top" });
  y += 12 * PT * 1.5;

  const date = (input.createdAt ?? new Date()).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });
  font("body", 9.5, MUTED);
  doc.text(`Erstellt von Mimi am ${date}`, MARGIN, y, { baseline: "top" });
  y += 9.5 * PT * 1.5 + 3;

  if (report.schwerpunkt) {
    const label = `Schwerpunkt: ${clean(report.schwerpunkt)}`;
    font("bold", 9.5, BLUE);
    const w = Math.min(doc.getTextWidth(label) + 10, CONTENT_W);
    doc.setFillColor(...BLUE_LIGHT);
    doc.roundedRect(MARGIN, y, w, 8, 4, 4, "F");
    doc.text(label, MARGIN + 5, y + 4, { baseline: "middle", maxWidth: CONTENT_W - 10 });
    y += 8;
  }
  y += 8;

  // --- Eure Situation ------------------------------------------------------

  card([cardTitle("Eure Situation"), ...textBlocks(report.zusammenfassung, { gap: 0 })], { fill: CARD });

  // --- Mögliche Ursachen ---------------------------------------------------

  if (report.ursachen.length > 0) {
    const blocks: Block[] = [cardTitle("Mögliche Ursachen")];
    report.ursachen.forEach((cause, i) => {
      const lines = textBlocks(cause, { indent: 6, keep: true, gap: i === report.ursachen.length - 1 ? 0 : 3.5 });
      const first = lines[0];
      lines[0] = {
        ...first,
        draw: (x, by) => {
          doc.setFillColor(...GREEN);
          doc.circle(x + 1.6, by + 2.4, 1.2, "F");
          first.draw(x, by);
        },
      };
      blocks.push(...lines);
    });
    card(blocks, { fill: CARD });
  }

  // --- Tipps für die nächsten Tage -----------------------------------------

  if (report.tipps.length > 0) {
    const blocks: Block[] = [cardTitle("Tipps für die nächsten Tage")];
    const indent = 12;
    report.tipps.forEach((tip, i) => {
      const last = i === report.tipps.length - 1;
      const tipBlocks = keepTogether([
        ...(tip.titel ? textBlocks(tip.titel, { f: "extra", size: 11, indent, gap: 1 }) : []),
        ...textBlocks(tip.text, { indent, gap: last ? 0 : 5 }),
      ]);
      const first = tipBlocks[0];
      tipBlocks[0] = {
        ...first,
        draw: (x, by) => {
          doc.setFillColor(...GREEN);
          doc.circle(x + 3.8, by + 3, 3.8, "F");
          font("extra", 10.5, WHITE);
          doc.text(String(i + 1), x + 3.8, by + 3.1, { align: "center", baseline: "middle" });
          first.draw(x, by);
        },
      };
      blocks.push(...tipBlocks);
    });
    card(blocks, { fill: CARD });
  }

  // --- Mayas Empfehlung für euch -------------------------------------------

  const buttonLabel = "Zum Angebot  »";
  card(
    keepTogether([
      cardTitle("Mayas Empfehlung für euch", GREEN_DARK),
      ...textBlocks(product.title, { f: "extra", size: 13, color: TEXT, gap: 2 }),
      ...textBlocks(report.empfehlungBegruendung || product.description, { gap: 5 }),
      {
        h: 11,
        draw: (x, by) => {
          font("extra", 11, WHITE);
          const w = doc.getTextWidth(buttonLabel) + 16;
          doc.setFillColor(...BLUE);
          doc.roundedRect(x, by, w, 11, 5.5, 5.5, "F");
          doc.text(buttonLabel, x + w / 2, by + 5.6, { align: "center", baseline: "middle" });
          doc.link(x, by, w, 11, { url: product.url });
        },
      },
    ]),
    { fill: GREEN_LIGHT, border: GREEN }
  );

  // --- Persönlicher Abschluss und Hinweis ----------------------------------

  card(
    keepTogether([
      ...textBlocks("Ich wünsche euch ruhige Nächte!", { f: "bold", size: 13, gap: 0 }),
      {
        h: 20,
        draw: (x, by) => {
          font("script", 48, GREEN_DARK);
          doc.text("Maya", x + 2, by + 1, { baseline: "top" });
        },
      },
    ]),
    { pad: 2 }
  );

  card(textBlocks(REPORT_DISCLAIMER, { size: 8.5, color: MUTED, gap: 0 }), { fill: CARD_SOFT, pad: 5 });

  // --- Fußzeile auf jeder Seite --------------------------------------------

  const footer: { text: string; url?: string }[] = [
    { text: "Maya Löbel · Bindungsorientierte Schlafberatung · " },
    { text: "familienbegleitung-fulda.de", url: WEBSITE_URL },
    { text: " · Instagram: " },
    { text: "@familienbegleitung.fulda", url: INSTAGRAM_URL },
  ];
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, PAGE_H - 16, PAGE_W - MARGIN, PAGE_H - 16);

    const fy = PAGE_H - 10.5;
    let fx = MARGIN;
    for (const part of footer) {
      font(part.url ? "bold" : "body", 7.5, part.url ? BLUE : MUTED);
      const w = doc.getTextWidth(part.text);
      doc.text(part.text, fx, fy, { baseline: "middle" });
      if (part.url) doc.link(fx, fy - 2, w, 4, { url: part.url });
      fx += w;
    }
    font("body", 7.5, MUTED);
    doc.text(`Seite ${page} von ${pages}`, PAGE_W - MARGIN, fy, { align: "right", baseline: "middle" });
  }

  return new Uint8Array(doc.output("arraybuffer"));
}
