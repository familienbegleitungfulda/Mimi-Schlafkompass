import type { Message } from "../chat/conversation";
import { questions } from "../data/questions";

export type Profile = Record<string, boolean>;

export function buildProfile(messages: Message[]): Profile {
  const text = messages
    .map((m) => m.content.toLowerCase())
    .join(" ");

  const profile: Profile = {};

  profile.age =
    /\b\d+\s?(tag|tage|woche|wochen|monat|monate|jahr|jahre)\b/.test(text);

  profile.problem =
    text.length > 20;

  profile.duration =
    /seit|tage|wochen|monaten|jahren/.test(text);

  profile.fallAsleep =
    /einschlaf|einschlafen|ins bett|schläft ein/.test(text);

  profile.sleepSupport =
    /still|brust|flasche|tragen|trage|pezziball|ball|kinderwagen|wagen|schnuller|kuscheln/.test(
      text
    );

  profile.fallAsleepTime =
    /min|minute|minuten|stunde/.test(text);

  profile.routine =
    /routine|ritual|buch|baden|zähne|schlafsack/.test(text);

  profile.light =
    /abdunk|rollo|dunkel|licht/.test(text);

  profile.noise =
    /white noise|rauschen|musik|geräusch/.test(text);

  profile.naps =
    /schläfchen|tagschlaf|mittagsschlaf|nap/.test(text);

  profile.wakeWindows =
    /wachphase|stunden wach|stunden zwischen/.test(text);

  profile.napDuration =
    /30 minuten|45 minuten|1 stunde|2 stunden/.test(text);

  profile.napPlace =
    /kinderwagen|bett|trage|arm|federwiege/.test(text);

  profile.nightWakeups =
    /nachts|jede stunde|aufwachen|wach/.test(text);

  profile.nightHelp =
    /stillen|tragen|kuscheln|schnuller|flasche/.test(text);

  profile.sleepPlace =
    /familienbett|beistellbett|eigenes zimmer|bett/.test(text);

  profile.feeding =
    /still|flasche|beikost|milch/.test(text);

  profile.changes =
    /krank|zähne|urlaub|kita|eingewöhnung|entwicklung/.test(text);

  profile.health =
    /reflux|allerg|medikament|arzt/.test(text);

  profile.temperament =
    /high need|gefühlsstark|sensibel|temperament/.test(text);

  return profile;
}

export function getMissingTopics(profile: Profile) {
  return questions.filter((q) => !profile[q.id]);
}