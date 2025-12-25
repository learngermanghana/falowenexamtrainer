import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchAttendanceSummary } from "../services/attendanceService";
import { fetchScoreSummary } from "../services/scoreSummaryService";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";

const PASS_MARK = 60;

/** -------------------------
 * Fallback helpers (old logic)
 * ------------------------- */
const parseAssignmentNumber = (assignment = "") => {
  const text = String(assignment || "");
  const dayMatch = text.match(/\bday\s*(\d+(?:\.\d+)?)\b/i);
  if (dayMatch?.[1]) return Number(dayMatch[1]);
  const match = text.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
};

const uniqSorted = (numbers = []) => {
  const clean = numbers.filter((n) => Number.isFinite(n));
  return Array.from(new Set(clean)).sort((a, b) => a - b);
};

const inferStep = (numbers = []) => {
  const sorted = uniqSorted(numbers);
  if (sorted.length < 2) {
    const hasDecimal = sorted.some((n) => Math.abs(n - Math.round(n)) > 1e-6);
    return hasDecimal ? 0.5 : 1;
  }

  let minDiff = Infinity;
  for (let i = 1; i < sorted.length; i += 1) {
    const diff = sorted[i] - sorted[i - 1];
    if (diff > 1e-6 && diff < minDiff) minDiff = diff;
  }

  if (!Number.isFinite(minDiff) || minDiff <= 1e-6) return 1;
  if (minDiff <= 0.1 + 1e-6) return 0.1;
  if (minDiff <= 0.25 + 1e-6) return 0.25;
  if (minDiff <= 0.5 + 1e-6) return 0.5;
  return 1;
};

const findMissingNumbers = (numbers = []) => {
  const sorted = uniqSorted(numbers);
  if (!sorted.length) return [];

  const step = inferStep(sorted);
  const start = sorted[0] > step ? step : sorted[0];
  const end = sorted[sorted.length - 1];

  const missing = [];
  const round = (value) => Number(value.toFixed(2));

  for (let current = start; current < end - 1e-6; current = round(current + step)) {
    const exists = sorted.some((v) => Math.abs(v - current) < 1e-6);
    if (!exists) missing.push(current);
  }

  return missing;
};

/** -------------------------
 * Display helpers (new logic)
 * ------------------------- */
const asArray = (v) => (Array.isArray(v) ? v : []);

const formatLessonLabel = (entry) => {
  if (!entry) return "";
  if (typeof entry === "string") return entry;
  if (typeof entry === "number") return `Assignment ${entry}`;

  // new schedule-aware payload uses .label
  if (entry.label) return String(entry.label);

  // fallback older payload
  if (entry.assignment) return String(entry.assignment);
  if (typeof entry.number === "number") return `Assignment ${entry.number}`;

  return "";
};

const formatList = (items = [], maxItems = 3) => {
  const labels = asArray(items).map(formatLessonLabel).filter(Boolean);
  if (!labels.length) return "None yet";

  if (labels.length <= maxItems) {
    if (labels.length === 1) return labels[0];
    if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
    return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
  }

  const shown = labels.slice(0, maxItems);
  return `${shown.join(", ")} (+${labels.length - maxItems} more)`;
};

const joinIdentifiers = (ids = []) => {
  const clean = asArray(ids).map((x) => String(x || "").trim()).filter(Boolean);
  if (!clean.length) return "";
  if (clean.length <= 3) return clean.join(", ");
  return `${clean.slice(0, 3).join(", ")} (+${clean.length - 3})`;
};

