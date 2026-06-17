import React from "react";
import WritingPage from "./WritingPage";

const inferLevel = (lesson = {}) => String(lesson?.level || lesson?.courseLevel || "").trim().toUpperCase();
const inferDay = (lesson = {}) => lesson?.day || lesson?.lessonDay || null;
const inferWorkbookId = (lesson = {}) => lesson?.workbookId || lesson?.id || [lesson?.level, lesson?.day].filter(Boolean).join("-day-") || "current-workbook";
const inferLessonId = (lesson = {}) => lesson?.lessonId || lesson?.id || [lesson?.level, lesson?.day].filter(Boolean).join("-day-") || inferWorkbookId(lesson);

export default function WorkbookReferenceAnswers({ level, lesson = {}, task, workbookId }) {
  const resolvedLevel = level || inferLevel(lesson);
  const resolvedWorkbookId = workbookId || inferWorkbookId(lesson);
  const taskTitle = task?.title || lesson?.writingTask?.title || lesson?.writingTopic || lesson?.topic || lesson?.title || "Writing task";

  return (
    <section data-workbook-reference-library>
      <WritingPage
        mode="course"
        initialTab="references"
        enabledTabs={["references"]}
        hideTabList
        hideWorkspaceIntro
        writingContext={{
          courseLevel: resolvedLevel,
          level: resolvedLevel,
          day: inferDay(lesson),
          lessonId: inferLessonId(lesson),
          workbookId: resolvedWorkbookId,
          writingTaskId: task?.id || lesson?.writingTask?.id || `${resolvedWorkbookId}-writing`,
          taskTitle,
        }}
      />
    </section>
  );
}
