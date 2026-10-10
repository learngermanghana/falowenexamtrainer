import React from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../context/ExamContext";
import { getMockExamsForLevel } from "../data/mockExamCatalog";
import { styles } from "../styles";

const statusLabel = (status, mock) => {
  if (mock?.id === "a2-mock-02") return "4-module mock · grading verification pending";
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
          {mocks.some((mock) => mock.mode === "full" && mock.status === "ready") ? "Choose a complete mock or practise one skill. Full mocks cover all four modules; previews may not produce a combined score." : "A full mock is not yet published for this level. Choose available skill practice below; it does not produce an overall mock result."}
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
                    <span style={styles.badge}>{statusLabel(mock.status, mock)}</span>
                  </div>
                  <p style={{ ...styles.helperText, margin: "8px 0 0" }}>
                    {mock.description}
                  </p>
                  <p style={{ ...styles.helperText, margin: "8px 0 0", fontSize: 12 }}>
                    {mock.durationLabel} · {(mock.sections || []).join(" · ")}
                  </p>
                  {mock.mode === "full" ? (
                    <p style={{ ...styles.helperText, margin: "8px 0 0", color: "#7f1d1d", fontWeight: 700 }}>
                      Finish all four modules for your final result. You can resume an unfinished attempt; running timers do not pause.
                    </p>
                  ) : mock.id === "a2-mock-02" ? (
                    <p style={{ ...styles.helperText, margin: "8px 0 0" }}>
                      All four modules are inside this mock. Your progress is saved on this device; verified final scores are not available yet.
                    </p>
                  ) : (
                    <p style={{ ...styles.helperText, margin: "8px 0 0", color: "#7f1d1d", fontWeight: 700 }}>
                      Section practice does not generate a complete mock score.
                    </p>
                  )}
                </div>
                <button type="button" style={styles.primaryButton} onClick={() => navigate(mock.route)}>
                  {mock.mode === "full" ? "Start or resume mock" : mock.id === "a2-mock-02" ? "Open A2 Mock 2" : mock.status === "planned" ? "Browse exam skills" : "Open practice section"}
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
