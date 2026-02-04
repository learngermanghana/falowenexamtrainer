import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";

const buildAnswersText = (questions, answers) =>
  questions
    .map((question, index) => {
      const answer = answers[index]?.trim() || "";
      return `${index + 1}. ${question.prompt}\n${answer ? `Answer: ${answer}` : "Answer:"}`;
    })
    .join("\n\n");

const AssignmentForm = ({ title, intro, questions, onOpenSubmission, storageKey, checklist, tips }) => {
  const [answers, setAnswers] = useState(() => questions.map(() => ""));
  const [copyStatus, setCopyStatus] = useState("");

  const combinedAnswers = useMemo(() => buildAnswersText(questions, answers), [questions, answers]);

  useEffect(() => {
    if (!storageKey) {
      return;
    }
    try {
      const savedAnswers = window.localStorage.getItem(storageKey);
      if (savedAnswers) {
        const parsed = JSON.parse(savedAnswers);
        if (Array.isArray(parsed) && parsed.length === questions.length) {
          setAnswers(parsed);
        }
      }
    } catch (error) {
      console.warn("Unable to read saved answers", error);
    }
  }, [storageKey, questions.length]);

  useEffect(() => {
    if (!storageKey) {
      return;
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(answers));
    } catch (error) {
      console.warn("Unable to save answers", error);
    }
  }, [answers, storageKey]);

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
      return true;
    } catch (error) {
      console.error("Copy failed", error);
      setCopyStatus("Copy failed");
      setTimeout(() => setCopyStatus(""), 2000);
      return false;
    }
  };

  const handleCopyAndOpen = async () => {
    const copied = await handleCopy();
    if (copied && onOpenSubmission) {
      onOpenSubmission();
    }
  };

  const handleClear = () => {
    setAnswers(questions.map(() => ""));
    setCopyStatus("");
  };

  const answeredCount = answers.filter((answer) => answer.trim()).length;

  return (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {intro ? (
          <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
            {intro}
          </p>
        ) : null}
        {tips ? <p style={{ ...styles.helperText, margin: "6px 0 0" }}>{tips}</p> : null}
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "#6b7280" }}>
          Progress: {answeredCount}/{questions.length} answered
        </p>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {questions.map((question, index) => (
          <label key={question.id} style={{ display: "grid", gap: 6 }}>
            <span style={{ fontWeight: 600 }}>
              {index + 1}. {question.prompt}
            </span>
            {question.type === "mcq" ? (
              <div style={{ display: "grid", gap: 6 }}>
                {question.options.map((option) => (
                  <label key={option.value} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={answers[index] === option.value}
                      onChange={handleAnswerChange(index)}
                    />
                    <span>
                      {option.value}. {option.label}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                rows={3}
                value={answers[index]}
                onChange={handleAnswerChange(index)}
                placeholder="Write your answer in German."
                style={{ ...styles.textarea, margin: 0 }}
              />
            )}
          </label>
        ))}
      </div>

      {Array.isArray(checklist) && checklist.length ? (
        <div style={{ padding: 12, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <p style={{ margin: "0 0 6px", fontWeight: 600 }}>Before you submit</p>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#4b5563", fontSize: 13, display: "grid", gap: 4 }}>
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <button type="button" style={styles.secondaryButton} onClick={handleCopy}>
          Copy answers
        </button>
        {onOpenSubmission ? (
          <button type="button" style={styles.primaryButton} onClick={handleCopyAndOpen}>
            Copy + open submission
          </button>
        ) : null}
        <button type="button" style={styles.secondaryButton} onClick={handleClear}>
          Clear form
        </button>
        {onOpenSubmission ? (
          <button type="button" style={styles.secondaryButton} onClick={onOpenSubmission}>
            Open assignment submission
          </button>
        ) : null}
        {copyStatus ? <span style={{ fontSize: 13, color: "#059669" }}>{copyStatus}</span> : null}
      </div>
    </section>
  );
};

export default AssignmentForm;
