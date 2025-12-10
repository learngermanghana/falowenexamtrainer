import React from "react";
import { styles } from "../styles";

const ResultHistory = ({ results = [] }) => {
  if (!results.length) return null;

  return (
    <section style={{ ...styles.card, marginTop: 16 }}>
      <h2 style={styles.sectionTitle}>Past feedback</h2>
      <p style={styles.helperText}>
        Review your previous speaking and writing analyses to track your progress.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {results.map((entry) => {
          const created = entry.createdAt
            ? new Date(entry.createdAt).toLocaleString()
            : "";

          return (
            <article
              key={entry.id || created}
              style={{ ...styles.resultCard, marginTop: 0 }}
            >
              <div style={{ ...styles.helperText, marginBottom: 8 }}>
                <strong>{entry.mode || "Feedback"}</strong> · {entry.teil} · {entry.level}
                {created ? ` · ${created}` : ""}
              </div>

              {entry.transcript && (
                <>
                  <h4 style={styles.resultHeading}>Transcript</h4>
                  <p style={styles.resultText}>{entry.transcript}</p>
                </>
              )}

              {entry.corrected_text && (
                <>
                  <h4 style={styles.resultHeading}>Corrected German Version</h4>
                  <p style={styles.resultText}>{entry.corrected_text}</p>
                </>
              )}

              {entry.mistakes && (
                <>
                  <h4 style={styles.resultHeading}>Mistakes & Explanations</h4>
                  <pre style={styles.pre}>{entry.mistakes}</pre>
                </>
              )}

              {entry.pronunciation && (
                <>
                  <h4 style={styles.resultHeading}>Pronunciation / Fluency</h4>
                  <p style={styles.resultText}>{entry.pronunciation}</p>
                </>
              )}

              {entry.score !== undefined && entry.score !== null && (
                <>
                  <h4 style={styles.resultHeading}>Score</h4>
                  <p style={styles.score}>
                    ⭐ <b>{entry.score} / 10</b>
                  </p>
                </>
              )}

              {entry.comment && (
                <p style={{ ...styles.resultText, marginTop: 4 }}>{entry.comment}</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ResultHistory;
