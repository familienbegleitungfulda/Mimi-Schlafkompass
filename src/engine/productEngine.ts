import { products } from "../data/products";
import { detectMainCause } from "./analysisEngine";

export function buildRecommendation(memory: any) {
    const cause = detectMainCause(memory);
  
    if (cause.id === "sleepPressure") {
      return {
        product: products.find((p) => p.id === "struktur"),
        reason: `
  Nach allem, was du mir erzählt hast, habe ich den Eindruck, dass vor allem Schlafdruck und Tagesstruktur eine Rolle spielen könnten.
  
  Das bedeutet nicht automatisch, dass eure Einschlafbegleitung die Ursache ist.
  
  Häufig beeinflussen sich Schlafdruck, Wachphasen und nächtliches Aufwachen gegenseitig.
  
  Genau deshalb könnte dieses Angebot aktuell besonders gut zu euch passen.
  `,
      };
    }
  
    if (cause.id === "association") {
      return {
        product: products.find((p) => p.id === "papa"),
        reason: `
  Nach allem, was du erzählt hast, scheint die Einschlafbegleitung aktuell ein wichtiger Baustein zu sein.
  
  Deshalb könnte dieses Angebot euch besonders weiterhelfen.
  `,
      };
    }
  
    return {
      product: products.find(
        (p) => p.id === "schlummerwerkstatt"
      ),
      reason: `
  Da sich mehrere mögliche Ursachen zeigen, würde ich zunächst einen umfassenden Blick auf eure Schlafsituation empfehlen.
  `,
    };
  }