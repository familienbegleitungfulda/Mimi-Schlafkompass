type Props = {
    messages: {
      role: "assistant" | "user" | "system";
      content: string;
    }[];
  };
  
  export default function ChatWindow({ messages }: Props) {
    return (
      <div
        style={{
          maxWidth: 700,
          margin: "32px auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {messages
          .filter((m) => m.role !== "system")
          .map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf:
                  m.role === "user" ? "flex-end" : "flex-start",
                background:
                  m.role === "user" ? "#6E5AE6" : "#ffffff",
                color:
                  m.role === "user" ? "#ffffff" : "#333333",
                padding: "16px 20px",
                borderRadius: 20,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                whiteSpace: "pre-wrap",
                maxWidth: "80%",
              }}
            >
              {m.content}
            </div>
          ))}
      </div>
    );
  }