import React, { useMemo } from "react";
import { styles } from "../styles";
import { getTasksForLevel, useExam } from "../context/ExamContext";

const SPEAKING_LINK =
  "https://script.google.com/macros/s/AKfycbyWHrf5snW93gvPOqHbiMd63C8Kc_z6-JRVUCymslwFlgMEli5V52OdmEm47TyVT6sG/exec";
const SPEAKING_PAGE_LINK = "https://www.falowen.app/exams/speaking";

const COMMON_MISTAKES = [
  {
    title: "Missing the task points",
    example: "You talk about the topic but forget one required point.",
    fix: "Repeat the task bullets aloud before you start speaking.",
  },
  {
    title: "Sentence structure slips",
    example: "Word order drifts in questions or subordinate clauses.",
    fix: "Use short main clauses and add one connector at a time.",
  },
  {
    title: "No clear conclusion",
    example: "You end abruptly without a decision or summary.",
    fix: "Finish with “Also, wir entscheiden uns für …” or a summary.",
  },
];

const ChecklistItem = ({ icon, children }) => (
  <li
    style={{
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      padding: "10px 12px",
      border: "1px solid #E5E7EB",
      borderRadius: 12,
      background: "#FFFFFF",
    }}
  >
    <span
      aria-hidden="true"
      style={{
        width: 28,
        height: 28,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        border: "1px solid #E5E7EB",
        background: "#F9FAFB",
        flex: "0 0 auto",
        fontSize: 16,
        lineHeight: 1,
      }}
    >
      {icon}
    </span>

    <div style={{ lineHeight: 1.55, color: "#111827", fontSize: 15 }}>
      {children}
    </div>
  </li>
);

const SpeakingPage = () => {
  const { level } = useExam();
  const tasks = useMemo(() => getTasksForLevel(level), [level]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ marginBottom: 12 }}>
          <h1 style={{ ...styles.title, marginBottom: 8 }}>Speaking Exams – Level {level}</h1>
          <p style={styles.subtitle}>
            Open the Goethe Speaking Exams practice page to start your speaking prep.
          </p>
        </div>

        <div
          style={{
            ...styles.card,
            margin: 0,
            boxShadow: "none",
            border: "1px solid #BFDBFE",
            background: "#EFF6FF",
            display: "grid",
            gap: 10,
          }}
        >
          <p style={{ margin: 0, color: "#1E3A8A", fontWeight: 700 }}>Start here</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <a
              href={SPEAKING_LINK}
              target="_blank"
              rel="noreferrer"
              style={{
                ...styles.buttonPrimary,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Open Goethe Speaking Exams
            </a>
            <a
              href={SPEAKING_PAGE_LINK}
              target="_blank"
              rel="noreferrer"
              style={{
                ...styles.buttonSecondary,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Open speaking page
            </a>
          </div>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ ...styles.card, margin: 0, boxShadow: "none" }}>
            <h3 style={{ ...styles.sectionTitle, margin: "0 0 8px 0" }}>Scoring rubric focus</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {tasks.map((task) => (
                <div key={task.id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
                  <div style={{ fontWeight: 700 }}>{task.label}</div>
                  <p style={{ ...styles.helperText, margin: "6px 0" }}>{task.instructions}</p>
                  <p style={{ ...styles.helperText, margin: 0 }}>
                    <strong>Scoring focus:</strong> {task.scoringHints}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 14,
              border: "1px solid #E5E7EB",
              background: "#F9FAFB",
            }}
          >
            <div style={{ fontSize: 14, color: "#111827", marginBottom: 8 }}>
              <strong>Common mistakes to avoid</strong>
            </div>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: 10,
              }}
            >
              {COMMON_MISTAKES.map((item) => (
                <ChecklistItem key={item.title} icon="⚠️">
                  <strong>{item.title}:</strong> {item.example} <em>Fix:</em> {item.fix}
                </ChecklistItem>
              ))}
            </ul>
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 14,
              border: "1px solid #E5E7EB",
              background: "#F9FAFB",
            }}
          >
            <div style={{ fontSize: 14, color: "#111827", marginBottom: 8 }}>
              <strong>Quick checklist</strong>
            </div>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: 10,
              }}
            >
              <ChecklistItem icon="🔓">
                Click <strong>Open Goethe Speaking Exams</strong> and enter your{" "}
                <strong>Student Code</strong>.
              </ChecklistItem>

              <ChecklistItem icon="🧭">
                Go to the <strong>Question</strong> tab and choose what you want to
                practice: <strong>Teil 1</strong>, <strong>Teil 2</strong>, or{" "}
                <strong>Teil 3</strong>.
              </ChecklistItem>

              <ChecklistItem icon="📌">
                Under your Question selection, read the <strong>description</strong>{" "}
                carefully before you start.
              </ChecklistItem>

              <ChecklistItem icon="🎙️">
                Click <strong>Start Recording</strong>, then <strong>ask and answer</strong>{" "}
                the questions yourself (like a real exam).
              </ChecklistItem>

              <ChecklistItem icon="🤖">
                Click <strong>Ask &amp; AI</strong> to get marking, feedback, and see your{" "}
                results.
              </ChecklistItem>

              <ChecklistItem icon="✅">
                Optional: tick the checkbox above <strong>Start Recording</strong> to use{" "}
                the <strong>AI as your speaking partner</strong>.
              </ChecklistItem>
            </ul>
          </div>

          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.5, margin: 0 }}>
            Further information:{" "}
            <a href={SPEAKING_LINK} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
              Goethe Speaking Exams practice page
            </a>
            .
          </p>

          <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
            Tip: Keep your microphone close and speak clearly for better AI feedback.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPage;
