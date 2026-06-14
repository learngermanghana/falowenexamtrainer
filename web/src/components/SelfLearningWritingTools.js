import React from "react";
import { styles } from "../styles";

const toolCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 14,
  background: "#fff",
  display: "grid",
  gap: 8,
};

const writingTools = [
  {
    title: "Analyse my text",
    description: "For guided B2/C1 writing before Day 20: combine the five sections and receive feedback based on your current level.",
  },
  {
    title: "Mark my letter",
    description: "From Day 20, paste the complete essay or letter in the writing panel and receive a score, corrections, feedback and an improved version.",
  },
  {
    title: "Ref / Redemittel",
    description: "Save useful model phrases and reference texts for later revision. Use Study Buddy when you need explanations, questions or idea support.",
  },
];

const SelfLearningWritingTools = ({ writingType, structure = [], usefulLines = [], showGuides = true }) => (
  <div style={{ display: "grid", gap: 12 }}>
    <div
      style={{
        padding: 12,
        borderRadius: 12,
        border: "1px solid #bfdbfe",
        background: "#eff6ff",
        lineHeight: 1.7,
      }}
    >
      <strong>Use the writing task above.</strong> B2 and C1 students build five focused sections during Days 1–19. From Day 20, students write and mark one complete task. Use Study Buddy for questions or idea support; the separate Ideas Generator is no longer part of the writing workflow.
    </div>

    <div style={toolCardStyle}>
      <strong>Writing type for this topic</strong>
      <span style={{ ...styles.badge, justifySelf: "start" }}>{writingType}</span>
      <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>
        Follow the writing phase shown in the lesson, then analyse or mark your work at the correct stage.
      </p>
    </div>

    {showGuides && structure.length ? (
      <div style={toolCardStyle}>
        <strong>Structure guide</strong>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          {structure.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    ) : null}

    {showGuides && usefulLines.length ? (
      <div style={toolCardStyle}>
        <strong>Redemittel preview</strong>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          {usefulLines.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    ) : null}

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
      {writingTools.map((tool) => (
        <div key={tool.title} style={toolCardStyle}>
          <strong>{tool.title}</strong>
          <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>{tool.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default SelfLearningWritingTools;
