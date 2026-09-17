import React from "react";
import { styles } from "../styles";

export const A1_TUTOR_MARKED_OVERVIEW_GUIDANCE =
  "First open the Grammar tab and read the grammar notes carefully. Then complete every required Teil in order. For multiple-choice and true/false questions, tap the answer directly beside the question; typed tasks use the answer field shown with the task. Your work saves as a draft. In Review & Submit, check and edit the final answer before pressing Submit Assignment.";

export default function A1TutorMarkedOverviewGuidance() {
  return (
    <div
      data-a1-tutor-marked-grammar-guidance="true"
      style={{
        ...styles.card,
        margin: 0,
        border: "1px solid #bfdbfe",
        background: "#eff6ff",
        display: "grid",
        gap: 8,
      }}
    >
      <strong>How to complete this assignment</strong>
      <p style={{ margin: 0, lineHeight: 1.7 }}>{A1_TUTOR_MARKED_OVERVIEW_GUIDANCE}</p>
    </div>
  );
}
