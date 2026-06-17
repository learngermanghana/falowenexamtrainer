import React from "react";
import SpeakingPracticeTimerCard from "../SpeakingPracticeTimerCard";
import SpeakingMindMap from "./SpeakingMindMap";

export default function SpeakingPreparationFlow({
  config,
  children,
  showTimer = false,
  note,
}) {
  return (
    <section
      data-speaking-preparation-flow
      style={{ display: "grid", gap: 16 }}
    >
      <SpeakingMindMap config={config} />
      {showTimer ? <SpeakingPracticeTimerCard /> : null}
      {note ? (
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
          {note}
        </p>
      ) : null}
      {children}
    </section>
  );
}
