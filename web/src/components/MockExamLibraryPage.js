import React from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../context/ExamContext";
import { getMockExamsForLevel } from "../data/mockExamCatalog";
import { styles } from "../styles";

const statusLabel = (status) => {
  if (status === "preview") return "Section practice only";
  if (status === "ready") return "Complete 4-module mock";
  return "Full mock not published";
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
          Choose a full timed mock when available, or work on individual sections. At every level (A1–C2), a complete mock means Lesen, Hören, Schreiben and Sprechen. Finish all four for a full result. If a complete mock is not yet available for your level, use individual skill practice instead. Section practice does not yet generate one final combined score.
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
                  <p style={{ ...styles.helperText, margin: "8px 0 0" }}>
                    {mock.mode === "full"
                      ? "Complete Lesen, Hören, Schreiben and Sprechen in one exam-style attempt."
                      : mock.description}
                  </p>
                  <p style={{ ...styles.helperText, margin: "8px 0 0", fontSize: 12 }}>
                    {mock.durationLabel} · {(mock.sections || []).join(" · ")}
                  </p>
                  {mock.mode === "full" ? (
                    <p style={{ ...styles.helperText, margin: "8px 0 0", color: "#7f1d1d", fontWeight: 700 }}>
                      One full mock = 4 modules. Complete all four for the final score. If you leave, return to continue where you stopped. A running module's timer does not pause.
                    </p>
                  ) : (
                    <p style={{ ...styles.helperText, margin: "8px 0 0", color: "#7f1d1d", fontWeight: 700 }}>
                      This is section practice, not a completed four-module mock. No overall mock pass/fail score is available.
                    </p>
                  )}
                </div>
                <button type="button" style={styles.primaryButton} onClick={() => navigate(mock.route)}>
                  {mock.mode === "full" ? "Start or resume all 4 modules" : mock.status === "planned" ? "Browse exam skills" : "Open practice section"}
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
