import React, { useMemo } from "react";
import { styles } from "../styles";
import Day9FalowenRadioPilot from "./Day9FalowenRadioPilot";
import WorkbookReadAloudInjector from "./WorkbookReadAloudInjector";

const resolveWorkbookLevel = (level) => {
  const explicit = String(level || "").trim().toUpperCase();
  if (["A2", "B1"].includes(explicit)) return explicit;

  if (typeof window === "undefined") return "";
  const path = `${window.location.pathname || ""} ${window.location.href || ""}`.toUpperCase();
  if (/\bB1\b|B1DAY|\/B1\//.test(path)) return "B1";
  if (/\bA2\b|A2DAY|\/A2\//.test(path)) return "A2";
  return "";
};

export const A2B1WorkbookGuidance = ({ level = "" }) => {
  const workbookLevel = useMemo(() => resolveWorkbookLevel(level), [level]);
  const workbookLabel = workbookLevel ? `${workbookLevel} workbook` : "workbook";

  return (
    <>
      <WorkbookReadAloudInjector />
      <Day9FalowenRadioPilot />
      <section
        aria-label="Workbook guide"
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
        <h2 style={{ margin: 0, fontSize: "1.05rem" }}>How this workbook works</h2>

        <div style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>
            This {workbookLabel} has <strong>four parts</strong>: Sprechen, Schreiben, Lesen and Hören.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Teil 1 · Sprechen</strong> is practical class preparation. You do not submit Teil 1 as an assignment. Prepare it before class and use the AI speaking coach on this page to practise.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Hören</strong> are the assignment parts. You can practise with the AI tools on this page, but your final answers must be submitted in the <strong>Submission</strong> tab.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Read aloud:</strong> In Teil 3 · Lesen, use the free German voice controls to listen to the text, pause, continue, stop and change speed.
          </p>
        </div>
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