const HomeMetrics = ({ studentProfile }) => {
  const { idToken } = useAuth();

  const [attendance, setAttendance] = useState({ sessions: 0, hours: 0 });
  const [assignmentStats, setAssignmentStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshError, setRefreshError] = useState("");

  const className = studentProfile?.className || "";
  const studentCode =
    studentProfile?.studentcode || studentProfile?.studentCode || studentProfile?.id || "";

  const isMountedRef = useRef(true);
  const lastRefreshAtRef = useRef(0);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refreshMetrics = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshAtRef.current < 2000) return;
    lastRefreshAtRef.current = now;

    if (!className && !studentCode) {
      if (isMountedRef.current) {
        setAttendance({ sessions: 0, hours: 0 });
        setAssignmentStats(null);
        setRefreshError("");
      }
      return;
    }

    if (isMountedRef.current) {
      setLoading(true);
      setRefreshError("");
    }

    try {
      const [attendanceResponse, scoreResponse] = await Promise.all([
        fetchAttendanceSummary({ className, studentCode }),
        idToken && studentCode ? fetchScoreSummary({ idToken, studentCode }) : Promise.resolve(null),
      ]);

      if (!isMountedRef.current) return;

      setAttendance(attendanceResponse || { sessions: 0, hours: 0 });
      setAssignmentStats(scoreResponse?.student || null);
      setRefreshError("");
    } catch (error) {
      if (!isMountedRef.current) return;
      // show real error if present (helps debugging)
      setRefreshError(error?.message || "Could not refresh right now. Showing your last saved metrics.");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [className, studentCode, idToken]);

  useEffect(() => {
    refreshMetrics();
  }, [refreshMetrics]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refreshMetrics();
    };
    const handleFocus = () => refreshMetrics();

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refreshMetrics]);

  /** -------------------------
   * New payload fields (preferred)
   * ------------------------- */
  const missedLessons = useMemo(
    () => asArray(assignmentStats?.missedAssignments),
    [assignmentStats?.missedAssignments]
  );

  const failedLessons = useMemo(
    () => asArray(assignmentStats?.failedAssignments),
    [assignmentStats?.failedAssignments]
  );

  const failedIdentifiers = useMemo(
    () => asArray(assignmentStats?.failedIdentifiers),
    [assignmentStats?.failedIdentifiers]
  );

  const nextRecommendation = assignmentStats?.nextRecommendation || null;
  const recommendationBlocked = Boolean(assignmentStats?.recommendationBlocked);

  const hasFailures = useMemo(
    () => recommendationBlocked || failedLessons.length > 0 || failedIdentifiers.length > 0,
    [failedIdentifiers.length, failedLessons.length, recommendationBlocked]
  );

  /** -------------------------
   * Fallback (old payload)
   * ------------------------- */
  const completedAssignmentsFallback = useMemo(
    () => asArray(assignmentStats?.completedAssignments),
    [assignmentStats?.completedAssignments]
  );

  const completedNumbersFallback = useMemo(() => {
    return completedAssignmentsFallback
      .map((e) =>
        typeof e?.number === "number" ? e.number : parseAssignmentNumber(e?.label || e?.assignment)
      )
      .filter((n) => Number.isFinite(n));
  }, [completedAssignmentsFallback]);

  const computedMissingNumbersFallback = useMemo(
    () => findMissingNumbers(completedNumbersFallback),
    [completedNumbersFallback]
  );

  const missedFallback = useMemo(() => {
    if (missedLessons.length) return missedLessons;
    // if backend doesn't return missedLessons (older deployment), fall back to gap guessing
    return computedMissingNumbersFallback.map((n) => ({ number: n, label: `Assignment ${n}` }));
  }, [computedMissingNumbersFallback, missedLessons]);

  /** -------------------------
   * UI text for Next / Missed / Failed
   * ------------------------- */
  const nextText = useMemo(() => {
    if (hasFailures) {
      const firstFail = failedLessons[0];
      return firstFail?.label
        ? `Fix failed attempt: ${firstFail.label}`
        : "Fix failed assignments before new lessons";
    }
    if (nextRecommendation?.label) return nextRecommendation.label;
    if (missedFallback.length) return formatLessonLabel(missedFallback[0]);
    return "All caught up 🎉";
  }, [failedLessons, hasFailures, missedFallback, nextRecommendation?.label]);

  const nextSubtext = useMemo(() => {
    if (hasFailures) {
      const ids = joinIdentifiers(failedIdentifiers);
      if (ids) return `Scores under ${PASS_MARK}. Pass these first: ${ids}`;
      return `Scores under ${PASS_MARK} need a retry before the next assignment unlocks.`;
    }
    const ids = joinIdentifiers(nextRecommendation?.identifiers || []);
    if (ids) return `Targets: ${ids}`;
    return "Based on your schedule + score submissions.";
  }, [failedIdentifiers, hasFailures, nextRecommendation?.identifiers]);

  return (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <p style={{ ...styles.helperText, margin: 0 }}>Your personalised metrics</p>
          <h3 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Attendance and assignments snapshot</h3>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {loading ? <span style={styles.badge}>Refreshing…</span> : null}
          {refreshError ? (
            <span
              style={{
                ...styles.badge,
                background: "#fff7ed",
                borderColor: "#fdba74",
                color: "#9a3412",
              }}
            >
              {refreshError}
            </span>
          ) : null}
          <button
            type="button"
            onClick={refreshMetrics}
            disabled={loading}
            style={{ ...styles.secondaryButton, padding: "8px 12px" }}
          >
            Refresh now
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        <div style={{ ...styles.vocabCard, background: "#ecfeff", borderColor: "#67e8f9" }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Attendance</p>
          <h4 style={{ margin: "4px 0" }}>{attendance.sessions} sessions credited</h4>
          <p style={{ ...styles.helperText, margin: 0 }}>{attendance.hours} total hours</p>
        </div>

        <div style={{ ...styles.vocabCard, background: "#fef9c3", borderColor: "#fcd34d" }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Next recommendation</p>
          <h4 style={{ margin: "4px 0" }}>{nextText}</h4>
          <p style={{ ...styles.helperText, margin: 0 }}>{nextSubtext}</p>
        </div>

        <div style={{ ...styles.vocabCard, background: "#eef2ff", borderColor: "#c7d2fe" }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Missed or skipped</p>
          <h4 style={{ margin: "4px 0" }}>{formatList(missedFallback)}</h4>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Based on your class schedule order (not just number gaps).
          </p>
        </div>

        <div style={{ ...styles.vocabCard, background: "#ffe4e6", borderColor: "#fda4af" }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Needs rework (below {PASS_MARK})</p>
          <h4 style={{ margin: "4px 0" }}>{formatList(failedLessons)}</h4>
          <p style={{ ...styles.helperText, margin: 0 }}>
            {failedIdentifiers.length
              ? `Identifiers to redo: ${joinIdentifiers(failedIdentifiers)}`
              : `Retake these to clear the ${PASS_MARK} pass mark.`}
          </p>
        </div>
      </div>

      {assignmentStats ? (
        <div style={{ ...styles.helperText, margin: 0 }}>
          This week: {assignmentStats.weekAssignments || 0} assignments across{" "}
          {assignmentStats.weekAttempts || 0} attempts · Streak: {assignmentStats.streakDays || 0}{" "}
          day(s) · Last upload: {assignmentStats.lastAssignment || "–"} · Retries this week:{" "}
          {assignmentStats.retriesThisWeek || 0}
        </div>
      ) : null}
    </section>
  );
};

export default HomeMetrics;
