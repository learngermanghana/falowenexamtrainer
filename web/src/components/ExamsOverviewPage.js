import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";
import { getMockExamsForLevel } from "../data/mockExamCatalog";
import { getLatestReadingPracticeResult } from "../services/readingPracticeHistory";

const PRACTICE_SECTIONS = [
  {
    key: "lesen",
    title: "Lesen",
    description: "Interactive A1/A2 reading sets with exam-style texts, timing and answer checking.",
    status: "Ready",
  },
  {
    key: "writing",
    title: "Schreiben",
    description: "Writing practice with corrections and tutor-ready submissions.",
    status: "Ready",
  },
  {
    key: "speaking",
    title: "Sprechen",
    description: "Use the existing speaking app for timed responses and oral exam practice.",
    status: "Ready",
  },
  {
    key: "horen",
    title: "Hören",
    description: "The reusable exam-format listening bank will be added next.",
    status: "Coming later",
    disabled: true,
  },
];

const ExamsOverviewPage = () => {
  const navigate = useNavigate();
  const { level } = useExam();
  const mocks = getMockExamsForLevel(level);
  const primaryMock = mocks[0] || null;
  const latestReading = getLatestReadingPracticeResult(level);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section
        style={{
          ...styles.card,
          background: "linear-gradient(135deg, #1f2937, #374151)",
          color: "#f8fafc",
          border: "none",
          padding: 24,
        }}
      >
        <p style={{ margin: 0, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Falowen Exams Room
        </p>
        <h2 style={{ ...styles.sectionTitle, margin: "7px 0 8px", color: "#ffffff" }}>
          Prepare for your {level} exam
        </h2>
        <p style={{ margin: 0, maxWidth: 760, lineHeight: 1.55, color: "#e5e7eb" }}>
          Use full mock exams for realistic exam practice, or work on one section at a time when you want focused training.
        </p>
        <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" style={styles.primaryButton} onClick={() => navigate("/exams/mocks")}>
            Open mock exams
          </button>
          <button type="button" style={styles.secondaryButton} onClick={() => navigate("/exams/file")}>
            My Exam File
          </button>
        </div>
      </section>

      <section style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div>
            <p style={{ ...styles.helperText, margin: 0 }}>Full exam practice</p>
            <h3 style={{ ...styles.sectionTitle, margin: "5px 0 6px" }}>Mock Exams</h3>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Complete Lesen, Hören, Schreiben and Sprechen as one exam journey.
            </p>
          </div>
          <button type="button" style={styles.secondaryButton} onClick={() => navigate("/exams/mocks")}>
            View all
          </button>
        </div>

        {primaryMock ? (
          <article
            style={{
              marginTop: 14,
              border: "1px solid #d1d5db",
              borderRadius: 12,
              padding: 16,
              background: "#f9fafb",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <div>
                <strong>{primaryMock.shortTitle || primaryMock.title}</strong>
                <p style={{ ...styles.helperText, margin: "5px 0 0" }}>
                  {primaryMock.durationLabel} · {(primaryMock.sections || []).join(" · ")}
                </p>
              </div>
              <button type="button" style={styles.primaryButton} onClick={() => navigate(primaryMock.route)}>
                {primaryMock.status === "preview" ? "Open preview" : "Start mock"}
              </button>
            </div>
          </article>
        ) : (
          <p style={{ ...styles.helperText, marginBottom: 0 }}>
            No full {level} mock has been published yet. Use section practice below.
          </p>
        )}
      </section>

      <section style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, marginBottom: 6 }}>Practice by Section</h3>
        <p style={{ ...styles.helperText, marginTop: 0 }}>
          Train the skill you want without starting a complete mock.
        </p>
        <div style={styles.gridTwo}>
          {PRACTICE_SECTIONS.map((section) => (
            <article
              key={section.key}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 14,
                background: "#f9fafb",
                display: "grid",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                <strong>{section.title}</strong>
                <span style={styles.badge}>
                  {section.key === "lesen" && latestReading
                    ? `${latestReading.percent}% · last attempt`
                    : section.status}
                </span>
              </div>
              <p style={{ ...styles.helperText, margin: 0 }}>
                {section.description}
                {section.key === "lesen" && latestReading
                  ? ` Latest: ${latestReading.score}/${latestReading.total} on Practice Set ${latestReading.setId.endsWith("-01") ? "1" : latestReading.setId}.`
                  : ""}
              </p>
              <div>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  disabled={section.disabled}
                  onClick={() => {
                    if (!section.disabled) navigate(`/exams/${section.key}`);
                  }}
                >
                  {section.disabled ? "Coming later" : `Practice ${section.title}`}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, marginBottom: 6 }}>Support & history</h3>
        <p style={{ ...styles.helperText, marginTop: 0 }}>
          Review saved exam work, practise vocabulary, or open official preparation resources.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" style={styles.secondaryButton} onClick={() => navigate("/exams/file")}>
            My Exam File
          </button>
          <button type="button" style={styles.secondaryButton} onClick={() => navigate("/exams/vocab")}>
            Vocab
          </button>
          <button type="button" style={styles.secondaryButton} onClick={() => navigate("/exams/resources")}>
            Resources
          </button>
        </div>
      </section>
    </div>
  );
};

export default ExamsOverviewPage;
