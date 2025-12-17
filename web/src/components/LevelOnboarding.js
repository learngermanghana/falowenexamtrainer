import React from "react";
import { styles } from "../styles";
import { ALLOWED_LEVELS, useExam } from "../context/ExamContext";
import { classCatalog } from "../data/classCatalog";
import { useAccess } from "../context/AccessContext";

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
  const { state, setPreferredClass, setExamOnlyFocus } = useAccess();

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

      <div style={{ marginTop: 10 }}>
        <h3 style={{ margin: "0 0 6px 0" }}>Choose a live class or exam-only focus</h3>
        <p style={{ ...styles.helperText, marginTop: 4 }}>
          Courses are tutor-supported with live help. If you only want automated exam prep, pick the exam focus instead.
        </p>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {Object.entries(classCatalog).map(([className, meta]) => (
            <button
              key={className}
              style={{
                ...styles.uploadCard,
                textAlign: "left",
                cursor: "pointer",
                borderColor: state?.preferredClass === className ? "#4f46e5" : "#e5e7eb",
                background: state?.preferredClass === className ? "#eef2ff" : "#ffffff",
              }}
              onClick={() => setPreferredClass(className)}
            >
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{className}</div>
              <div style={{ ...styles.helperText, margin: "0 0 6px 0" }}>
                {meta.startDate} – {meta.endDate}
              </div>
              <div style={{ ...styles.helperText, margin: 0 }}>
                {meta.schedule.map((slot) => `${slot.day} ${slot.startTime}-${slot.endTime}`).join(" · ")}
              </div>
            </button>
          ))}
          <button
            style={{
              ...styles.uploadCard,
              textAlign: "left",
              cursor: "pointer",
              borderColor: state?.focus === "exam-only" ? "#4f46e5" : "#e5e7eb",
              background: state?.focus === "exam-only" ? "#eef2ff" : "#ffffff",
            }}
            onClick={setExamOnlyFocus}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Exam prep only</div>
            <div style={{ ...styles.helperText, margin: 0 }}>
              Skip live classes and focus on the automated speaking and writing exams.
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelOnboarding;
