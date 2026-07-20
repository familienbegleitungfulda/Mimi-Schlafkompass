import { useEffect, useRef, useState } from "react";
import { askMimi } from "../services/openai";
import type { Message } from "./conversation";
import { products as allProducts } from "../data/products";
import type { ResolvedCourseModule } from "../data/course";
import ChatInput from "../components/ChatInput";
import { isCourseMode, MODE } from "../config";

export default function ChatPage() {
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

      if (
        answer.message.includes(
          "### ANALYSE BEENDET ###"
        )
      ) {
        setRecommendedProducts(answer.products);
        setRecommendedModules(answer.modules);
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

      setMessages([
        ...history,
        {
          role: "assistant",
          content:
            "Entschuldige, gerade konnte ich nicht antworten. Bitte versuche es gleich noch einmal.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 20,
      }}
    >
      <h1
        style={{
          color: "white",
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        Mimi 🌙
      </h1>

      <div
        style={{
          background: "white",
          borderRadius: 14,
          padding: "12px 16px",
          marginBottom: 20,
          border: "1px solid #e8e8e8",
          boxShadow: "0 4px 10px rgba(0,0,0,.05)",
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 6,
            color: "#333",
          }}
        >
          Wichtiger Hinweis
        </div>

        <div
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: "#666",
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
                message.role === "assistant" ? "#ffffff" : "#A6BE95",
              color: "#333",
              padding: 20,
              borderRadius: 20,
              whiteSpace: "pre-wrap",
              maxWidth: 650,
              lineHeight: 1.8,
              boxShadow: "0 8px 20px rgba(0,0,0,.08)",
            }}
          >
            {message.content}
          </div>
        ))}

        {loading && (
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 18,
              width: 180,
            }}
          >
            Mimi denkt...
          </div>
        )}

        <div ref={bottomRef} />

        {recommendedProducts.length > 0 && !isCourseMode() && (
          <div style={{ marginTop: 30 }}>
            <h2
              style={{
                color: "white",
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
                    background: "white",
                    borderRadius: 20,
                    padding: 24,
                    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
                  }}
                >
                  <h3 style={{ marginTop: 0, color: "#3B3B3B" }}>
                    {product.title}
                  </h3>

                  <p
                    style={{
                      color: "#666",
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
                      background: "#A6BE95",
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

        {recommendedModules.length > 0 && isCourseMode() && (
          <div style={{ marginTop: 30 }}>
            <h2
              style={{
                color: "white",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Passende Module in der Schlummerwerkstatt
            </h2>

            <div style={{ display: "grid", gap: 18 }}>
              {recommendedModules.map((module) => (
                <div
                  key={module.id}
                  style={{
                    background: "white",
                    borderRadius: 20,
                    padding: 24,
                    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
                  }}
                >
                  <h3 style={{ marginTop: 0, color: "#3B3B3B" }}>
                    {module.title}
                  </h3>

                  <p
                    style={{
                      color: "#666",
                      lineHeight: 1.7,
                      marginBottom: 12,
                    }}
                  >
                    {module.description}
                  </p>

                  <p
                    style={{
                      color: "#888",
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
                        color: "#888",
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
                      background: "#f7f7f7",
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <strong style={{ display: "block", marginBottom: 8 }}>
                      Schritte für heute:
                    </strong>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
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
      />

      {import.meta.env.DEV && (
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 12,
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Modus: {MODE}
        </p>
      )}
    </main>
  );
}
