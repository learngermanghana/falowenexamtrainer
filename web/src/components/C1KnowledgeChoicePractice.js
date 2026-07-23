import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";

const shellStyle = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: "1px solid #c7d2fe",
  borderRadius: 18,
  background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
  boxShadow: "0 10px 26px rgba(15,23,42,.06)",
};

const optionStyle = ({ selected, correct, revealedCorrect }) => ({
  width: "100%",
  textAlign: "left",
  padding: "12px 14px",
  borderRadius: 14,
  border: `1px solid ${selected ? (correct ? "#22c55e" : "#ef4444") : revealedCorrect ? "#86efac" : "#dbe3ef"}`,
  background: selected ? (correct ? "#dcfce7" : "#fee2e2") : revealedCorrect ? "#f0fdf4" : "#ffffff",
  color: "#0f172a",
  cursor: "pointer",
  font: "inherit",
  fontWeight: selected || revealedCorrect ? 800 : 650,
  lineHeight: 1.5,
});

const readSavedAnswers = (storageKey) => {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const getC1KnowledgeItems = (lesson) => {
  const level = String(lesson?.level || "").toUpperCase();
  const day = Number(lesson?.day || 0);
  if (level !== "C1" || day < 1 || day > 12) return [];
  return Array.isArray(lesson?.grammarLesson?.knowledgeTest)
    ? lesson.grammarLesson.knowledgeTest.filter(
        (item) => item?.question && Array.isArray(item?.options) && item.options.length >= 2 && item?.answer,
      )
    : [];
};

export default function C1KnowledgeChoicePractice({ lesson, completed = false, onCompleteChange }) {
  const items = useMemo(() => getC1KnowledgeItems(lesson), [lesson]);
  const storageKey = `falowen:c1:learn-choice:${Number(lesson?.day || 0)}`;
  const [answers, setAnswers] = useState(() => readSavedAnswers(storageKey));
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(answers));
  }, [answers, storageKey]);

  const correctCount = items.filter((item, index) => answers[index] === item.answer).length;
  const allCorrect = items.length > 0 && correctCount === items.length;

  useEffect(() => {
    if (allCorrect && !completed) onCompleteChange?.(true);
  }, [allCorrect, completed, onCompleteChange]);

  if (!items.length) {
    return (
      <section style={shellStyle}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Knowledge practice</h2>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
          Multiple-choice knowledge questions are not available for this lesson yet.
        </p>
      </section>
    );
  }

  const safeIndex = Math.min(currentIndex, items.length - 1);
  const item = items[safeIndex];
  const selected = answers[safeIndex] || "";
  const isAnswered = Boolean(selected);
  const isCorrect = selected === item.answer;
  const progressPercent = Math.round((correctCount / items.length) * 100);

  const choose = (option) => {
    setAnswers((previous) => ({ ...previous, [safeIndex]: option }));
  };

  const next = () => {
    if (!isCorrect) return;
    setCurrentIndex((index) => Math.min(index + 1, items.length - 1));
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setAnswers({});
    setCurrentIndex(0);
    onCompleteChange?.(false);
  };

  return (
    <section style={shellStyle} aria-label={`C1 Day ${lesson.day} knowledge practice`}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "grid", gap: 4 }}>
          <span style={{ ...styles.badge, width: "fit-content", background: "#eef2ff", color: "#3730a3" }}>Learn by choosing</span>
          <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Knowledge questions</h2>
        </div>
        <span style={{ ...styles.badge, background: allCorrect || completed ? "#dcfce7" : "#eff6ff", color: allCorrect || completed ? "#166534" : "#1d4ed8" }}>
          {correctCount}/{items.length} correct
        </span>
      </div>

      <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
        Click one answer at a time. Falowen explains the answer immediately, so you learn while answering instead of reading a long block of notes.
      </p>

      <div style={{ height: 9, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }} aria-label={`${progressPercent}% complete`}>
        <div style={{ width: `${progressPercent}%`, height: "100%", background: "#2563eb", transition: "width .2s ease" }} />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {items.map((question, index) => {
          const questionCorrect = answers[index] === question.answer;
          return (
            <button
              key={`${question.question}-${index}`}
              type="button"
              onClick={() => setCurrentIndex(index)}
              style={{
                ...(index === safeIndex ? styles.primaryButton : styles.secondaryButton),
                minWidth: 46,
                minHeight: 40,
                borderRadius: 999,
                padding: "7px 12px",
                background: questionCorrect && index !== safeIndex ? "#dcfce7" : undefined,
                color: questionCorrect && index !== safeIndex ? "#166534" : undefined,
              }}
              aria-label={`Question ${index + 1}${questionCorrect ? ", correct" : ""}`}
            >
              {questionCorrect ? "✓ " : ""}{index + 1}
            </button>
          );
        })}
      </div>

      <div style={{ border: "1px solid #e2e8f0", borderRadius: 16, padding: 16, background: "#ffffff", display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <strong>Question {safeIndex + 1} of {items.length}</strong>
          {lesson?.grammarLesson?.title ? <span style={{ color: "#64748b", fontSize: 13 }}>{lesson.grammarLesson.title}</span> : null}
        </div>
        <h3 style={{ margin: 0, fontSize: "1.08rem", lineHeight: 1.5 }}>{item.question}</h3>

        <div style={{ display: "grid", gap: 9 }}>
          {item.options.map((option) => {
            const optionSelected = selected === option;
            const optionCorrect = option === item.answer;
            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(option)}
                style={optionStyle({ selected: optionSelected, correct: optionCorrect, revealedCorrect: isAnswered && optionCorrect && !optionSelected })}
              >
                {option}
              </button>
            );
          })}
        </div>

        {isAnswered ? (
          <div
            role="status"
            style={{
              border: `1px solid ${isCorrect ? "#86efac" : "#fecaca"}`,
              borderRadius: 14,
              padding: 12,
              background: isCorrect ? "#f0fdf4" : "#fef2f2",
              color: isCorrect ? "#14532d" : "#991b1b",
              lineHeight: 1.65,
            }}
          >
            <strong>{isCorrect ? "Correct." : "Not correct yet. Try another answer."}</strong>{" "}
            {item.explanation || "Review the answer and try again."}
          </div>
        ) : null}

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <button type="button" style={styles.secondaryButton} onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))} disabled={safeIndex === 0}>
            Previous
          </button>
          {safeIndex < items.length - 1 ? (
            <button type="button" style={{ ...styles.primaryButton, opacity: isCorrect ? 1 : 0.5 }} onClick={next} disabled={!isCorrect}>
              Next question
            </button>
          ) : null}
        </div>
      </div>

      {allCorrect || completed ? (
        <div style={{ border: "1px solid #86efac", borderRadius: 14, padding: 12, background: "#f0fdf4", color: "#14532d", lineHeight: 1.65 }}>
          <strong>Learn complete.</strong> You answered all knowledge questions correctly. You can continue to Speak when you are ready.
        </div>
      ) : null}

      <button type="button" style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={reset}>
        Restart knowledge questions
      </button>
    </section>
  );
}
