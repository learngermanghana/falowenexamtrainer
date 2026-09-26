import React from "react";
import { getA2ReadingTask } from "../data/a2ReadingTasks";

const taskCard = {
  border: "1px solid #dbeafe",
  borderRadius: 14,
  padding: 14,
  background: "#f8fbff",
  display: "grid",
  gap: 9,
};

const questionCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 6,
};

const A2ReadingTaskPanel = ({ day }) => {
  const task = getA2ReadingTask(day);
  const text = task?.text || "";
  const questions = task?.questions || [];

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {task ? (
        <div style={taskCard}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: ".05em" }}>
              {task.format}
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>A2 exam reading practice</span>
          </div>
          <strong style={{ color: "#0f172a" }}>{task.title}</strong>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            <strong>Lesestrategie:</strong> {task.strategy}
          </p>
        </div>
      ) : null}

      <p style={{ margin: 0 }}>
        Lies den Text und die Fragen. <strong>Antworte nicht direkt auf dieser Seite.</strong> Trage deine endgültigen
        Antwortbuchstaben im Submit-Bereich ein.
      </p>

      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: 14,
          background: "#fff",
          lineHeight: 1.75,
          whiteSpace: "pre-line",
          color: "#1f2937",
        }}
      >
        {text || "Lies einen kurzen A2-Text zum Thema des Tages und finde Hauptinformation und wichtige Details."}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {questions.map((question, index) => (
          <div key={`${day}-reading-${index}-${question.stem}`} style={questionCard}>
            <strong>{index + 1}. {question.stem}</strong>
            {(question.options || []).map((option) => <span key={option}>{option}</span>)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default A2ReadingTaskPanel;
