import React, { useMemo, useState } from "react";
import WritingHistorySection from "./WritingHistorySection";
import WritingReferenceLibrary from "./WritingReferenceLibrary";
import { styles } from "../styles";

const normalize = (value) => String(value || "").trim().toUpperCase();

const belongsToCurrentLesson = (entry, context = {}, level) => {
  const currentLevel = normalize(context.level || context.courseLevel || level);
  const entryLevel = normalize(entry.level || entry.courseLevel);
  if (currentLevel && entryLevel && currentLevel !== entryLevel) return false;

  const currentLessonId = String(context.lessonId || "").trim();
  const currentWorkbookId = String(context.workbookId || "").trim();
  if (!currentLessonId && !currentWorkbookId) return true;

  return Boolean(
    (currentLessonId && entry.lessonId === currentLessonId) ||
      (currentWorkbookId && entry.workbookId === currentWorkbookId),
  );
};

export default function WritingLibraryTab({
  context = {},
  historyEntries = [],
  level,
  onOpenAttempt,
  referenceProps,
}) {
  const [showAll, setShowAll] = useState(false);
  const currentEntries = useMemo(
    () =>
      historyEntries.filter((entry) =>
        belongsToCurrentLesson(entry, context, level),
      ),
    [context, historyEntries, level],
  );
  const visibleEntries = showAll ? historyEntries : currentEntries;
  const hiddenCount = Math.max(historyEntries.length - currentEntries.length, 0);
  const dayLabel =
    context.day === 0 || context.day ? String(context.day) : "—";

  return (
    <section data-writing-library-tab style={{ display: "grid", gap: 16 }}>
      <div style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, marginBottom: 4 }}>
          References and saved writing
        </h3>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Level {context.level || context.courseLevel || level || "—"} · Day{" "}
          {dayLabel} ·{" "}
          {context.taskTitle ||
            context.lessonId ||
            context.workbookId ||
            "Writing task"}
        </p>
      </div>
      <WritingReferenceLibrary {...referenceProps} />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          style={showAll ? styles.secondaryButton : styles.primaryButton}
          onClick={() => setShowAll(false)}
        >
          This lesson ({currentEntries.length})
        </button>
        <button
          type="button"
          style={showAll ? styles.primaryButton : styles.secondaryButton}
          onClick={() => setShowAll(true)}
        >
          All saved writing ({historyEntries.length})
        </button>
      </div>
      {!showAll && hiddenCount > 0 ? (
        <p style={{ ...styles.helperText, margin: 0 }}>
          {hiddenCount} attempt{hiddenCount === 1 ? "" : "s"} from other
          lessons are available under “All saved writing”.
        </p>
      ) : null}
      <WritingHistorySection
        title={showAll ? "All saved letters and texts" : "This lesson’s saved writing"}
        entries={visibleEntries}
        level={context.level || context.courseLevel || level}
        onOpen={onOpenAttempt}
      />
    </section>
  );
}
