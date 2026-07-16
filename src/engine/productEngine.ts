import { products } from "../data/products";
import { detectMainCause } from "./analysisEngine";
import {
  hasNervousSystemIssues,
  hasStructureIssues,
  isPossibleSleepAssociation,
} from "./associationEngine";

export function buildRecommendation(memory: any) {
  const cause = detectMainCause(memory);

  if (cause.id === "sleepPressure" || hasStructureIssues(memory)) {
    return {
      product: products.find((p) => p.id === "struktur"),
      reason: `
  Nach allem, was du mir erzählt hast, habe ich den Eindruck, dass vor allem Schlafstruktur, Schlafdruck und Tagesgestaltung eine Rolle spielen könnten.
  
  Altersgerechte Wachzeiten, ausreichender Schlafdruck, Reizverarbeitung und ein vorhersehbarer Tagesablauf verbessern den Schlaf in den meisten Fällen deutlich stärker als frühes Arbeiten an einer Einschlafassoziation.
  
  ${
    isPossibleSleepAssociation(memory)
      ? "Falls später weiterhin Schwierigkeiten bestehen, könnte eventuell auch eine Schlafassoziation eine Rolle spielen – das wäre aber erst der nächste Schritt, wenn die Grundlagen gut passen."
      : ""
  }
  
  Genau deshalb könnte dieses Angebot aktuell besonders gut zu euch passen.
  `,
    };
  }

  if (cause.id === "overstimulation" || hasNervousSystemIssues(memory)) {
    return {
      product: products.find((p) => p.id === "struktur"),
      reason: `
  Nach allem, was du erzählt hast, könnte vor allem die Regulation des Nervensystems und eine passende Tagesstruktur eine wichtige Rolle spielen.
  
  Reizüberflutung reduzieren, sensorische Pausen einbauen und Über- oder Unterforderung erkennen – das steht in den meisten Fällen vor dem Thema Einschlafassoziationen.
  
  Genau deshalb könnte dieses Angebot aktuell besonders gut zu euch passen.
  `,
    };
  }

  return {
    product: products.find((p) => p.id === "schlummerwerkstatt"),
    reason: `
  Da sich mehrere mögliche Einflussfaktoren zeigen, würde ich zunächst einen umfassenden Blick auf eure Schlafstruktur und Tagesgestaltung empfehlen – bevor das Thema Einschlafassoziationen überhaupt relevant wird.
  `,
  };
}
