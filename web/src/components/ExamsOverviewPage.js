import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";

const LAST_SECTION_STORAGE_KEY = "falowen_exam_last_section";
const ExamsOverviewPage = () => {
  const navigate = useNavigate();
  const { level } = useExam();
  const [lastSection, setLastSection] = useState("speaking");

  useEffect(() => {
    try {
      const storedSection = localStorage.getItem(LAST_SECTION_STORAGE_KEY);
      if (storedSection) {
        setLastSection(storedSection);
      }
    } catch (error) {
      console.warn("Failed to load exam overview storage", error);
    }
  }, []);

  const resumeSection = lastSection || "speaking";

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <p style={{ ...styles.helperText, margin: 0 }}>Exams Room overview</p>
        <h2 style={{ ...styles.sectionTitle, margin: "6px 0" }}>Start here for level {level}</h2>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Get a quick snapshot of your activity, then jump into the tab you need most today.
        </p>
        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => navigate(`/exams/${resumeSection}`)}
          >
            Resume last session
          </button>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => navigate("/exams/speaking")}
          >
            Start speaking warm-up
          </button>
        </div>
      </section>

    </div>
  );
};

export default ExamsOverviewPage;
