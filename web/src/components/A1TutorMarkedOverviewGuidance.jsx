import React from "react";
import { styles } from "../styles";

export const A1_TUTOR_MARKED_OVERVIEW_GUIDANCE =
  "First open Grammar. Next complete Teil 1 and every other required Teil in order. Submit the assignment once, only after all required Teile are finished.";

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
        First open <strong>Grammar</strong>. Next complete <strong>Teil 1</strong> and every other required <strong>Teil</strong> in order. Submit the assignment <strong>once</strong>, only after all required Teile are finished.
      </p>
    </div>
  );
}
