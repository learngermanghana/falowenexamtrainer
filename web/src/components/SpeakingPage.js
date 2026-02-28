import React from "react";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";

const PRACTICE_LINK =
  "https://www.falowen.app/campus/speech";

const SpeakingPage = () => {
  const { level: examLevel } = useExam();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Speaking Exams{examLevel ? ` – Level ${examLevel}` : ""}</h1>
        <p style={styles.subtitle}>
          We moved speaking exam practice to a dedicated page. Please open the link below to practice your exams.
        </p>

        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            background: "#F9FAFB",
          }}
        >
          <a href={PRACTICE_LINK} target="_blank" rel="noreferrer" style={styles.primaryButton}>
            Open speaking exam practice link
          </a>
          <p style={{ ...styles.helperText, marginTop: 12, marginBottom: 0, wordBreak: "break-all" }}>{PRACTICE_LINK}</p>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPage;
