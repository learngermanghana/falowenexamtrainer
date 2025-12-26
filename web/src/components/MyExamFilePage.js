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
import { jsPDF } from "jspdf"; // npm i jspdf

const formatDate = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString();
};

const getRowTime = (row) => {
  const raw = row?.date || row?.created_at || row?.createdAt || 0;
  const t = new Date(raw).getTime();
  return Number.isNaN(t) ? 0 : t;
};

// More robust than Number(value). Supports "85", "85/100", "Score: 85"
const parseScoreValue = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;

  const cleaned = String(value).trim().replace(",", ".");
  const match = cleaned.match(/(\d+(\.\d+)?)/);
  if (!match) return null;

  const num = Number(match[1]);
  return Number.isFinite(num) ? num : null;
};

// ---------- Simple UI blocks ----------
const StatCard = ({ icon, label, value, sub }) => (
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
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>{right}</div>
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

const MyExamFilePage = () => {
  const { studentProfile, user, idToken } = useAuth();
  const { level, levelConfirmed } = useExam();

  const [attendanceState, setAttendanceState] = useState({ sessions: 0, hours: 0, loading: false, error: "" });

  const [assignmentState, setAssignmentState] = useState({
    loading: false,
    completed: [],
    failedLessons: [],
    missedLessons: [],
    nextRecommendation: null,
    blocked: false,
    lastAssignment: null,
    retriesThisWeek: 0,
    error: "",
  });

  const [feedbackState, setFeedbackState] = useState({ loading: false, items: [], error: "" });

  const studentCode = useMemo(
    () => studentProfile?.studentcode || studentProfile?.studentCode || studentProfile?.id || "",
    [studentProfile?.id, studentProfile?.studentCode, studentProfile?.studentcode]
  );

  const className = useMemo(() => studentProfile?.className || "", [studentProfile?.className]);

  const detectedLevel = useMemo(
    () => (levelConfirmed ? level : (studentProfile?.level || level || "").toString().toUpperCase()),
    [level, levelConfirmed, studentProfile?.level]
  );

  const loadAttendance = useCallback(async () => {
    if (!className || !studentCode) {
      setAttendanceState({
        sessions: 0,
        hours: 0,
        loading: false,
        error: "Add your class and student code to view attendance.",
      });
      return;
    }

    if (!isFirebaseConfigured) {
      setAttendanceState({
        sessions: 0,
        hours: 0,
        loading: false,
        error: "Connect Firebase to load attendance.",
      });
      return;
    }

    setAttendanceState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const summary = await fetchAttendanceSummary({ className, studentCode });
      setAttendanceState({ sessions: summary.sessions || 0, hours: summary.hours || 0, loading: false, error: "" });
    } catch (error) {
      setAttendanceState({
        sessions: 0,
        hours: 0,
        loading: false,
        error: "Could not load attendance right now.",
      });
    }
  }, [className, studentCode]);

  const loadAssignments = useCallback(async () => {
    if (!studentCode) {
      setAssignmentState({
        loading: false,
        completed: [],
        failedLessons: [],
        missedLessons: [],
        nextRecommendation: null,
        blocked: false,
        lastAssignment: null,
        retriesThisWeek: 0,
        error: "Add your student code to see submitted assignments.",
      });
      return;
    }

    if (!idToken) {
      setAssignmentState((prev) => ({
        ...prev,
        loading: false,
        error: "Sign in again to load your score summary.",
      }));
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
        error: "",
      });
    } catch (error) {
      setAssignmentState({
        loading: false,
        completed: [],
        failedLessons: [],
        missedLessons: [],
        nextRecommendation: null,
        blocked: false,
        lastAssignment: null,
        retriesThisWeek: 0,
        error: "Could not load score summary.",
      });
    }
  }, [idToken, studentCode]);

  const loadFeedback = useCallback(async () => {
    if (!studentCode) {
      setFeedbackState({ loading: false, items: [], error: "Add your student code to see feedback history." });
      return;
    }

    if (!idToken) {
      setFeedbackState({ loading: false, items: [], error: "Sign in again to load feedback history." });
      return;
    }

    setFeedbackState({ loading: true, items: [], error: "" });
    try {
      const rows = await fetchStudentResultsHistory({ idToken, studentCode });

      const items = (rows || [])
        .map((row) => ({ ...row, score: parseScoreValue(row.score) }))
        .slice()
        .sort((a, b) => getRowTime(b) - getRowTime(a))
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

  const readiness = useMemo(
    () =>
      computeExamReadiness({
        attendanceSessions: attendanceState.sessions,
        completedAssignments: assignmentState.completed,
      }),
    [assignmentState.completed, attendanceState.sessions]
  );

  const lockedAssignments = useMemo(
    () =>
      assignmentState.completed
        .slice()
        .sort((a, b) => String(a.identifier || "").localeCompare(String(b.identifier || "")))
        .slice(0, 8),
    [assignmentState.completed]
  );

  const feedbackItems = useMemo(() => feedbackState.items.slice(0, 6), [feedbackState.items]);

  const lastFeedbackDate = useMemo(() => {
    const latest = feedbackState.items?.[0];
    return latest?.date || latest?.created_at || latest?.createdAt || "";
  }, [feedbackState.items]);

  const nextRecommendationText = useMemo(() => {
    if (assignmentState.loading) return "Loading…";
    if (assignmentState.error) return "Unavailable";
    if (assignmentState.blocked) return "Blocked (fix failed tasks)";
    if (!assignmentState.nextRecommendation) return "Not set yet";
    return assignmentState.nextRecommendation.label || assignmentState.nextRecommendation.identifier || "Next task";
  }, [assignmentState.blocked, assignmentState.error, assignmentState.loading, assignmentState.nextRecommendation]);

  const refreshAll = async () => {
    await Promise.allSettled([loadAttendance(), loadAssignments(), loadFeedback()]);
  };

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
        ["Start", studentProfile?.contractStart || "n/a"],
        ["End", studentProfile?.contractEnd || "n/a"],
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
        ["Payment status", studentProfile?.paymentStatus || "pending"],
      ],
      footer: "This is a placeholder receipt log. Contact support for official invoices/receipts.",
    });
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* Report header + summary row */}
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
            <button type="button" style={styles.secondaryButton} onClick={refreshAll}>
              Refresh all
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
          <StatCard icon="🎓" label="Level" value={detectedLevel || "Not set"} sub={className ? `Class: ${className}` : "Add your class name"} />
          <StatCard icon={readiness.icon || "📌"} label="Readiness" value={readiness.text} sub={readiness.detail} />
          <StatCard icon="🧾" label="Attendance" value={`${attendanceState.sessions} sessions`} sub={`${attendanceState.hours} hours`} />
          <StatCard
            icon="🗓️"
            label="Last feedback"
            value={lastFeedbackDate ? formatDate(lastFeedbackDate) : feedbackState.loading ? "Loading…" : "No feedback yet"}
            sub="Latest marked task date"
          />
          <StatCard
            icon={assignmentState.blocked ? "⛔" : "➡️"}
            label="Next recommendation"
            value={nextRecommendationText}
            sub={assignmentState.blocked ? "Pass failed identifiers to unlock" : "Based on your score sheet"}
          />
        </div>

        <div
          style={{
            borderRadius: 12,
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

      {/* Collapsible: Attendance */}
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
        {attendanceState.error ? <div style={styles.errorBox}>{attendanceState.error}</div> : null}
      </CollapsibleCard>

      {/* Collapsible: Assignments */}
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
          {lockedAssignments.map((entry, index) => {
            const scoreValue = parseScoreValue(entry.score);
            return (
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
                  <b style={{ color: "#111827" }}>{scoreValue !== null ? `${scoreValue}/100` : "Pending"}</b> · Date:{" "}
                  <b style={{ color: "#111827" }}>{formatDate(entry.date) || "—"}</b>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleCard>

      {/* Collapsible: Feedback */}
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
            const scoreValue = parseScoreValue(entry.score);
            const hasScore = scoreValue !== null;

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
                    {hasScore ? `Score: ${scoreValue}/100` : "Not scored"}
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

      {/* Collapsible: Downloadables */}
      <CollapsibleCard
        title="Downloadables"
        subtitle="Calendar + PDF downloads for contract and receipt."
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
