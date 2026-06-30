import React from "react";
import { styles } from "../styles";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";

const workflowStepStyle = {
  border: "1px solid #fed7aa",
  borderRadius: 12,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 4,
};

const A1SimpleMarkMyLetterPanel = ({ title = "Check your letters before submission" }) => (
  <section
    style={{
      ...styles.card,
      display: "grid",
      gap: 14,
      border: "1px solid #fed7aa",
      background: "#fffaf5",
    }}
  >
    <div style={{ display: "grid", gap: 6 }}>
      <p style={{ ...styles.helperText, margin: 0, color: "#c2410c", fontWeight: 800 }}>
        A1 self-practice tool
      </p>
      <h2 style={{ margin: 0 }}>{title}</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Use <strong>Mark My Letter</strong> to check each completed A1 letter, understand your mistakes,
        and improve your final version before sending the assignment to your tutor.
      </p>
    </div>

    <div
      style={{
        display: "grid",
        gap: 10,
        gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
      }}
    >
      <div style={workflowStepStyle}>
        <strong>1. Practise</strong>
        <span>Paste one completed letter into Mark My Letter.</span>
      </div>
      <div style={workflowStepStyle}>
        <strong>2. Improve</strong>
        <span>Read the feedback, correct the letter, and check it again if needed.</span>
      </div>
      <div style={workflowStepStyle}>
        <strong>3. Submit</strong>
        <span>Copy your final letters into the normal assignment submission area.</span>
      </div>
    </div>

    <div
      style={{
        border: "1px solid #fdba74",
        borderRadius: 12,
        padding: 12,
        background: "#fffbeb",
        color: "#92400e",
        lineHeight: 1.7,
      }}
    >
      <strong>Important:</strong> Mark My Letter is for self-practice only. It does not submit or send
      your assignment to your tutor.
    </div>

    <CourseInlinePracticePanel
      type="writing"
      title="Self-practice · Mark My Letter"
      description="Paste one completed A1 letter here. Falowen AI will mark it, explain the corrections, and help you improve it. When you are satisfied, submit the final version through the normal assignment area."
      writingContext={{
        level: "A1",
        courseLevel: "A1",
        day: 12,
        lessonId: "A1-day-12.3",
        workbookId: "A1-day-12.3-letter-writing",
        writingTaskId: "A1-day-12.3-letter-writing-practice",
        taskTitle: "A1 Day 12.3 letter self-practice",
      }}
    />

    <div
      style={{
        border: "1px solid #bbf7d0",
        borderRadius: 12,
        padding: 12,
        background: "#f0fdf4",
        color: "#166534",
        lineHeight: 1.7,
      }}
    >
      <strong>After checking both letters:</strong> continue to the submission section below and send
      your complete work for tutor marking.
    </div>
  </section>
);

export default A1SimpleMarkMyLetterPanel;
