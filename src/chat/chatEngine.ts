export type ChatMessage = {
    role: "assistant" | "user";
    text: string;
  };
  
  export function getNextQuestion(history: ChatMessage[]) {
    const assistantMessages = history.filter(
      (m) => m.role === "assistant"
    );
  
    switch (assistantMessages.length) {
      case 0:
        return "Hallo ❤️ Ich bin Mimi. Erzähl mir doch erstmal, was euch aktuell beim Schlaf am meisten belastet.";
  
      case 1:
        return "Wie alt ist dein Kind?";
  
      case 2:
        return "Wie schläft dein Kind meistens ein?";
  
      case 3:
        return "Wie oft wacht dein Kind nachts ungefähr auf?";
  
      case 4:
        return "Wie lange dauert das Einschlafen meistens?";
  
      default:
        return null;
    }
  }