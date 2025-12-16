import React from "react";
import { styles } from "../styles";

const HomeActions = ({ onSelect }) => {
  return (
    <div style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={styles.sectionTitle}>Was möchtest du heute machen?</h2>
        <span style={styles.levelPill}>Schnellstart</span>
      </div>
      <p style={styles.helperText}>
        Wähle eine der beiden Hauptaufgaben für den Tag: arbeite im Kursbuch oder mache eine
        Prüfungssimulation.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        <button
          style={{ ...styles.primaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("course")}
        >
          Kursbuch öffnen
        </button>
        <button
          style={{ ...styles.secondaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("exam")}
        >
          Zur Prüfungssimulation
        </button>
      </div>
    </div>
  );
};

export default HomeActions;
