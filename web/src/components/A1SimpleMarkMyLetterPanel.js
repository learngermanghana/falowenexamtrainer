import React from "react";
import { styles } from "../styles";
import WritingPage from "./WritingPage";

const A1SimpleMarkMyLetterPanel = ({ title = "Practice only · Mark my letter" }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #fed7aa", background: "#fffaf5" }}>
    <div style={{ display: "grid", gap: 6 }}>
      <p style={{ ...styles.helperText, margin: 0, color: "#c2410c", fontWeight: 800 }}>A1 writing practice</p>
      <h2 style={{ margin: 0 }}>{title}</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        This box is only for practice. Paste your A1 letter, get AI feedback, improve your text, then copy the clean final answer into the normal Submission tab with the other required parts.
      </p>
    </div>

    <div style={{ border: "1px solid #fdba74", borderRadius: 12, padding: 12, background: "#fffbeb", color: "#92400e", lineHeight: 1.7 }}>
      <strong>Important:</strong> This does not submit your assignment. Use it to check your letter before final submission.
    </div>

    <div className="a1-mark-letter-only" style={{ border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
      <style>{`
        .a1-mark-letter-only .tab-list button:not(:first-child),
        .a1-mark-letter-only [role="tablist"] button:not(:first-child) {
          display: none !important;
        }
      `}</style>
      <WritingPage mode="course" initialTab="mark" />
    </div>
  </section>
);

export default A1SimpleMarkMyLetterPanel;
