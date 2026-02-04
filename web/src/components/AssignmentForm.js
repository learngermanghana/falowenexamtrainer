import React, { useMemo, useState } from "react";
import { styles } from "../styles";

const buildAnswersText = (questions, answers) =>
  questions
    .map((question, index) => {
      const answer = answers[index]?.trim() || "";
      return `${index + 1}. ${question.prompt}\n${answer ? `Answer: ${answer}` : "Answer:"}`;
    })
    .join("\n\n");

const AssignmentForm = ({ title, intro, questions, onOpenSubmission }) => {
  const [answers, setAnswers] = useState(() => questions.map(() => ""));
  const [copyStatus, setCopyStatus] = useState("");

  const combinedAnswers = useMemo(() => buildAnswersText(questions, answers), [questions, answers]);

  const handleAnswerChange = (index) => (event) => {
    const value = event.target.value;
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleCopy = async () => {
    setCopyStatus("");
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(combinedAnswers);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = combinedAnswers;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopyStatus("Copied ✅");
      setTimeout(() => setCopyStatus(""), 1500);
    } catch (error) {
      console.error("Copy failed", error);
      setCopyStatus("Copy failed");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  const handleClear = () => {
    setAnswers(questions.map(() => ""));
    setCopyStatus("");
  };

  return (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {intro ? (
          <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
            {intro}
          </p>
        ) : null}
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {questions.map((question, index) => (
          <label key={question.id} style={{ display: "grid", gap: 6 }}>
            <span style={{ fontWeight: 600 }}>
              {index + 1}. {question.prompt}
            </span>
            <textarea
              rows={3}
              value={answers[index]}
              onChange={handleAnswerChange(index)}
              placeholder="Write your answer in German."
              style={{ ...styles.textarea, margin: 0 }}
            />
          </label>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <button type="button" style={styles.secondaryButton} onClick={handleCopy}>
          Copy answers
        </button>
        <button type="button" style={styles.secondaryButton} onClick={handleClear}>
          Clear form
        </button>
        {onOpenSubmission ? (
          <button type="button" style={styles.primaryButton} onClick={onOpenSubmission}>
            Open assignment submission
          </button>
        ) : null}
        {copyStatus ? <span style={{ fontSize: 13, color: "#059669" }}>{copyStatus}</span> : null}
      </div>
    </section>
  );
};

export default AssignmentForm;
