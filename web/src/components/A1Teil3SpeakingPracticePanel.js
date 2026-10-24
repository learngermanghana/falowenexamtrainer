import React from "react";
import { styles } from "../styles";
import SpeakingPage from "./SpeakingPage";

export default function A1Teil3SpeakingPracticePanel() {
  return (
    <section
      id="a1-teil3-speaking-practice"
      data-a1-speaking-lock="A1-Teil-3"
      style={{
        ...styles.card,
        display: "grid",
        gap: 16,
        border: "1px solid #c7d2fe",
        background: "linear-gradient(180deg, #eef2ff 0%, #ffffff 100%)",
      }}
    >
      <div style={{ display: "grid", gap: 7 }}>
        <span style={{ ...styles.badge, width: "fit-content", background: "#ddd6fe", color: "#5b21b6" }}>
          Goethe A1 · Sprechen Teil 3
        </span>
        <h2 style={{ margin: 0 }}>Practise polite requests after the notes</h2>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>
          This practice room is locked to <strong>A1 Teil 3</strong>. Choose a request card,
          answer by voice or text, and use the AI feedback to improve your use of
          <strong> Sie</strong>, <strong>bitte</strong>, and <strong>Können Sie bitte ...?</strong>
        </p>
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        <SpeakingPage
          mode="exam"
          lockedLevel="A1"
          lockedTeil="3"
          examOnly
          contextLabel="Goethe A1 · Sprechen Teil 3"
        />
      </div>

      <p style={{ margin: 0, color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>
        Teil 1 and Teil 2 remain available in the full Speaking Exams Room. This lesson keeps the practice focused on the polite-request task taught above.
      </p>
    </section>
  );
}
