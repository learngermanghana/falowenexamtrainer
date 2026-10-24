import React from "react";
import { styles } from "../styles";
import { useA1TutorWorkbookDraft } from "./A1TutorWorkbookDraftContext";

const taskShell = {
  border: "1px solid #bfdbfe",
  borderRadius: 16,
  background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 150px)",
  padding: 16,
  display: "grid",
  gap: 14,
};

const questionGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: 12,
};

const questionCard = {
  border: "1px solid #dbeafe",
  borderRadius: 14,
  background: "#ffffff",
  padding: 14,
  display: "grid",
  gap: 10,
  alignContent: "start",
  boxShadow: "0 8px 22px rgba(15, 23, 42, 0.05)",
};

export default function A1TranslationTask({
  sectionKey,
  title = "Übersetzen",
  instruction = "Übersetze die Sätze ins Deutsche.",
  questions = [],
}) {
  const draftContext = useA1TutorWorkbookDraft();
  const draft = draftContext?.draft;
  const updateAnswer = draftContext?.updateAnswer;
  const saveState = draftContext?.saveState;
  const savedAnswers = draft?.sections?.[sectionKey]?.answers || {};

  return (
    <section data-a1-inline-translation={sectionKey} style={taskShell}>
      <header style={{ display: "grid", gap: 6 }}>
        <span
          style={{
            width: "fit-content",
            borderRadius: 999,
            padding: "5px 9px",
            background: "#dbeafe",
            color: "#1e3a8a",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: ".05em",
            textTransform: "uppercase",
          }}
        >
          Teil 1 · Übersetzen
        </span>
        <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#0f172a" }}>{title}</h3>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>{instruction}</p>
      </header>

      <div style={questionGrid}>
        {questions.map((question, index) => {
          const number = Number(question.number || index + 1);
          const value = savedAnswers?.[number] || "";
          return (
            <article key={number} data-translation-question={number} style={questionCard}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <strong style={{ color: "#1d4ed8", fontSize: 13 }}>Question {number}</strong>
                {question.cue ? (
                  <span
                    style={{
                      borderRadius: 999,
                      background: "#f1f5f9",
                      color: "#475569",
                      padding: "4px 8px",
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    {question.cue}
                  </span>
                ) : null}
              </div>

              <p style={{ margin: 0, color: "#111827", fontSize: "1.02rem", lineHeight: 1.65, fontWeight: 700 }}>
                {question.text}
              </p>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#334155", fontSize: 12, fontWeight: 900 }}>Deine Übersetzung</span>
                <input
                  type="text"
                  value={value}
                  onChange={(event) => updateAnswer?.(sectionKey, number, event.target.value)}
                  placeholder={question.placeholder || "Auf Deutsch schreiben"}
                  aria-label={`Translation answer ${number}`}
                  style={{
                    ...styles.input,
                    minHeight: 46,
                    fontSize: 16,
                    background: "#ffffff",
                  }}
                />
              </label>
            </article>
          );
        })}
      </div>

      <div
        aria-live="polite"
        style={{
          borderTop: "1px solid #dbeafe",
          paddingTop: 10,
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
          color: "#64748b",
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        <span>{questions.filter((question, index) => String(savedAnswers?.[Number(question.number || index + 1)] || "").trim()).length} of {questions.length} answered</span>
        <span>{saveState === "saving" ? "Saving draft…" : saveState === "saved" ? "Draft saved on this device." : "Draft saves automatically on this device."}</span>
      </div>
    </section>
  );
}
