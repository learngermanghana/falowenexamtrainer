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
  const mocks = getMockExamsForLevel(level, { includeCourse: true });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <p style={{ ...styles.helperText, margin: 0 }}>Full exam practice</p>
        <h2 style={{ ...styles.sectionTitle, margin: "6px 0" }}>{level} Mock Exams</h2>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Choose a full timed mock when available, or practise exam sections in the course preview. Preview practice does not yet generate one final combined score.
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
                  {mock.level === "B1" && mock.mode === "full" ? (
                    <p style={{ ...styles.helperText, margin: "8px 0 0", color: "#7f1d1d", fontWeight: 700 }}>
                      One complete mock = 4 modules. Finish all four for a final score. If you leave, return to resume your saved attempt; exam timers continue.
                    </p>
                  ) : null}
                </div>
                <button type="button" style={styles.primaryButton} onClick={() => navigate(mock.route)}>
                  {mock.status === "preview" ? "Open practice" : mock.level === "B1" ? "Start or resume all 4 modules" : "Start mock"}
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
