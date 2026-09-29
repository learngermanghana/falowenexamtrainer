import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { auth, db, doc, onSnapshot, serverTimestamp, setDoc } from "../firebase";
import { triggerInteractionFeedback } from "../services/interactionFeedback";
import { styles } from "../styles";
import {
  getTimedAssignmentConfig,
  getTimedAssignmentDurationSeconds,
} from "../data/timedAssignmentConfig";

const ATTEMPT_COLLECTION = "timedAssignmentAttempts";

const TimedAssignmentContext = createContext({
  enabled: false,
  assignmentLocked: false,
  attemptState: "disabled",
  cloudState: "disabled",
  config: null,
  expired: false,
  isTabLocked: () => false,
  onSubmissionVerified: () => {},
  onSubmissionError: () => {},
  session: null,
  secondsLeft: 0,
  timedAutoSubmit: false,
  status: "",
  warningMessage: "",
  agreed: false,
  setAgreed: () => {},
  start: () => {},
  startBusy: false,
});

export const useTimedAssignment = () => useContext(TimedAssignmentContext);

const normalizeKeyPart = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "_")
    .slice(0, 140);

const timestampToMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (Number.isFinite(value?.seconds)) return Number(value.seconds) * 1000;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

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

const readLocalSession = (assignmentKey, level) => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(buildTimedAssignmentStorageKey(assignmentKey, level));
    const value = JSON.parse(raw || "null");
    return Number.isFinite(value?.endsAt) && value.endsAt > 0 ? value : null;
  } catch (_error) {
    return null;
  }
};

const writeLocalSession = (assignmentKey, level, session) => {
  if (typeof window === "undefined") return;
  try {
    if (!session) {
      window.localStorage.removeItem(buildTimedAssignmentStorageKey(assignmentKey, level));
      return;
    }
    window.localStorage.setItem(
      buildTimedAssignmentStorageKey(assignmentKey, level),
      JSON.stringify(session),
    );
  } catch (_error) {}
};

const remainingSeconds = (session, durationSeconds, now = Date.now()) =>
  session ? Math.max(0, Math.ceil((session.endsAt - now) / 1000)) : durationSeconds;

