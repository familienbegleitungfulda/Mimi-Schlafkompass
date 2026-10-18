import { useState, type CSSProperties, type FormEvent } from "react";
import type { MimiTheme } from "../theme";
import type { Message } from "../chat/conversation";

type Props = {
  messages: Message[];
  productId: string;
  age: string;
  sleepAssociation: boolean;
  /** Schlafprofil aus dem Gespräch – daraus entstehen die Gründe im PDF. */
  profile: Record<string, unknown>;
  theme: MimiTheme;
};

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PRIVACY_URL = "https://familienbegleitung-fulda.de/datenschutz/";

export default function ReportRequestBox({ messages, productId, age, sleepAssociation, profile, theme }: Props) {
  const [vorname, setVorname] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  const vornameError = !vorname.trim() ? "Bitte gib deinen Vornamen an." : "";
  const emailError = !email.trim()
    ? "Bitte gib deine E-Mail-Adresse an."
    : !EMAIL_PATTERN.test(email.trim())
      ? "Bitte prüfe das Format deiner E-Mail-Adresse."
      : "";
  const consentError = !consent ? "Bitte setze das Häkchen, damit wir dir die Auswertung schicken dürfen." : "";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (vornameError || emailError || consentError || status === "loading") return;

    setStatus("loading");

    try {
      const response = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vorname: vorname.trim(),
          email: email.trim(),
          consent,
          website,
          productId,
          age,
          sleepAssociation,
          profile,
          messages: messages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error("subscribe failed");

      setAlreadySubscribed(data.status === "sent");
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: `1px solid ${theme.inputBorder}`,
    fontSize: 16,
    fontFamily: "inherit",
    boxSizing: "border-box",
    background: theme.sectionBackground,
    color: theme.bodyText,
  };

  const labelStyle: CSSProperties = {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    color: theme.bodyText,
    marginBottom: 6,
  };

  const errorStyle: CSSProperties = {
    color: "#b5533c",
    fontSize: 13,
    marginTop: 6,
  };

  const buttonStyle: CSSProperties = {
    width: "100%",
    background: theme.accent,
    color: "white",
    border: "none",
    borderRadius: 14,
    padding: "16px",
    fontSize: 16,
    fontWeight: 700,
    cursor: status === "loading" ? "default" : "pointer",
    opacity: status === "loading" ? 0.7 : 1,
    textDecoration: "none",
    display: "block",
    textAlign: "center",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        marginTop: 30,
        background: theme.cardBackground,
        borderRadius: 20,
        padding: 24,
        boxShadow: theme.cardShadow,
        border: `2px solid ${theme.accentMuted}`,
      }}
    >
      <h3 style={{ marginTop: 0, color: theme.bodyText }}>
        Deine ausführliche Auswertung als PDF
      </h3>

      <p style={{ color: theme.mutedText, lineHeight: 1.7, marginBottom: 20 }}>
        Mimi fasst dir alles noch einmal ausführlich zusammen: eure
        Schlafsituation, die wichtigsten Stellschrauben und konkrete nächste
        Schritte. Du bekommst die Auswertung als PDF per Mail.
      </p>

      {status === "success" ? (
        <div style={{ textAlign: "left" }}>
          <p
            role="status"
            style={{
              background: "rgba(157, 179, 142, 0.15)",
              color: theme.bodyText,
              borderRadius: 14,
              padding: 16,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {alreadySubscribed
              ? "Schön, dass du wieder da bist! Deine Auswertung ist schon auf dem Weg in dein Postfach. Schau auch im Spam-Ordner nach."
              : "Fast geschafft! Wir haben dir eine Mail geschickt. Bitte bestätige deine Adresse, dann kommt deine ausführliche Auswertung direkt in dein Postfach. Schau auch im Spam-Ordner nach."}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate style={{ textAlign: "left" }}>
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="report-vorname" style={labelStyle}>
              Vorname
            </label>
            <input
              id="report-vorname"
              type="text"
              autoComplete="given-name"
              required
              maxLength={60}
              value={vorname}
              onChange={(e) => setVorname(e.target.value)}
              style={inputStyle}
            />
            {touched && vornameError && <div style={errorStyle}>{vornameError}</div>}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label htmlFor="report-email" style={labelStyle}>
              E-Mail
            </label>
            <input
              id="report-email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            {touched && emailError && <div style={errorStyle}>{emailError}</div>}
          </div>

          {/* Honeypot for bots – hidden from people and screen readers */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
          />

          <label
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              fontSize: 14,
              lineHeight: 1.6,
              color: theme.bodyText,
              marginBottom: 6,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ marginTop: 5, width: 18, height: 18, accentColor: theme.accent, flexShrink: 0 }}
            />
            <span>
              Ja, schick mir die Auswertung und Mayas Tipps rund um Babyschlaf
              und Stillen per Mail. Abmelden geht jederzeit. Hinweise zum
              Datenschutz findest du in der{" "}
              <a
                href={PRIVACY_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: theme.accentHover, fontWeight: 600 }}
              >
                Datenschutzerklärung
              </a>
              .
            </span>
          </label>
          {touched && consentError && <div style={errorStyle}>{consentError}</div>}

          {status === "error" && (
            <p role="alert" style={{ ...errorStyle, fontSize: 15, margin: "16px 0 0 0" }}>
              Das hat leider nicht geklappt. Bitte versuch es noch einmal.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            style={{ ...buttonStyle, marginTop: 20 }}
          >
            {status === "loading" ? "Mimi schreibt deine Auswertung …" : "Auswertung anfordern"}
          </button>
        </form>
      )}
    </div>
  );
}
