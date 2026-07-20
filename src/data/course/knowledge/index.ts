import { durchschlafenKnowledge } from "./durchschlafen";
import { familienbettKnowledge } from "./familienbett";
import { schlaftrainingKnowledge } from "./schlaftraining";
import { sidsKnowledge } from "./sids";

export { durchschlafenKnowledge } from "./durchschlafen";
export { familienbettKnowledge } from "./familienbett";
export { sidsKnowledge } from "./sids";
export { schlaftrainingKnowledge } from "./schlaftraining";

export const courseKnowledgeBase = [
  durchschlafenKnowledge,
  familienbettKnowledge,
  sidsKnowledge,
  schlaftrainingKnowledge,
].join("\n\n------------------------------------------------\n\n");
