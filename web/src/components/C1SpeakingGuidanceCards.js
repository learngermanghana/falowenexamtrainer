import React from "react";

const listStyle = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };

export default function C1SpeakingGuidanceCards({ question, intro, branches = [] }) {
  const safeBranches = Array.isArray(branches) ? branches : [];

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ border: "1px solid #fde68a", borderRadius: 14, padding: 12, background: "#fffbeb", color: "#92400e", lineHeight: 1.65 }}>
        <strong>Sprechfrage:</strong> {question}
      </div>

      <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>
        {intro || "Nutze die Punkte als Denkstütze. Wähle passende Aspekte aus, begründe sie und entwickle mindestens ein konkretes Beispiel."}
      </p>

      {safeBranches.length ? (
        <div style={{ display: "grid", gap: 12 }}>
          {safeBranches.map((branch, index) => {
            const ideas = Array.isArray(branch.keywords) && branch.keywords.length
              ? branch.keywords
              : Array.isArray(branch.points)
                ? branch.points
                : [];

            return (
              <article
                key={branch.id || branch.title || index}
                style={{ border: "1px solid #c7d2fe", borderRadius: 16, padding: 14, background: "#eef2ff", display: "grid", gap: 8 }}
              >
                <strong>{index + 1}. {branch.title}</strong>

                {ideas.length ? (
                  <div>
                    <strong>Beispielideen:</strong>
                    <ul style={listStyle}>{ideas.map((idea) => <li key={idea}>{idea}</li>)}</ul>
                  </div>
                ) : null}

                {branch.prompt ? (
                  <div><strong>Was ist damit gemeint?</strong> {branch.prompt}</div>
                ) : null}

                {branch.example ? (
                  <div style={{ borderLeft: "4px solid #818cf8", paddingLeft: 10, color: "#3730a3", lineHeight: 1.65 }}>
                    <strong>Konkretes Beispiel:</strong> {branch.example}
                  </div>
                ) : null}

                {branch.starter ? (
                  <div style={{ borderLeft: "4px solid #60a5fa", paddingLeft: 10, lineHeight: 1.65 }}>
                    <strong>Möglicher C1-Satzanfang:</strong> {branch.starter}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <div style={{ border: "1px solid #cbd5e1", borderRadius: 14, padding: 12, color: "#475569" }}>
          Entwickle deine Antwort mit Position, zwei Gründen, einem konkreten Beispiel, einer Gegenperspektive und einem kurzen Fazit.
        </div>
      )}
    </div>
  );
}
