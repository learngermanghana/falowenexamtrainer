import InlineReadingTranslations from "./InlineReadingTranslations";
import React, { useEffect, useState } from "react";

// Private-by-default: answer drafts stay in this browser component.
// Self-study practice is separate from official Campus scores.
export default function C1ReadingPracticePanel({ day, reading }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState(false);
  useEffect(() => {
    setQuestionIndex(0);
    setAnswers({});
    setReview(false);
  }, [day]);

  if (!reading?.text?.length || !reading.questions?.length) {
    return <p>Für diesen Tag ist noch kein Lesetext vorhanden.</p>;
  }
  const questions = reading.questions;
  const current = questions[questionIndex];
  const answered = questions.filter((_, index) =>
    String(answers[index] || "").trim().length > 0).length;
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
        Falowen C1 Lesepraxis · Eigener Übungstext, kein offizieller Goethe-Prüfungssatz.
        Freie Antworten werden hier nicht automatisch benotet oder an Falowen übermittelt.
      </p>
      <article aria-label={reading.title} style={{
        border: "1px solid #e2e8f0", borderRadius: 12, padding: 16,
        background: "#fff", lineHeight: 1.8,
      }}>
        <h4 style={{ marginTop: 0 }}>{reading.title}</h4>
        {reading.text.map((paragraph, index) => (
          <p key={index} style={{ margin: "0 0 14px" }}><InlineReadingTranslations text={paragraph} level="C1" day={day} /></p>
        ))}
      </article>
      <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
        <p style={{ color: "#475569", margin: "0 0 8px" }}>
          Frage {questionIndex + 1} von {questions.length} · {answered}/{questions.length} beantwortet
        </p>
        <label htmlFor={`c1-reading-${day}-${questionIndex}`} style={{ display: "block", fontWeight: 700, marginBottom: 10 }}>
          {current.question}
        </label>
        <textarea
          id={`c1-reading-${day}-${questionIndex}`}
          rows={4}
          value={answers[questionIndex] || ""}
          onChange={(event) => {
            setAnswers((previous) => ({ ...previous, [questionIndex]: event.target.value }));
            setReview(false);
          }}
          placeholder="Antworte in deinen eigenen Worten und beziehe dich auf den Text."
          style={{ boxSizing: "border-box", width: "100%", padding: 12,
            border: "1px solid #cbd5e1", borderRadius: 8, resize: "vertical" }}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          <button type="button" disabled={questionIndex === 0}
            onClick={() => { setQuestionIndex((index) => index - 1); setReview(false); }}>
            Zurück
          </button>
          <button type="button" disabled={questionIndex === questions.length - 1}
            onClick={() => { setQuestionIndex((index) => index + 1); setReview(false); }}>
            Nächste Frage
          </button>
          <button type="button" disabled={!String(answers[questionIndex] || "").trim()}
            onClick={() => setReview(true)}>
            Selbstkontrolle anzeigen
          </button>
          <button type="button" onClick={() => {
            setAnswers({});
            setQuestionIndex(0);
            setReview(false);
          }}>
            Zurücksetzen
          </button>
        </div>
        {review ? (
          <div role="status" style={{ marginTop: 12, padding: 12,
            background: "#f1f5f9", borderRadius: 8, lineHeight: 1.6 }}>
            <strong>Überprüfe deine Antwort:</strong> Ist die Aussage durch den Lesetext belegt?
            Nenne den relevanten Absatz, unterscheide Hauptthese und Einwand
            und erkläre die Schlussfolgerung in eigenen Worten.
            Für individuelles Korrekturfeedback nutze Falowen AI oder den
            Falowen Learning Companion in ChatGPT.
          </div>
        ) : null}
      </div>
    </div>
  );
}
