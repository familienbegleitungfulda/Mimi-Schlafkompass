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
        product: products.find((p) => p.id === "schlummerwerkstatt"),
        reason: `
  Nach allem, was du erzählt hast, fällt mir auf, dass eure Einschlafbegleitung eine wichtige Rolle spielt.
  
  Schlafassoziationen können häufig zu häufigem nächtlichen Aufwachen führen, weil das Kind die Einschlafhilfe bei jedem Schlafzyklus wieder braucht.
  
  Wenn eure Familie darunter leidet, kann es sinnvoll sein, die Schlafassoziation bindungsorientiert zu verändern – das ist aber immer eine individuelle Entscheidung.
  
  Genau dabei kann Mayas Unterstützung weiterhelfen – entweder in der 1:1 Schlafberatung oder in der Schlummerwerkstatt, Mayas umfassendem Schlafkurs für Babys und Kleinkinder.
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