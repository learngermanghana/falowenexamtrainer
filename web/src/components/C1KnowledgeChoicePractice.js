import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import C1SpeakGrammarGuide from "./C1SpeakGrammarGuide";
import C1TopicCollocationPractice from "./C1TopicCollocationPractice";

const shellStyle = { ...styles.card, display: "grid", gap: 14, border: "1px solid #c7d2fe", borderRadius: 18, background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" };
const optionStyle = ({ selected, correct, revealedCorrect }) => ({ width: "100%", textAlign: "left", padding: "12px 14px", borderRadius: 14, border: `1px solid ${selected ? (correct ? "#22c55e" : "#ef4444") : revealedCorrect ? "#86efac" : "#dbe3ef"}`, background: selected ? (correct ? "#dcfce7" : "#fee2e2") : revealedCorrect ? "#f0fdf4" : "#ffffff", color: "#0f172a", cursor: "pointer", font: "inherit", fontWeight: selected || revealedCorrect ? 800 : 650, lineHeight: 1.5 });
const readSavedAnswers = (storageKey) => { if (typeof window === "undefined") return {}; try { const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "{}"); return parsed && typeof parsed === "object" ? parsed : {}; } catch { return {}; } };

export const getC1KnowledgeItems = (lesson) => {
  const level = String(lesson?.level || "").toUpperCase();
  const day = Number(lesson?.day || 0);
  if (level !== "C1" || day < 1 || day > 16) return [];
  return Array.isArray(lesson?.grammarLesson?.knowledgeTest) ? lesson.grammarLesson.knowledgeTest.filter((item) => item?.question && Array.isArray(item?.options) && item.options.length >= 2 && item?.answer) : [];
};

export default function C1KnowledgeChoicePractice({ lesson, completed = false, onCompleteChange }) {
  const items = useMemo(() => getC1KnowledgeItems(lesson), [lesson]);
  const storageKey = `falowen:c1:learn-choice:${Number(lesson?.day || 0)}`;
  const [answers, setAnswers] = useState(() => readSavedAnswers(storageKey));
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => { if (typeof window !== "undefined") window.localStorage.setItem(storageKey, JSON.stringify(answers)); }, [answers, storageKey]);
  const correctCount = items.filter((item, index) => answers[index] === item.answer).length;
  const allCorrect = items.length > 0 && correctCount === items.length;
  useEffect(() => { if (allCorrect && !completed) onCompleteChange?.(true); }, [allCorrect, completed, onCompleteChange]);

  if (!items.length) return <><C1SpeakGrammarGuide lesson={lesson} showGrammar showSpeaking={false} /><C1TopicCollocationPractice day={lesson?.day} /><section style={shellStyle}><h2 style={{ margin: 0 }}>Knowledge practice</h2><p style={{ margin: 0 }}>Multiple-choice knowledge questions are not available for this lesson yet.</p></section></>;

  const safeIndex = Math.min(currentIndex, items.length - 1);
  const item = items[safeIndex];
  const selected = answers[safeIndex] || "";
  const isCorrect = selected === item.answer;
  const choose = (option) => setAnswers((previous) => ({ ...previous, [safeIndex]: option }));
  const reset = () => { setAnswers({}); setCurrentIndex(0); onCompleteChange?.(false); };

  return <><C1SpeakGrammarGuide lesson={lesson} showGrammar showSpeaking={false} /><C1TopicCollocationPractice day={lesson?.day} /><section style={shellStyle} aria-label={`C1 Day ${lesson.day} knowledge practice`}>
    <div><span style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>Learn by choosing</span><h2>Knowledge questions</h2><strong>{correctCount}/{items.length} correct</strong></div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{items.map((question, index) => <button key={`${question.question}-${index}`} type="button" onClick={() => setCurrentIndex(index)} style={index === safeIndex ? styles.primaryButton : styles.secondaryButton} aria-label={`Question ${index + 1}${answers[index] === question.answer ? ", correct" : ""}`}>{answers[index] === question.answer ? "✓ " : ""}{index + 1}</button>)}</div>
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 16, padding: 16, display: "grid", gap: 12 }}>
      <strong>Question {safeIndex + 1} of {items.length}</strong><h3 style={{ margin: 0 }}>{item.question}</h3>
      {item.options.map((option) => { const optionSelected = selected === option; const optionCorrect = option === item.answer; return <button key={option} type="button" onClick={() => choose(option)} style={optionStyle({ selected: optionSelected, correct: optionCorrect, revealedCorrect: Boolean(selected) && optionCorrect && !optionSelected })}>{option}</button>; })}
      {selected ? <div role="status"><strong>{isCorrect ? "Correct." : "Not correct yet. Try another answer."}</strong> {item.explanation}</div> : null}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><button type="button" style={styles.secondaryButton} onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))} disabled={safeIndex === 0}>Previous</button>{safeIndex < items.length - 1 ? <button type="button" style={styles.primaryButton} onClick={() => isCorrect && setCurrentIndex((index) => Math.min(index + 1, items.length - 1))} disabled={!isCorrect}>Next question</button> : null}</div>
    </div>
    {allCorrect || completed ? <div style={{ border: "1px solid #86efac", borderRadius: 14, padding: 12, background: "#f0fdf4", color: "#14532d" }}><strong>Learn complete.</strong> You answered all knowledge questions correctly.</div> : null}
    <button type="button" style={styles.secondaryButton} onClick={reset}>Restart knowledge questions</button>
  </section></>;
}
