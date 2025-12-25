import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchAttendanceSummary } from "../services/attendanceService";
import { fetchScoreSummary } from "../services/scoreSummaryService";
import { useAuth } from "../context/AuthContext";
import { courseSchedules } from "../data/courseSchedule";
import { courseSchedulesByName } from "../data/courseSchedules";
import { styles } from "../styles";

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

const normalizeAssignmentEntry = (session = {}, fallbackTitle = null) => {
  if (session.assignment !== true) return null;

  const chapter = session.chapter || session.assignmentId || session.id || session.assignment || fallbackTitle || null;
  const number = parseAssignmentNumber(chapter);
  const label =
    session.assignmentTitle ||
    session.title ||
    session.keyAssignment ||
    fallbackTitle ||
    chapter ||
    (Number.isFinite(number) ? `Assignment ${number}` : null);

  if (!label && !Number.isFinite(number)) return null;

  return {
    label: label || "",
    number: Number.isFinite(number) ? number : null,
  };
};

const collectDayAssignments = (day = {}) => {
  const collected = [];

  const pushEntry = (entry, fallbackTitle) => {
    const normalized = normalizeAssignmentEntry(entry, fallbackTitle);
    if (normalized) collected.push(normalized);
  };

  const fallbackTitle = day.topic || day.title || null;
  pushEntry({ ...day, chapter: day.chapter || day.topic }, fallbackTitle);

  const processGroup = (group, fallback) => {
    if (Array.isArray(group)) {
      group.forEach((item) => pushEntry(item, fallback));
    } else if (group) {
      pushEntry(group, fallback);
    }
  };

  processGroup(day.sessions, fallbackTitle);
  processGroup(day.lesen_hören, fallbackTitle);
  processGroup(day.schreiben_sprechen, fallbackTitle);

  return collected;
};

