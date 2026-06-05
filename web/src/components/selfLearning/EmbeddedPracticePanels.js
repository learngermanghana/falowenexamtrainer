import React from "react";
import SpeakingPage from "../SpeakingPage";
import WritingPage from "../WritingPage";

export function EmbeddedSpeechPracticePanel() {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
      <SpeakingPage mode="course" />
    </div>
  );
}

export function EmbeddedWritingPracticePanel() {
  return (
    <div className="embedded-writing-compact" style={{ border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
      <style>{`
        .embedded-writing-compact > section:first-of-type {
          display: none;
        }

        .embedded-writing-compact > section:nth-of-type(2) > p:first-of-type,
        .embedded-writing-compact > section:nth-of-type(2) > div:first-of-type {
          display: none;
        }
      `}</style>
      <WritingPage mode="course" initialTab="mark" />
    </div>
  );
}

export function EmbeddedPracticeNote({ children }) {
  return (
    <div style={{ padding: 12, borderRadius: 12, border: "1px solid #bbf7d0", background: "#f0fdf4", lineHeight: 1.7 }}>
      <strong>Practise inside this lesson.</strong> {children}
    </div>
  );
}

const EmbeddedPracticePanels = {
  EmbeddedSpeechPracticePanel,
  EmbeddedWritingPracticePanel,
  EmbeddedPracticeNote,
};

export default EmbeddedPracticePanels;
