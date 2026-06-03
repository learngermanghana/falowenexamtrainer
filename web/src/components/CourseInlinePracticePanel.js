import React, { useState } from "react";
import { styles } from "../styles";
import SpeechTrainerPage from "./SpeechTrainerPage";
import WritingPage from "./WritingPage";

const practiceConfig = {
  speaking: {
    defaultTitle: "Practice speaking on this page",
    defaultDescription: "Open the speaking coach here after reading the task. No new tab is needed.",
    label: "Speaking coach",
    render: () => <SpeechTrainerPage />,
  },
  writing: {
    defaultTitle: "Practice writing on this page",
    defaultDescription: "Write and mark your answer here after studying the task. No new tab is needed.",
    label: "Writing practice",
    render: () => <WritingPage />,
  },
};

const CourseInlinePracticePanel = ({ type, title, description }) => {
  const [isOpen, setIsOpen] = useState(false);
  const config = practiceConfig[type] || practiceConfig.speaking;
  const panelId = `course-inline-practice-${type || "speaking"}`;

  return (
    <div
      style={{
        ...styles.card,
        margin: 0,
        display: "grid",
        gap: 12,
        background: "#f8fafc",
        border: "1px solid #dbeafe",
      }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <strong>{title || config.defaultTitle}</strong>
        <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>{description || config.defaultDescription}</p>
      </div>
      <button
        type="button"
        style={{ ...styles.primaryButton, width: "fit-content" }}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        {isOpen ? "Close practice" : "Practice here"}
      </button>
      {isOpen ? (
        <div
          id={panelId}
          style={{
            display: "grid",
            gap: 12,
            borderTop: "1px solid #dbeafe",
            paddingTop: 12,
          }}
        >
          <span style={styles.helperText}>{config.label} loaded inside this workbook page.</span>
          {config.render()}
        </div>
      ) : null}
    </div>
  );
};

export default CourseInlinePracticePanel;
