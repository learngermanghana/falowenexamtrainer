import React, { useEffect, useRef, useState } from "react";
import { styles } from "../styles";
import LessonClassNotesPanel from "./LessonClassNotesPanel";
import WorkbookReadAloudInjector from "./WorkbookReadAloudInjector";

export const A2B1WorkbookGuidance = ({ showClassNotes = true, compactNotes = true }) => {
  const [activePart, setActivePart] = useState("guide");
  const [hasOpenedNotes, setHasOpenedNotes] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (activePart === "notes") {
      setHasOpenedNotes(true);
    }
  }, [activePart]);

  useEffect(() => {
    if (!showClassNotes || !sectionRef.current || typeof document === "undefined") return undefined;

    const section = sectionRef.current;
    const headerCard = section.previousElementSibling;
    if (!headerCard || headerCard.querySelector('[data-class-notes-main-tab="true"]')) return undefined;

    const tabRows = Array.from(headerCard.querySelectorAll("div"));
    const tabRow = tabRows.find((row) => {
      const buttons = Array.from(row.querySelectorAll("button"));
      const buttonText = buttons.map((button) => button.textContent || "").join(" ");
      return buttons.length >= 4 && buttonText.includes("Teil 1") && buttonText.includes("Teil 4");
    });

    if (!tabRow) return undefined;

    const button = document.createElement("button");
    button.type = "button";
    button.dataset.classNotesMainTab = "true";
    button.textContent = "Teil 5 · Class Notes";
    button.style.border = "1px solid #d1d5db";
    button.style.background = "#ffffff";
    button.style.color = "#111827";
    button.style.borderRadius = "999px";
    button.style.padding = "9px 16px";
    button.style.fontWeight = "600";
    button.style.cursor = "pointer";
    button.style.fontFamily = "inherit";
    button.style.fontSize = "inherit";

    const activateNotes = () => {
      setActivePart("notes");
      setHasOpenedNotes(true);
      button.style.borderColor = "#2563eb";
      button.style.background = "#eff6ff";
      button.style.color = "#1d4ed8";
      window.setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    };

    button.addEventListener("click", activateNotes);
    tabRow.appendChild(button);

    return () => {
      button.removeEventListener("click", activateNotes);
      button.remove();
    };
  }, [showClassNotes]);

  return (
    <>
      <WorkbookReadAloudInjector />
      <section
        ref={sectionRef}
        aria-label="Workbook guide and class notes"
        style={{
          ...styles.card,
          margin: 0,
          display: "grid",
          gap: 12,
          border: "1px solid #bfdbfe",
          background: "#eff6ff",
          color: "#1e3a8a",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "1.05rem" }}>How this workbook works</h2>
          {showClassNotes && !hasOpenedNotes ? (
            <span style={{ ...styles.badge, background: "#dbeafe", color: "#1d4ed8" }}>Class notes available</span>
          ) : null}
        </div>

        <div style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>
            Each A2/B1 workbook now has <strong>five parts</strong>: Sprechen, Schreiben, Lesen, Hören and Class Notes.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Teil 1 · Sprechen</strong> is practical class preparation. You do not submit Teil 1 as an assignment. Prepare it before class and use the AI speaking coach on this page to practise.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Hören</strong> are the assignment parts. You can practise with the AI tools on this page, but your final answers must be submitted in the <strong>Submission</strong> tab.
          </p>
          {showClassNotes ? (
            <p style={{ margin: 0 }}>
              <strong>Teil 5 · Class Notes</strong> is not an assignment. It is where your tutor saves vocabulary from Zoom, short suggestions, corrections, reminders and answers to class questions for this exact lesson.
            </p>
          ) : null}
          <p style={{ margin: 0 }}>
            <strong>Read aloud:</strong> In Teil 3 · Lesen, use the free German voice controls to listen to the text, pause, continue, stop and change speed.
          </p>
        </div>

        {showClassNotes && activePart === "notes" ? <LessonClassNotesPanel compact={compactNotes} /> : null}
      </section>
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
    Reminder: This page is for learning and practice. Submit only your final assignment work in the Submission tab.
  </div>
);
