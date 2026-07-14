import { useLayoutEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  loading?: boolean;
};

const MIN_ROWS = 2;
const MAX_ROWS = 10;

export default function ChatInput({
  value,
  onChange,
  onSend,
  loading,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";

    const style = getComputedStyle(el);
    const lineHeight = parseFloat(style.lineHeight) || 24;
    const verticalExtra =
      parseFloat(style.paddingTop) +
      parseFloat(style.paddingBottom) +
      parseFloat(style.borderTopWidth) +
      parseFloat(style.borderBottomWidth);

    const minHeight = lineHeight * MIN_ROWS + verticalExtra;
    const maxHeight = lineHeight * MAX_ROWS + verticalExtra;

    el.style.height = `${Math.min(Math.max(el.scrollHeight, minHeight), maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [value]);

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginTop: 24,
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        rows={MIN_ROWS}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!loading && value.trim()) onSend();
          }
        }}
        placeholder="Schreibe deine Nachricht..."
        style={{
          flex: 1,
          padding: 18,
          borderRadius: 16,
          border: "1px solid #DDD",
          fontSize: 16,
          lineHeight: 1.5,
          fontFamily: "inherit",
          resize: "none",
          boxSizing: "border-box",
          overflowY: "hidden",
        }}
      />

      <button
        onClick={onSend}
        disabled={loading}
        style={{
          background: "#9DB38E",
          color: "white",
          border: "none",
          borderRadius: 16,
          padding: "18px 28px",
          cursor: "pointer",
          fontSize: 16,
          fontWeight: 600,
          alignSelf: "flex-end",
        }}
      >
        {loading ? "..." : "Senden"}
      </button>
    </div>
  );
}
