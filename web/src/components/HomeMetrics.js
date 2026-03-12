import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { fetchAttendanceSummary } from "../services/attendanceService";
import { getAssignmentDictionaryEntry } from "../data/germanAssignmentCatalog";
import { fetchScoreSummary } from "../services/scoreSummaryService";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";
import { PillBadge, PrimaryActionBar, SectionHeader, StatCard } from "./ui";

const labelOf = (entry) => {
  if (!entry) return "";
  if (typeof entry === "string") return entry;
  return String(entry.label || entry.assignment || "").trim();
};

const formatList = (items = [], maxItems = 3, t) => {
  const labels = (items || []).map(labelOf).filter(Boolean);
  if (!labels.length) return t("homeMetrics.list.none");
  if (labels.length <= maxItems) {
    if (labels.length === 1) return labels[0];
    if (labels.length === 2) return t("homeMetrics.list.two", { first: labels[0], second: labels[1] });
    return t("homeMetrics.list.many", { items: labels.slice(0, -1).join(", "), last: labels[labels.length - 1] });
  }
  const shown = labels.slice(0, maxItems);
  return t("homeMetrics.list.more", { items: shown.join(", "), count: labels.length - maxItems });
};

const extractIdentifiers = (value = "") => {
  const matches = String(value || "").match(/\d+(?:\.\d+)?/g) || [];
  return matches.map((item) => item.trim()).filter(Boolean);
};

const PASS_MARK = 60;

const getScoreFromGoal = (goal = "") => {
  const text = String(goal);
  const fractionMatch = text.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
  if (fractionMatch) {
    const score = Number(fractionMatch[1]);
    const total = Number(fractionMatch[2]);
    if (Number.isFinite(score) && Number.isFinite(total) && total > 0) {
      return { score, total, percent: (score / total) * 100 };
    }
  }
  const percentMatch = text.match(/(\d+(?:\.\d+)?)\s*%/);
  if (percentMatch) {
    const percent = Number(percentMatch[1]);
    if (Number.isFinite(percent)) {
      return { percent };
    }
  }
  return null;
};

const isPassingScoreGoal = (goal = "") => {
  const scoreInfo = getScoreFromGoal(goal);
  if (!scoreInfo) return false;
  if (Number.isFinite(scoreInfo.percent)) return scoreInfo.percent >= PASS_MARK;
  if (Number.isFinite(scoreInfo.score)) return scoreInfo.score >= PASS_MARK;
  return false;
};

const completionIdentifiersByLevel = {
  A1: "14.1",
  A2: "10.28",
  B1: "10.28",
  B2: "10.28",
};

const COURSE_COMPLETION_CALENDAR_KEY = "falowen_course_completion_calendar_download";

const extractCanonicalAssignmentIds = (entry = {}, level = "") => {
  const ids = Array.isArray(entry?.identifiers) ? entry.identifiers : [];
  const normalizedLevel = String(level || "").toUpperCase();
  const normalized = ids
    .map((id) => String(id || "").trim().toUpperCase())
    .filter(Boolean)
    .map((id) => {
      if (/^(A1|A2|B1|B2|C1|C2)-/.test(id)) return id;
      return normalizedLevel ? `${normalizedLevel}-${id}` : id;
    });
  return Array.from(new Set(normalized));
};

const buildDictionaryLabel = (entry = {}, level = "") => {
  const canonicalIds = extractCanonicalAssignmentIds(entry, level);
  if (!canonicalIds.length) return entry?.label || "";

  const topics = canonicalIds
    .map((canonicalId) => {
      const chapter = canonicalId.split("-").slice(1).join("-");
      const dictionaryEntry = getAssignmentDictionaryEntry({
        level,
        assignmentId: canonicalId,
        chapter,
      });
      return dictionaryEntry?.topic || dictionaryEntry?.en || dictionaryEntry?.de || "";
    })
    .filter(Boolean);

  if (!topics.length) return entry?.label || "";

  const day = Number(entry?.dayNumber);
  const dayPrefix = Number.isFinite(day) && day > 0 ? `Day ${day}: ` : "";
  const mergedTopic = Array.from(new Set(topics)).join(" + ");
  return `${dayPrefix}${mergedTopic}`.trim();
};

