import React from "react";
import { styles } from "../styles";
import SpeakingPage from "./SpeakingPage";

const A1ExamSpeakingPracticePanel = () => (
  <section style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #c7d2fe", background: "#f8fbff" }}>
    <div style={{ display: "grid", gap: 6 }}>
      <p style={{ ...styles.helperText, margin: 0, color: "#4f46e5", fontWeight: 800 }}>A1 speaking exam practice</p>
      <h2 style={{ margin: 0 }}>Practise with the Falowen speaking exam room</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Use this for A1 exam-style speaking practice. This replaces the old confidence timer here because students need the real exam prompt flow, not custom chat.
      </p>
    </div>

    <div style={{ border: "1px solid #dbeafe", borderRadius: 12, padding: 12, background: "#eff6ff", color: "#1e3a8a", lineHeight: 1.7 }}>
      <strong>How to practise:</strong>
      <ol style={{ margin: "8px 0 0", paddingLeft: 20 }}>
        <li>Keep the level on <strong>A1</strong>.</li>
        <li>Choose <strong>Teil 2</strong> to ask and answer questions.</li>
        <li>Choose <strong>Teil 3</strong> to make requests and react politely.</li>
        <li>Record or type your answer and read the feedback.</li>
      </ol>
    </div>

    <div className="a1-exam-speaking-only" style={{ border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
      <style>{`
        .a1-exam-speaking-only > div {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .a1-exam-speaking-only [role="tablist"] [role="tab"]:not(:first-child) {
          display: none !important;
        }
      `}</style>
      <SpeakingPage mode="exam" />
    </div>
  </section>
);

export default A1ExamSpeakingPracticePanel;
