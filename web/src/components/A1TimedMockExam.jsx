import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styles } from "../styles";

export const A1_TIMED_MOCK_CONFIG = Object.freeze({
  "A1-12.3": {
    durationMinutes: 30,
    scope: "Two complete letters",
  },
  "A1-13": {
    durationMinutes: 35,
    scope: "9 reading answers and one letter",
  },
  "A1-14.1": {
    durationMinutes: 35,
    scope: "5 reading answers, one letter and 10 vocabulary answers",
  },
});

export const getA1MockExamDurationSeconds = (assignmentKey = "") =>
  (A1_TIMED_MOCK_CONFIG[String(assignmentKey).trim().toUpperCase()]?.durationMinutes || 0) * 60;

const A1TimedMockExamContext = createContext({ enabled: false, assignmentLocked: false });

export const useA1TimedMockExam = () => useContext(A1TimedMockExamContext);

export const buildA1MockExamStorageKey = (assignmentKey = "") =>
  `falowen:a1:mock-exam:${String(assignmentKey).trim().toUpperCase()}`;

export const formatA1MockExamTime = (seconds = 0) => {
  const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = Math.floor(safeSeconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(safeSeconds % 60).padStart(2, "0")}`;
};

const readSession = (assignmentKey) => {
  if (typeof window === "undefined") return null;
  try {
    const value = JSON.parse(window.localStorage.getItem(buildA1MockExamStorageKey(assignmentKey)) || "null");
    return Number.isFinite(value?.endsAt) && value.endsAt > 0 ? value : null;
  } catch (_) {
    return null;
  }
};

const remainingSeconds = (session, durationSeconds, now = Date.now()) =>
  session ? Math.max(0, Math.ceil((session.endsAt - now) / 1000)) : durationSeconds;

export default function A1TimedMockExam({ assignment, children = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const assignmentKey = assignment?.assignmentKey || "";
  const mockConfig = A1_TIMED_MOCK_CONFIG[assignmentKey] || null;
  const durationSeconds = getA1MockExamDurationSeconds(assignmentKey);
  const enabled = Boolean(mockConfig);
  const initialSession = useMemo(() => (enabled ? readSession(assignmentKey) : null), [assignmentKey, enabled]);
  const [session, setSession] = useState(initialSession);
  const [secondsLeft, setSecondsLeft] = useState(() => remainingSeconds(initialSession, durationSeconds));
  const [status, setStatus] = useState("");
  const [agreed, setAgreed] = useState(false);
  const autoSubmitStartedRef = useRef(false);
  const timedAutoSubmit = new URLSearchParams(location.search || "").get("timedAutoSubmit") === "1";

  if (timedAutoSubmit && session) autoSubmitStartedRef.current = true;

  const clearSession = useCallback(() => {
    window.localStorage.removeItem(buildA1MockExamStorageKey(assignmentKey));
    setSession(null);
    setSecondsLeft(durationSeconds);
    setAgreed(false);
    autoSubmitStartedRef.current = false;
  }, [assignmentKey, durationSeconds]);

  const openSubmitAndSend = useCallback(() => {
    if (autoSubmitStartedRef.current) return;
    autoSubmitStartedRef.current = true;
    setStatus("Time is up. Submitting your saved answers now…");

    const search = new URLSearchParams(location.search || "");
    search.set("workbookTab", "submit");
    search.set("assignmentKey", assignmentKey);
    search.set("assignmentId", assignmentKey);
    search.set("level", "A1");
    search.set("timedAutoSubmit", "1");
    navigate({ pathname: location.pathname, search: `?${search.toString()}` }, { replace: true, state: location.state });
  }, [assignmentKey, location.pathname, location.search, location.state, navigate]);

  useEffect(() => {
    if (!enabled || !session) return undefined;
    const update = () => {
      const next = remainingSeconds(session, durationSeconds);
      setSecondsLeft(next);
      if (next === 0) openSubmitAndSend();
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [durationSeconds, enabled, openSubmitAndSend, session]);

  useEffect(() => {
    if (!enabled || !timedAutoSubmit || !session || new URLSearchParams(location.search).get("workbookTab") !== "submit") return undefined;
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const form = document.querySelector('[data-a1-built-in-submission] form');
      const submitButton = form?.querySelector('button[type="submit"]');
      const cloudDraftRoot = form?.closest('[data-a1-built-in-submission]')
        ?.querySelector('[data-cloud-draft-persistence="react-owned"]');
      const cloudDraftReady = cloudDraftRoot?.getAttribute("data-draft-submit-ready") === "true";
      if (form && submitButton && (!submitButton.disabled || cloudDraftReady)) {
        form.setAttribute("data-a1-timed-auto-submit", "true");
        window.clearInterval(timer);
        form.requestSubmit();
      } else if (attempts >= 80) {
        window.clearInterval(timer);
        setStatus("Time is up. We could not reach the submission form. Your answers are saved—open Review & Submit to send them.");
      }
    }, 150);
    return () => window.clearInterval(timer);
  }, [enabled, location.search, session, timedAutoSubmit]);

  const handleSubmissionVerified = useCallback(() => {
    window.localStorage.removeItem(buildA1MockExamStorageKey(assignmentKey));
    setStatus("Time is up. Your saved answers were submitted automatically.");
    setSession(null);
    autoSubmitStartedRef.current = false;
  }, [assignmentKey]);

  const handleSubmissionError = useCallback(() => {
    setStatus("Time is up, but automatic submission failed. Your timed session and answers are preserved; try submitting again.");
  }, []);

  if (!enabled) return children;

  const start = () => {
    if (!agreed) return;
    const next = { endsAt: Date.now() + (durationSeconds * 1000) };
    window.localStorage.setItem(buildA1MockExamStorageKey(assignmentKey), JSON.stringify(next));
    autoSubmitStartedRef.current = false;
    setStatus("");
    setSession(next);
    setSecondsLeft(durationSeconds);
  };

  const urgent = Boolean(session && secondsLeft <= 5 * 60);
  const assignmentLocked = !session && !autoSubmitStartedRef.current;

  return (
    <A1TimedMockExamContext.Provider value={{
      enabled: true,
      assignmentLocked,
      timedAutoSubmit,
      onSubmissionVerified: handleSubmissionVerified,
      onSubmissionError: handleSubmissionError,
    }}>
      <section
        data-a1-timed-mock-exam={assignmentKey}
        data-assignment-locked={assignmentLocked ? "true" : "false"}
        style={{
          ...styles.card,
          background: urgent ? "#fff1f2" : session ? "#eff6ff" : "#fffbeb",
          border: `2px solid ${urgent ? "#e11d48" : session ? "#2563eb" : "#f59e0b"}`,
          display: "grid",
          gap: 10,
          position: "sticky",
          top: 8,
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <strong style={{ color: urgent ? "#9f1239" : "#1e3a8a" }}>
            Timed mock exam · {mockConfig.durationMinutes} minutes
          </strong>
          <p style={{ margin: "4px 0 0", color: "#475569", lineHeight: 1.5 }}>
            {mockConfig.scope}. The clock continues if you refresh or change sections. At 00:00, your saved answers are submitted automatically.
          </p>
        </div>
        {session ? (
          <div aria-live="polite" aria-label={`${secondsLeft} seconds remaining`} style={{ fontSize: 30, fontWeight: 900, color: urgent ? "#be123c" : "#1d4ed8", fontVariantNumeric: "tabular-nums" }}>
            {formatA1MockExamTime(secondsLeft)}
          </div>
        ) : null}
        </div>
        {!session && !autoSubmitStartedRef.current ? (
        <div style={{ borderTop: "1px solid #fcd34d", display: "grid", gap: 10, paddingTop: 10 }}>
          <p style={{ margin: 0, color: "#78350f", lineHeight: 1.55 }}>
            <strong>Grammar stays open for preparation.</strong> The assignment sections and Review &amp; Submit remain locked until you accept the time limit and start the mock.
          </p>
          <label style={{ alignItems: "flex-start", color: "#78350f", display: "flex", gap: 9, fontWeight: 800, lineHeight: 1.45 }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              style={{ height: 20, marginTop: 1, width: 20 }}
            />
            I understand that I have {mockConfig.durationMinutes} minutes and my saved answers will submit automatically at 00:00.
          </label>
          <button type="button" disabled={!agreed} onClick={start} style={{ ...styles.primaryButton, justifySelf: "start", minHeight: 46 }}>
            Agree &amp; unlock {mockConfig.durationMinutes}-minute mock
          </button>
        </div>
        ) : null}
        {session ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <span style={{ color: urgent ? "#9f1239" : "#1e3a8a", fontWeight: 800 }}>
            {urgent ? "Final 5 minutes — finish the answer you are working on." : "Mock in progress — work independently and move through every Teil."}
          </span>
          <button type="button" onClick={clearSession} style={{ ...styles.secondaryButton, minHeight: 38 }}>
            End mock without submitting
          </button>
        </div>
        ) : null}
        {status ? <p role="status" style={{ margin: 0, color: "#9f1239", fontWeight: 800 }}>{status}</p> : null}
      </section>
      {children}
    </A1TimedMockExamContext.Provider>
  );
}
