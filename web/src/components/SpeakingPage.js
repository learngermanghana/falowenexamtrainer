import React from "react";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";

const EXAMS_PRACTICE_LINK =
  "https://script.google.com/macros/s/AKfycbyJ5lTeXUgaGw-rejDuh_2ex7El_28JgKLurOOsO1c8LWfVE-Em2-vuWuMn1hC5-_IN/exec";
const CAMPUS_PRACTICE_LINK =
  "https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec";

const SpeakingPage = ({ mode = "exam" }) => {
  const { level: examLevel } = useExam();
  const practiceLink = mode === "campus" ? CAMPUS_PRACTICE_LINK : EXAMS_PRACTICE_LINK;

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
          <a href={practiceLink} target="_blank" rel="noreferrer" style={styles.primaryButton}>
            Open speaking exam practice link
          </a>
          <p style={{ ...styles.helperText, marginTop: 12, marginBottom: 0, wordBreak: "break-all" }}>{practiceLink}</p>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPage;
