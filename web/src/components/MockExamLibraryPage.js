import React from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../context/ExamContext";
import { getMockExamsForLevel } from "../data/mockExamCatalog";
import { styles } from "../styles";

const statusLabel = (status) => {
  if (status === "preview") return "Practice";
  if (status === "ready") return "Ready";
  return "Planned";
};

export default function MockExamLibraryPage() {
  const navigate = useNavigate();
  const { level } = useExam();
  const mocks = getMockExamsForLevel(level);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <p style={{ ...styles.helperText, margin: 0 }}>Full exam practice</p>
        <h2 style={{ ...styles.sectionTitle, margin: "6px 0" }}>{level} Mock Exams</h2>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Practise a complete exam under timed conditions and review your result when you finish.
        </p>
      </section>

      {mocks.length ? (
        <section style={{ display: "grid", gap: 12 }}>
          {mocks.map((mock) => (
            <article key={mock.id} style={{ ...styles.card, margin: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
                <div style={{ maxWidth: 720 }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <h3 style={{ margin: 0 }}>{mock.shortTitle || mock.title}</h3>
                    <span style={styles.badge}>{statusLabel(mock.status)}</span>
                  </div>
                  <p style={{ ...styles.helperText, margin: "8px 0 0" }}>Complete {(mock.sections || []).join(", ")} in one exam-style practice.</p>
                  <p style={{ ...styles.helperText, margin: "8px 0 0", fontSize: 12 }}>
                    {mock.durationLabel} · {(mock.sections || []).join(" · ")}
                  </p>
                </div>
                <button type="button" style={styles.primaryButton} onClick={() => navigate(mock.route)}>
                  {mock.status === "preview" ? "Open practice" : "Start mock"}
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section style={styles.card}>
          <strong>No full {level} mock is published yet.</strong>
          <p style={styles.helperText}>Use the section practice while a full mock is not yet available.</p>
        </section>
      )}
    </div>
  );
}
