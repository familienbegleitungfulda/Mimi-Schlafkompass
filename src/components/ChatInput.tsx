type Props = {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    loading?: boolean;
  };
  
  export default function ChatInput({
    value,
    onChange,
    onSend,
    loading,
  }: Props) {
    return (
      <div
        style={{
          display: "flex",
          gap: 12,
          maxWidth: 700,
          margin: "24px auto",
        }}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
          placeholder="Schreibe deine Nachricht..."
          style={{
            flex: 1,
            padding: 16,
            borderRadius: 16,
            border: "1px solid #ddd",
          }}
        />
  
        <button onClick={onSend} disabled={loading}>
          {loading ? "..." : "Senden"}
        </button>
      </div>
    );
  }