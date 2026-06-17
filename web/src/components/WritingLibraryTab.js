import React from "react";
import WritingHistorySection from "./WritingHistorySection";
import WritingReferenceLibrary from "./WritingReferenceLibrary";
import { styles } from "../styles";

export default function WritingLibraryTab({
  context = {},
  historyEntries = [],
  level,
  onOpenAttempt,
  referenceProps,
}) {
  return (
    <section data-writing-library-tab style={{ display: "grid", gap: 16 }}>
      <div style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, marginBottom: 4 }}>
          References and saved writing
        </h3>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Level {context.level || level || "—"} · Day {context.day || "—"} ·{" "}
          {context.taskTitle ||
            context.lessonId ||
            context.workbookId ||
            "Writing task"}
        </p>
      </div>
      <WritingReferenceLibrary {...referenceProps} />
      <WritingHistorySection
        title="Saved letters and texts"
        entries={historyEntries}
        level={context.level || level}
        onOpen={onOpenAttempt}
      />
    </section>
  );
}
