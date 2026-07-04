import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import WorkbookReadAloudInjector from "./WorkbookReadAloudInjector";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";

const LEGACY_A2_SUBMIT_CONFIG_BY_PATH = {
  "/campus/course/a2-day-12-mein-traumberuf-workbook": {
    day: 12,
    chapter: "5.12",
    assignmentKey: "A2-5.12",
    workbookId: "A2Day12MeinTraumberuf",
    title: "Mein Traumberuf",
  },
  "/campus/course/a2-day-13-vorstellungsgespraech-workbook": {
    day: 13,
    chapter: "5.13",
    assignmentKey: "A2-5.13",
    workbookId: "A2Day13Vorstellungsgespraech",
    title: "Vorstellungsgespräch",
  },
  "/campus/course/a2-day-15-mein-lieblingssport-workbook": {
    day: 15,
    chapter: "6.15",
    assignmentKey: "A2-6.15",
    workbookId: "A2Day15MeinLieblingssport",
    title: "Mein Lieblingssport",
  },
  "/campus/course/a2-day-16-wohlbefinden-und-entspannung-workbook": {
    day: 16,
    chapter: "6.16",
    assignmentKey: "A2-6.16",
    workbookId: "A2Day16WohlbefindenUndEntspannung",
    title: "Wohlbefinden und Entspannung",
  },
  "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook": {
    day: 26,
    chapter: "10.26",
    assignmentKey: "A2-10.26",
    workbookId: "A2Day26GefuehleInVerschiedenenSituationen",
    title: "Gefühle in verschiedenen Situationen",
  },
};

const resolveWorkbookLevel = (level) => {
  const explicit = String(level || "").trim().toUpperCase();
  if (["A2", "B1"].includes(explicit)) return explicit;

  if (typeof window === "undefined") return "";
  const path = `${window.location.pathname || ""} ${window.location.href || ""}`.toUpperCase();
  if (/\bB1\b|B1DAY|\/B1\//.test(path)) return "B1";
  if (/\bA2\b|A2DAY|\/A2\//.test(path)) return "A2";
  return "";
};

const getLegacyA2SubmitConfig = () => {
  if (typeof window === "undefined") return null;
  const pathname = String(window.location.pathname || "").replace(/\/$/, "");
  return LEGACY_A2_SUBMIT_CONFIG_BY_PATH[pathname] || null;
};

const isLegacyWorkbookTabRow = (element) => {
  if (!element || element.dataset?.a2LegacySubmitPatched === "true") return false;
  const buttons = Array.from(element.children || []).filter((child) => child.tagName === "BUTTON");
  if (buttons.length < 5) return false;

  const labels = buttons.map((button) => button.textContent || "").join(" ");
  return (
    /Teil\s*1/i.test(labels) &&
    /Teil\s*2/i.test(labels) &&
    /Teil\s*3/i.test(labels) &&
    /Teil\s*4/i.test(labels) &&
    /Ref/i.test(labels)
  );
};

const applySubmitButtonStyle = (button, active) => {
  if (!button) return;
  Object.assign(button.style, {
    border: `1px solid ${active ? "#2563eb" : "#d1d5db"}`,
    borderRadius: "8px",
    background: active ? "#eff6ff" : "#fff",
    color: active ? "#1d4ed8" : "#111827",
    cursor: "pointer",
    fontWeight: "700",
    padding: "8px 12px",
  });
  button.setAttribute("aria-pressed", active ? "true" : "false");
};

const LegacyA2SubmitTabPatch = () => {
  const [config, setConfig] = useState(null);
  const [submitActive, setSubmitActive] = useState(false);
  const submitSectionRef = useRef(null);

  useEffect(() => {
    setConfig(getLegacyA2SubmitConfig());
  }, []);

  const decorateTabs = useCallback(() => {
    if (!config || typeof document === "undefined") return;

    const tabRow = Array.from(document.querySelectorAll("div")).find(isLegacyWorkbookTabRow);
    if (!tabRow) return;

    tabRow.dataset.a2LegacySubmitPatched = "true";

    const legacyButtons = Array.from(tabRow.children || []).filter(
      (child) => child.tagName === "BUTTON" && child.dataset.a2LegacySubmitButton !== "true"
    );

    legacyButtons.forEach((button) => {
      if (button.dataset.a2LegacyResetBound === "true") return;
      button.dataset.a2LegacyResetBound = "true";
      button.addEventListener("click", () => setSubmitActive(false));
    });

    let submitButton = tabRow.querySelector('[data-a2-legacy-submit-button="true"]');
    if (!submitButton) {
      submitButton = document.createElement("button");
      submitButton.type = "button";
      submitButton.textContent = "Submit";
      submitButton.dataset.a2LegacySubmitButton = "true";
      submitButton.addEventListener("click", () => {
        setSubmitActive(true);
        window.setTimeout(() => {
          submitSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 40);
      });
      tabRow.appendChild(submitButton);
    }

    applySubmitButtonStyle(submitButton, submitActive);
  }, [config, submitActive]);

  useEffect(() => {
    if (!config || typeof document === "undefined") return undefined;

    decorateTabs();
    const observer = new MutationObserver(decorateTabs);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [config, decorateTabs]);

  useEffect(() => {
    decorateTabs();
  }, [decorateTabs, submitActive]);

  if (!config || !submitActive) return null;

  return (
    <section ref={submitSectionRef} style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #bfdbfe" }}>
      <h2 style={{ margin: 0 }}>Submit Workbook · A2 Day {config.day} · Kapitel {config.chapter}</h2>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
        Submit your final answers for <strong>{config.title}</strong>. Teil 1 is group practice only; submit the final work for Teil 2, Teil 3 and Teil 4 where required.
      </p>
      <div
        className="legacy-a2-inline-submission"
        style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}
      >
        <style>{`.legacy-a2-inline-submission > div > section:first-child { display: none !important; }
        .legacy-a2-inline-submission select { display: none !important; }`}</style>
        <AssignmentSubmissionPage
          submissionContext={{
            level: "A2",
            day: config.day,
            assignmentKey: config.assignmentKey,
            canonicalAssignmentKey: config.assignmentKey,
            workbookId: config.workbookId,
          }}
        />
      </div>
    </section>
  );
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
            Use the tabs above to move through the four workbook parts of this {workbookLabel}. Use <strong>Ref</strong> for reflection and the <strong>Submit</strong> tab in the Course Book when your final answers are ready.
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
      <LegacyA2SubmitTabPatch />
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
