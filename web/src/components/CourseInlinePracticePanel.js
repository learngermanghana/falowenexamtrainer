import React, { useState } from "react";
import { EmbeddedSpeechPracticePanel, EmbeddedWritingPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import { styles } from "../styles";

const panelStyle = {
  border: "1px solid #bfdbfe",
  borderRadius: 14,
  background: "#eff6ff",
  overflow: "hidden",
  display: "grid",
  gap: 0,
};

const headerStyle = {
  padding: 14,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const bodyStyle = {
  padding: 14,
  borderTop: "1px solid #bfdbfe",
  background: "#fff",
  display: "grid",
  gap: 12,
};

const CourseInlinePracticePanel = ({
  type = "speaking",
  title,
  description,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const isWriting = type === "writing";
  const fallbackTitle = isWriting ? "Practice writing on this page" : "Practice speaking on this page";
  const fallbackDescription = isWriting
    ? "Use the writing coach here without leaving the workbook page."
    : "Use the speaking coach here without leaving the workbook page.";

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <div style={{ display: "grid", gap: 4 }}>
          <strong>{title || fallbackTitle}</strong>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{description || fallbackDescription}</p>
        </div>
        <button type="button" style={styles.secondaryButton} onClick={() => setOpen((value) => !value)}>
          {open ? "Hide practice" : "Practice here"}
        </button>
      </div>

      {open ? (
        <div style={bodyStyle}>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Keep this workbook open, practise with AI, then come back to tick the prepared box.
          </p>
          {isWriting ? <EmbeddedWritingPracticePanel /> : <EmbeddedSpeechPracticePanel />}
        </div>
      ) : null}
    </div>
  );
};

export default CourseInlinePracticePanel;
