/**
 * Run: npx vite-node scripts/test-ask-mimi.ts [public|course]
 */

(globalThis as Record<string, unknown>).window = {
  location: {
    hostname:
      process.argv[2] === "public"
        ? "mimi-schlafkompass.netlify.app"
        : "mimi-schlummerwerkstatt.netlify.app",
  },
};

import { askMimi } from "../src/services/openai";

const messages = [
  {
    role: "assistant" as const,
    content: "Wie alt ist dein Kind?",
  },
  {
    role: "user" as const,
    content: "8 Monate",
  },
];

try {
  const result = await askMimi(messages);
  console.log("mode:", result.mode);
  console.log("OK:", result.message.slice(0, 180));
} catch (error) {
  console.error(
    "FAILED:",
    error instanceof Error ? error.message.slice(0, 500) : error
  );
  process.exit(1);
}
