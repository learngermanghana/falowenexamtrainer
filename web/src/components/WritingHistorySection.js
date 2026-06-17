import React from "react";
import WritingFeedbackCard from "./WritingFeedbackCard";
import { styles } from "../styles";

export const buildWritingHistoryRecord = ({ userId, studentCode, level, day, lessonId, workbookId, taskId, taskTitle, text, data, context }) => {
  const now = new Date().toISOString();
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    studentId: studentCode || userId || "",
    userId: userId || "",
    courseLevel: level || data?.level || "",
    level: level || data?.level || "",
    day: day || data?.day || null,
    lessonId: lessonId || data?.lessonId || workbookId || context || "writing-room",
    workbookId: workbookId || data?.workbookId || context || "writing-room",
    writingTaskId: taskId || "custom",
    taskTitle: taskTitle || "Custom writing task",
    originalLetter: text,
    originalText: text,
    score: data?.score ?? null,
    maxScore: data?.maxScore ?? null,
    rubricScores: data?.rubric || null,
    summary: data?.summary || data?.structuredFeedback?.summary || "",
    strengths: data?.strengths || data?.structuredFeedback?.strengths || [],
    areasToImprove: data?.mainIssues || data?.areasToImprove || data?.structuredFeedback?.mainIssues || [],
    corrections: Array.isArray(data?.corrections) ? data.corrections : [],
    improvedVersion: data?.improvedVersion || data?.structuredFeedback?.improvedVersion || "",
    feedback: data?.feedback || "",
    structuredFeedback: data?.structuredFeedback || data || null,
    submissionDate: now,
    createdAt: now,
    lastUpdatedDate: now,
    updatedAt: now,
  };
};

export default function WritingHistorySection({ title = "Writing History", entries = [], level, onOpen }) {
  return (
    <section data-writing-history style={{ ...styles.helperCard, display: "grid", gap: 12 }}>
      <div>
        <h3 style={{ margin: "0 0 4px" }}>{title}</h3>
        <p style={{ margin: 0, color: "#64748b" }}>Previous attempts are saved to your Falowen account. Open one to edit and resubmit it as a new attempt.</p>
      </div>
      {!entries.length ? <p style={{ margin: 0 }}>No saved writing attempts yet.</p> : entries.slice().reverse().map((entry, index) => (
        <article key={entry.id || `${entry.submissionDate}-${index}`} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#fff", display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
            <strong>Attempt {entries.length - index}: {entry.taskTitle || entry.writingTaskId || "Writing task"}</strong>
            <span>{entry.score ?? "—"}/{entry.maxScore ?? "—"} · {entry.submissionDate ? new Date(entry.submissionDate).toLocaleString() : "saved"}</span>
          </div>
          <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "#334155" }}>{String(entry.originalLetter || entry.originalText || "").slice(0, 360)}</p>
          <button type="button" style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => onOpen?.(entry)}>Open this attempt</button>
          <WritingFeedbackCard feedback={entry.feedback || entry.summary} level={entry.courseLevel || level} draft={entry.originalLetter || entry.originalText} rubric={entry.rubricScores} corrections={entry.corrections} structuredFeedback={entry.structuredFeedback} />
        </article>
      ))}
    </section>
  );
}
