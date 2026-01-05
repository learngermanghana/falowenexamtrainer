import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchAttendanceSummary } from "../services/attendanceService";
import { fetchScoreSummary } from "../services/scoreSummaryService";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";
import { PillBadge, PrimaryActionBar, SectionHeader, StatCard } from "./ui";

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

const extractIdentifiers = (value = "") => {
  const matches = String(value || "").match(/\d+(?:\.\d+)?/g) || [];
  return matches.map((item) => item.trim()).filter(Boolean);
};

const completionIdentifiersByLevel = {
  A1: "14.1",
  A2: "10.28",
  B1: "10.28",
  B2: "10.28",
};

const HomeMetrics = ({ studentProfile }) => {
  const { idToken } = useAuth();

  const [attendance, setAttendance] = useState({ sessions: 0, hours: 0 });
  const [assignmentStats, setAssignmentStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [leaderboardGeneratedAt, setLeaderboardGeneratedAt] = useState("");
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
        setLeaderboard(null);
        setLeaderboardGeneratedAt("");
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
      setLeaderboard(scoreResponse?.leaderboard || null);
      setLeaderboardGeneratedAt(scoreResponse?.generatedAt || "");
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

  const levelKey = String(studentProfile?.level || studentProfile?.course || "").trim().toUpperCase();
  const isCourseCompleter = useMemo(() => {
    const targetIdentifier = completionIdentifiersByLevel[levelKey];
    if (!targetIdentifier || !assignmentStats?.lastAssignment) return false;
    return extractIdentifiers(assignmentStats.lastAssignment).includes(targetIdentifier);
  }, [assignmentStats?.lastAssignment, levelKey]);

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

  const leaderboardRows = useMemo(() => leaderboard?.rows || [], [leaderboard]);
  const qualificationMinimum = leaderboard?.qualificationMinimum ?? 3;
  const topLeaderboardRows = useMemo(() => leaderboardRows.slice(0, 10), [leaderboardRows]);
  const leaderboardUpdatedLabel = useMemo(() => {
    if (!leaderboardGeneratedAt) return "";
    const parsed = new Date(leaderboardGeneratedAt);
    if (Number.isNaN(parsed.getTime())) return "";
    return `Last updated ${parsed.toLocaleString()}`;
  }, [leaderboardGeneratedAt]);
  const myLeaderboardEntry = useMemo(() => {
    const normalizedCode = String(studentCode || "").toLowerCase();
    return leaderboardRows.find((row) => String(row.studentCode || "").toLowerCase() === normalizedCode) || null;
  }, [leaderboardRows, studentCode]);
  const normalizedStudentCode = String(studentCode || "").toLowerCase();

  return (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <SectionHeader
        eyebrow="Your personalised metrics"
        title="Attendance and assignments snapshot"
        actions={
          <PrimaryActionBar align="flex-end" wrap>
            {isCourseCompleter ? <PillBadge tone="success">Course completer</PillBadge> : null}
            {loading ? <PillBadge tone="info">Refreshing…</PillBadge> : null}
            {refreshError ? <PillBadge tone="warning">{refreshError}</PillBadge> : null}
            <button
              type="button"
              onClick={refreshMetrics}
              disabled={loading}
              style={{ ...styles.secondaryButton, padding: "8px 12px" }}
            >
              Refresh now
            </button>
          </PrimaryActionBar>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        <StatCard
          label="Attendance"
          value={`${attendance.sessions} sessions credited`}
          helper={`${attendance.hours} total hours`}
          tone="info"
        />
        <StatCard
          label="Next recommendation"
          value={recommendedNext}
          helper={
            blocked
              ? failedIdentifiersText
                ? `Blocked until you pass: ${failedIdentifiersText}`
                : "Blocked until failed work is passed."
              : nextObj?.goal
              ? `Goal: ${nextObj.goal}`
              : "Based on your score sheet submissions and schedule targets."
          }
          tone="warning"
        />
        <StatCard
          label="Missed or skipped"
          value={formatList(missedAssignments)}
          helper="Missed = incomplete items up to your last fully completed day."
          tone="neutral"
        />
        <StatCard
          label="Below pass mark (60)"
          value={formatList(failedAssignments)}
          helper="Retake these to unlock next recommendations."
          tone="error"
        />
      </div>

      {assignmentStats ? (
        <div style={{ ...styles.helperText, margin: 0 }}>
          This week: {assignmentStats.weekAssignments || 0} assignments across {assignmentStats.weekAttempts || 0} attempts ·
          Streak: {assignmentStats.streakDays || 0} day(s) · Last upload: {assignmentStats.lastAssignment || "–"} ·
          Retries this week: {assignmentStats.retriesThisWeek || 0}
        </div>
      ) : null}

      {leaderboard ? (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ ...styles.helperText, margin: 0 }}>
            Level leaderboard ({leaderboard.level || levelKey || "your level"}) · Only scores 60+ count ·
            Qualify after {qualificationMinimum} passed assignments.
            {leaderboardUpdatedLabel ? ` · ${leaderboardUpdatedLabel}` : ""}
          </div>

          {assignmentStats && assignmentStats.completedCount < qualificationMinimum ? (
            <div style={{ ...styles.helperText, margin: 0, fontStyle: "italic" }}>
              You&apos;ll join once you pass {qualificationMinimum} assignments. Keep it steady — no rush.
            </div>
          ) : null}

          {leaderboardRows.length === 0 ? (
            <div style={{ ...styles.helperText, margin: 0 }}>No qualified rankings yet for this level.</div>
          ) : (
            <div style={{ display: "grid", gap: 6 }}>
              {myLeaderboardEntry ? (
                <div style={{ ...styles.helperText, margin: 0 }}>
                  You are #{myLeaderboardEntry.rank} out of {leaderboardRows.length} students with{" "}
                  {myLeaderboardEntry.completedCount} / {Math.round((myLeaderboardEntry.expectedPoints || 0) / 100)} passed, {" "}
                  {myLeaderboardEntry.failedCount || 0} failed, {myLeaderboardEntry.totalScore} points, and{" "}
                  {myLeaderboardEntry.expectedPoints || 0} expected points.
                </div>
              ) : (
                <div style={{ ...styles.helperText, margin: 0 }}>
                  {leaderboardRows.length} students have qualified for this level.
                </div>
              )}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: "left", color: "#6B7280" }}>
                      <th style={{ padding: "6px 8px", borderBottom: "1px solid #e5e7eb" }}>Rank</th>
                      <th style={{ padding: "6px 8px", borderBottom: "1px solid #e5e7eb" }}>Name</th>
                      <th style={{ padding: "6px 8px", borderBottom: "1px solid #e5e7eb" }}>Passed</th>
                      <th style={{ padding: "6px 8px", borderBottom: "1px solid #e5e7eb" }}>Failed</th>
                      <th style={{ padding: "6px 8px", borderBottom: "1px solid #e5e7eb" }}>Total score</th>
                      <th style={{ padding: "6px 8px", borderBottom: "1px solid #e5e7eb" }}>Expected points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topLeaderboardRows.map((row) => {
                      const isCurrentUser =
                        normalizedStudentCode && String(row.studentCode || "").toLowerCase() === normalizedStudentCode;
                      return (
                        <tr
                          key={`${row.studentCode || row.name}-${row.rank}`}
                          style={{
                            background: isCurrentUser ? "#eef2ff" : "transparent",
                            fontWeight: isCurrentUser ? 700 : 500,
                          }}
                        >
                          <td style={{ padding: "6px 8px", borderBottom: "1px solid #f3f4f6" }}>#{row.rank}</td>
                          <td style={{ padding: "6px 8px", borderBottom: "1px solid #f3f4f6" }}>
                            {row.name || "Student"}
                          </td>
                          <td style={{ padding: "6px 8px", borderBottom: "1px solid #f3f4f6" }}>
                            {row.completedCount} / {Math.round((row.expectedPoints || 0) / 100)}
                          </td>
                          <td style={{ padding: "6px 8px", borderBottom: "1px solid #f3f4f6" }}>{row.failedCount || 0}</td>
                          <td style={{ padding: "6px 8px", borderBottom: "1px solid #f3f4f6" }}>{row.totalScore}</td>
                          <td style={{ padding: "6px 8px", borderBottom: "1px solid #f3f4f6" }}>
                            {row.expectedPoints || 0}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
};

export default HomeMetrics;
