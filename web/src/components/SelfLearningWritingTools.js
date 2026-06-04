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
    title: "Mark my letter",
    description: "Paste your finished draft in the writing panel below and get a score, corrections, feedback and a better version.",
  },
  {
    title: "Ref / Redemittel",
    description: "Use the writing panel below to save useful phrases, structure lines and reference notes before you write.",
  },
  {
    title: "Ideas generator",
    description: "Use the writing panel below to build ideas, examples and a simple writing plan before drafting.",
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
      <strong>Use the writing task above.</strong> First understand the topic, then use the writing panel below to plan,
      write, mark and improve your answer. Full extra exam prompts are still in the Exam Room.
    </div>

    <div style={toolCardStyle}>
      <strong>Writing type for this topic</strong>
      <span style={{ ...styles.badge, justifySelf: "start" }}>{writingType}</span>
      <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>
        Use the type as a guide, then write your own answer and mark it with AI inside this lesson.
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
