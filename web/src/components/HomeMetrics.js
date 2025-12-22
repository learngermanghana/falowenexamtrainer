import React, { useEffect, useMemo, useState } from "react";
import { fetchAttendanceSummary } from "../services/attendanceService";
import { fetchAssignmentSummary } from "../services/assignmentService";
import { styles } from "../styles";

const parseAssignmentNumber = (assignment = "") => {
  const match = assignment.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
};

const findMissingNumbers = (numbers = []) => {
  const sorted = Array.from(new Set(numbers)).sort((a, b) => a - b);
  if (!sorted.length) return [];

  const hasDecimals = sorted.some((value) => Math.abs(value - Math.round(value)) > 0.0001);
  const step = hasDecimals ? 0.1 : 1;
  const end = sorted[sorted.length - 1];
  const start = sorted[0] > step ? step : sorted[0];
  const missing = [];

  for (let current = start; current < end - 1e-6; current = Number((current + step).toFixed(1))) {
    const exists = sorted.some((value) => Math.abs(value - current) < 1e-6);
    if (!exists) missing.push(Number(current.toFixed(1)));
  }

  return missing;
};

const formatAssignmentLabel = (entry) => {
  if (!entry) return "";
  if (typeof entry === "string") return entry;
  if (entry.label) return entry.label;
  if (typeof entry.number === "number") return `Assignment ${entry.number}`;
  return "";
};

const formatList = (items = []) => {
  const labels = items.map(formatAssignmentLabel).filter(Boolean);
  if (!labels.length) return "None yet";
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
};

const HomeMetrics = ({ studentProfile }) => {
  const [attendance, setAttendance] = useState({ sessions: 0, hours: 0 });
  const [assignmentStats, setAssignmentStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const className = studentProfile?.className || "";
  const studentCode =
    studentProfile?.studentcode || studentProfile?.studentCode || studentProfile?.id || "";

  const isMountedRef = React.useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refreshMetrics = React.useCallback(async () => {
    if (!className && !studentCode) {
      if (isMountedRef.current) {
        setAttendance({ sessions: 0, hours: 0 });
        setAssignmentStats(null);
      }
      return;
    }

    if (isMountedRef.current) setLoading(true);
    try {
      const [attendanceResponse, assignmentResponse] = await Promise.all([
        fetchAttendanceSummary({ className, studentCode }),
        fetchAssignmentSummary({ studentCode }),
      ]);

      if (!isMountedRef.current) return;

      setAttendance(attendanceResponse || { sessions: 0, hours: 0 });
      setAssignmentStats(assignmentResponse?.student || null);
    } catch (error) {
      if (!isMountedRef.current) return;

      setAttendance({ sessions: 0, hours: 0 });
      setAssignmentStats(null);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [className, studentCode]);

  useEffect(() => {
    const run = async () => {
      await refreshMetrics();
    };

    run();
  }, [refreshMetrics]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refreshMetrics();
      }
    };

    const handleFocus = () => {
      refreshMetrics();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refreshMetrics]);

  const completedNumbers = useMemo(() => {
    return (assignmentStats?.completedAssignments || [])
      .map((entry) => entry.number)
      .filter((value) => typeof value === "number");
  }, [assignmentStats?.completedAssignments]);

  const missingNumbers = useMemo(() => findMissingNumbers(completedNumbers), [completedNumbers]);

  const normalizedMissedAssignments = useMemo(() => {
    if (assignmentStats?.missedAssignments?.length) {
      return assignmentStats.missedAssignments
        .map((entry) => {
          if (!entry) return null;
          if (typeof entry === "string") {
            return { label: entry, number: parseAssignmentNumber(entry) };
          }
          return {
            label: entry.label || entry.title || entry.assignment || entry.chapter || null,
            number:
              typeof entry.number === "number"
                ? entry.number
                : parseAssignmentNumber(entry.label || entry.title || entry.assignment || entry.chapter),
          };
        })
        .filter(Boolean);
    }

    return missingNumbers.map((value) => ({ number: value, label: `Assignment ${value}` }));
  }, [assignmentStats?.missedAssignments, missingNumbers]);

  const recommendedNext = useMemo(() => {
    const queued = normalizedMissedAssignments[0];
    const queuedLabel = formatAssignmentLabel(queued);
    if (queuedLabel) return queuedLabel;

    const hasDecimals = completedNumbers.some((value) => Math.abs(value - Math.round(value)) > 0.0001);
    const step = hasDecimals ? 0.1 : 1;
    const nextNumber = missingNumbers[0] ?? (completedNumbers.length
      ? Number((Math.max(...completedNumbers) + step).toFixed(1))
      : null);

    if (nextNumber !== null && Number.isFinite(nextNumber)) {
      return `Assignment ${nextNumber}`;
    }

    if (assignmentStats?.lastAssignment) {
      const parsed = parseAssignmentNumber(assignmentStats.lastAssignment);
      if (parsed !== null) {
        return `Assignment ${(parsed + step).toFixed(1)}`;
      }
      return `Repeat ${assignmentStats.lastAssignment}`;
    }

    return "Start with Assignment 1";
  }, [assignmentStats?.lastAssignment, completedNumbers, missingNumbers, normalizedMissedAssignments]);

  const failedAssignments = useMemo(() => assignmentStats?.failedAssignments || [], [assignmentStats?.failedAssignments]);

  const missedAssignments = useMemo(() => normalizedMissedAssignments, [normalizedMissedAssignments]);

  return (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <p style={{ ...styles.helperText, margin: 0 }}>Your personalised metrics</p>
          <h3 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Attendance and assignments snapshot</h3>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {loading && <span style={styles.badge}>Refreshing…</span>}
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
            Based on your submissions and any gaps we detected.
          </p>
        </div>

        <div style={{ ...styles.vocabCard, background: "#eef2ff", borderColor: "#c7d2fe" }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Missed or skipped</p>
          <h4 style={{ margin: "4px 0" }}>{formatList(missedAssignments)}</h4>
          <p style={{ ...styles.helperText, margin: 0 }}>
            We flag graded assignments only; self-practice items are ignored.
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

      {assignmentStats && (
        <div style={{ ...styles.helperText, margin: 0 }}>
          This week: {assignmentStats.weekAssignments || 0} assignments across {assignmentStats.weekAttempts || 0} attempts ·
          Streak: {assignmentStats.streakDays || 0} day(s) · Last upload: {assignmentStats.lastAssignment || "–"}
        </div>
      )}
    </section>
  );
};

export default HomeMetrics;
