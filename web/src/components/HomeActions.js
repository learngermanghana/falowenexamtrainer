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
        Wähle dein Niveau, starte den Level Check und bleibe mit Daily Sessions und Streaks dran.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        <button
          style={{ ...styles.primaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("level-check")}
        >
          Level Check starten
        </button>
        <button
          style={{ ...styles.secondaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("daily")}
        >
          Daily Plan öffnen
        </button>
        <button
          style={{ ...styles.secondaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("exam")}
        >
          Nächste Session (Simulation)
        </button>
      </div>
      <ul style={styles.checklist}>
        <li>Automatische Tagesaufgaben basierend auf A1–B2 Level.</li>
        <li>"Next Session" führt direkt zur passenden Sprechen- oder Schreiben-Übung.</li>
        <li>Streak/Progress-Anzeige motiviert und verlinkt zum Fortschritt-Tab.</li>
      </ul>
    </div>
  );
};

export default HomeActions;
