import React, { useMemo } from "react";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";

const LEVEL_BLURBS = {
  A1: "Kurze Vorstellungsrunden, einfache Fragen und Bitten.",
  A2: "Alltagssituationen sicher üben – Fragen, kurze Planungen, E-Mails.",
  B1: "Kurzvorträge, Meinung sagen und Schreiben mit klarer Struktur.",
  B2: "Argumentieren, diskutieren und längere Schreiben mit Belegen.",
};

const HomeActions = ({ onSelect }) => {
  const { level, levelConfirmed } = useExam();
  const levelBlurb = useMemo(
    () => LEVEL_BLURBS[level] || "Wähle zuerst dein Niveau, damit wir die richtigen Aufgaben laden.",
    [level]
  );

  return (
    <div style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={styles.sectionTitle}>Home / Plan</h2>
        <span style={styles.levelPill}>{levelConfirmed ? `Level ${level}` : "Level wählen"}</span>
      </div>
      <p style={styles.helperText}>{levelBlurb}</p>
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
