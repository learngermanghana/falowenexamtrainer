import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import WorkbookReadAloudInjector from "./WorkbookReadAloudInjector";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";

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
  const levelPrefix = workbookLevel || "A2/B1";

  return (
    <>
      <WorkbookReadAloudInjector />
      <details
        style={{
          ...styles.card,
          margin: 0,
          border: "1px solid #bfdbfe",
          background: "#eff6ff",
          color: "#1e3a8a",
          padding: 0,
          overflow: "hidden",
        }}
      >
        <summary
          style={{
            cursor: "pointer",
            padding: 14,
            fontWeight: 800,
            fontSize: "1.02rem",
            listStylePosition: "inside",
          }}
        >
          How this workbook works · open guide
        </summary>

        <div style={{ display: "grid", gap: 10, padding: "0 14px 14px", lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>
            Use the tabs above to move between the four parts of this {workbookLabel}. The highlighted task card at the top of each part tells you exactly what to answer.
          </p>
          <p style={{ margin: 0 }}>
            <strong>{levelPrefix} · Teil 1 · Sprechen:</strong> prepare for class and practise with the AI speaking coach. Teil 1 is not submitted.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Hören:</strong> complete the tasks and send only your final answers through the <strong>Submit</strong> tab.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Read aloud:</strong> In Teil 3, use the German voice controls to listen to the reading text, pause, continue, stop and change speed.
          </p>
        </div>
      </details>
    </>
  );
};

export const WorkbookSubmissionReminder = () => {
  const reminderRef = useRef(null);
  const [showDay20Submission, setShowDay20Submission] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isDay20Workbook = window.location.pathname.includes(
      "/campus/course/a2-day-20-typische-reklamationssituationen-workbook"
    );
    const sectionTitle = reminderRef.current
      ?.closest("section")
      ?.querySelector("h2")
      ?.textContent?.trim()
      ?.toLowerCase();

    setShowDay20Submission(Boolean(isDay20Workbook && sectionTitle?.startsWith("submit workbook")));
  }, []);

  if (showDay20Submission) {
    return (
      <div
        ref={reminderRef}
        className="a2-day20-inline-submission"
        style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}
      >
        <style>{`.a2-day20-inline-submission > div > section:first-child { display: none !important; }
        .a2-day20-inline-submission select { display: none !important; }
        .a2-day20-inline-submission ~ a[href="/campus/course?submitWork=1"] { display: none !important; }`}</style>
        <AssignmentSubmissionPage />
      </div>
    );
  }

  return (
    <div
      ref={reminderRef}
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
      Reminder: Practise here, then submit only your final answers through the Submit tab.
    </div>
  );
};
