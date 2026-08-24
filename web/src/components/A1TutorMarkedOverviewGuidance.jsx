import React from "react";
import { styles } from "../styles";

export const A1_TUTOR_MARKED_OVERVIEW_GUIDANCE =
  "First open the Grammar tab and read the grammar notes carefully. Use the rules and examples from Grammar to complete the assignment. Next complete Teil 1 and the other Teil sections in order. Use Submit only after you finish the questions.";

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
