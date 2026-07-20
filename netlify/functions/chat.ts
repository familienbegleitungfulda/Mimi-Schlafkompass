export const handler = async (event: {
  httpMethod: string;
  body: string | null;
}) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey =
    process.env.OPENAI_API_KEY ??
    process.env.VITE_OPENAI_API_KEY ??
    "";

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: {
          message:
            "Missing OpenAI API key in Netlify environment (OPENAI_API_KEY or VITE_OPENAI_API_KEY).",
        },
      }),
    };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: event.body ?? "{}",
  });

  return {
    statusCode: response.status,
    headers: { "Content-Type": "application/json" },
    body: await response.text(),
  };
};
