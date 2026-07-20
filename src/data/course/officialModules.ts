export const OFFICIAL_RECOMMENDABLE_MODULE_IDS = [
  "grundlagen",
  "schlafentwicklung",
  "struktur",
  "schlafbereitschaft",
  "schlafassoziationen",
  "bezugspersonen",
  "praktische-tipps",
  "notfalltipps",
] as const;

export type OfficialModuleId = (typeof OFFICIAL_RECOMMENDABLE_MODULE_IDS)[number];

export const OFFICIAL_MODULE_TITLES: Record<OfficialModuleId, string> = {
  grundlagen: "Modul 1 – Grundlagen Babyschlaf",
  schlafentwicklung: "Modul 2 – Entwicklung und Schlaftypen",
  struktur: "Modul 3 – Struktur",
  schlafbereitschaft: "Modul 4 – Schlafbereitschaft",
  schlafassoziationen: "Modul 5 – Gewohnheiten verändern",
  bezugspersonen: "Modul 6 – Bezugsperson",
  "praktische-tipps": "Modul 7 – Praktische Tipps",
  notfalltipps: "Modul 8 – Notfalltipps",
};

/** Interne Sub-Module → offizielles Empfehlungsmodul */
export const LEGACY_MODULE_TO_OFFICIAL: Record<string, OfficialModuleId> = {
  schlafdruck: "struktur",
  tagesstruktur: "struktur",
  reizverarbeitung: "struktur",
  tagschlaf: "struktur",
  abendroutine: "struktur",
  nachtschlaf: "struktur",
  einschlafbegleitung: "schlafassoziationen",
};

export function toOfficialModuleId(moduleId: string): OfficialModuleId | undefined {
  if (moduleId in OFFICIAL_MODULE_TITLES) {
    return moduleId as OfficialModuleId;
  }

  const mapped = LEGACY_MODULE_TO_OFFICIAL[moduleId];
  return mapped;
}

export function getOfficialModuleTitle(moduleId: string): string | undefined {
  const officialId = toOfficialModuleId(moduleId);
  return officialId ? OFFICIAL_MODULE_TITLES[officialId] : undefined;
}

export function formatOfficialModuleList(): string {
  return OFFICIAL_RECOMMENDABLE_MODULE_IDS.map(
    (id) => `• ${OFFICIAL_MODULE_TITLES[id]}`
  ).join("\n");
}
