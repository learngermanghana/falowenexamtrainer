import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import {
  getTimedAssignmentConfig,
  getTimedAssignmentDurationSeconds,
} from "../data/timedAssignmentConfig";

const TimedAssignmentContext = createContext({
  enabled: false,
  assignmentLocked: false,
  expired: false,
  isTabLocked: () => false,
  onSubmissionVerified: () => {},
  onSubmissionError: () => {},
  session: null,
  secondsLeft: 0,
  timedAutoSubmit: false,
});

export const useTimedAssignment = () => React.useContext(TimedAssignmentContext);

export const buildTimedAssignmentStorageKey = (assignmentKey = "", level = "") => {
  const key = String(assignmentKey || "").trim().toUpperCase();
  const normalizedLevel = String(level || "").trim().toUpperCase();
  return normalizedLevel === "A1" || key.startsWith("A1-")
    ? `falowen:a1:mock-exam:${key}`
    : `falowen:timed-assignment:${key}`;
};

export const formatTimedAssignmentTime = (seconds = 0) => {
  const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = Math.floor(safeSeconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(safeSeconds % 60).padStart(2, "0")}`;
};

const readSession = (assignmentKey, level) => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(buildTimedAssignmentStorageKey(assignmentKey, level));
    const value = JSON.parse(raw || "null");
    return Number.isFinite(value?.endsAt) && value.endsAt > 0 ? value : null;
  } catch (_) {
    return null;
  }
};

const remainingSeconds = (session, durationSeconds, now = Date.now()) =>
  session ? Math.max(0, Math.ceil((session.endsAt - now) / 1000)) : durationSeconds;

export default function SharedTimedAssignment({
  assignmentKey,
  level,
  children = null,
  onTimeExpired = null,
  timedAutoSubmit = false,
}) {
  const config = getTimedAssignmentConfig(assignmentKey);
  const enabled = Boolean(config);
  const normalizedLevel = String(level || config?.level || "").toUpperCase();
  const durationSeconds = getTimedAssignmentDurationSeconds(assignmentKey);
  const initialSession = useMemo(
    () => (enabled ? readSession(assignmentKey, normalizedLevel) : null),
    [assignmentKey, enabled, normalizedLevel],
  );
  const [session, setSession] = useState(initialSession);
  const [secondsLeft, setSecondsLeft] = useState(() => remainingSeconds(initialSession, durationSeconds));
  const [status, setStatus] = useState("");
  const [agreed, setAgreed] = useState(false);
  const expiryHandledRef = useRef(false);
  const expiryCallbackRef = useRef(onTimeExpired);

  useEffect(() => {
    expiryCallbackRef.current = onTimeExpired;
  }, [onTimeExpired]);

  const expired = Boolean(enabled && session && secondsLeft <= 0);
  const assignmentLocked = Boolean(enabled && !session);

  const clearSession = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(buildTimedAssignmentStorageKey(assignmentKey, normalizedLevel));
    }
    expiryHandledRef.current = false;
    setSession(null);
    setSecondsLeft(durationSeconds);
    setStatus("");
    setAgreed(false);
  }, [assignmentKey, durationSeconds, normalizedLevel]);

  const onSubmissionVerified = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(buildTimedAssignmentStorageKey(assignmentKey, normalizedLevel));
    }
    setStatus("Time is up. Your saved answers were submitted automatically.");
    setSession(null);
    setSecondsLeft(0);
    expiryHandledRef.current = true;
  }, [assignmentKey, normalizedLevel]);

  const onSubmissionError = useCallback((message = "") => {
    setStatus(
      message ||
      "Time is up, but automatic submission failed. Your timed session and saved answers are preserved; try submitting again.",
    );
  }, []);

  const isTabLocked = useCallback((tabKey = "") => {
    if (!enabled) return false;
    const normalizedTab = String(tabKey || "").trim().toLowerCase();
    const isTimedWork = (config?.timedTabs || []).includes(normalizedTab);
    const isSubmit = normalizedTab === "submit";

    if (!session) return isTimedWork || isSubmit;
    if (secondsLeft <= 0) return isTimedWork;
    return false;
  }, [config, enabled, secondsLeft, session]);

  useEffect(() => {
    if (!enabled || !session) return undefined;

    const update = () => {
      const next = remainingSeconds(session, durationSeconds);
      setSecondsLeft(next);

      if (next === 0 && !expiryHandledRef.current) {
        expiryHandledRef.current = true;
        setStatus(
          config.autoSubmit
            ? "Time is up. Submitting your saved answers now…"
            : "Time is up. The timed assignment sections are locked. Open Submit to send your saved answers.",
        );
        expiryCallbackRef.current?.({ assignmentKey, config });
      }
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [assignmentKey, config, durationSeconds, enabled, session]);

  const start = useCallback(() => {
    if (!enabled || !agreed) return;
    const next = { endsAt: Date.now() + (durationSeconds * 1000) };
    window.localStorage.setItem(
      buildTimedAssignmentStorageKey(assignmentKey, normalizedLevel),
      JSON.stringify(next),
    );
    expiryHandledRef.current = false;
    setStatus("");
    setSession(next);
    setSecondsLeft(durationSeconds);
  }, [agreed, assignmentKey, durationSeconds, enabled, normalizedLevel]);

  const contextValue = useMemo(() => ({
    enabled,
    assignmentLocked,
    expired,
    isTabLocked,
    onSubmissionVerified,
    onSubmissionError,
    session,
    secondsLeft,
    timedAutoSubmit,
  }), [
    assignmentLocked,
    enabled,
    expired,
    isTabLocked,
    onSubmissionError,
    onSubmissionVerified,
    secondsLeft,
    session,
    timedAutoSubmit,
  ]);

  const renderedChildren =
    typeof children === "function" ? children(contextValue) : children;

  if (!enabled) {
    return (
      <TimedAssignmentContext.Provider value={contextValue}>
        {renderedChildren}
      </TimedAssignmentContext.Provider>
    );
  }

  const urgent = Boolean(session && secondsLeft > 0 && secondsLeft <= 5 * 60);

  return (
    <TimedAssignmentContext.Provider value={contextValue}>
      <section
        data-timed-assignment={assignmentKey}
        data-a1-timed-mock-exam={normalizedLevel === "A1" ? assignmentKey : undefined}
        data-assignment-locked={assignmentLocked ? "true" : "false"}
        data-timed-assignment-expired={expired ? "true" : "false"}
        style={{
          ...styles.card,
          background: urgent ? "#fff1f2" : session ? "#eff6ff" : "#fffbeb",
          border: `2px solid ${urgent ? "#e11d48" : session ? "#2563eb" : "#f59e0b"}`,
          display: "grid",
          gap: 10,
          position: "sticky",
          top: 8,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <strong style={{ color: urgent ? "#9f1239" : "#1e3a8a" }}>
              Timed mock exam · {config.durationMinutes} minutes
            </strong>
            <p style={{ margin: "4px 0 0", color: "#475569", lineHeight: 1.5 }}>
              {config.scope}. The clock continues if you refresh or change sections.
              {config.autoSubmit
                ? " At 00:00, your saved answers are submitted automatically."
                : " At 00:00, the timed sections lock and Submit stays available."}
            </p>
          </div>
          {session ? (
            <div
              aria-live="polite"
              aria-label={`${secondsLeft} seconds remaining`}
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: urgent ? "#be123c" : "#1d4ed8",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatTimedAssignmentTime(secondsLeft)}
            </div>
          ) : null}
        </div>

        {!session ? (
          <div style={{ borderTop: "1px solid #fcd34d", display: "grid", gap: 10, paddingTop: 10 }}>
            <p style={{ margin: 0, color: "#78350f", lineHeight: 1.55 }}>
              <strong>{config.preparationLabel || "Preparation sections stay open."}</strong>{" "}
              The timed assignment sections and Submit remain locked until you accept the time limit and start the mock.
            </p>
            <label style={{ alignItems: "flex-start", color: "#78350f", display: "flex", gap: 9, fontWeight: 800, lineHeight: 1.45 }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                style={{ height: 20, marginTop: 1, width: 20 }}
              />
              I understand that I have {config.durationMinutes} minutes
              {config.autoSubmit
                ? " and my saved answers will submit automatically at 00:00."
                : " and the timed sections will lock at 00:00."}
            </label>
            <button
              type="button"
              disabled={!agreed}
              onClick={start}
              style={{ ...styles.primaryButton, justifySelf: "start", minHeight: 46 }}
            >
              Agree &amp; unlock {config.durationMinutes}-minute mock
            </button>
          </div>
        ) : null}

        {session && !expired ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <span style={{ color: urgent ? "#9f1239" : "#1e3a8a", fontWeight: 800 }}>
              {urgent
                ? "Final 5 minutes — finish the answer you are working on."
                : "Mock in progress — work independently through the timed assignment sections."}
            </span>
            <button type="button" onClick={clearSession} style={{ ...styles.secondaryButton, minHeight: 38 }}>
              End mock without submitting
            </button>
          </div>
        ) : null}

        {status ? <p role="status" style={{ margin: 0, color: "#9f1239", fontWeight: 800 }}>{status}</p> : null}
      </section>
      {renderedChildren}
    </TimedAssignmentContext.Provider>
  );
}
