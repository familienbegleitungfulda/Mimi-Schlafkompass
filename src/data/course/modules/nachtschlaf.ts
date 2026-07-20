import type { CourseModuleDefinition } from "./types";

export const nachtschlafModule: CourseModuleDefinition = {
  id: "nachtschlaf",
  title: "Nachtschlaf & nächtliches Aufwachen",
  description:
    "Nächtliches Aufwachen einordnen und bindungsorientiert begleiten.",
  order: 7,
  todayActions: [
    {
      id: "nachtschlaf-1",
      text: "Notiere heute Nacht: Wann wacht dein Kind auf und wie lange dauert das Wiedereinschlafen?",
      priority: 1,
    },
    {
      id: "nachtschlaf-2",
      text: "Achte darauf, welche Hilfe nachts aktuell angeboten wird – ohne sie zu verändern.",
      priority: 2,
    },
  ],
  roadmap: {
    chapters: [
      {
        id: "ns-1",
        title: "Nächtliches Aufwachen einordnen",
        timestamp: "Kapitel 7.1",
        description: "Normal vs. belastend – und was dahinterstecken könnte.",
      },
    ],
    pdfs: [
      {
        id: "ns-pdf-1",
        title: "Nacht-Protokoll",
        filename: "nachtschlaf-protokoll.pdf",
      },
    ],
    bonus: [],
    exercises: [
      {
        id: "ns-ex-1",
        title: "Nacht-Beobachtung",
        description: "Notiere drei Nächte lang Aufwachzeiten und Hilfe.",
      },
    ],
  },
};
