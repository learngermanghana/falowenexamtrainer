import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import WorkbookReadAloudInjector from "./WorkbookReadAloudInjector";
import "./A2B1WorkbookGuidance.css";

const GUIDE_SEEN_PREFIX = "falowen:workbook-guide-seen:v1:";

const resolveWorkbookLevel = (level) => {
  const explicit = String(level || "").trim().toUpperCase();
  if (["A2", "B1"].includes(explicit)) return explicit;

  if (typeof window === "undefined") return "";
  const path = `${window.location.pathname || ""} ${window.location.href || ""}`.toUpperCase();
  if (/\bB1\b|B1DAY|\/B1\//.test(path)) return "B1";
  if (/\bA2\b|A2DAY|\/A2\//.test(path)) return "A2";
  return "";
};

const hasSeenGuide = (level) => {
  if (typeof window === "undefined" || !window.localStorage) return false;
  try {
    return window.localStorage.getItem(`${GUIDE_SEEN_PREFIX}${level || "general"}`) === "1";
  } catch {
    return false;
  }
};

const markGuideSeen = (level) => {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(`${GUIDE_SEEN_PREFIX}${level || "general"}`, "1");
  } catch {
    // Ignore unavailable storage.
  }
};

const findGuideTarget = (marker) => {
  const workbookRoot = marker?.parentElement;
  if (!workbookRoot) return null;

  const headerCard = Array.from(workbookRoot.children).find(
    (child) =>
      child.querySelector?.("h1") &&
      Array.from(child.querySelectorAll?.("button") || []).some((button) =>
        /teil\s*1/i.test(button.textContent || ""),
      ),
  );
  if (!headerCard) return null;

  const existingHost = headerCard.querySelector(":scope > .workbook-guide__host");
  if (existingHost) return existingHost;

  const tabRow = Array.from(headerCard.children).find((child) => {
    const buttons = Array.from(child.querySelectorAll?.("button") || []);
    return buttons.length >= 4 && buttons.some((button) => /teil\s*1/i.test(button.textContent || ""));
  });

  const host = document.createElement("div");
  host.className = "workbook-guide__host";
  host.dataset.workbookGuideHost = "true";
  headerCard.insertBefore(host, tabRow || null);
  return host;
};

const GuidancePanel = ({ workbookLabel, open, onToggle }) => (
  <details className="workbook-guide" open={open} onToggle={onToggle}>
    <summary>How this workbook works</summary>
    <div className="workbook-guide__content">
      <p>
        This {workbookLabel} has <strong>four parts</strong>: Sprechen, Schreiben, Lesen and Hören.
      </p>
      <p>
        <strong>Teil 1 · Sprechen:</strong> Prepare before class and practise with the AI speaking coach. No submission is required.
      </p>
      <p>
        <strong>Teile 2–4:</strong> Practise on this page, then submit your final answers in the <strong>Submission</strong> tab.
      </p>
    </div>
  </details>
);

export const A2B1WorkbookGuidance = ({ level = "" }) => {
  const workbookLevel = useMemo(() => resolveWorkbookLevel(level), [level]);
  const workbookLabel = workbookLevel ? `${workbookLevel} workbook` : "workbook";
  const markerRef = useRef(null);
  const [portalTarget, setPortalTarget] = useState(null);
  const [isOpen, setIsOpen] = useState(() => !hasSeenGuide(workbookLevel));

  useEffect(() => {
    setIsOpen(!hasSeenGuide(workbookLevel));
    markGuideSeen(workbookLevel);
  }, [workbookLevel]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const target = findGuideTarget(markerRef.current);
    setPortalTarget(target);

    return () => {
      if (target?.dataset?.workbookGuideHost === "true") target.remove();
    };
  }, []);

  const panel = (
    <GuidancePanel
      workbookLabel={workbookLabel}
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    />
  );

  return (
    <>
      <WorkbookReadAloudInjector />
      <span ref={markerRef} hidden aria-hidden="true" />
      {portalTarget ? createPortal(panel, portalTarget) : panel}
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