const warningForSeconds = (secondsLeft) => {
  if (secondsLeft <= 60 && secondsLeft > 0) return { threshold: 60, label: "1 minute remaining" };
  if (secondsLeft <= 300 && secondsLeft > 60) return { threshold: 300, label: "5 minutes remaining" };
  if (secondsLeft <= 600 && secondsLeft > 300) return { threshold: 600, label: "10 minutes remaining" };
  return null;
};

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
  const currentUser = auth?.currentUser || null;
  const attemptDocId = currentUser?.uid
    ? `${normalizeKeyPart(currentUser.uid)}__${normalizeKeyPart(assignmentKey)}`
    : "";
  const attemptRef = useMemo(
    () => (enabled && db && attemptDocId ? doc(db, ATTEMPT_COLLECTION, attemptDocId) : null),
    [attemptDocId, enabled],
  );
  const localSession = useMemo(
    () => (enabled ? readLocalSession(assignmentKey, normalizedLevel) : null),
    [assignmentKey, enabled, normalizedLevel],
  );

  const [session, setSession] = useState(localSession);
  const [secondsLeft, setSecondsLeft] = useState(() => remainingSeconds(localSession, durationSeconds));
  const [attemptState, setAttemptState] = useState(() => (enabled ? (localSession ? "active" : "loading") : "disabled"));
  const [cloudState, setCloudState] = useState(() => (enabled && attemptRef ? "loading" : "local"));
  const [status, setStatus] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [startBusy, setStartBusy] = useState(false);
  const expiryHandledRef = useRef(false);
  const expiryCallbackRef = useRef(onTimeExpired);
  const warningThresholdsRef = useRef(new Set());

  useEffect(() => {
    expiryCallbackRef.current = onTimeExpired;
  }, [onTimeExpired]);

  useEffect(() => {
    if (!enabled) return undefined;

    if (!attemptRef || !currentUser?.uid) {
      setCloudState("local");
      setAttemptState(localSession ? "active" : "none");
      return undefined;
    }

    setCloudState("loading");
    const unsubscribe = onSnapshot(
      attemptRef,
      (snapshot) => {
        setCloudState("ready");

        if (!snapshot.exists()) {
          writeLocalSession(assignmentKey, normalizedLevel, null);
          setSession(null);
          setSecondsLeft(durationSeconds);
          setAttemptState("none");
          setStatus("");
          setWarningMessage("");
          setAgreed(false);
          expiryHandledRef.current = false;
          warningThresholdsRef.current = new Set();
          return;
        }

        const data = snapshot.data() || {};
        const nextState = String(data.status || "active").toLowerCase();
        const startedAt =
          timestampToMillis(data.startedAt) ||
          Number(data.clientStartedAt) ||
          timestampToMillis(data.createdAt);
        const persistedDuration = Math.max(1, Number(data.durationSeconds) || durationSeconds);
        const endsAt = startedAt ? startedAt + (persistedDuration * 1000) : Number(data.endsAt) || 0;
        const nextSession = endsAt > 0 ? { startedAt, endsAt } : null;

        setAttemptState(nextState);
        setSession(nextSession);
        setSecondsLeft(
          nextState === "active"
            ? remainingSeconds(nextSession, persistedDuration)
            : 0,
        );

        if (nextState === "active" && nextSession) {
          writeLocalSession(assignmentKey, normalizedLevel, nextSession);
        } else {
          writeLocalSession(assignmentKey, normalizedLevel, null);
        }

        if (["expired", "submitted"].includes(nextState)) {
          expiryHandledRef.current = true;
        }
      },
      (error) => {
        console.error("Timed assignment cloud state failed", error);
        setCloudState("error");
        if (localSession) {
          setAttemptState("active");
          setSession(localSession);
          setSecondsLeft(remainingSeconds(localSession, durationSeconds));
        } else {
          setAttemptState("none");
        }
        setStatus("Falowen could not verify this timed attempt online. Reconnect before starting a new attempt.");
      },
    );

    return unsubscribe;
  }, [
    assignmentKey,
    attemptRef,
    currentUser?.uid,
    durationSeconds,
    enabled,
    localSession,
    normalizedLevel,
  ]);

  const markExpired = useCallback(() => {
    if (!enabled || expiryHandledRef.current) return;
    expiryHandledRef.current = true;
    setAttemptState("expired");
    setSecondsLeft(0);
    setStatus(
      config?.autoSubmit
        ? "Time is up. Your saved answers are being submitted automatically."
        : "Time is up. The timed assignment sections are locked.",
    );
    writeLocalSession(assignmentKey, normalizedLevel, null);

    if (attemptRef) {
      setDoc(
        attemptRef,
        {
          status: "expired",
          expiredAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      ).catch((error) => {
        console.error("Could not persist timed assignment expiry", error);
      });
    }

    expiryCallbackRef.current?.({ assignmentKey, config });
  }, [assignmentKey, attemptRef, config, enabled, normalizedLevel]);

  useEffect(() => {
    if (!enabled || attemptState !== "active" || !session) return undefined;

    const update = () => {
      const next = remainingSeconds(session, durationSeconds);
      setSecondsLeft(next);

      const warning = warningForSeconds(next);
      if (warning && !warningThresholdsRef.current.has(warning.threshold)) {
        warningThresholdsRef.current.add(warning.threshold);
        setWarningMessage(warning.label);
        triggerInteractionFeedback({
          sound: "info",
          vibratePattern: warning.threshold === 60 ? [100, 60, 100] : [70],
        }).catch(() => {});
      }

      if (next === 0) markExpired();
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [attemptState, durationSeconds, enabled, markExpired, session]);

  const start = useCallback(async () => {
    if (!enabled || !agreed || startBusy || attemptState !== "none") return;
    if (attemptRef && cloudState !== "ready") {
      setStatus("Falowen is still checking whether this timed attempt was already used.");
      return;
    }

    const now = Date.now();
    const nextSession = {
      startedAt: now,
      endsAt: now + (durationSeconds * 1000),
    };

    setStartBusy(true);
    setStatus("");
    setWarningMessage("");

    try {
      if (attemptRef && currentUser?.uid) {
        await setDoc(attemptRef, {
          studentId: currentUser.uid,
          studentEmail: currentUser.email || "",
          assignmentKey: String(assignmentKey || "").trim().toUpperCase(),
          level: normalizedLevel,
          status: "active",
          startedAt: serverTimestamp(),
          clientStartedAt: now,
          durationSeconds,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      writeLocalSession(assignmentKey, normalizedLevel, nextSession);
      expiryHandledRef.current = false;
      warningThresholdsRef.current = new Set();
      setSession(nextSession);
      setSecondsLeft(durationSeconds);
      setAttemptState("active");
      setAgreed(false);
    } catch (error) {
      console.error("Could not start timed assignment", error);
      writeLocalSession(assignmentKey, normalizedLevel, null);
      setSession(null);
      setSecondsLeft(durationSeconds);
      setAttemptState("none");
      setStatus("This timed attempt could not be started. It may already have been used or Falowen is offline.");
    } finally {
      setStartBusy(false);
    }
  }, [
    agreed,
    assignmentKey,
    attemptRef,
    attemptState,
    cloudState,
    currentUser?.email,
    currentUser?.uid,
    durationSeconds,
    enabled,
    normalizedLevel,
    startBusy,
  ]);

  const onSubmissionVerified = useCallback(() => {
    setAttemptState("submitted");
    setSecondsLeft(0);
    setStatus("Timed attempt submitted.");
    setWarningMessage("");
    expiryHandledRef.current = true;
    writeLocalSession(assignmentKey, normalizedLevel, null);

    if (attemptRef) {
      setDoc(
        attemptRef,
        {
          status: "submitted",
          submittedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      ).catch((error) => {
        console.error("Could not persist timed assignment submission state", error);
      });
    }
  }, [assignmentKey, attemptRef, normalizedLevel]);

  const onSubmissionError = useCallback((message = "") => {
    setStatus(
      message ||
      "Time is up, but automatic submission could not finish. Your saved work is preserved; open Submit and try again.",
    );
  }, []);

  const expired = attemptState === "expired" || (attemptState === "active" && secondsLeft <= 0);
  const assignmentLocked = Boolean(enabled && attemptState !== "active");
  const resolvedTimedAutoSubmit = Boolean(
    timedAutoSubmit ||
    (config?.autoSubmit && attemptState === "expired"),
  );

  const isTabLocked = useCallback((tabKey = "") => {
    if (!enabled) return false;
    const normalizedTab = String(tabKey || "").trim().toLowerCase();
    const isTimedWork = (config?.timedTabs || []).includes(normalizedTab);
    const isSubmit = normalizedTab === "submit";

    if (attemptState === "active" && secondsLeft > 0) return false;
    if (attemptState === "expired" || attemptState === "submitted") return isTimedWork;
    return isTimedWork || isSubmit;
  }, [attemptState, config, enabled, secondsLeft]);

  const contextValue = useMemo(() => ({
    enabled,
    assignmentLocked,
    attemptState,
    cloudState,
    config,
    expired,
    isTabLocked,
    onSubmissionVerified,
    onSubmissionError,
    session,
    secondsLeft,
    timedAutoSubmit: resolvedTimedAutoSubmit,
    status,
    warningMessage,
    agreed,
    setAgreed,
    start,
    startBusy,
  }), [
    agreed,
    assignmentLocked,
    attemptState,
    cloudState,
    config,
    enabled,
    expired,
    isTabLocked,
    onSubmissionError,
    onSubmissionVerified,
    resolvedTimedAutoSubmit,
    secondsLeft,
    session,
    start,
    startBusy,
    status,
    warningMessage,
  ]);

  const renderedChildren =
    typeof children === "function" ? children(contextValue) : children;

  return (
    <TimedAssignmentContext.Provider value={contextValue}>
      {renderedChildren}
    </TimedAssignmentContext.Provider>
  );
}

export function TimedAssignmentPanel() {
  const timed = useTimedAssignment();
  if (!timed.enabled || !timed.config) return null;

  const {
    config,
    attemptState,
    cloudState,
    secondsLeft,
    status,
    warningMessage,
    agreed,
    setAgreed,
    start,
    startBusy,
  } = timed;

  const active = attemptState === "active" && secondsLeft > 0;
  const urgent = active && secondsLeft <= 5 * 60;
  const used = ["expired", "submitted"].includes(attemptState);
  const checking = cloudState === "loading";
  const cloudError = cloudState === "error";

  return (
    <section
      data-timed-assignment={config.level}
      data-a1-timed-mock-exam={config.level === "A1" ? "true" : undefined}
      data-assignment-locked={!active ? "true" : "false"}
      data-timed-assignment-state={attemptState}
      style={{
        width: "100%",
        flex: "1 0 100%",
        boxSizing: "border-box",
        border: `1px solid ${urgent ? "#fb7185" : active ? "#93c5fd" : used ? "#cbd5e1" : "#fbbf24"}`,
        borderRadius: 14,
        background: urgent ? "#fff1f2" : active ? "#eff6ff" : used ? "#f8fafc" : "#fffbeb",
        padding: 12,
        display: "grid",
        gap: 9,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 3 }}>
          <strong style={{ color: urgent ? "#9f1239" : "#1e3a8a" }}>
            Timed assignment · {config.durationMinutes} minutes
          </strong>
          <span style={{ color: "#475569", fontSize: 13, lineHeight: 1.45 }}>{config.scope}</span>
        </div>
        {active ? (
          <strong
            aria-live="polite"
            aria-label={`${secondsLeft} seconds remaining`}
            style={{
              color: urgent ? "#be123c" : "#1d4ed8",
              fontSize: 26,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatTimedAssignmentTime(secondsLeft)}
          </strong>
        ) : null}
      </div>

      {active ? (
        <div style={{ display: "grid", gap: 4 }}>
          <span style={{ color: urgent ? "#9f1239" : "#1e40af", fontWeight: 800 }}>
            {warningMessage || "Mock in progress. The clock continues when you change sections or devices."}
          </span>
          <span style={{ color: "#475569", fontSize: 12 }}>
            Warnings appear at 10, 5 and 1 minute. At 00:00 Falowen submits the latest saved work automatically.
          </span>
        </div>
      ) : attemptState === "none" ? (
        <div style={{ display: "grid", gap: 8 }}>
          <p style={{ margin: 0, color: "#78350f", lineHeight: 1.5 }}>
            <strong>{config.preparationLabel || "Preparation sections stay open."}</strong>{" "}
            Timed assignment sections stay locked until you start. This is one attempt; after it expires, only a teacher can reset it.
          </p>
          <label style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "#78350f", fontWeight: 800 }}>
            <input
              type="checkbox"
              checked={agreed}
              disabled={checking || cloudError || startBusy}
              onChange={(event) => setAgreed(event.target.checked)}
            />
            I understand that I have {config.durationMinutes} minutes and Falowen will submit my latest saved answers automatically at 00:00.
          </label>
          <button
            type="button"
            disabled={!agreed || checking || cloudError || startBusy}
            onClick={start}
            style={{ ...styles.primaryButton, width: "fit-content", minHeight: 42 }}
          >
            {checking ? "Checking attempt…" : startBusy ? "Starting…" : `Start ${config.durationMinutes}-minute attempt`}
          </button>
        </div>
      ) : attemptState === "expired" ? (
        <p style={{ margin: 0, color: "#9f1239", fontWeight: 800, lineHeight: 1.5 }}>
          Time is up. This attempt cannot be restarted. Falowen is submitting the latest saved work; a teacher can reset the attempt if another try is required.
        </p>
      ) : attemptState === "submitted" ? (
        <p style={{ margin: 0, color: "#166534", fontWeight: 800, lineHeight: 1.5 }}>
          Timed attempt submitted. A teacher must reset the attempt before another timed try can begin.
        </p>
      ) : (
        <p style={{ margin: 0, color: "#475569", fontWeight: 700 }}>
          {checking ? "Checking timed-attempt status…" : "Timed attempt status is loading…"}
        </p>
      )}

      {status ? <p role="status" style={{ margin: 0, color: "#9f1239", fontWeight: 800 }}>{status}</p> : null}
    </section>
  );
}
