import { followUps } from "../data/followUps";

function random(list: string[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export function getFollowUpQuestion(memory: any) {
  if (!memory.age) {
    return "Wie alt ist dein Kind genau?";
  }

  if (!memory.mainProblem) {
    return "Was belastet euch aktuell beim Schlaf am meisten?";
  }

  // ------------------------
  // Einschlafhilfe
  // ------------------------

  if (memory.bedtimeSupport) {
    const value = memory.bedtimeSupport.toLowerCase();

    if (value.includes("brust")) {
      return random(followUps.bedtimeSupport.brust);
    }

    if (value.includes("flasche")) {
      return random(followUps.bedtimeSupport.flasche);
    }

    if (value.includes("tragen")) {
      return random(followUps.bedtimeSupport.tragen);
    }

    if (value.includes("ball")) {
      return random(followUps.bedtimeSupport.pezziball);
    }

    if (value.includes("schnuller")) {
      return random(followUps.bedtimeSupport.schnuller);
    }
  }

  // ------------------------
  // Nächte
  // ------------------------

  if (memory.nightWakeups) {
    const value = memory.nightWakeups.toLowerCase();

    if (
      value.includes("jede") ||
      value.includes("stünd")
    ) {
      return random(followUps.nightWakeups["jede Stunde"]);
    }

    return random(followUps.nightWakeups.häufig);
  }

  // ------------------------
  // kurze Schläfchen
  // ------------------------

  if (
    memory.napLength &&
    /(20|25|30|35|40)/.test(memory.napLength)
  ) {
    return random(followUps.napLength.kurz);
  }

  // ------------------------
  // lange Wachphasen
  // ------------------------

  if (
    memory.wakeWindows &&
    /(4|5|6)/.test(memory.wakeWindows)
  ) {
    return random(followUps.wakeWindows.lang);
  }

  // ------------------------
  // Routine vorhanden
  // ------------------------

  if (memory.bedtimeRoutine) {
    return random(
      followUps.bedtimeRoutine.vorhanden
    );
  }

  // ------------------------
  // Standardfragen
  // ------------------------

  if (!memory.duration) {
    return "Seit wann besteht das Schlafproblem ungefähr?";
  }

  if (!memory.bedtime) {
    return "Wie läuft das Einschlafen aktuell Schritt für Schritt ab?";
  }

  if (!memory.bedtimeRoutine) {
    return "Was macht ihr vom Abendessen bis zum Einschlafen ganz genau?";
  }

  if (!memory.bedtimeDuration) {
    return "Wie lange dauert das Einschlafen ungefähr?";
  }

  if (!memory.naps) {
    return "Wie viele Schläfchen macht dein Kind tagsüber?";
  }

  if (!memory.wakeWindows) {
    return "Wie lange ist dein Kind morgens wach, bevor es das erste Schläfchen macht?";
  }

  if (!memory.napLength) {
    return "Wie lange dauern die einzelnen Schläfchen ungefähr?";
  }

  if (!memory.napPlace) {
    return "Wo macht dein Kind tagsüber seine Schläfchen?";
  }

  if (!memory.sleepPlace) {
    return "Wo schläft dein Kind nachts?";
  }

  if (!memory.feeding) {
    return "Wird dein Kind gestillt, bekommt es die Flasche oder isst es bereits Beikost?";
  }

  if (!memory.light) {
    return "Ist das Schlafzimmer vollständig abgedunkelt?";
  }

  if (!memory.noise) {
    return "Verwendet ihr White Noise oder schläft dein Kind ohne Hintergrundgeräusche?";
  }

  if (!memory.changes) {
    return "Gab es in den letzten Wochen Veränderungen wie Zahnen, Krankheit oder Entwicklungsschritte?";
  }

  if (!memory.health) {
    return "Gibt es gesundheitliche Besonderheiten wie Reflux, Allergien oder ein Zungenband?";
  }

  if (!memory.temperament) {
    return "Wie würdest du dein Kind beschreiben – eher ruhig, sensibel, High Need oder gefühlsstark?";
  }

  return "";
}