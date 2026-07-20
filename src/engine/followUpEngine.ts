import { getMissingAreas } from "./reasoningEngine";
import type { AppMode } from "../config";
import { resolveAppMode } from "../config";
import { followUps } from "../data/followUps";

function random(list: string[]) {
  return list[Math.floor(Math.random() * list.length)];
}

const areaQuestions: Record<string, string[]> = {
  "Alter des Kindes": ["Wie alt ist dein Kind genau?"],
  Hauptproblem: ["Was belastet euch aktuell beim Schlaf am meisten?"],
  "Tagschlaf – Anzahl": [
    "Wie viele Schläfchen macht dein Kind tagsüber?",
  ],
  "Tagschlaf – Dauer": [
    "Wie lange dauern die einzelnen Schläfchen ungefähr?",
  ],
  Einschlafdauer: [
    "Wie lange dauert das Einschlafen ungefähr?",
  ],
  "Häufigkeit des nächtlichen Erwachens": [
    "Wie oft wacht dein Kind nachts ungefähr auf?",
  ],
  "Nachtschlaf – Uhrzeiten": [
    "Um wie viel Uhr geht dein Kind abends ins Bett und wann steht es morgens auf?",
  ],
  Wachzeiten: [
    "Wie lange ist dein Kind morgens wach, bevor es das erste Schläfchen macht?",
  ],
  Schlafbereitschaft: [
    "Wie merkt ihr, wann euer Kind müde genug zum Schlafen ist?",
    "Wirkt dein Kind abends eher übermüdet oder noch recht aktiv?",
  ],
  Schlafumgebung: [
    "Wo schläft dein Kind nachts und wie ist das Schlafzimmer eingerichtet?",
    "Ist das Schlafzimmer abgedunkelt und gibt es Hintergrundgeräusche?",
  ],
  Einschlafhilfe: [
    "Wie begleitet ihr dein Kind beim Einschlafen abends?",
  ],
  "Hilfe nachts": [
    "Was macht ihr, wenn dein Kind nachts aufwacht?",
  ],
  "Nachtnahrung / Ernährung": [
    "Wird dein Kind gestillt, bekommt es die Flasche oder isst es bereits Beikost?",
  ],
  "Entwicklung / Veränderungen": [
    "Gab es in den letzten Wochen Veränderungen wie Zahnen, Krankheit oder Entwicklungsschritte?",
  ],
  Gesundheit: [
    "Gibt es gesundheitliche Besonderheiten wie Reflux, Allergien oder ein Zungenband?",
  ],
  Temperament: [
    "Wie würdest du dein Kind beschreiben – eher ruhig, sensibel, High Need oder gefühlsstark?",
  ],
  Bezugspersonen: [
    "Wer begleitet euer Kind beim Schlafen – immer dieselbe Person oder wechselnd?",
  ],
  "Seit wann das Problem besteht": [
    "Seit wann besteht das Schlafproblem ungefähr?",
  ],
  Abendroutine: [
    "Was macht ihr vom Abendessen bis zum Einschlafen ganz genau?",
  ],
  "Belastung der Familie": [
    "Wie belastend fühlt sich die Situation für euch als Familie gerade an?",
    "Empfindet ihr die aktuelle Schlafsituation als anstrengend oder überfordernd?",
  ],
};

function contextualQuestion(memory: Record<string, unknown>): string | undefined {
  if (memory.bedtimeSupport) {
    const value = String(memory.bedtimeSupport).toLowerCase();

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

  if (memory.nightWakeups) {
    const value = String(memory.nightWakeups).toLowerCase();
    if (value.includes("jede") || value.includes("stünd")) {
      return random(followUps.nightWakeups["jede Stunde"]);
    }
    return random(followUps.nightWakeups.häufig);
  }

  return undefined;
}

export function getFollowUpQuestions(
  memory: Record<string, unknown>,
  max = 2,
  mode: AppMode = resolveAppMode()
): string[] {
  const contextual = contextualQuestion(memory);
  const missing = getMissingAreas(memory, mode);
  const questions: string[] = [];

  if (contextual) {
    questions.push(contextual);
  }

  for (const area of missing) {
    const options = areaQuestions[area];
    if (!options?.length) continue;

    const question = random(options);
    if (!questions.includes(question)) {
      questions.push(question);
    }

    if (questions.length >= max) break;
  }

  return questions.slice(0, max);
}

export function getFollowUpQuestion(
  memory: Record<string, unknown>,
  mode: AppMode = resolveAppMode()
): string {
  return getFollowUpQuestions(memory, 1, mode)[0] ?? "";
}
