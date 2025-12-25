import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchAttendanceSummary } from "../services/attendanceService";
import { fetchScoreSummary } from "../services/scoreSummaryService";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";

const labelOf = (entry) => {
  if (!entry) return "";
  if (typeof entry === "string") return entry;
  return String(entry.label || entry.assignment || "").trim();
};

const formatList = (items = [], maxItems = 3) => {
  const labels = (items || []).map(labelOf).filter(Boolean);
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

  const missedAssignments = useMemo(() => assignmentStats?.missedAssignments || [], [assignmentStats]);
  const failedAssignments = useMemo(() => assignmentStats?.failedAssignments || [], [assignmentStats]);
  const blocked = Boolean(assignmentStats?.recommendationBlocked);
  const nextObj = assignmentStats?.nextRecommendation || null;

  const recommendedNext = useMemo(() => {
    if (blocked) {
      const firstFail = failedAssignments[0];
      return firstFail ? `Redo first: ${labelOf(firstFail)}` : "Redo failed work first";
    }

    if (nextObj?.label) return nextObj.label;

    if (missedAssignments.length) return labelOf(missedAssignments[0]);

    // If we have any stats at all and nothing is pending, you're caught up.
    if (assignmentStats) return "All caught up 🎉";

    return "Start with Day 1";
  }, [assignmentStats, blocked, failedAssignments, missedAssignments, nextObj]);

  const failedIdentifiersText = useMemo(() => {
    const ids = assignmentStats?.failedIdentifiers || [];
    return ids.length ? ids.join(", ") : "";
  }, [assignmentStats]);

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
            {blocked
              ? failedIdentifiersText
                ? `Blocked until you pass: ${failedIdentifiersText}`
                : "Blocked until failed work is passed."
              : nextObj?.goal
              ? `Goal: ${nextObj.goal}`
              : "Based on your score sheet submissions and schedule targets."}
          </p>
        </div>

        <div style={{ ...styles.vocabCard, background: "#eef2ff", borderColor: "#c7d2fe" }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Missed or skipped</p>
          <h4 style={{ margin: "4px 0" }}>{formatList(missedAssignments)}</h4>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Missed = incomplete items up to your last fully completed day.
          </p>
        </div>

        <div style={{ ...styles.vocabCard, background: "#ffe4e6", borderColor: "#fda4af" }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Below pass mark (60)</p>
          <h4 style={{ margin: "4px 0" }}>{formatList(failedAssignments)}</h4>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Retake these to unlock next recommendations.
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
