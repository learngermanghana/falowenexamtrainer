import React from "react";
import { styles } from "../styles";
import SpeakingPage from "./SpeakingPage";
import C1Day11EngagementUndEhrenamtWorkbookPage from "./C1Day11EngagementUndEhrenamtWorkbookPage";

export default function C1Day11GoetheSpeakingSelfLearningPage() {
  return (
    <div data-c1-day11-goethe-speaking-page="true" style={{ display: "grid", gap: 16 }}>
      <section
        style={{
          ...styles.container,
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <div
          style={{
            ...styles.card,
            display: "grid",
            gap: 14,
            border: "2px solid #2563eb",
            background: "linear-gradient(135deg, #eff6ff, #ffffff)",
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <span
              style={{
                ...styles.badge,
                width: "fit-content",
                background: "#dbeafe",
                color: "#1d4ed8",
              }}
            >
              Goethe C1 · Sprechen
            </span>
            <h1 style={{ margin: 0, fontSize: "clamp(1.45rem, 3vw, 2rem)" }}>
              Practise Engagement und Ehrenamt with the Goethe speaking coach
            </h1>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
              Keep the speaking level on <strong>C1</strong>. Choose an exam prompt, answer by text or voice,
              and use the feedback to improve structure, vocabulary, grammar and pronunciation readiness.
            </p>
          </div>

          <div
            data-c1-day11-speaking-ui="embedded"
            style={{
              border: "1px solid #bfdbfe",
              borderRadius: 16,
              overflow: "hidden",
              background: "#ffffff",
            }}
          >
            <SpeakingPage mode="exam" />
          </div>
        </div>
      </section>

      <C1Day11EngagementUndEhrenamtWorkbookPage />
    </div>
  );
}
