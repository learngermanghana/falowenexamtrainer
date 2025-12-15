import React from "react";
import { styles } from "../styles";

const PROGRESS_ITEMS = [
  {
    title: "Skill-Breakdown",
    description: "Getrennte Scores für Sprechen, Schreiben und Vokabeln plus Trendpfeile.",
  },
  {
    title: "Schwachstellen-Heatmap",
    description: "Fehlertrends nach Kategorien (Kasus, Verbposition, Konnektoren, Aussprache).",
  },
  {
    title: "Action-Liste",
    description: "Nächste 3 Fokuspunkte automatisch generiert, inkl. passenden Drills oder Aufgaben.",
  },
  {
    title: "Verlauf & Sharing",
    description: "Streak, Gesamtzeit und Export/Sharing-Option für Lehrkräfte oder Lernpartner:innen.",
  },
];

const ProgressPage = () => {
  return (
    <div style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h2 style={styles.sectionTitle}>Fortschritt</h2>
          <p style={styles.helperText}>
            Klarer Überblick, damit Lernende dranbleiben und Coaching gezielt ansetzen kann.
          </p>
        </div>
        <span style={styles.badge}>Motivation + Fokus</span>
      </div>
      <div style={styles.gridTwo}>
        {PROGRESS_ITEMS.map((item) => (
          <div key={item.title} style={{ ...styles.card, marginBottom: 0 }}>
            <h3 style={{ margin: "0 0 6px 0" }}>{item.title}</h3>
            <p style={{ ...styles.helperText, margin: 0 }}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressPage;
