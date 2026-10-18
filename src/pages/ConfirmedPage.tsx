import { getMimiTheme } from "../theme";

export default function ConfirmedPage() {
  const theme = getMimiTheme("public");

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          color: theme.headingColor,
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        Mimi 🌙
      </h1>

      <div
        style={{
          background: theme.cardBackground,
          borderRadius: 20,
          padding: "36px 28px",
          boxShadow: theme.cardShadow,
          border: `2px solid ${theme.accentMuted}`,
          maxWidth: 600,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 44, marginBottom: 12 }} aria-hidden="true">
          💌
        </div>

        <h2 style={{ color: theme.bodyText, marginTop: 0, marginBottom: 14 }}>
          Danke, deine Adresse ist bestätigt!
        </h2>

        <p
          style={{
            color: theme.mutedText,
            lineHeight: 1.7,
            margin: "0 0 28px 0",
          }}
        >
          Deine ausführliche Auswertung ist schon auf dem Weg in dein Postfach.
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            background: theme.accent,
            color: "white",
            borderRadius: 14,
            padding: "16px 28px",
            fontSize: 16,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Zurück zum Schlafkompass
        </a>
      </div>
    </main>
  );
}
