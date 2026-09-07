import React from "react";
import { styles } from "../styles";

export const A1_TUTOR_MARKED_OVERVIEW_GUIDANCE =
  "First open Grammar. Next complete Teil 1 and the other Teil sections in order. Use Submit only after you finish the questions.";

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
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        First open <strong>Grammar</strong>. Next complete <strong>Teil 1</strong> and the other <strong>Teil</strong> sections in order. Use <strong>Submit</strong> only after you finish the questions.
      </p>
    </div>
  );
}
