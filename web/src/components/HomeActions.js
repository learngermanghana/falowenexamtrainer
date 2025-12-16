import React from "react";
import { styles } from "../styles";

const HomeActions = ({ onSelect }) => {
  return (
    <div style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={styles.sectionTitle}>Home / Plan</h2>
        <span style={styles.levelPill}>A1–B2</span>
      </div>
      <p style={styles.helperText}>
        Choose your level, start the Level Check, and stay consistent with daily sessions and streaks.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        <button
          style={{ ...styles.primaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("level-check")}
        >
          Start Level Check
        </button>
        <button
          style={{ ...styles.secondaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("daily")}
        >
          Open Daily Plan
        </button>
        <button
          style={{ ...styles.secondaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("exam")}
        >
          Next session (simulation)
        </button>
      </div>
      <ul style={styles.checklist}>
        <li>Automatic daily tasks based on A1–B2 level.</li>
        <li>"Next Session" jumps straight to the right speaking or writing exercise.</li>
        <li>Streak/progress display keeps you motivated and links to the progress tab.</li>
      </ul>
    </div>
  );
};

export default HomeActions;
