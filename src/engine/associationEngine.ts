const SUPPORT_PATTERNS: Record<string, RegExp> = {
  brust: /brust|still/i,
  flasche: /flasche|flaschen/i,
  tragen: /tragen|trage|getragen/i,
  ball: /pezziball|ball|wippe/i,
  schnuller: /schnuller/i,
  kuscheln: /kuschel|körperkontakt/i,
  wagen: /kinderwagen|wagen/i,
};

const ALWAYS_PATTERNS =
  /immer|nur|ausschließlich|ausschliesslich|jedes mal|jedesmal|jede nacht|stets|jedes einzelne mal/i;

export function parseAgeInMonths(age?: string): number | null {
  if (!age) return null;

  const lower = age.toLowerCase().trim();

  const monthsMatch = lower.match(/(\d+)\s*(monat|monate|m\b)/);
  if (monthsMatch) return parseInt(monthsMatch[1], 10);

  const yearsMatch = lower.match(/(\d+)\s*(jahr|jahre|j\b)/);
  if (yearsMatch) return parseInt(yearsMatch[1], 10) * 12;

  if (/^\d+$/.test(lower)) return parseInt(lower, 10);

  if (/neugeboren|newborn/.test(lower)) return 0;

  return null;
}

export function isUnder6Months(memory: any): boolean {
  const months = parseAgeInMonths(memory.age);
  return months !== null && months < 6;
}

export function getBedtimeSupport(memory: any): string {
  return memory.bedtimeSupport || memory.fallAsleepHelp || "";
}

export function getNightSupport(memory: any): string {
  return memory.nightSupport || memory.nightHelp || "";
}

export function detectSupportType(text: string): string | null {
  if (!text) return null;

  for (const [type, pattern] of Object.entries(SUPPORT_PATTERNS)) {
    if (pattern.test(text)) return type;
  }

  return null;
}

function isFeedingSupport(type: string | null): boolean {
  return type === "brust" || type === "flasche";
}

function mentionsAlways(text: string): boolean {
  return ALWAYS_PATTERNS.test(text);
}

function isSingleSupportType(text: string): boolean {
  const matches = Object.values(SUPPORT_PATTERNS).filter((pattern) =>
    pattern.test(text)
  );
  return matches.length === 1;
}

export function isSameExclusiveSupport(
  bedtime: string,
  night: string
): boolean {
  const bedtimeType = detectSupportType(bedtime);
  const nightType = detectSupportType(night);

  if (!bedtimeType || !nightType || bedtimeType !== nightType) {
    return false;
  }

  const alwaysIndicated =
    mentionsAlways(bedtime) ||
    mentionsAlways(night) ||
    (isSingleSupportType(bedtime) && isSingleSupportType(night));

  return alwaysIndicated;
}

export function isPossibleSleepAssociation(memory: any): boolean {
  const bedtime = getBedtimeSupport(memory);
  const night = getNightSupport(memory);

  if (!bedtime || !night) return false;
  if (!isSameExclusiveSupport(bedtime, night)) return false;

  const supportType = detectSupportType(bedtime);
  if (!supportType) return false;

  if (isFeedingSupport(supportType) && isUnder6Months(memory)) {
    return false;
  }

  return true;
}

export function hasStructureIssues(memory: any): boolean {
  if (memory.wakeWindows && /(4|5|6|7)\s*(stunde|h)|lang/i.test(memory.wakeWindows)) {
    return true;
  }

  if (memory.napLength && /(20|25|30)\s*(min|minute)|kurz/i.test(memory.napLength)) {
    return true;
  }

  if (memory.napCount || memory.daySleepTotal || memory.wakeWindows) {
    return true;
  }

  return false;
}

export function hasNervousSystemIssues(memory: any): boolean {
  if (
    memory.temperament &&
    /high|fomo|gefühls|sensibel|reiz|überreiz|hochsensibel/i.test(
      memory.temperament
    )
  ) {
    return true;
  }

  if (memory.changes) return true;

  return false;
}

export const CAUTIOUS_ASSOCIATION_HINT =
  "Falls dein Kind wirklich jedes einzelne Mal dieselbe Unterstützung benötigt – sowohl zum Einschlafen als auch bei jedem nächtlichen Aufwachen – könnte eventuell auch eine Schlafassoziation eine Rolle spielen. In den allermeisten Fällen ist das jedoch nicht die erste Stellschraube.";
