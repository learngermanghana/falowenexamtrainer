import React, { useState } from "react";
import { styles } from "../styles";
import LessonClassNotesPanel from "./LessonClassNotesPanel";

export const A2B1WorkbookGuidance = ({ showClassNotes = true, compactNotes = true }) => {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <>
      <section
        aria-label="How this workbook works"
        style={{
          ...styles.card,
          margin: 0,
          display: "grid",
          gap: 10,
          border: "1px solid #bfdbfe",
          background: "#eff6ff",
          color: "#1e3a8a",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "1.05rem" }}>How this workbook works</h2>
          {showClassNotes ? (
            <button
              type="button"
              style={{ ...styles.secondaryButton, background: showNotes ? "#1d4ed8" : "#ffffff", color: showNotes ? "#ffffff" : "#1d4ed8", borderColor: "#93c5fd" }}
              onClick={() => setShowNotes((current) => !current)}
            >
              {showNotes ? "Hide Class Notes" : "Teil 5 · Class Notes"}
            </button>
          ) : null}
        </div>
        <div style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>
            <strong>Teil 1 · Sprechen</strong> is practical class preparation. You do not submit Teil 1 as an assignment. Use the AI
            speaking coach on this page to practise before class.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Hören</strong> are assignment parts. You can use the AI tools on
            this page to practise and improve, but when you are finished, submit your final answers in the Submission tab.
          </p>
          {showClassNotes ? (
            <p style={{ margin: 0 }}>
              <strong>Teil 5 · Class Notes</strong> saves vocabulary, Zoom notes, short tutor suggestions and student questions for this exact lesson and class.
            </p>
          ) : null}
        </div>
      </section>

      {showClassNotes && showNotes ? <LessonClassNotesPanel compact={compactNotes} /> : null}
    </>
  );
};

export const WorkbookSubmissionReminder = () => (
  <div
    role="note"
    style={{
      border: "1px solid #bfdbfe",
      borderRadius: 10,
      padding: "10px 12px",
      background: "#eff6ff",
      color: "#1e40af",
      fontWeight: 600,
      lineHeight: 1.5,
    }}
  >
    Reminder: This page is for learning and practice. Submit your final work in the Submission tab.
  </div>
);
