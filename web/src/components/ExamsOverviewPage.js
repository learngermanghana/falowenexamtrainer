import React from "react";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";

const ExamsOverviewPage = () => {
  const { level } = useExam();

  return (
    <section style={{ ...styles.card, display: "grid", gap: 8 }}>
      <h2 style={{ margin: 0 }}>Prepare for your {level} exam</h2>
      <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.55 }}>
        Use this page to prepare for your exam. Explore the navigation above to practise each section, open mock exams, and review your Exam File.
      </p>
    </section>
  );
};

export default ExamsOverviewPage;
