import React from "react";
import { styles } from "../styles";

const SPEAKING_LINK =
  "https://script.google.com/macros/s/AKfycbyJ5lTeXUgaGw-rejDuh_2ex7El_28JgKLurOOsO1c8LWfVE-Em2-vuWuMn1hC5-_IN/exec";
const A1_SAMPLE_PDF_LINK =
  "https://drive.google.com/file/d/1UWvbCCCcrW3_j9x7pOuWug6_Odvzcvaa/view";

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
  const speakingStarters = [
    {
      level: "A1",
      text: "Hallo, ich heiße ___ . Ich komme aus ___ . Ich wohne in ___ . Ich bin ___ Jahre alt. Ich bin ___ von Beruf.",
    },
    {
      level: "A2",
      text: "Guten Tag, ich möchte kurz über ___ sprechen. Ich finde das Thema wichtig, weil ___ .",
    },
    {
      level: "B1",
      text: "Ich präsentiere heute das Thema ___ . Zuerst erkläre ich ___, danach spreche ich über ___ .",
    },
    {
      level: "B2",
      text: "In meinem Vortrag geht es um ___ . Zunächst skizziere ich ___, anschließend nenne ich ___ .",
    },
    {
      level: "C1",
      text: "Das Thema meines Beitrags lautet ___ . Im Folgenden stelle ich die Situation dar und diskutiere ___ .",
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ marginBottom: 12 }}>
          <h1 style={{ ...styles.title, marginBottom: 8 }}>Speaking Exams</h1>
          <p style={styles.subtitle}>
            Use the link below to open the Goethe Speaking Exams practice page.
          </p>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <div
            style={{
              padding: 12,
              borderRadius: 14,
              border: "1px solid #E5E7EB",
              background: "#FFFFFF",
            }}
          >
            <div style={{ fontSize: 14, color: "#111827", marginBottom: 8 }}>
              <strong>Beispielantwort (Sprechen): How to start by level</strong>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {speakingStarters.map((starter) => (
                <div
                  key={starter.level}
                  style={{
                    border: "1px solid #E5E7EB",
                    borderRadius: 10,
                    padding: "10px 12px",
                    background: "#F9FAFB",
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{starter.level}</div>
                  <div style={{ fontSize: 14, color: "#111827", lineHeight: 1.5 }}>
                    {starter.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 14,
              border: "1px solid #E5E7EB",
              background: "#FFFFFF",
              display: "grid",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 14, color: "#111827" }}>
              <strong>A1 sample speaking document (PDF)</strong>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.5 }}>
              This PDF is only for A1 students. Use it to review the speaking exam
              sample before you start practicing.
            </p>
            <a
              href={A1_SAMPLE_PDF_LINK}
              target="_blank"
              rel="noreferrer"
              style={{
                ...styles.buttonPrimary,
                alignSelf: "flex-start",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Open A1 sample PDF
            </a>
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
