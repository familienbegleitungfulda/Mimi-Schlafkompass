type Props = {
    onStart?: () => void;
  };
  
  export default function LandingPage({ onStart }: Props) {
    return (
      <main className="app">
        <section className="hero">
          <div style={{ fontSize: 48 }}>🌙</div>
  
          <h1>Mimi</h1>
  
          <h2>Dein KI-Schlafkompass</h2>
  
          <p>
            Gemeinsam finden wir heraus, warum dein Kind gerade schlecht schläft.
          </p>
  
          <button
            onClick={() => {
              if (onStart) {
                onStart();
              } else {
                window.location.href = "/chat";
              }
            }}
          >
            Schlafanalyse starten
          </button>
        </section>
      </main>
    );
  }