const collectPlannedAssignments = ({ level, className } = {}) => {
  const levelKey = String(level || "").toUpperCase();
  const scheduleDays = courseSchedules[levelKey] || courseSchedulesByName[className]?.days || [];
  const seen = new Set();

  return scheduleDays
    .flatMap((day) => collectDayAssignments(day))
    .filter(Boolean)
    .filter((entry) => {
      const key = Number.isFinite(entry.number) ? `N:${entry.number}` : `L:${entry.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const formatAssignmentLabel = (entry) => {
  if (!entry) return "";
  if (typeof entry === "string") return entry;
  if (typeof entry === "number") return `Assignment ${entry}`;
  if (entry.label) return entry.label;
  if (entry.assignment) return entry.assignment;
  if (typeof entry.number === "number") return `Assignment ${entry.number}`;
  return "";
};

const formatList = (items = [], maxItems = 3) => {
  const labels = items.map(formatAssignmentLabel).filter(Boolean);
  if (!labels.length) return "None yet";
  if (labels.length <= maxItems) {
    if (labels.length === 1) return labels[0];
    if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
    return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
  }
  const shown = labels.slice(0, maxItems);
  return `${shown.join(", ")} (+${labels.length - maxItems} more)`;
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
      setRefreshError("Could not refresh right now. Showing your last saved metrics.");
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

  const completedAssignments = useMemo(
    () => assignmentStats?.completedAssignments || [],
    [assignmentStats?.completedAssignments]
  );

  const plannedAssignments = useMemo(() => {
    return collectPlannedAssignments({
      level: studentProfile?.level,
      className: studentProfile?.className,
    });
  }, [studentProfile?.className, studentProfile?.level]);

  const plannedNumberToLabel = useMemo(() => {
    const map = new Map();
    plannedAssignments.forEach((entry) => {
      if (Number.isFinite(entry.number) && entry.label && !map.has(entry.number)) {
        map.set(entry.number, entry.label);
      }
    });
    return map;
  }, [plannedAssignments]);

  const missedAssignments = useMemo(
    () => assignmentStats?.missedAssignments || [],
    [assignmentStats?.missedAssignments]
  );

  const failedAssignments = useMemo(
    () => assignmentStats?.failedAssignments || [],
    [assignmentStats?.failedAssignments]
  );

  const completedNumbers = useMemo(() => {
    return completedAssignments
      .map((e) =>
        typeof e?.number === "number"
          ? e.number
          : parseAssignmentNumber(e?.label || e?.assignment)
      )
      .filter((n) => Number.isFinite(n));
  }, [completedAssignments]);

  const computedMissingNumbers = useMemo(
    () => findMissingNumbers(completedNumbers),
    [completedNumbers]
  );

  const plannedMissing = useMemo(() => {
    if (!plannedAssignments.length) return [];
    const latestCompleted = completedNumbers.length ? Math.max(...completedNumbers) : null;
    const plannedNumbers = plannedAssignments
      .map((entry) => entry.number)
      .filter((num) => Number.isFinite(num))
      .sort((a, b) => a - b);

    return plannedNumbers
      .filter((num) => !completedNumbers.includes(num) && (latestCompleted === null || num <= latestCompleted))
      .map((num) => ({ number: num, label: plannedNumberToLabel.get(num) || `Assignment ${num}` }));
  }, [completedNumbers, plannedAssignments, plannedNumberToLabel]);

  const normalizedMissed = useMemo(() => {
    if (missedAssignments.length) return missedAssignments;
    if (plannedMissing.length) return plannedMissing;
    return computedMissingNumbers.map((n) => ({ number: n, label: `Assignment ${n}` }));
  }, [computedMissingNumbers, missedAssignments, plannedMissing]);

  const recommendedNext = useMemo(() => {
    if (normalizedMissed.length) return formatAssignmentLabel(normalizedMissed[0]);

    if (plannedAssignments.length) {
      const pendingPlanned = plannedAssignments
        .filter((entry) => Number.isFinite(entry.number) && !completedNumbers.includes(entry.number))
        .sort((a, b) => Number(a.number ?? 0) - Number(b.number ?? 0));
      if (pendingPlanned.length) return formatAssignmentLabel(pendingPlanned[0]);
    }

    const step = inferStep(completedNumbers);
    if (completedNumbers.length) {
      const max = Math.max(...completedNumbers);
      const next = Number((max + step).toFixed(2));
      return `Assignment ${next}`;
    }

    if (assignmentStats?.lastAssignment) {
      const parsed = parseAssignmentNumber(assignmentStats.lastAssignment);
      if (parsed !== null) return `Assignment ${Number((parsed + 1).toFixed(2))}`;
      return `Repeat ${assignmentStats.lastAssignment}`;
    }

    return "Start with Assignment 1";
  }, [assignmentStats?.lastAssignment, completedNumbers, normalizedMissed, plannedAssignments]);

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
            <span style={{ ...styles.badge, background: "#fff7ed", borderColor: "#fdba74", color: "#9a3412" }}>
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
          <h4 style={{ margin: "4px 0" }}>{recommendedNext}</h4>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Based on your score sheet submissions and any gaps we detected.
          </p>
        </div>

        <div style={{ ...styles.vocabCard, background: "#eef2ff", borderColor: "#c7d2fe" }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Missed or skipped</p>
          <h4 style={{ margin: "4px 0" }}>{formatList(normalizedMissed)}</h4>
          <p style={{ ...styles.helperText, margin: 0 }}>
            We use scored submissions only.
          </p>
        </div>

        <div style={{ ...styles.vocabCard, background: "#ffe4e6", borderColor: "#fda4af" }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Below pass mark (60)</p>
          <h4 style={{ margin: "4px 0" }}>{formatList(failedAssignments)}</h4>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Retake these to push them over the line.
          </p>
        </div>
      </div>

      {assignmentStats ? (
        <div style={{ ...styles.helperText, margin: 0 }}>
          This week: {assignmentStats.weekAssignments || 0} assignments across {assignmentStats.weekAttempts || 0} attempts ·
          Streak: {assignmentStats.streakDays || 0} day(s) · Last upload: {assignmentStats.lastAssignment || "–"} ·
          Retries this week: {assignmentStats.retriesThisWeek || 0}
        </div>
      ) : null}
    </section>
  );
};

export default HomeMetrics;
