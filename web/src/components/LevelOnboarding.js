import React, { useEffect } from "react";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";

const LevelOnboarding = () => {
  const { level, levelConfirmed, setLevelConfirmed } = useExam();

  useEffect(() => {
    if (!levelConfirmed) {
      setLevelConfirmed(true);
    }
  }, [levelConfirmed, setLevelConfirmed]);

  if (levelConfirmed) {
    return null;
  }

  return (
    <div style={{ ...styles.card, borderColor: "#4f46e5", background: "#f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div>
          <p style={{ ...styles.badge, background: "#e0e7ff", color: "#3730a3" }}>Level synced</p>
          <h2 style={{ ...styles.sectionTitle, marginTop: 0 }}>Dein Niveau ist festgelegt</h2>
          <p style={{ ...styles.helperText, marginTop: 4 }}>
            Wir wählen dein Niveau automatisch anhand deines Kursprofils. Wenn etwas nicht stimmt, kontaktiere bitte
            dein Support-Team.
          </p>
        </div>
        <span style={{ ...styles.levelPill, background: "#eef2ff", color: "#3730a3" }}>Aktuell: {level}</span>
      </div>
    </div>
  );
};

export default LevelOnboarding;
