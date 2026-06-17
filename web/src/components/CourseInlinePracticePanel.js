import React, { useState } from "react";
import { styles } from "../styles";
import SpeakingPage from "./SpeakingPage";
import WritingPage from "./WritingPage";

const practiceConfig = {
  speaking: {
    defaultTitle: "Practice Teil 1 speaking here",
    defaultDescription:
      "Teil 1 is for practice and class discussion only. You do not submit it as an assignment. Use this AI speaking coach to prepare your answer before class.",
    label: "Custom speaking chat",
    closedButtonLabel: "Open custom speaking chat",
    render: () => <SpeakingPage mode="course" />,
  },
  writing: {
    defaultTitle: "Mark my letter",
    defaultDescription:
      "Paste your completed text here. Falowen AI will mark it, show your score, explain the corrections and help you improve the final version. Submit the finished work through your normal assignment area when required.",
    label: "Mark my letter",
    closedButtonLabel: "Open Mark my letter",
    render: () => (
      <WritingPage
        mode="course"
        initialTab="mark"
        enabledTabs={["mark"]}
        hideTabList
        markLabel="Mark My Letter"
        submitLabel="Mark My Letter"
      />
    ),
  },
};

const CourseInlinePracticePanel = ({
  type,
  title,
  description,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
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
        <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>
          {description || config.defaultDescription}
        </p>
      </div>
      <button
        type="button"
        style={{ ...styles.primaryButton, width: "fit-content" }}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        {isOpen ? "Hide practice" : config.closedButtonLabel}
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
          <span style={styles.helperText}>
            {config.label} loaded inside this workbook page.
          </span>
          {config.render()}
        </div>
      ) : null}
    </div>
  );
};

export default CourseInlinePracticePanel;