const HomeMetrics = ({ studentProfile }) => {
  const { t } = useTranslation();
  const { idToken, user } = useAuth();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState({ sessions: 0, hours: 0 });
  const [assignmentStats, setAssignmentStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [leaderboardGeneratedAt, setLeaderboardGeneratedAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshError, setRefreshError] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const className = studentProfile?.className || "";
  const studentCode =
    studentProfile?.studentcode || studentProfile?.studentCode || studentProfile?.id || "";
  const levelKey = String(studentProfile?.level || studentProfile?.course || "").trim().toUpperCase();

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
        fetchAttendanceSummary({ className, studentCode, studentUid: user?.uid, level: levelKey }),
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
      setRefreshError(t("homeMetrics.refreshError"));
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [className, idToken, levelKey, studentCode, t, user?.uid]);

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

  const missedAssignments = useMemo(
    () =>
      (assignmentStats?.missedAssignments || []).map((entry) => ({
        ...entry,
        label: buildDictionaryLabel(entry, levelKey) || entry?.label,
      })),
    [assignmentStats, levelKey]
  );
  const failedAssignments = useMemo(
    () =>
      (assignmentStats?.failedAssignments || []).map((entry) => ({
        ...entry,
        label: buildDictionaryLabel(entry, levelKey) || entry?.label,
      })),
    [assignmentStats, levelKey]
  );
  const blocked = Boolean(assignmentStats?.recommendationBlocked);
  const nextObj = useMemo(() => {
    const next = assignmentStats?.nextRecommendation;
    if (!next) return null;
    return {
      ...next,
      label: buildDictionaryLabel(next, levelKey) || next?.label,
    };
  }, [assignmentStats, levelKey]);

  const isCourseCompleter = useMemo(() => {
    const targetIdentifier = completionIdentifiersByLevel[levelKey];
    if (!targetIdentifier || !assignmentStats?.lastAssignment) return false;
    return extractIdentifiers(assignmentStats.lastAssignment).includes(targetIdentifier);
  }, [assignmentStats?.lastAssignment, levelKey]);

  const completionStorageKey = useMemo(() => {
    const codeKey = String(studentCode || "guest").toLowerCase();
    const level = levelKey || "level";
    return `${COURSE_COMPLETION_CALENDAR_KEY}:${codeKey}:${level}`;
  }, [levelKey, studentCode]);

  const [hasPromptedCompletion, setHasPromptedCompletion] = useState(() => {
    try {
      return localStorage.getItem(completionStorageKey) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!completionStorageKey) return;
    try {
      setHasPromptedCompletion(localStorage.getItem(completionStorageKey) === "true");
    } catch {
      setHasPromptedCompletion(false);
    }
  }, [completionStorageKey]);

  useEffect(() => {
    if (!isCourseCompleter || hasPromptedCompletion) return;
    try {
      localStorage.setItem(completionStorageKey, "true");
    } catch {
      // ignore storage failures
    }
    setHasPromptedCompletion(true);
    navigate("/exams/study?force=1", { state: { forceDownload: true, source: "course-complete" } });
  }, [completionStorageKey, hasPromptedCompletion, isCourseCompleter, navigate]);

  const recommendedNext = useMemo(() => {
    if (nextObj?.label) {
      if (nextObj.type === "retry_failed") {
        return t("homeMetrics.nextRecommendation.redoFirst", { item: nextObj.label });
      }
      if (nextObj.type === "catch_up_missed") {
        return t("homeMetrics.nextRecommendation.catchUpFirst", { item: nextObj.label });
      }
      if (isPassingScoreGoal(nextObj.goal)) {
        return t("homeMetrics.nextRecommendation.allCaughtUp");
      }
      return nextObj.label;
    }

    if (blocked) {
      const firstFail = failedAssignments[0];
      return firstFail
        ? t("homeMetrics.nextRecommendation.redoFirst", { item: labelOf(firstFail) })
        : t("homeMetrics.nextRecommendation.redoFailed");
    }

    if (missedAssignments.length) return labelOf(missedAssignments[0]);

    // If we have any stats at all and nothing is pending, you're caught up.
    if (assignmentStats) return t("homeMetrics.nextRecommendation.allCaughtUp");

    return t("homeMetrics.nextRecommendation.startDayOne");
  }, [assignmentStats, blocked, failedAssignments, missedAssignments, nextObj, t]);

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
    return t("homeMetrics.leaderboard.updated", { date: parsed.toLocaleString() });
  }, [leaderboardGeneratedAt, t]);
  const myLeaderboardEntry = useMemo(() => {
    const normalizedCode = String(studentCode || "").toLowerCase();
    return leaderboardRows.find((row) => String(row.studentCode || "").toLowerCase() === normalizedCode) || null;
  }, [leaderboardRows, studentCode]);
  const normalizedStudentCode = String(studentCode || "").toLowerCase();
  const leaderboardQuickSummary = useMemo(() => {
    if (!leaderboardRows.length) return t("homeMetrics.leaderboard.none");
    if (myLeaderboardEntry) {
      return t("homeMetrics.leaderboard.summarySelf", {
        rank: myLeaderboardEntry.rank,
        total: leaderboardRows.length,
        passed: myLeaderboardEntry.completedCount,
        expected: Math.round((myLeaderboardEntry.expectedPoints || 0) / 100),
        points: myLeaderboardEntry.totalScore,
      });
    }
    return t("homeMetrics.leaderboard.summaryOther", { total: leaderboardRows.length });
  }, [leaderboardRows, myLeaderboardEntry, t]);

  const formatCountedList = useCallback(
    (items = []) => {
      const list = formatList(items, 3, t);
      if (!items.length) return list;
      return `${items.length} · ${list}`;
    },
    [t]
  );

  const missedHelperText = useMemo(() => t("homeMetrics.missed.helper"), [t]);


  return (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      {isCourseCompleter ? (
        <div style={{ ...styles.card, marginBottom: 0, border: "1px solid #fdba74", background: "#fff7ed" }}>
          <SectionHeader
            eyebrow={t("homeMetrics.courseComplete.eyebrow")}
            title={t("homeMetrics.courseComplete.title")}
            actions={
              <PrimaryActionBar align="flex-end">
                <button
                  type="button"
                  onClick={() => navigate("/exams/study?force=1", { state: { forceDownload: true } })}
                  style={styles.primaryButton}
                >
                  {t("homeMetrics.courseComplete.cta")}
                </button>
              </PrimaryActionBar>
            }
          />
          <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>
            {t("homeMetrics.courseComplete.helper")}
          </p>
        </div>
      ) : null}
      <SectionHeader
        eyebrow={t("homeMetrics.section.eyebrow")}
        title={t("homeMetrics.section.title")}
        actions={
          <PrimaryActionBar align="flex-end" wrap>
            {isCourseCompleter ? (
              <PillBadge tone="success">{t("homeMetrics.section.courseCompleter")}</PillBadge>
            ) : null}
            {loading ? <PillBadge tone="info">{t("homeMetrics.section.refreshing")}</PillBadge> : null}
            {refreshError ? <PillBadge tone="warning">{refreshError}</PillBadge> : null}
            <button
              type="button"
              onClick={refreshMetrics}
              disabled={loading}
              style={{ ...styles.secondaryButton, padding: "8px 12px" }}
            >
              {t("homeMetrics.section.refreshCta")}
            </button>
          </PrimaryActionBar>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        <StatCard
          label={t("homeMetrics.attendance.label")}
          value={t("homeMetrics.attendance.sessions", { count: attendance.sessions })}
          helper={t("homeMetrics.attendance.hours", { count: attendance.hours })}
          tone="info"
        />
        <StatCard
          label={t("homeMetrics.nextRecommendation.label")}
          value={recommendedNext}
          helper={
            blocked
              ? failedIdentifiersText
                ? t("homeMetrics.nextRecommendation.blockedWithIds", { items: failedIdentifiersText })
                : t("homeMetrics.nextRecommendation.blocked")
              : nextObj?.type === "catch_up_missed"
              ? t("homeMetrics.nextRecommendation.catchUpHelper")
              : nextObj?.goal && !isPassingScoreGoal(nextObj.goal)
              ? t("homeMetrics.nextRecommendation.goal", { goal: nextObj.goal })
              : t("homeMetrics.nextRecommendation.defaultHelper")
          }
          tone="warning"
        />
        <StatCard
          label={t("homeMetrics.missed.label")}
          value={formatCountedList(missedAssignments)}
          helper={missedHelperText}
          tone="neutral"
        />
        <StatCard
          label={t("homeMetrics.failed.label")}
          value={formatCountedList(failedAssignments)}
          helper={t("homeMetrics.failed.helper")}
          tone="error"
        />
      </div>

      {assignmentStats ? (
        <div style={{ ...styles.helperText, margin: 0 }}>
          {t("homeMetrics.weeklySummary", {
            assignments: assignmentStats.weekAssignments || 0,
            attempts: assignmentStats.weekAttempts || 0,
            streak: assignmentStats.streakDays || 0,
            last: assignmentStats.lastAssignment || "–",
            retries: assignmentStats.retriesThisWeek || 0,
          })}
        </div>
      ) : null}

      {leaderboard ? (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <button
              type="button"
              onClick={() => setShowLeaderboard((prev) => !prev)}
              style={{ ...styles.secondaryButton, padding: "8px 12px" }}
              aria-expanded={showLeaderboard}
            >
              {showLeaderboard ? t("homeMetrics.leaderboard.hide") : t("homeMetrics.leaderboard.view")}
            </button>
          </div>

          {!showLeaderboard ? (
            <div style={{ ...styles.helperText, margin: 0 }}>
              {leaderboardQuickSummary}
              {leaderboardUpdatedLabel ? ` ${leaderboardUpdatedLabel}` : ""}
            </div>
          ) : null}

          {showLeaderboard ? (
            <>
              <div style={{ ...styles.helperText, margin: 0 }}>
                {t("homeMetrics.leaderboard.details", {
                  level: leaderboard.level || levelKey || t("homeMetrics.leaderboard.levelFallback"),
                  minimum: qualificationMinimum,
                })}
                {leaderboardUpdatedLabel ? ` · ${leaderboardUpdatedLabel}` : ""}
              </div>

              {assignmentStats && assignmentStats.completedCount < qualificationMinimum ? (
                <div style={{ ...styles.helperText, margin: 0, fontStyle: "italic" }}>
                  {t("homeMetrics.leaderboard.joinSoon", { minimum: qualificationMinimum })}
                </div>
              ) : null}

              {leaderboardRows.length === 0 ? (
                <div style={{ ...styles.helperText, margin: 0 }}>{t("homeMetrics.leaderboard.none")}</div>
              ) : (
                <div style={{ display: "grid", gap: 6 }}>
                  {myLeaderboardEntry ? (
                    <div style={{ ...styles.helperText, margin: 0 }}>
                      {t("homeMetrics.leaderboard.detailSelf", {
                        rank: myLeaderboardEntry.rank,
                        total: leaderboardRows.length,
                        passed: myLeaderboardEntry.completedCount,
                        expected: Math.round((myLeaderboardEntry.expectedPoints || 0) / 100),
                        failed: myLeaderboardEntry.failedCount || 0,
                        points: myLeaderboardEntry.totalScore,
                        expectedPoints: myLeaderboardEntry.expectedPoints || 0,
                      })}
                    </div>
                  ) : (
                    <div style={{ ...styles.helperText, margin: 0 }}>
                      {t("homeMetrics.leaderboard.qualifiedCount", { total: leaderboardRows.length })}
                    </div>
                  )}
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ textAlign: "left", color: "#6B7280" }}>
                          <th style={{ padding: "6px 8px", borderBottom: "1px solid #e5e7eb" }}>
                            {t("homeMetrics.leaderboard.headers.rank")}
                          </th>
                          <th style={{ padding: "6px 8px", borderBottom: "1px solid #e5e7eb" }}>
                            {t("homeMetrics.leaderboard.headers.name")}
                          </th>
                          <th style={{ padding: "6px 8px", borderBottom: "1px solid #e5e7eb" }}>
                            {t("homeMetrics.leaderboard.headers.passed")}
                          </th>
                          <th style={{ padding: "6px 8px", borderBottom: "1px solid #e5e7eb" }}>
                            {t("homeMetrics.leaderboard.headers.failed")}
                          </th>
                          <th style={{ padding: "6px 8px", borderBottom: "1px solid #e5e7eb" }}>
                            {t("homeMetrics.leaderboard.headers.totalScore")}
                          </th>
                          <th style={{ padding: "6px 8px", borderBottom: "1px solid #e5e7eb" }}>
                            {t("homeMetrics.leaderboard.headers.expectedPoints")}
                          </th>
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
                                {row.name || t("homeMetrics.leaderboard.studentFallback")}
                              </td>
                              <td style={{ padding: "6px 8px", borderBottom: "1px solid #f3f4f6" }}>
                                {row.completedCount} / {Math.round((row.expectedPoints || 0) / 100)}
                              </td>
                              <td style={{ padding: "6px 8px", borderBottom: "1px solid #f3f4f6" }}>
                                {row.failedCount || 0}
                              </td>
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
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default HomeMetrics;
