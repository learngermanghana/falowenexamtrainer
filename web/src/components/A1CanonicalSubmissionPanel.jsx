import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AssignmentSubmissionDebugPanel from "./AssignmentSubmissionDebugPanel";
import VerifiedCloudDraftSubmissionPage from "./VerifiedCloudDraftSubmissionPage";
import { useA1TutorWorkbookDraft } from "./A1TutorWorkbookDraftContext";
import { validateA1TutorDraftSubmissionSections } from "../data/a1TutorDraftProfiles";
import { styles } from "../styles";

const AUTO_RESOLVE_POLL_MS = 120;
const AUTO_RESOLVE_MAX_ATTEMPTS = 80;
const WORKBOOK_DRAFT_SEED_POLL_MS = 150;
const WORKBOOK_DRAFT_SEED_MAX_ATTEMPTS = 18;

const buildSubmitClassName = (assignmentKey = "A1-assignment") =>
  `a1-canonical-submit-${String(assignmentKey).toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

const missingRequiredNumbers = (answers, total) =>
  Array.from({ length: total }, (_, index) => index + 1).filter((number) => !answers.has(number));

const parseA1SubmissionSections = (text = "") => {
  const sections = new Map();
  let currentSection = "";

  String(text || "")
    .split(/\r?\n/)
    .forEach((rawLine) => {
      let line = rawLine.trim();
      if (!line) return;

      const headingMatch = line.match(/^(?:teil|part)\s*(\d+)\b/i);
      if (headingMatch) {
        currentSection = `teil-${Number(headingMatch[1])}`;
        if (!sections.has(currentSection)) sections.set(currentSection, []);
        line = line.slice(headingMatch[0].length).replace(/^\s*[·:—-]?\s*/, "").trim();
        if (!line) return;
      }

      if (!currentSection) return;
      if (!sections.has(currentSection)) sections.set(currentSection, []);
      sections.get(currentSection).push(line);
    });

  return sections;
};

const numberedAnswersForSection = (sections, sectionKey) => {
  const answers = new Set();
  (sections.get(sectionKey) || []).forEach((line) => {
    const match = line.match(/^\s*(\d{1,2})\s*(?:[\).:\-]\s*|\s+)(\S.*)$/);
    if (match && String(match[2] || "").trim()) answers.add(Number(match[1]));
  });
  return answers;
};

export const validateA1CanonicalSubmissionCompleteness = ({ assignmentKey = "", text = "" } = {}) => {
  const normalizedAssignmentKey = String(assignmentKey).trim().toUpperCase();
  const sections = parseA1SubmissionSections(text);

  if (normalizedAssignmentKey === "A1-0.2") {
    const teil1Answers = numberedAnswersForSection(sections, "teil-1");
    const teil2Answers = numberedAnswersForSection(sections, "teil-2");
    const missingTeil1 = missingRequiredNumbers(teil1Answers, 7);
    const missingTeil2 = missingRequiredNumbers(teil2Answers, 5);
    if (!missingTeil1.length && !missingTeil2.length) {
      return { ok: true, message: "" };
    }

    const missing = [];
    if (missingTeil1.length) missing.push(`Teil 1 answers ${missingTeil1.join(", ")}`);
    if (missingTeil2.length) missing.push(`Teil 2 · Hören answers ${missingTeil2.join(", ")}`);
    return {
      ok: false,
      message: `Complete both required parts before submitting A1-0.2. Use a "Teil 1" heading with answers 1–7 and a "Teil 2 · Hören" heading with answers 1–5. Missing: ${missing.join("; ")}.`,
    };
  }

  if (normalizedAssignmentKey === "A1-3") {
    const teil1Answers = numberedAnswersForSection(sections, "teil-1");
    const teil3Answers = numberedAnswersForSection(sections, "teil-3");
    const missingTeil1 = missingRequiredNumbers(teil1Answers, 4);
    const missingTeil3 = missingRequiredNumbers(teil3Answers, 10);
    const familyText = (sections.get("teil-2") || []).join(" ").trim();

    if (!missingTeil1.length && familyText && !missingTeil3.length) {
      return { ok: true, message: "" };
    }

    const missing = [];
    if (missingTeil1.length) missing.push(`Teil 1 answers ${missingTeil1.join(", ")}`);
    if (!familyText) missing.push("Teil 2 family writing");
    if (missingTeil3.length) missing.push(`Teil 3 answers ${missingTeil3.join(", ")}`);
    return {
      ok: false,
      message: `Your Chapter 3 workbook is still incomplete. Return to the workbook and finish: ${missing.join("; ")}. Your saved draft has not been submitted.`,
    };
  }

  return validateA1TutorDraftSubmissionSections({
    assignmentKey: normalizedAssignmentKey,
    sections,
  });
};

const setReactTextareaValue = (textarea, value) => {
  if (!textarea) return;
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
  if (setter) setter.call(textarea, value);
  else textarea.value = value;
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  textarea.dispatchEvent(new Event("change", { bubbles: true }));
};

export default function A1CanonicalSubmissionPanel({ assignment, submitTitle, submitDescription }) {
  const location = useLocation();
  const navigate = useNavigate();
  const draftContext = useA1TutorWorkbookDraft();
  const submitRootRef = useRef(null);
  const autoResolveInFlightRef = useRef(false);
  const lastContextNavigationRef = useRef("");
  const workbookSeedUserEditedRef = useRef(false);
  const [autoResolveMessage, setAutoResolveMessage] = useState("");
  const [submissionGuardMessage, setSubmissionGuardMessage] = useState("");
  const searchParams = useMemo(() => new URLSearchParams(location.search || ""), [location.search]);
  const requestedTab = searchParams.get("workbookTab");
  const assignmentKey = assignment.assignmentKey;
  const submissionContextReady =
    searchParams.get("assignmentKey") === assignmentKey &&
    searchParams.get("assignmentId") === assignmentKey &&
    searchParams.get("level") === "A1";
  const submitDebugEnabled = searchParams.get("submitDebug") === "1";
  const mappedWorkbookText = draftContext?.assignmentKey === assignmentKey
    ? String(draftContext?.submissionText || "").trim()
    : "";
  const draftProgress = draftContext?.assignmentKey === assignmentKey ? draftContext?.progress : null;

  useEffect(() => {
    autoResolveInFlightRef.current = false;
    lastContextNavigationRef.current = "";
    workbookSeedUserEditedRef.current = false;
    setAutoResolveMessage("");
    setSubmissionGuardMessage("");
  }, [assignmentKey]);

  useEffect(() => {
    if (requestedTab !== "submit" || submissionContextReady) return;

    const nextSearch = new URLSearchParams(location.search || "");
    nextSearch.set("workbookTab", "submit");
    nextSearch.set("assignmentKey", assignmentKey);
    nextSearch.set("assignmentId", assignmentKey);
    nextSearch.set("level", "A1");

    const nextSearchText = `?${nextSearch.toString()}`;
    const nextSignature = `${location.pathname}${nextSearchText}|${assignmentKey}|${assignment.day}`;
    if (lastContextNavigationRef.current === nextSignature) return;
    lastContextNavigationRef.current = nextSignature;

    navigate(
      { pathname: location.pathname, search: nextSearchText },
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

  useEffect(() => {
    if (requestedTab !== "submit" || !submissionContextReady || !mappedWorkbookText) return undefined;
    workbookSeedUserEditedRef.current = false;
    let attempts = 0;
    let timer = null;

    const seed = () => {
      if (workbookSeedUserEditedRef.current) return;
      const textarea = submitRootRef.current?.querySelector("textarea");
      if (textarea) {
        const current = String(textarea.value || "").trim();
        if (current !== mappedWorkbookText) {
          setReactTextareaValue(textarea, mappedWorkbookText);
          textarea.setAttribute("data-a1-workbook-draft-mapped", "true");
        }
      }
      attempts += 1;
      if (attempts < WORKBOOK_DRAFT_SEED_MAX_ATTEMPTS && !workbookSeedUserEditedRef.current) {
        timer = window.setTimeout(seed, WORKBOOK_DRAFT_SEED_POLL_MS);
      }
    };

    timer = window.setTimeout(seed, 0);
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [mappedWorkbookText, requestedTab, submissionContextReady]);

  const handleSubmissionInputCapture = (event) => {
    if (event.target?.tagName === "TEXTAREA" && event.nativeEvent?.isTrusted) {
      workbookSeedUserEditedRef.current = true;
    }
  };

  const handleSubmissionCapture = async (event) => {
    const root = submitRootRef.current;
    const visibleSubmissionText = root?.querySelector("textarea")?.value || "";
    const completeness = validateA1CanonicalSubmissionCompleteness({
      assignmentKey,
      text: visibleSubmissionText,
    });
    setSubmissionGuardMessage("");

    if (!completeness.ok) {
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent?.stopImmediatePropagation?.();
      setSubmissionGuardMessage(completeness.message);
      return;
    }

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

  const openMissingSection = (sectionKey) => {
    const nextSearch = new URLSearchParams(location.search || "");
    nextSearch.set("workbookTab", sectionKey);
    nextSearch.set("assignmentKey", assignmentKey);
    nextSearch.set("assignmentId", assignmentKey);
    nextSearch.set("level", "A1");
    navigate(
      { pathname: location.pathname, search: `?${nextSearch.toString()}` },
      { replace: true, state: location.state },
    );
  };

  const submitClassName = buildSubmitClassName(assignmentKey);
  const reviewSections = draftProgress?.sections?.filter((section) => section.total > 0) || [];

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

      {reviewSections.length ? (
        <div
          data-a1-draft-review="true"
          style={{ background: "#fffbeb", border: "1px solid #fbbf24", borderRadius: 12, color: "#78350f", display: "grid", gap: 10, padding: "12px 14px", lineHeight: 1.55 }}
        >
          <div>
            <strong>Review stage — not submitted yet</strong>
            <p style={{ margin: "4px 0 0" }}>
              Your workbook answers are mapped into the submission form below. Check them, then press the final Submit Assignment button. Until that succeeds, your tutor has not received this work.
            </p>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {reviewSections.map((section) => {
              const label = assignment.sections.find(({ key }) => key === section.sectionKey)?.label || section.sectionKey.replace("teil-", "Teil ");
              return (
                <div key={section.sectionKey} style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 800 }}>
                    {label}: {section.complete ? "Complete" : `${section.completed}/${section.total} complete`}
                  </span>
                  {!section.complete ? (
                    <button type="button" style={{ ...styles.secondaryButton, minHeight: 38 }} onClick={() => openMissingSection(section.sectionKey)}>
                      Finish {section.sectionKey.replace("teil-", "Teil ")}
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : assignmentKey === "A1-3" ? (
        <div
          data-a1-chapter3-submit-warning="true"
          style={{ background: "#fffbeb", border: "1px solid #fbbf24", borderRadius: 10, color: "#78350f", display: "grid", gap: 5, padding: "10px 12px", lineHeight: 1.55 }}
        >
          <strong>Review stage — not submitted yet</strong>
          <span>Your Chapter 3 workbook answers are loaded as a draft below. Check them carefully. They reach your tutor only after the final Submit Assignment button succeeds.</span>
        </div>
      ) : null}

      <div
        ref={submitRootRef}
        className={submitClassName}
        data-a1-built-in-submission
        data-assignment-key={assignmentKey}
        data-auto-resolve-draft-conflicts="visible-version-on-submit"
        onInputCapture={handleSubmissionInputCapture}
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

        {submissionGuardMessage ? (
          <p role="alert" style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 10, color: "#991b1b", fontWeight: 800, margin: "0 0 10px", padding: "10px 12px", lineHeight: 1.55 }}>
            {submissionGuardMessage}
          </p>
        ) : null}

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
