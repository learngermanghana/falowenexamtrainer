import React, { useCallback, useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { useExam } from "../context/ExamContext";
import { fetchAttendanceSummary } from "../services/attendanceService";
import { fetchScoreSummary } from "../services/scoreSummaryService";
import { fetchStudentResultsHistory } from "../services/resultsApi";
import { downloadClassCalendar } from "../services/classCalendar";
import { isFirebaseConfigured } from "../firebase";
import { computeExamReadiness } from "../lib/examReadiness";
import { jsPDF } from "jspdf";

// ---------- helpers ----------
const formatDate = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString();
};

const formatDateTime = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleString();
};

const toTime = (row) => {
  const raw = row?.date ?? row?.created_at ?? row?.createdAt ?? 0;
  const t = new Date(raw).getTime();
  return Number.isNaN(t) ? 0 : t;
};

// Sheets/CSV often returns "85" or "85/100" as string
const parseScore = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;

  const cleaned = String(value).trim().replace(",", ".");
  const match = cleaned.match(/(\d+(\.\d+)?)/);
  if (!match) return null;

  const num = Number(match[1]);
  return Number.isFinite(num) ? num : null;
};

const initialAttendanceState = { sessions: 0, hours: 0, loading: false, error: "" };

const initialAssignmentState = {
  loading: false,
  completed: [],
  failedLessons: [],
  missedLessons: [],
  nextRecommendation: null,
  blocked: false,
  lastAssignment: null,
  retriesThisWeek: 0,
  totalAssignments: null,
  completedCount: 0,
  pointsEarned: null,
  expectedPoints: null,
  leaderboard: null,
  leaderboardGeneratedAt: "",
  error: "",
};

const initialFeedbackState = { loading: false, items: [], error: "" };

// ---------- UI bits ----------
const StatCard = ({ label, value, sub, icon }) => (
  <div
    style={{
      border: "1px solid #e5e7eb",
      borderRadius: 14,
      padding: 12,
      background: "#ffffff",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      display: "grid",
      gap: 6,
      minWidth: 0,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6B7280", fontSize: 12, fontWeight: 800 }}>
      <span aria-hidden style={{ fontSize: 14 }}>{icon}</span>
      {label}
    </div>
    <div style={{ fontSize: 16, fontWeight: 900, color: "#111827", overflow: "hidden", textOverflow: "ellipsis" }}>
      {value}
    </div>
    {sub ? <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.4 }}>{sub}</div> : null}
  </div>
);

