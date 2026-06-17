import React, { useMemo } from "react";
import { styles } from "../styles";

const inferLevel = (lesson = {}) => String(lesson?.level || lesson?.courseLevel || "").trim().toUpperCase();
const inferWorkbookId = (lesson = {}) => lesson?.workbookId || lesson?.id || [lesson?.level, lesson?.day].filter(Boolean).join("-day-") || "current-workbook";

const buildReferenceSections = ({ level, lesson, task }) => {
  const writingTask = task || lesson?.writingTask || lesson?.writingTopic || lesson?.topic || "Use the writing task from this workbook.";
  const title = lesson?.title || lesson?.lessonTitle || "Current lesson";
  const checklist = Array.isArray(lesson?.writingChecklist) ? lesson.writingChecklist : Array.isArray(lesson?.checklist) ? lesson.checklist : [];
  const usefulLines = Array.isArray(lesson?.writingUsefulLines) ? lesson.writingUsefulLines : Array.isArray(lesson?.modelSentences) ? lesson.modelSentences : [];

  return [
    {
      title: `${level || "Course"} reference for ${title}`,
      body: writingTask,
      items: checklist,
    },
    usefulLines.length
      ? {
          title: "Useful structures to compare with your answer",
          body: "Use these as reference language after you have completed your own attempt.",
          items: usefulLines,
        }
      : null,
  ].filter(Boolean);
};

export default function WorkbookReferenceAnswers({ level, lesson = {}, task, workbookId }) {
  const resolvedLevel = level || inferLevel(lesson);
  const resolvedWorkbookId = workbookId || inferWorkbookId(lesson);
  const sections = useMemo(() => buildReferenceSections({ level: resolvedLevel, lesson, task }), [lesson, resolvedLevel, task]);

  return (
    <section data-workbook-reference-answers style={{ ...styles.card, display: "grid", gap: 14 }}>
      <div>
        <span style={{ ...styles.badge, width: "fit-content", background: "#eef2ff", color: "#3730a3" }}>Tab 5</span>
        <h2 style={{ margin: "8px 0 4px" }}>Reference Answers</h2>
        <p style={{ margin: 0, color: "#475569" }}>
          Reference content is selected for {resolvedLevel || "this level"} and workbook {resolvedWorkbookId}. Use it after your own attempt; the writing form and AI marking stay inside the writing tab.
        </p>
      </div>
      {sections.map((section) => (
        <article key={section.title} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, background: "#fff" }}>
          <h3 style={{ margin: "0 0 8px" }}>{section.title}</h3>
          <p style={{ margin: 0, lineHeight: 1.65 }}>{section.body}</p>
          {section.items?.length ? <ul style={{ marginBottom: 0 }}>{section.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}
        </article>
      ))}
    </section>
  );
}
