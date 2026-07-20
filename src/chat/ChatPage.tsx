import { useEffect, useRef, useState } from "react";
import { askMimi } from "../services/openai";
import type { Message } from "./conversation";
import { products as allProducts } from "../data/products";
import type { ResolvedCourseModule } from "../data/course";
import ChatInput from "../components/ChatInput";
import { isCourseMode, resolveAppMode } from "../config";
import { getMimiTheme } from "../theme";

export default function ChatPage() {
  const theme = getMimiTheme();
  const courseMode = isCourseMode();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [recommendedProducts, setRecommendedProducts] =
    useState<typeof allProducts>([]);
  const [recommendedModules, setRecommendedModules] = useState<
    ResolvedCourseModule[]
  >([]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Beta-Version
        
        Hallo ❤️
Ich bin Mimi.
Ich bin Mayas virtuelle Assistentin.
Gemeinsam schauen wir uns eure Schlafsituation Schritt für Schritt an.
Die Analyse basiert auf Mayas Fachwissen und soll euch eine erste Orientierung geben.

Bevor wir starten:
Wie alt ist dein Kind aktuell?`,
      },
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, recommendedProducts, recommendedModules]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    const history = [...messages, userMessage];

    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const answer = await askMimi(history);

      const analysisComplete = answer.message.includes("### ANALYSE BEENDET ###");

      if (analysisComplete) {
        if (answer.mode === "course") {
          setRecommendedProducts([]);
          setRecommendedModules(answer.modules);
        } else {
          setRecommendedProducts(answer.products);
          setRecommendedModules([]);
        }
      }

      setMessages([
        ...history,
        {
          role: "assistant",
          content: answer.message.replace(
            "### ANALYSE BEENDET ###",
            ""
          ),
        },
      ]);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : JSON.stringify(error, null, 2);

      setMessages([
        ...history,
        {
          role: "assistant",
          content: `Fehler (Debug):\n\n${errorMessage}`,
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: courseMode ? "0 auto" : "40px auto",
        padding: courseMode ? "48px 20px 40px" : 20,
        minHeight: courseMode ? "100vh" : undefined,
        background: courseMode ? theme.pageBackground : undefined,
        boxSizing: "border-box",
      }}
    >
      {courseMode ? (
        <header style={{ textAlign: "center", marginBottom: 36 }}>
          <h1
            style={{
              color: theme.headingColor,
              fontSize: 42,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              margin: "0 0 8px 0",
            }}
          >
            Mimi
          </h1>
          <p
            style={{
              margin: 0,
              color: theme.headingSubline,
              fontSize: 15,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Schlummerwerkstatt
          </p>
        </header>
      ) : (
        <h1
          style={{
            color: theme.headingColor,
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          Mimi 🌙
        </h1>
      )}

      <div
        style={{
          background: theme.sectionBackground,
          borderRadius: 14,
          padding: "12px 16px",
          marginBottom: 20,
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: courseMode ? theme.cardShadow : "0 4px 10px rgba(0,0,0,.05)",
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 6,
            color: theme.bodyText,
          }}
        >
          Wichtiger Hinweis
        </div>

        <div
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: theme.mutedText,
          }}
        >
          <p style={{ margin: "0 0 6px 0" }}>
            <strong>Mimi ist Mayas virtuelle Assistentin.</strong> Sie erstellt
            anhand deiner Angaben eine erste Einschätzung eurer Schlafsituation auf
            Grundlage von Mayas Fachwissen.
          </p>

          <p style={{ margin: "0 0 6px 0" }}>
            Die Analyse dient ausschließlich der ersten Orientierung und ersetzt
            keine individuelle Schlafberatung sowie keine medizinische Untersuchung.
          </p>

          <p style={{ margin: 0 }}>
            Bei gesundheitlichen Auffälligkeiten oder akuten Beschwerden wende dich
            bitte an deine Kinderärztin oder deinen Kinderarzt.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          minHeight: 450,
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              alignSelf:
                message.role === "assistant"
                  ? "flex-start"
                  : "flex-end",
              background:
                message.role === "assistant"
                  ? theme.assistantBubble
                  : theme.userBubble,
              color:
                message.role === "assistant"
                  ? theme.assistantText
                  : theme.userText,
              padding: 20,
              borderRadius: 20,
              whiteSpace: "pre-wrap",
              maxWidth: 650,
              lineHeight: 1.8,
              boxShadow: theme.cardShadow,
              border:
                courseMode && message.role === "assistant"
                  ? `1px solid ${theme.cardBorder}`
                  : undefined,
            }}
          >
            {message.content}
          </div>
        ))}

        {loading && (
          <div
            style={{
              background: theme.assistantBubble,
              color: theme.assistantText,
              padding: 20,
              borderRadius: 18,
              width: 180,
              border: courseMode ? `1px solid ${theme.cardBorder}` : undefined,
            }}
          >
            Mimi denkt...
          </div>
        )}

        <div ref={bottomRef} />

        {recommendedProducts.length > 0 && !courseMode && (
          <div style={{ marginTop: 30 }}>
            <h2
              style={{
                color: theme.headingColor,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Das könnte euch jetzt weiterhelfen
            </h2>

            <div style={{ display: "grid", gap: 18 }}>
              {recommendedProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    background: theme.cardBackground,
                    borderRadius: 20,
                    padding: 24,
                    boxShadow: theme.cardShadow,
                    border: courseMode
                      ? `1px solid ${theme.cardBorder}`
                      : undefined,
                  }}
                >
                  <h3 style={{ marginTop: 0, color: theme.bodyText }}>
                    {product.title}
                  </h3>

                  <p
                    style={{
                      color: theme.mutedText,
                      lineHeight: 1.7,
                      marginBottom: 20,
                    }}
                  >
                    {product.description}
                  </p>

                  <button
                    onClick={() => window.open(product.url, "_blank")}
                    style={{
                      width: "100%",
                      background: theme.accentMuted,
                      color: "white",
                      border: "none",
                      borderRadius: 14,
                      padding: "16px",
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Zum Angebot →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendedModules.length > 0 && courseMode && (
          <div style={{ marginTop: 30 }}>
            <h2
              style={{
                color: theme.headingColor,
                textAlign: "center",
                marginBottom: 20,
                fontWeight: 500,
              }}
            >
              Passende Module in der Schlummerwerkstatt
            </h2>

            <div style={{ display: "grid", gap: 18 }}>
              {recommendedModules.map((module) => (
                <div
                  key={module.id}
                  style={{
                    background: theme.cardBackground,
                    borderRadius: 20,
                    padding: 24,
                    boxShadow: theme.cardShadow,
                    border: `1px solid ${theme.cardBorder}`,
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0,
                      color: theme.bodyText,
                      fontWeight: 600,
                    }}
                  >
                    {module.recommendation?.priorityRank
                      ? `${module.recommendation.priorityRank}. `
                      : ""}
                    {module.title}
                  </h3>

                  {module.recommendation?.focusTitle && (
                    <p
                      style={{
                        color: theme.goldAccent,
                        fontSize: 15,
                        fontWeight: 600,
                        marginBottom: 12,
                      }}
                    >
                      Fokus: {module.recommendation.focusTitle}
                    </p>
                  )}

                  <p
                    style={{
                      color: theme.mutedText,
                      lineHeight: 1.7,
                      marginBottom: 12,
                    }}
                  >
                    {module.description}
                  </p>

                  {module.recommendation && (
                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: theme.bodyText,
                        marginBottom: 16,
                      }}
                    >
                      <p style={{ margin: "0 0 8px 0" }}>
                        <strong>Warum:</strong> {module.recommendation.whyFits}
                      </p>
                      <p style={{ margin: "0 0 8px 0" }}>
                        <strong>Ziel:</strong>{" "}
                        {module.recommendation.problemSolved}
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong>Priorität:</strong>{" "}
                        {module.recommendation.priorityReason}
                      </p>
                    </div>
                  )}

                  <p
                    style={{
                      color: theme.goldAccent,
                      fontSize: 14,
                      marginBottom: 16,
                    }}
                  >
                    {module.primaryChapter?.title}
                    {module.primaryChapter?.timestamp
                      ? ` · ${module.primaryChapter.timestamp}`
                      : ""}
                  </p>

                  {(module.roadmap.pdfs.length > 0 ||
                    module.roadmap.exercises.length > 0) && (
                    <p
                      style={{
                        color: theme.mutedText,
                        fontSize: 13,
                        marginBottom: 16,
                      }}
                    >
                      {module.roadmap.pdfs.length > 0 &&
                        `PDF: ${module.roadmap.pdfs.map((pdf) => pdf.title).join(", ")}`}
                      {module.roadmap.pdfs.length > 0 &&
                        module.roadmap.exercises.length > 0 &&
                        " · "}
                      {module.roadmap.exercises.length > 0 &&
                        `Übung: ${module.roadmap.exercises.map((exercise) => exercise.title).join(", ")}`}
                    </p>
                  )}

                  <div
                    style={{
                      background: courseMode
                        ? "rgba(26, 40, 56, 0.04)"
                        : "#f7f7f7",
                      borderRadius: 12,
                      padding: 16,
                      border: courseMode
                        ? `1px solid ${theme.cardBorder}`
                        : undefined,
                    }}
                  >
                    <strong
                      style={{
                        display: "block",
                        marginBottom: 8,
                        color: theme.bodyText,
                      }}
                    >
                      Schritte für heute:
                    </strong>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: 20,
                        color: theme.bodyText,
                      }}
                    >
                      {module.todayActions.map((action) => (
                        <li key={action} style={{ marginBottom: 6 }}>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={sendMessage}
        loading={loading}
        theme={theme}
      />

      {import.meta.env.DEV && (
        <p
          style={{
            color: courseMode
              ? "rgba(232, 220, 200, 0.5)"
              : "rgba(255,255,255,0.6)",
            fontSize: 12,
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Modus: {resolveAppMode()}
        </p>
      )}
    </main>
  );
}
