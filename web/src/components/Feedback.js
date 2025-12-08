import React from "react";
import { styles } from "../styles";

const Feedback = ({ result }) => {
  if (!result) return null;

  return (
    <section style={styles.resultCard}>
      <h2 style={styles.sectionTitle}>3. Feedback</h2>

      <h3 style={styles.resultHeading}>Transcript (What the AI heard)</h3>
      <p style={styles.resultText}>{result.transcript}</p>

      <h3 style={styles.resultHeading}>Corrected German Version</h3>
      <p style={styles.resultText}>{result.corrected_text}</p>

      <h3 style={styles.resultHeading}>Mistakes & Explanations (English)</h3>
      <pre style={styles.pre}>{result.mistakes}</pre>

      <h3 style={styles.resultHeading}>Pronunciation / Fluency (from transcript)</h3>
      <p style={styles.resultText}>{result.pronunciation}</p>

      <h3 style={styles.resultHeading}>Score</h3>
      <p style={styles.score}>
        ⭐ <b>{result.score} / 10</b>
      </p>
      <p style={styles.resultText}>{result.comment}</p>
    </section>
  );
};

export default Feedback;
