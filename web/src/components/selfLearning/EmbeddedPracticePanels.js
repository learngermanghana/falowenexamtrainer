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
        .embedded-writing-compact > section:first-of-type > h2,
        .embedded-writing-compact > section:first-of-type > p,
        .embedded-writing-compact > section:first-of-type > div:first-of-type,
        .embedded-writing-compact > section:first-of-type > div:nth-of-type(3) {
          display: none;
        }

        .embedded-writing-compact > section:first-of-type {
          padding-bottom: 12px;
        }

        .embedded-writing-compact > section:first-of-type > div:nth-of-type(2) {
          margin-top: 0;
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

const EmbeddedPracticePanels = {
  EmbeddedSpeechPracticePanel,
  EmbeddedWritingPracticePanel,
};

export default EmbeddedPracticePanels;
