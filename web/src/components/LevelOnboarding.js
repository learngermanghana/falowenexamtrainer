import React from "react";
import { styles } from "../styles";
import { ALLOWED_LEVELS, useExam } from "../context/ExamContext";

const LEVEL_DETAILS = {
  A1: {
    title: "A1 · Grundlagen",
    focus: "Vorstellung, einfache Fragen, kurze Bitten.",
  },
  A2: {
    title: "A2 · Alltag festigen",
    focus: "Fragen/Antworten im Alltag, kleine Planungen, E-Mails.",
  },
  B1: {
    title: "B1 · Selbstständig handeln",
    focus: "Kurzvorträge, Diskussionen mit Begründungen, strukturierte Briefe.",
  },
  B2: {
    title: "B2 · Sicher argumentieren",
    focus: "Meinungen stützen, Daten/Beispiele nutzen, anspruchsvoll schreiben.",
  },
};

const LevelOnboarding = () => {
  const { level, setLevel, levelConfirmed } = useExam();

  if (levelConfirmed) {
    return null;
  }

  return (
    <div style={{ ...styles.card, borderColor: "#4f46e5", background: "#f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div>
          <p style={{ ...styles.badge, background: "#e0e7ff", color: "#3730a3" }}>Onboarding</p>
          <h2 style={{ ...styles.sectionTitle, marginTop: 0 }}>Wähle dein Niveau</h2>
          <p style={{ ...styles.helperText, marginTop: 4 }}>
            Wir laden sofort die passenden Sprechen- und Schreiben-Fragen aus dem Level-Sheet. Du kannst das Niveau
            später jederzeit im Formular "Einstellungen" ändern.
          </p>
        </div>
        <span style={{ ...styles.levelPill, background: "#eef2ff", color: "#3730a3" }}>Aktuell: {level}</span>
      </div>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginTop: 8 }}>
        {ALLOWED_LEVELS.map((option) => {
          const detail = LEVEL_DETAILS[option];
          return (
            <button
              key={option}
              style={{
                ...styles.uploadCard,
                textAlign: "left",
                borderColor: option === level ? "#4f46e5" : "#e5e7eb",
                background: option === level ? "#eef2ff" : "#ffffff",
                cursor: "pointer",
              }}
              onClick={() => setLevel(option)}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{detail?.title || option}</div>
              <div style={{ ...styles.helperText, margin: 0 }}>{detail?.focus || "Aufgaben und Fragen für dieses Niveau."}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LevelOnboarding;
