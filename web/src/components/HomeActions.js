import React from "react";
import { styles } from "../styles";

const HomeActions = ({ onSelect }) => {
  return (
    <div style={{ ...styles.card, display: "grid", gap: 12 }}>
      <h2 style={styles.sectionTitle}>Was möchtest du trainieren?</h2>
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
          Daily Trainer
        </button>
        <button
          style={{ ...styles.secondaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("exam")}
        >
          Exam Simulation
        </button>
      </div>
    </div>
  );
};

export default HomeActions;
