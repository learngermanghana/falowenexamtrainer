import React, { useMemo } from "react";
import { styles } from "../styles";
import { getTasksForLevel, useExam } from "../context/ExamContext";

const SPEAKING_LINK =
  "https://script.google.com/macros/s/AKfycbyJ5lTeXUgaGw-rejDuh_2ex7El_28JgKLurOOsO1c8LWfVE-Em2-vuWuMn1hC5-_IN/exec";

const SPEAKING_SAMPLE_PDFS = [
  {
    level: "A1",
    title: "A1 sample speaking document (PDF)",
    description: "Start Deutsch 1 sample prompts and picture cards.",
    url: "https://drive.google.com/file/d/1UWvbCCCcrW3_j9x7pOuWug6_Odvzcvaa/view",
  },
  {
    level: "A2",
    title: "A2 sample speaking document (PDF)",
    description: "Short presentations and situational dialogues.",
    url: null,
  },
  {
    level: "B1",
    title: "B1 sample speaking document (PDF)",
    description: "Presentation + follow-up questions practice set.",
    url: null,
  },
  {
    level: "B2",
    title: "B2 sample speaking document (PDF)",
    description: "Argumentation and negotiation practice set.",
    url: null,
  },
  {
    level: "C1",
    title: "C1 sample speaking document (PDF)",
    description: "Advanced presentation and debate prompts.",
    url: null,
  },
];

const SPEAKING_PROMPT_BANK = {
  A1: [
    "Introduce yourself (name, origin, languages, job).",
    "Ask a classmate about their weekend plans.",
    "Plan a short meeting time and place.",
  ],
  A2: [
    "Describe your last trip in 3–4 sentences.",
    "Ask for information about a course or appointment.",
    "Plan an activity with a partner and agree on details.",
  ],
  B1: [
    "Give a short talk about healthy routines with 2 reasons.",
    "React to a partner’s opinion and add a counterpoint.",
    "Plan an event and make a final decision together.",
  ],
  B2: [
    "Present a balanced argument about social media use.",
    "Discuss pros/cons and respond to objections.",
    "Negotiate a compromise for a group project.",
  ],
  C1: [
    "Present a structured viewpoint on a social issue.",
    "Challenge a counter-argument politely and summarize.",
    "Moderate a decision-making discussion with outcomes.",
  ],
};

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
  const promptBank = SPEAKING_PROMPT_BANK[level] || SPEAKING_PROMPT_BANK.A1;
  const samplePdfs = SPEAKING_SAMPLE_PDFS;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ marginBottom: 12 }}>
          <h1 style={{ ...styles.title, marginBottom: 8 }}>Speaking Exams – Level {level}</h1>
          <p style={styles.subtitle}>
            Warm up in-app, review the sample PDF for your level, then open the Goethe Speaking Exams practice page.
          </p>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {samplePdfs.map((pdf) => (
              <div
                key={pdf.level}
                style={{
                  padding: 12,
                  borderRadius: 14,
                  border: pdf.level === level ? "2px solid #2563eb" : "1px solid #E5E7EB",
                  background: "#FFFFFF",
                  display: "grid",
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 14, color: "#111827" }}>
                  <strong>{pdf.title}</strong>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.5 }}>
                  {pdf.description}
                </p>
                {pdf.url ? (
                  <a
                    href={pdf.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      ...styles.buttonPrimary,
                      alignSelf: "flex-start",
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    Open {pdf.level} sample PDF
                  </a>
                ) : (
                  <button type="button" style={{ ...styles.buttonSecondary, cursor: "not-allowed" }} disabled>
                    Sample PDF coming soon
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ ...styles.card, margin: 0, boxShadow: "none" }}>
            <h3 style={{ ...styles.sectionTitle, margin: "0 0 8px 0" }}>In-app warm-up prompt bank</h3>
            <ul style={{ ...styles.checklist, margin: 0 }}>
              {promptBank.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
          </div>

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

          <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
            Tip: Keep your microphone close and speak clearly for better AI feedback.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPage;
