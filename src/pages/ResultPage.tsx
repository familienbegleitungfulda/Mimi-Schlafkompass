type Score = {
    title: string;
    explanation: string;
  };
  
  type Props = {
    scores: Score[];
    analysis: string;
  };
  
  export default function ResultsPage({
    scores,
    analysis,
  }: Props) {
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
          }}
        >
          Mimis Schlafanalyse 🌙
        </h1>
  
        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: 30,
            marginTop: 30,
          }}
        >
          <h2>Das ist mir aufgefallen</h2>
  
          {scores.map((score) => (
            <div
              key={score.title}
              style={{
                marginBottom: 30,
                paddingBottom: 20,
                borderBottom: "1px solid #ececec",
              }}
            >
              <h3
                style={{
                  marginBottom: 10,
                  color: "#4d5f47",
                }}
              >
                {score.title}
              </h3>
  
              <p
                style={{
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {score.explanation}
              </p>
            </div>
          ))}
  
          <h2
            style={{
              marginTop: 40,
            }}
          >
            Meine erste Einschätzung
          </h2>
  
          <div
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.8,
            }}
          >
            {analysis}
          </div>
        </div>
      </main>
    );
  }