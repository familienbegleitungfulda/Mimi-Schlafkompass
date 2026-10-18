import { getStore } from "@netlify/blobs";

const ID_PATTERN = /^[A-Za-z0-9_-]{32}$/;

export default async (req: Request) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";

  if (!ID_PATTERN.test(id)) {
    return new Response("Nicht gefunden", { status: 404 });
  }

  const pdf = await getStore("auswertungen").get(id, { type: "arrayBuffer" });
  if (!pdf) {
    return new Response("Nicht gefunden", { status: 404 });
  }

  const disposition = url.searchParams.has("download") ? "attachment" : "inline";

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="Mimis-Schlafkompass-Auswertung.pdf"`,
      "Cache-Control": "private, max-age=86400",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
};
