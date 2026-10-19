import React, { useEffect, useRef } from "react";
import { shouldDispatchA1TimedAutoSubmit } from "../utils/a1TimedAutoSubmitGate";
import { useLocation, useNavigate } from "react-router-dom";
import SharedTimedAssignment, {
  buildTimedAssignmentStorageKey,
  formatTimedAssignmentTime,
  useTimedAssignment,
} from "./SharedTimedAssignment";
import {
  TIMED_ASSIGNMENT_CONFIG,
  getTimedAssignmentDurationSeconds,
} from "../data/timedAssignmentConfig";

export const A1_TIMED_MOCK_CONFIG = Object.freeze(
  Object.fromEntries(
    Object.entries(TIMED_ASSIGNMENT_CONFIG).filter(([, config]) => config.level === "A1"),
  ),
);

export const getA1MockExamDurationSeconds = getTimedAssignmentDurationSeconds;
export const useA1TimedMockExam = useTimedAssignment;
export const formatA1MockExamTime = formatTimedAssignmentTime;
export const buildA1MockExamStorageKey = (assignmentKey = "") =>
  buildTimedAssignmentStorageKey(assignmentKey, "A1");

const A1TimedAutoSubmitBridge = ({ children }) => {
  const location = useLocation();
  const timedExam = useTimedAssignment();
  const autoSubmitStartedRef = useRef(false);

  useEffect(() => {
    // A stale timedAutoSubmit URL flag must not submit a still-running attempt.
    if (!timedExam.enabled || !timedExam.timedAutoSubmit || !timedExam.session || !timedExam.expired) return undefined;

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const form = document.querySelector('[data-a1-built-in-submission] form');
      const submitButton = form?.querySelector('button[type="submit"]');
      const cloudDraftRoot = form?.closest('[data-a1-built-in-submission]')
        ?.querySelector('[data-cloud-draft-persistence="react-owned"]');
      const cloudDraftReady = cloudDraftRoot?.getAttribute("data-draft-submit-ready") === "true";
      const draftLoaded = cloudDraftRoot?.getAttribute("data-draft-loaded") === "true";
      const draftConflict = cloudDraftRoot?.getAttribute("data-draft-conflict") === "true";
      const finalState = cloudDraftRoot?.getAttribute("data-final-submission-state");
      // Do not attempt the one-time final upload before the saved draft,
      // textarea and conflict checks are ready. Previously the enabled
      // button OR readiness check could fire too early, silently leaving
      // the timer expired but the submission absent from Admin.
      if (finalState === "verified") {
        window.clearInterval(timer);
        return;
      }
      if (shouldDispatchA1TimedAutoSubmit({ formAvailable: Boolean(form && submitButton), cloudDraftReady, draftLoaded, draftConflict, finalState })) {
        if (autoSubmitStartedRef.current) {
          window.clearInterval(timer);
          return;
        }
        autoSubmitStartedRef.current = true;
        form.setAttribute("data-a1-timed-auto-submit", "true");
        window.clearInterval(timer);
        form.requestSubmit();
      } else if (attempts >= 80) {
        window.clearInterval(timer);
        timedExam.onSubmissionError(
          "Time is up, but Falowen could not confirm a final submission. Your draft may still be saved. Open Review & Submit and submit manually; check for a verified receipt before leaving.",
        );
      }
    }, 150);

    return () => window.clearInterval(timer);
  }, [
    location.search,
    timedExam.enabled,
    timedExam.expired,
    timedExam.onSubmissionError,
    timedExam.session,
    timedExam.timedAutoSubmit,
  ]);

  return children;
};

export default function A1TimedMockExam({ assignment, children = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const assignmentKey = assignment?.assignmentKey || "";
  const timedAutoSubmit = new URLSearchParams(location.search || "").get("timedAutoSubmit") === "1";

  const openSubmitAndSend = () => {
    const search = new URLSearchParams(location.search || "");
    search.set("workbookTab", "submit");
    search.set("assignmentKey", assignmentKey);
    search.set("assignmentId", assignmentKey);
    search.set("level", "A1");
    search.set("timedAutoSubmit", "1");
    navigate(
      { pathname: location.pathname, search: `?${search.toString()}` },
      { replace: true, state: location.state },
    );
  };

  return (
    <SharedTimedAssignment
      assignmentKey={assignmentKey}
      level="A1"
      timedAutoSubmit={timedAutoSubmit}
      onTimeExpired={openSubmitAndSend}
    >
      <A1TimedAutoSubmitBridge>{children}</A1TimedAutoSubmitBridge>
    </SharedTimedAssignment>
  );
}
