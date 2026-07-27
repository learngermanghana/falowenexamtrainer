import React from "react";
import { styles } from "../styles";

export const A1_TUTOR_MARKED_OVERVIEW_GUIDANCE =
  "Start here in Overview. Before you begin the Teil sections, open the Grammar tab and read the grammar notes carefully. " +
  "Use the rules and examples from Grammar when you complete the assignment, then review your answers before you submit.";

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
        gap: 6,
      }}
    >
      <strong>How to complete this assignment</strong>
      <p style={{ margin: 0, lineHeight: 1.6 }}>{A1_TUTOR_MARKED_OVERVIEW_GUIDANCE}</p>
    </div>
  );
}
