import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";

const normalizeItems = (lesson) => {
  const items = lesson?.grammarLesson?.knowledgeTest || lesson?.knowledgeTest || [];
  return Array.isArray(items)
    ? items.filter((item) => item?.question && Array.isArray(item?.options) && item.options.length >= 2 && item?.answer)
    : [];
};

export default function B2KnowledgeChoicePractice({ lesson, onCompleteChange }) {
  const items = useMemo(() => normalizeItems(lesson), [lesson]);
  const storageKey = `b2KnowledgeChoice:${Number(lesson?.day || 0)}`;
  const [answers, setAnswers] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  });

  const correctCount = items.reduce((total, item, index) => total + (answers[index] === item.answer ? 1 : 0), 0);
  const complete = items.length > 0 && correctCount === items.length;

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(answers));
    } catch {
      // Storage is optional; the exercise still works in memory.
    }
  }, [answers, storageKey]);

  useEffect(() => {
    onCompleteChange?.(complete);
  }, [complete, onCompleteChange]);

  if (!items.length) return null;

  return (
    <section style={{ ...styles.card, display: "grid", gap: 14, border: "1px solid #c7d2fe", borderRadius: 18 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Grammatik-Check</h2>
        <p style={{ margin: "6px 0 0", color: "#475569", lineHeight: 1.6 }}>Klicke eine Antwort an. Du siehst sofort, warum sie richtig oder falsch ist.</p>
      </div>
      {items.map((item, index) => {
        const selected = answers[index];
        const answered = Boolean(selected);
        const isCorrect = selected === item.answer;
        return (
          <div key={`${index}-${item.question}`} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, display: "grid", gap: 10 }}>
            <strong>{index + 1}. {item.question}</strong>
            <div style={{ display: "grid", gap: 8 }}>
              {item.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAnswers((old) => ({ ...old, [index]: option }))}
                  style={{
                    ...styles.secondaryButton,
                    textAlign: "left",
                    justifyContent: "flex-start",
                    borderColor: selected === option ? (option === item.answer ? "#16a34a" : "#dc2626") : "#cbd5e1",
                    background: selected === option ? (option === item.answer ? "#f0fdf4" : "#fef2f2") : "#fff",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
            {answered ? (
              <div style={{ borderRadius: 12, padding: 10, background: isCorrect ? "#f0fdf4" : "#fff7ed", color: isCorrect ? "#166534" : "#9a3412", lineHeight: 1.6 }}>
                <strong>{isCorrect ? "Richtig." : `Noch nicht. Richtig ist: ${item.answer}`}</strong>{item.explanation ? ` ${item.explanation}` : ""}
              </div>
            ) : null}
          </div>
        );
      })}
      <div style={{ fontWeight: 800 }}>Ergebnis: {correctCount}/{items.length}{complete ? " · Learn-Check geschafft" : ""}</div>
    </section>
  );
}
