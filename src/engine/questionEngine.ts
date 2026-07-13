import { questions } from "../data/questions";

export function getNextQuestion(messageCount: number): string | null {
  const index = messageCount - 1;

  if (index >= questions.length) {
    return null;
  }

  return questions[index].question;
}