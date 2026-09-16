import React from "react";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
  border: "1px solid #dbeafe",
  borderRadius: 18,
};

const DetailList = ({ items = [] }) => (
  <ul style={{ margin: 0, paddingLeft: 22, lineHeight: 1.7 }}>
    {items.filter(Boolean).map((item) => <li key={item}>{item}</li>)}
  </ul>
);

export default function C2AlignedTeachingSummary({ lesson }) {
  const mastery = lesson?.c2Mastery || lesson;
  const grammar = mastery?.grammarNotes;
  const checks = Array.isArray(mastery?.grammarChecks) ? mastery.grammarChecks : [];
  const writing = mastery?.writingExercise;
  if (!grammar || !writing) return null;

  return (
    <section
      style={{ ...styles.container, display: "grid", gap: 14, marginTop: 14, marginBottom: 24 }}
      data-c2-aligned-teaching-summary={Number(lesson?.day || 0)}
    >
      <section style={card}>
        <div>
          <span style={{ ...styles.badge, marginBottom: 8 }}>C2 grammar notes</span>
          <h2 style={{ margin: 0 }}>{grammar.title}</h2>
        </div>
        <div>
          <strong>When and why to use it</strong>
          <p style={{ marginBottom: 0, lineHeight: 1.7 }}>{grammar.usage}</p>
        </div>
        <div>
          <strong>Structure / word order</strong>
          <p style={{ marginBottom: 0, lineHeight: 1.7 }}>{grammar.wordOrder}</p>
        </div>
        <div>
          <strong>Examples from today’s topic</strong>
          <DetailList items={grammar.examples} />
        </div>
        <div>
          <strong>Common mistake</strong>
          <DetailList items={grammar.commonMistakes} />
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Grammar checks with explanations</h2>
        {checks.map((check, index) => (
          <details key={`${index}-${check.question}`} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
            <summary style={{ cursor: "pointer", fontWeight: 800 }}>
              {index + 1}. {check.question}
            </summary>
            {Array.isArray(check.options) && check.options.length ? (
              <ol style={{ lineHeight: 1.7 }}>
                {check.options.map((option) => <li key={option}>{option}</li>)}
              </ol>
            ) : null}
            <p style={{ marginBottom: 4 }}>
              <strong>Answer:</strong> {check.options?.[check.answerIndex] || "See explanation"}
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>{check.explanation}</p>
          </details>
        ))}
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Writing exercise and model</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Task:</strong> {writing.prompt}</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Planning:</strong> {writing.planningPrompt}</p>
        <details style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
          <summary style={{ cursor: "pointer", fontWeight: 800 }}>Show model answer</summary>
          <p style={{ marginBottom: 0, lineHeight: 1.75 }}>{writing.modelAnswer}</p>
        </details>
      </section>
    </section>
  );
}