const CollapsibleCard = ({ title, subtitle, right, defaultOpen, children }) => (
  <details
    open={defaultOpen}
    style={{
      ...styles.card,
      padding: 0,
      overflow: "hidden",
    }}
  >
    <summary
      style={{
        listStyle: "none",
        cursor: "pointer",
        padding: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        borderBottom: "1px solid #e5e7eb",
        userSelect: "none",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span aria-hidden style={{ color: "#6B7280" }}>▾</span>
          <div style={{ fontWeight: 900, color: "#111827" }}>{title}</div>
        </div>
        {subtitle ? <div style={{ marginLeft: 22, fontSize: 12, color: "#6B7280" }}>{subtitle}</div> : null}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {right}
      </div>
    </summary>

    <div style={{ padding: 12 }}>{children}</div>
  </details>
);

// ---------- PDF helpers ----------
const pdfKeyValueBlock = (doc, startY, pairs) => {
  let y = startY;
  pairs.forEach(([k, v]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${k}:`, 14, y);
    doc.setFont("helvetica", "normal");

    const text = String(v ?? "—");
    const lines = doc.splitTextToSize(text, 130);
    doc.text(lines, 60, y);
    y += 8 * Math.max(1, lines.length);
  });
  return y;
};

const downloadSimplePdf = ({ filename, title, subtitle, pairs, footer }) => {
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, 14, 18);

  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(subtitle, 14, 26);
  }

  doc.setDrawColor(220);
  doc.line(14, 30, 196, 30);

  doc.setFontSize(12);
  const endY = pdfKeyValueBlock(doc, 40, pairs);

  doc.setDrawColor(220);
  doc.line(14, endY + 4, 196, endY + 4);

  if (footer) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const footerLines = doc.splitTextToSize(String(footer), 180);
    doc.text(footerLines, 14, endY + 14);
  }

  doc.save(filename);
};

// ---------- component ----------
const MyExamFilePage = () => {
  const { studentProfile, user, idToken } = useAuth();
  const { level, levelConfirmed } = useExam();

  const [attendanceState, setAttendanceState] = useState(initialAttendanceState);
  const [assignmentState, setAssignmentState] = useState(initialAssignmentState);
  const [feedbackState, setFeedbackState] = useState(initialFeedbackState);

  const studentCode = useMemo(() => {
    return studentProfile?.studentcode || studentProfile?.studentCode || studentProfile?.id || "";
  }, [studentProfile]);

  const className = useMemo(() => studentProfile?.className || "", [studentProfile]);

  const detectedLevel = useMemo(() => {
    const raw = levelConfirmed ? level : studentProfile?.level || level || "";
    return String(raw || "").toUpperCase();
  }, [level, levelConfirmed, studentProfile]);

  const loadAttendance = useCallback(async () => {
    if (!className || !studentCode) {
      setAttendanceState({ ...initialAttendanceState, error: "Add your class and student code to view attendance." });
      return;
    }

    // NOTE: some setups export isFirebaseConfigured as boolean, others as function.
    // If yours is a function, change this to: if (!isFirebaseConfigured())
    if (!isFirebaseConfigured) {
      setAttendanceState({ ...initialAttendanceState, error: "Connect Firebase to load attendance." });
      return;
    }

    setAttendanceState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const summary = await fetchAttendanceSummary({ className, studentCode });
      setAttendanceState({
        sessions: summary.sessions || 0,
        hours: summary.hours || 0,
        loading: false,
        error: "",
      });
    } catch (error) {
      setAttendanceState({ ...initialAttendanceState, error: "Could not load attendance right now." });
    }
  }, [className, studentCode]);

  const loadAssignments = useCallback(async () => {
    if (!studentCode) {
      setAssignmentState({ ...initialAssignmentState, error: "Add your student code to see submitted assignments." });
      return;
    }

    if (!idToken) {
      setAssignmentState({ ...initialAssignmentState, error: "Sign in again to load your score summary." });
      return;
    }

    setAssignmentState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const response = await fetchScoreSummary({ idToken, studentCode });
      const student = response.student || {};
      setAssignmentState({
        loading: false,
        completed: student.completedAssignments || [],
        failedLessons: student.failedAssignments || [],
        missedLessons: student.missedAssignments || [],
        nextRecommendation: student.nextRecommendation || null,
        blocked: Boolean(student.recommendationBlocked),
        lastAssignment: student.lastAssignment || null,
        retriesThisWeek: student.retriesThisWeek || 0,
        totalAssignments: student.totalAssignments ?? null,
        completedCount: student.completedCount ?? (student.completedAssignments || []).length,
        pointsEarned: student.pointsEarned ?? null,
        expectedPoints: student.expectedPoints ?? null,
        leaderboard: response.leaderboard || null,
        leaderboardGeneratedAt: response.generatedAt || "",
        error: "",
      });
    } catch (error) {
      setAssignmentState({ ...initialAssignmentState, error: "Could not load score summary." });
    }
  }, [idToken, studentCode]);

  const loadFeedback = useCallback(async () => {
    if (!studentCode) {
      setFeedbackState({ ...initialFeedbackState, error: "Add your student code to see feedback history." });
      return;
    }

    if (!idToken) {
      setFeedbackState({ ...initialFeedbackState, error: "Sign in again to load feedback history." });
      return;
    }

    setFeedbackState({ loading: true, items: [], error: "" });
    try {
      const rows = await fetchStudentResultsHistory({ idToken, studentCode });

      const items = (rows || [])
        .map((row) => ({ ...row, score: parseScore(row.score) }))
        .slice()
        .sort((a, b) => toTime(b) - toTime(a))
        .filter((row) => row.comments || row.score !== null)
        .slice(0, 12);

      setFeedbackState({ loading: false, items, error: "" });
    } catch (error) {
      setFeedbackState({ loading: false, items: [], error: "Could not load teacher feedback right now." });
    }
  }, [idToken, studentCode]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  const readiness = useMemo(() => {
    return computeExamReadiness({
      attendanceSessions: attendanceState.sessions,
      completedAssignments: assignmentState.completed,
      totalAssignments: assignmentState.totalAssignments,
    });
  }, [assignmentState.completed, assignmentState.totalAssignments, attendanceState.sessions]);

  const lockedAssignments = useMemo(() => {
    return (assignmentState.completed || [])
      .slice()
      .sort((a, b) => String(a.identifier || "").localeCompare(String(b.identifier || "")))
      .slice(0, 8);
  }, [assignmentState.completed]);

  const feedbackItems = useMemo(() => (feedbackState.items || []).slice(0, 6), [feedbackState.items]);
  const lastFeedbackDate = useMemo(() => {
    const latest = feedbackState.items?.[0];
    return latest?.date || latest?.created_at || latest?.createdAt || "";
  }, [feedbackState.items]);

  const pointsSummary = useMemo(() => {
    if (assignmentState.pointsEarned === null || assignmentState.expectedPoints === null) return "Not yet";
    return `${assignmentState.pointsEarned}/${assignmentState.expectedPoints} pts`;
  }, [assignmentState.expectedPoints, assignmentState.pointsEarned]);

  const assignmentProgress = useMemo(() => {
    if (assignmentState.totalAssignments === null) return "Assignments passed: —";
    return `Assignments passed: ${assignmentState.completedCount}/${assignmentState.totalAssignments}`;
  }, [assignmentState.completedCount, assignmentState.totalAssignments]);

  const leaderboardRows = useMemo(() => assignmentState.leaderboard?.rows || [], [assignmentState.leaderboard]);
  const qualificationMinimum = assignmentState.leaderboard?.qualificationMinimum ?? 3;
  const topLeaderboardRows = useMemo(() => leaderboardRows.slice(0, 10), [leaderboardRows]);
  const leaderboardUpdatedLabel = useMemo(() => {
    const formatted = formatDateTime(assignmentState.leaderboardGeneratedAt);
    return formatted ? `Last updated ${formatted}` : "";
  }, [assignmentState.leaderboardGeneratedAt]);
  const myLeaderboardEntry = useMemo(() => {
    const normalizedCode = String(studentCode || "").toLowerCase();
    return leaderboardRows.find((row) => String(row.studentCode || "").toLowerCase() === normalizedCode) || null;
  }, [leaderboardRows, studentCode]);
  const normalizedStudentCode = String(studentCode || "").toLowerCase();

  const nextRecLabel = useMemo(() => {
    if (assignmentState.loading) return "Loading…";
    if (assignmentState.error) return "Unavailable";
    if (assignmentState.blocked) return "Blocked (fix failed tasks)";
    if (!assignmentState.nextRecommendation) return "Not set yet";
    return assignmentState.nextRecommendation.label || assignmentState.nextRecommendation.identifier || "Next task";
  }, [assignmentState.blocked, assignmentState.error, assignmentState.loading, assignmentState.nextRecommendation]);

  const downloadContract = () => {
    const studentName = studentProfile?.name || user?.email || "Unknown";
    downloadSimplePdf({
      filename: "contract-summary.pdf",
      title: "Falowen Learning Hub",
      subtitle: "Contract Summary (Unofficial)",
      pairs: [
        ["Student", studentName],
        ["Student code", studentCode || "—"],
        ["Level", detectedLevel || "Not set"],
        ["Class", className || "Not set"],
        ["Payment status", studentProfile?.paymentStatus || "pending"],
        ["Contract term", `${studentProfile?.contractTermMonths || "n/a"} months`],
        ["Start date", formatDate(studentProfile?.contractStart) || "n/a"],
        ["End date", formatDate(studentProfile?.contractEnd) || "n/a"],
      ],
      footer: "This is a generated summary for quick reference. Contact support for an official contract copy.",
    });
  };

  const downloadReceipt = () => {
    const generated = new Date().toLocaleString();
    downloadSimplePdf({
      filename: "receipt-log.pdf",
      title: "Falowen Learning Hub",
      subtitle: "Receipt Log (Unofficial)",
      pairs: [
        ["Generated", generated],
        ["Student", studentProfile?.name || "—"],
        ["Student code", studentCode || "—"],
        ["Email", user?.email || "—"],
        ["Level", detectedLevel || "—"],
        ["Class", className || "—"],
        ["Payment status", (studentProfile?.paymentStatus || "pending").toString()],
      ],
      footer: "This is a placeholder receipt log. Contact support for official invoices/receipts.",
    });
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* Report header */}
      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
          <div>
            <p style={{ ...styles.helperText, margin: 0 }}>Exam dossier</p>
            <h2 style={{ ...styles.sectionTitle, margin: "4px 0" }}>My Exam File</h2>
            <p style={{ ...styles.helperText, margin: 0 }}>
              A quick report of your level, readiness, attendance, scores, and tutor feedback.
            </p>
          </div>

          <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
            <span style={styles.badge}>Student code: {studentCode || "not set"}</span>
            {className ? <span style={styles.badge}>Class: {className}</span> : null}
          </div>
        </div>

        {/* Top summary row */}
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
          <StatCard
            icon="🎓"
            label="Level"
            value={detectedLevel || "Not set"}
            sub={className ? `Class: ${className}` : "Add class name in your profile"}
          />
          <StatCard icon={readiness.icon || "📌"} label="Readiness" value={readiness.text} sub={readiness.detail} />
          <StatCard icon="🧾" label="Attendance" value={`${attendanceState.sessions} sessions`} sub={`${attendanceState.hours} hours`} />
          <StatCard
            icon="🗓️"
            label="Last feedback"
            value={lastFeedbackDate ? formatDate(lastFeedbackDate) : (feedbackState.loading ? "Loading…" : "No feedback yet")}
            sub="Latest marked task date"
          />
          <StatCard
            icon={assignmentState.blocked ? "⛔" : "➡️"}
            label="Next recommendation"
            value={nextRecLabel}
            sub={assignmentState.blocked ? "Pass failed identifiers to unlock" : "Based on your score sheet"}
          />
          <StatCard
            icon="🏅"
            label="Score progress"
            value={pointsSummary}
            sub={`${assignmentProgress} · Passes counted from 60+`}
          />
        </div>

        {/* Readiness banner */}
        <div
          style={{
            borderRadius: 14,
            padding: 12,
            background: readiness.tone,
            border: "1px solid #e5e7eb",
            display: "grid",
            gap: 6,
          }}
        >
          <div style={{ fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}>
            <span aria-hidden>{readiness.icon}</span>
            Exam readiness: {readiness.text}
          </div>
          <p style={{ ...styles.helperText, margin: 0 }}>{readiness.detail}</p>
        </div>
      </section>

      {/* Attendance (collapsible) */}
      <CollapsibleCard
        title="Attendance summary"
        subtitle="Sessions and hours credited to your class."
        defaultOpen
        right={
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              loadAttendance();
            }}
            disabled={attendanceState.loading}
          >
            {attendanceState.loading ? "Refreshing..." : "Refresh"}
          </button>
        }
      >
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <div style={{ ...styles.uploadCard, background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
              <div style={{ ...styles.helperText, margin: 0 }}>✅ Sessions credited</div>
              <div style={{ fontSize: 22, fontWeight: 900 }}>{attendanceState.sessions}</div>
            </div>
            <div style={{ ...styles.uploadCard, background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
              <div style={{ ...styles.helperText, margin: 0 }}>⏱️ Hours credited</div>
              <div style={{ fontSize: 22, fontWeight: 900 }}>{attendanceState.hours}</div>
            </div>
          </div>

          {attendanceState.error ? <div style={styles.errorBox}>{attendanceState.error}</div> : null}
        </div>
      </CollapsibleCard>

      {/* Assignments (collapsible) */}
      <CollapsibleCard
        title="Submitted assignments (locked)"
        subtitle="Passed identifiers from the published score sheet."
        defaultOpen={false}
        right={<div style={styles.lockPill}>🔒 View only</div>}
      >
        {assignmentState.error ? <div style={styles.errorBox}>{assignmentState.error}</div> : null}
        {assignmentState.loading ? <div style={styles.helperText}>Loading score summary ...</div> : null}

        {!assignmentState.loading && !assignmentState.error && assignmentState.blocked ? (
          <div style={{ ...styles.errorBox, background: "#fff7ed" }}>
            Your next recommendation is blocked until you pass the failed identifiers.
          </div>
        ) : null}

        {!assignmentState.loading && !assignmentState.error && lockedAssignments.length === 0 ? (
          <div style={styles.helperText}>No passed identifiers detected yet.</div>
        ) : null}

        <div style={{ display: "grid", gap: 10 }}>
          {lockedAssignments.map((entry, index) => (
            <div
              key={`${entry.identifier || index}-locked`}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 12,
                background: "#ffffff",
                display: "grid",
                gap: 6,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div style={{ fontWeight: 850, color: "#111827" }}>{entry.label || `Identifier ${entry.identifier}`}</div>
                <span style={styles.lockPill}>🔒 Locked</span>
              </div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>
                Identifier: <b style={{ color: "#111827" }}>{entry.identifier || "—"}</b> · Score:{" "}
                <b style={{ color: "#111827" }}>{typeof entry.score === "number" ? `${entry.score}/100` : "Pending"}</b> · Date:{" "}
                <b style={{ color: "#111827" }}>{formatDate(entry.date) || "—"}</b>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleCard>

      <CollapsibleCard
        title={`Level leaderboard (${assignmentState.leaderboard?.level || detectedLevel || "Level"})`}
        subtitle="Friendly ranking for your level — only scores 60+ count, qualify after 3 passed assignments."
        defaultOpen={false}
      >
        {assignmentState.loading ? <div style={styles.helperText}>Loading leaderboard ...</div> : null}
        {!assignmentState.loading && assignmentState.error ? (
          <div style={styles.errorBox}>{assignmentState.error}</div>
        ) : null}
        {!assignmentState.loading && !assignmentState.error && leaderboardUpdatedLabel ? (
          <div style={{ ...styles.helperText, margin: "0 0 10px" }}>{leaderboardUpdatedLabel}</div>
        ) : null}

        {!assignmentState.loading && !assignmentState.error && assignmentState.completedCount < qualificationMinimum ? (
          <div style={{ ...styles.helperText, fontStyle: "italic" }}>
            You&apos;ll join the leaderboard after {qualificationMinimum} passed assignments. Keep it steady — no rush!
          </div>
        ) : null}

        {!assignmentState.loading && !assignmentState.error && leaderboardRows.length === 0 ? (
          <div style={styles.helperText}>No qualified rankings yet for this level.</div>
        ) : null}

        {!assignmentState.loading && !assignmentState.error && leaderboardRows.length > 0 ? (
          <div style={{ display: "grid", gap: 10 }}>
            {myLeaderboardEntry ? (
              <div
                style={{
                  border: "1px solid #dbeafe",
                  background: "#eff6ff",
                  borderRadius: 14,
                  padding: 12,
                  display: "grid",
                  gap: 4,
                }}
              >
                <div style={{ fontWeight: 900 }}>Your standing</div>
                <div style={{ fontSize: 13, color: "#1f2937" }}>
                  You are #{myLeaderboardEntry.rank} out of {leaderboardRows.length} students with{" "}
                  {myLeaderboardEntry.totalScore} points and {myLeaderboardEntry.completedCount} completed assignments.
                </div>
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
                    <th style={{ padding: "6px 8px", borderBottom: "1px solid #e5e7eb" }}>Completed</th>
                    <th style={{ padding: "6px 8px", borderBottom: "1px solid #e5e7eb" }}>Total score</th>
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
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #f3f4f6" }}>{row.completedCount}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #f3f4f6" }}>{row.totalScore}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </CollapsibleCard>

      {/* Feedback (collapsible) */}
      <CollapsibleCard
        title="Teacher feedback history"
        subtitle="Scores + tutor comments loaded from the published Google Sheet."
        defaultOpen={false}
        right={
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              loadFeedback();
            }}
            disabled={feedbackState.loading}
          >
            {feedbackState.loading ? "Reloading..." : "Reload"}
          </button>
        }
      >
        {feedbackState.error ? <div style={styles.errorBox}>{feedbackState.error}</div> : null}
        {feedbackState.loading ? <div style={styles.helperText}>Loading feedback ...</div> : null}
        {!feedbackState.loading && !feedbackState.error && feedbackItems.length === 0 ? (
          <div style={styles.helperText}>No feedback recorded yet.</div>
        ) : null}

        <div style={{ display: "grid", gap: 10 }}>
          {feedbackItems.map((entry, index) => {
            const hasScore = entry.score !== null;

            return (
              <div
                key={`${entry.assignment || "assignment"}-${index}`}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 12,
                  background: "#ffffff",
                  display: "grid",
                  gap: 8,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 15, color: "#111827" }}>
                      {entry.assignment || "Marked task"}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>📅 {formatDate(entry.date) || "Not set"}</div>
                  </div>

                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      border: "1px solid #e5e7eb",
                      background: hasScore ? "#EEF2FF" : "#F9FAFB",
                      fontSize: 12,
                      fontWeight: 900,
                      color: "#111827",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {hasScore ? `Score: ${entry.score}/100` : "Not scored"}
                  </span>
                </div>

                <div style={{ fontSize: 14, lineHeight: 1.55, color: "#111827" }}>
                  {entry.comments ? entry.comments : hasScore ? "No tutor comments for this task." : "No comments supplied."}
                </div>

                {entry.link ? (
                  <a href={entry.link} target="_blank" rel="noreferrer" style={{ fontWeight: 800 }}>
                    Open marked file →
                  </a>
                ) : null}
              </div>
            );
          })}
        </div>
      </CollapsibleCard>

      {/* Downloadables (collapsible) */}
      <CollapsibleCard
        title="Downloadables"
        subtitle="Calendar + professional PDFs for contract and receipt."
        defaultOpen={false}
        right={null}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <button
              type="button"
              style={styles.buttonSecondary}
              onClick={() => downloadClassCalendar(className)}
              disabled={!className}
              title={!className ? "Add your class name to download calendar" : ""}
            >
              📅 Download class calendar (.ics)
            </button>

            <button type="button" style={styles.buttonSecondary} onClick={downloadContract}>
              📄 Download contract summary (PDF)
            </button>

            <button type="button" style={styles.buttonSecondary} onClick={downloadReceipt}>
              🧾 Download receipt log (PDF)
            </button>
          </div>

          <p style={{ ...styles.helperText, margin: 0 }}>
            Calendar downloads need your class name. Contract and receipt PDFs use the profile details shown above.
          </p>
        </div>
      </CollapsibleCard>
    </div>
  );
};

export default MyExamFilePage;
