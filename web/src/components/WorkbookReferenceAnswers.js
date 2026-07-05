import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";

const inferLevel = (lesson = {}) => String(lesson?.level || lesson?.courseLevel || "").trim().toUpperCase();
const inferDay = (lesson = {}) => lesson?.day || lesson?.lessonDay || null;
const inferWorkbookId = (lesson = {}) => lesson?.workbookId || lesson?.id || [lesson?.level, lesson?.day].filter(Boolean).join("-day-") || "current-workbook";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const noteBoxStyle = {
  width: "100%",
  minHeight: 260,
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  padding: 12,
  fontSize: "clamp(1rem, 4vw, 1.05rem)",
  lineHeight: 1.7,
  resize: "vertical",
  boxSizing: "border-box",
};

const helperStyle = {
  margin: 0,
  color: "#475569",
  lineHeight: 1.65,
};

export default function WorkbookReferenceAnswers({ level, lesson = {}, workbookId }) {
  const resolvedLevel = level || inferLevel(lesson);
  const resolvedDay = inferDay(lesson);
  const resolvedWorkbookId = workbookId || inferWorkbookId(lesson);
  const storageKey = useMemo(
    () => `falowen-workbook-notes:${resolvedLevel || "level"}:${resolvedDay || "day"}:${resolvedWorkbookId}`,
    [resolvedDay, resolvedLevel, resolvedWorkbookId],
  );
  const [notes, setNotes] = useState("");
  const [saveState, setSaveState] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setNotes(window.localStorage.getItem(storageKey) || "");
  }, [storageKey]);

  const saveNotes = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, notes);
    setSaveState("Saved on this device.");
    window.setTimeout(() => setSaveState(""), 2000);
  };

  const clearNotes = () => {
    setNotes("");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storageKey);
    }
    setSaveState("Notes cleared.");
    window.setTimeout(() => setSaveState(""), 2000);
  };

  return (
    <section data-workbook-student-notes style={cardStyle}>
      <span style={{ ...styles.badge, width: "fit-content" }}>Ref · My Notes</span>
      <h2 style={{ ...styles.title, margin: 0, fontSize: "1.35rem" }}>Save your important notes</h2>
      <p style={helperStyle}>
        This tab is for your own vocabulary, grammar reminders, tutor corrections and personal study notes. Official answer keys are not shown here.
      </p>
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Example: weil + verb at the end; der Tourismus; die Kosten; im Vergleich zu + Dativ ..."
        style={noteBoxStyle}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <button type="button" onClick={saveNotes} style={styles.primaryButton}>Save notes</button>
        <button type="button" onClick={clearNotes} style={styles.secondaryButton}>Clear</button>
        {saveState ? <span style={{ color: "#166534", fontWeight: 700 }}>{saveState}</span> : null}
      </div>
    </section>
  );
}
