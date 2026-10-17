import React from "react";
import { styles } from "../styles";

export default function AutomaticMarkingStatus({ result, delayed = false }) {
  return (
    <div role="status" aria-live="polite" style={{ ...styles.card, display: "grid", gap: 10 }}>
      {result?.markingStatus === "marked" ? (
        <>
          <strong>Your score: {result.finalScore}/100</strong>
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{result.aiFeedback}</p>
          <a href="/campus/results">View results and feedback</a>
        </>
      ) : result?.markingStatus === "needs_review" ? (
        <strong>Your work is saved and needs a tutor review. Your result will appear in Results when ready.</strong>
      ) : (
        <strong>{delayed
          ? "Your work is submitted. Marking is taking longer; you can leave this page and check Results later."
          : "Marking your work… Your submission is saved."}</strong>
      )}
    </div>
  );
}
