import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AssignmentSubmissionDebugPanel from "./AssignmentSubmissionDebugPanel";
import VerifiedCloudDraftSubmissionPage from "./VerifiedCloudDraftSubmissionPage";
import { styles } from "../styles";

const AUTO_RESOLVE_POLL_MS = 120;
const AUTO_RESOLVE_MAX_ATTEMPTS = 80;

const buildSubmitClassName = (assignmentKey = "A1-assignment") =>
  `a1-canonical-submit-${String(assignmentKey).toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

export default function A1CanonicalSubmissionPanel({ assignment, submitTitle, submitDescription }) {
  const location = useLocation();
  const navigate = useNavigate();
  const submitRootRef = useRef(null);
  const autoResolveInFlightRef = useRef(false);
  const [autoResolveMessage, setAutoResolveMessage] = useState("");
  const searchParams = useMemo(() => new URLSearchParams(location.search || ""), [location.search]);
  const requestedTab = searchParams.get("workbookTab");
  const assignmentKey = assignment.assignmentKey;
  const submissionContextReady =
    searchParams.get("assignmentKey") === assignmentKey &&
    searchParams.get("assignmentId") === assignmentKey &&
    searchParams.get("level") === "A1";
  const submitDebugEnabled = searchParams.get("submitDebug") === "1";

  useEffect(() => {
    autoResolveInFlightRef.current = false;
    setAutoResolveMessage("");
  }, [assignmentKey]);

  useEffect(() => {
    if (requestedTab !== "submit" || submissionContextReady) return;

    const nextSearch = new URLSearchParams(location.search || "");
    nextSearch.set("workbookTab", "submit");
    nextSearch.set("assignmentKey", assignmentKey);
    nextSearch.set("assignmentId", assignmentKey);
    nextSearch.set("level", "A1");

    navigate(
      { pathname: location.pathname, search: `?${nextSearch.toString()}` },
      {
        replace: true,
        state: {
          ...(location.state || {}),
          level: "A1",
          day: assignment.day,
          chapter: assignment.chapter,
          assignmentKey,
          assignmentId: assignmentKey,
          canonicalAssignmentKey: assignmentKey,
          inlineCourseSubmission: true,
        },
      },
    );
  }, [
    assignment.chapter,
    assignment.day,
    assignmentKey,
    location.pathname,
    location.search,
    location.state,
    navigate,
    requestedTab,
    submissionContextReady,
  ]);

  const handleSubmissionCapture = async (event) => {
    const root = submitRootRef.current;
    const cloudDraftRoot = root?.querySelector('[data-cloud-draft-persistence="react-owned"]');
    const hasCloudConflict = cloudDraftRoot?.getAttribute("data-draft-conflict") === "true";
    if (!hasCloudConflict) return;

    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent?.stopImmediatePropagation?.();
    if (autoResolveInFlightRef.current) return;

    const form = event.target?.tagName === "FORM" ? event.target : event.target?.closest?.("form");
    const submitter = event.nativeEvent?.submitter || null;
    const keepDeviceButton = Array.from(root?.querySelectorAll("button") || []).find(
      (button) => String(button.textContent || "").trim().toLowerCase() === "keep this device version",
    );

    if (!form || !keepDeviceButton || keepDeviceButton.disabled) {
      setAutoResolveMessage("A newer cloud draft was found. Please press Submit again in a moment.");
      return;
    }

    autoResolveInFlightRef.current = true;
    setAutoResolveMessage(
      "A newer cloud draft was detected. Saving the answer visible on this device as the final version…",
    );
    keepDeviceButton.click();

    for (let attempt = 0; attempt < AUTO_RESOLVE_MAX_ATTEMPTS; attempt += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, AUTO_RESOLVE_POLL_MS));
      if (!submitRootRef.current || !form.isConnected) {
        autoResolveInFlightRef.current = false;
        return;
      }

      const currentCloudRoot = submitRootRef.current.querySelector('[data-cloud-draft-persistence="react-owned"]');
      const conflictStillExists = currentCloudRoot?.getAttribute("data-draft-conflict") === "true";
      const draftState = currentCloudRoot?.getAttribute("data-draft-save-state") || "";

      if (!conflictStillExists && draftState === "saved") {
        autoResolveInFlightRef.current = false;
        setAutoResolveMessage("Draft conflict resolved automatically. Submitting the answer visible on this device…");
        window.setTimeout(() => {
          if (!form.isConnected) return;
          if (submitter?.isConnected) form.requestSubmit(submitter);
          else form.requestSubmit();
        }, 0);
        return;
      }

      if (draftState === "error") {
        autoResolveInFlightRef.current = false;
        setAutoResolveMessage(
          "The automatic draft recovery could not finish. Check your internet connection and press Submit again.",
        );
        return;
      }
    }

    autoResolveInFlightRef.current = false;
    setAutoResolveMessage("Automatic draft recovery is taking longer than expected. Please press Submit again.");
  };

  const submitClassName = buildSubmitClassName(assignmentKey);

  return (
    <section
      style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #bfdbfe" }}
      aria-label={`Submit ${assignmentKey} answers`}
    >
      <div>
        <p style={{ color: "#1d4ed8", fontSize: 13, fontWeight: 900, letterSpacing: ".04em", margin: 0, textTransform: "uppercase" }}>
          Tutor-marked assignment
        </p>
        <h2 style={{ margin: "4px 0" }}>{submitTitle || `Submit ${assignmentKey}`}</h2>
        <p style={{ color: "#475569", margin: 0 }}>
          {submitDescription || `This submission is locked to ${assignmentKey}.`}
        </p>
      </div>

      <div
        ref={submitRootRef}
        className={submitClassName}
        data-a1-built-in-submission
        data-assignment-key={assignmentKey}
        data-auto-resolve-draft-conflicts="visible-version-on-submit"
        onSubmitCapture={handleSubmissionCapture}
      >
        <style>{`
          .${submitClassName} > div > section:first-child { display: none !important; }
          .${submitClassName} select { display: none !important; }
          .${submitClassName} textarea {
            background: #ffffff !important;
            color: #111827 !important;
            -webkit-text-fill-color: #111827 !important;
            caret-color: #111827 !important;
            opacity: 1 !important;
            visibility: visible !important;
            font-size: 16px !important;
            line-height: 1.7 !important;
            pointer-events: auto !important;
            touch-action: manipulation !important;
            -webkit-user-select: text !important;
            user-select: text !important;
            position: relative !important;
            z-index: 1 !important;
          }
          .${submitClassName} textarea::placeholder {
            color: #6b7280 !important;
            -webkit-text-fill-color: #6b7280 !important;
            opacity: 1 !important;
          }
        `}</style>

        {autoResolveMessage ? (
          <p role="status" aria-live="polite" style={{ background: "#eff6ff", border: "1px solid #93c5fd", borderRadius: 10, color: "#1e3a8a", fontWeight: 700, margin: "0 0 10px", padding: "10px 12px" }}>
            {autoResolveMessage}
          </p>
        ) : null}

        {submitDebugEnabled ? (
          <AssignmentSubmissionDebugPanel
            rootRef={submitRootRef}
            assignmentKey={assignmentKey}
            level="A1"
            day={assignment.day}
            contextReady={submissionContextReady}
          />
        ) : null}

        {submissionContextReady ? (
          <VerifiedCloudDraftSubmissionPage
            submissionContext={{
              level: "A1",
              day: assignment.day,
              chapter: assignment.chapter,
              assignmentKey,
              assignmentId: assignmentKey,
              canonicalAssignmentKey: assignmentKey,
            }}
          />
        ) : (
          <p role="status" style={{ color: "#475569", margin: 8 }}>
            Preparing the correct assignment submission…
          </p>
        )}
      </div>
    </section>
  );
}
