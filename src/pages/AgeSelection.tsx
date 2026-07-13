type AgeSelectionProps = {
    onSelect: (age: string) => void;
  };
  
  export default function AgeSelection({ onSelect }: AgeSelectionProps) {
    return (
      <main className="app">
        <section className="hero">
          <div className="emoji">🌙</div>
  
          <h1>Hallo 👋</h1>
  
          <p>
            Ich bin Mimi.
            <br />
            Wie alt ist dein Kind?
          </p>
  
          <button onClick={() => onSelect("0-4")}>0–4 Monate</button>
          <button onClick={() => onSelect("4-8")}>4–8 Monate</button>
          <button onClick={() => onSelect("8-12")}>8–12 Monate</button>
          <button onClick={() => onSelect("1-2")}>1–2 Jahre</button>
          <button onClick={() => onSelect("2-4")}>2–4 Jahre</button>
        </section>
      </main>
    );
  }