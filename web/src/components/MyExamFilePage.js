import React, { useCallback, useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { useExam } from "../context/ExamContext";
import { fetchAttendanceSummary } from "../services/attendanceService";
import { fetchScoreSummary } from "../services/scoreSummaryService";
import { fetchStudentResultsHistory } from "../services/resultsApi";
import { downloadClassCalendar } from "../services/classCalendar";
import { isFirebaseConfigured } from "../firebase";

const formatDate = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString();
};

const downloadTextFile = (filename, content) => {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const computeReadiness = ({ attendanceSessions, completedAssignments }) => {
  const completedCount = completedAssignments.length;
  const scored = completedAssignments.filter((entry) => typeof entry.score === "number");
  const averageScore =
    scored.length > 0 ? Math.round(scored.reduce((sum, entry) => sum + entry.score, 0) / scored.length) : null;

  const passCount = scored.filter((entry) => entry.score >= 70).length;
  const passRate = scored.length ? Math.round((passCount / scored.length) * 100) : null;

  if (completedCount >= 5 && averageScore !== null && averageScore >= 75 && attendanceSessions >= 5) {
    return {
      icon: "✅",
      tone: "#dcfce7",
      text: "Ready for exam window",
      detail: `Consistent scores (${averageScore}/100 avg, ${passRate ?? 0}% pass) with solid attendance.`,
    };
  }

  if (completedCount >= 2 && averageScore !== null && averageScore >= 50) {
    return {
      icon: "⚠️",
      tone: "#fef3c7",
      text: "Build a stronger buffer",
      detail: "Keep aiming for 75+/100 on recent work and finish at least 5 marked identifiers for a green check.",
    };
  }

  return {
    icon: "❌",
    tone: "#fee2e2",
    text: "Not ready yet",
    detail: "Submit more assignments with scores to unlock readiness tracking.",
  };
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

  // ✅ sheet-backed summary (scores + schedule logic)
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

  // ✅ sheet-backed feedback history (scores + tutor comments)
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

      // newest first
      const items = (rows || [])
        .slice()
        .sort((a, b) => new Date(b.date || b.created_at || 0) - new Date(a.date || a.created_at || 0))
        .filter((row) => row.comments || typeof row.score === "number")
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
      computeReadiness({
        attendanceSessions: attendanceState.sessions,
        completedAssignments: assignmentState.completed,
      }),
    [assignmentState.completed, attendanceState.sessions]
  );

  const downloadContract = () => {
    const summary = [
      `Student: ${studentProfile?.name || user?.email || "Unknown"}`,
      `Level: ${detectedLevel || "Not set"}`,
      `Class: ${className || "Not set"}`,
      `Payment status: ${studentProfile?.paymentStatus || "pending"}`,
      `Contract term: ${studentProfile?.contractTermMonths || "n/a"} months`,
      `Start: ${studentProfile?.contractStart || "n/a"}`,
      `End: ${studentProfile?.contractEnd || "n/a"}`,
    ].join("\n");
    downloadTextFile("contract-summary.txt", summary);
  };

  const downloadReceipt = () => {
    const now = new Date().toISOString();
    const receipt = [
      "Falowen Learning Hub – Receipt",
      `Generated: ${now}`,
      `Student code: ${studentCode || "n/a"}`,
      `Email: ${user?.email || "n/a"}`,
      `Payment status: ${studentProfile?.paymentStatus || "pending"}`,
      "This placeholder receipt records your current status. Contact support for official invoices.",
    ].join("\n");
    downloadTextFile("receipt-log.txt", receipt);
  };

  const lockedAssignments = assignmentState.completed
    .slice()
    .sort((a, b) => String(a.identifier || "").localeCompare(String(b.identifier || "")))
    .slice(0, 8);

  const feedbackItems = feedbackState.items.slice(0, 6);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ ...styles.card, display: "grid", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div>
            <p style={{ ...styles.helperText, margin: 0 }}>Exam dossier</p>
            <h2 style={{ ...styles.sectionTitle, margin: "4px 0" }}>My Exam File</h2>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Level + class confirmation, attendance, score sheet progress, tutor feedback, and quick downloads in one place.
            </p>
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <span style={styles.badge}>Student code: {studentCode || "not set"}</span>
            {className ? <span style={styles.badge}>Class: {className}</span> : null}
          </div>
        </div>

        <div
          style={{
            borderRadius: 12,
            padding: 12,
            background: readiness.tone,
            border: "1px solid #e5e7eb",
            display: "grid",
            gap: 4,
          }}
        >
          <div style={{ fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
            <span aria-hidden>{readiness.icon}</span>
            Exam readiness: {readiness.text}
          </div>
          <p style={{ ...styles.helperText, margin: 0 }}>{readiness.detail}</p>
        </div>
      </section>

      <section style={{ ...styles.card, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ ...styles.sectionTitle, margin: "0 0 4px 0" }}>Attendance summary</h3>
            <p style={{ ...styles.helperText, margin: 0 }}>Sessions and hours credited to your class.</p>
          </div>
          <button type="button" style={styles.secondaryButton} onClick={loadAttendance} disabled={attendanceState.loading}>
            Refresh
          </button>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "grid", gap: 6, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <div style={{ ...styles.uploadCard, background: "#f8fafc" }}>
              <div style={{ ...styles.helperText, margin: 0 }}>Sessions credited</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{attendanceState.sessions}</div>
            </div>
            <div style={{ ...styles.uploadCard, background: "#f8fafc" }}>
              <div style={{ ...styles.helperText, margin: 0 }}>Hours credited</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{attendanceState.hours}</div>
            </div>
          </div>
          {attendanceState.error ? <div style={styles.errorBox}>{attendanceState.error}</div> : null}
          {attendanceState.loading ? <div style={styles.helperText}>Loading attendance ...</div> : null}
        </div>
      </section>

      <section style={{ ...styles.card, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ ...styles.sectionTitle, margin: "0 0 4px 0" }}>Submitted assignments (locked)</h3>
            <p style={{ ...styles.helperText, margin: 0 }}>
              This list comes from the published score sheet (best passed identifiers).
            </p>
          </div>
          <div style={styles.lockPill}>🔒 View only</div>
        </div>

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

        <div style={{ display: "grid", gap: 8 }}>
          {lockedAssignments.map((entry, index) => (
            <div
              key={`${entry.identifier || index}-locked`}
              style={{ ...styles.uploadCard, display: "grid", gap: 4, background: "#f9fafb" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div style={{ fontWeight: 700 }}>{entry.label || `Identifier ${entry.identifier}`}</div>
                <span style={styles.lockPill}>🔒 Locked</span>
              </div>
              <p style={{ ...styles.helperText, margin: 0 }}>
                Identifier: <b>{entry.identifier || "—"}</b> · Score:{" "}
                {typeof entry.score === "number" ? `${entry.score}/100` : "Pending"} · Date: {formatDate(entry.date) || "—"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...styles.card, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ ...styles.sectionTitle, margin: "0 0 4px 0" }}>Teacher feedback history</h3>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Scores + tutor comments are loaded from the published Google Sheet.
            </p>
          </div>
          <button type="button" style={styles.secondaryButton} onClick={loadFeedback} disabled={feedbackState.loading}>
            Reload feedback
          </button>
        </div>

        {feedbackState.error ? <div style={styles.errorBox}>{feedbackState.error}</div> : null}
        {feedbackState.loading ? <div style={styles.helperText}>Loading feedback ...</div> : null}
        {!feedbackState.loading && !feedbackState.error && feedbackItems.length === 0 ? (
          <div style={styles.helperText}>No feedback recorded yet.</div>
        ) : null}

        <div style={{ display: "grid", gap: 8 }}>
          {feedbackItems.map((entry, index) => (
            <div
              key={`${entry.assignment || "assignment"}-${index}`}
              style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 10, background: "#f8fafc" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{entry.assignment}</div>
                  <p style={{ ...styles.helperText, margin: 0 }}>Date: {formatDate(entry.date) || "Not set"}</p>
                </div>

                {typeof entry.score === "number" ? (
                  <span style={{ ...styles.badge, background: "#eef2ff", borderColor: "#c7d2fe" }}>
                    Score: {entry.score}/100
                  </span>
                ) : (
                  <span style={styles.badge}>Not scored</span>
                )}
              </div>

              <p style={{ ...styles.resultText, margin: "6px 0 0" }}>{entry.comments || "No comments supplied."}</p>

              {entry.link ? (
                <div style={{ marginTop: 8 }}>
                  <a href={entry.link} target="_blank" rel="noreferrer">
                    Open marked file
                  </a>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...styles.card, display: "grid", gap: 10 }}>
        <h3 style={{ ...styles.sectionTitle, margin: "0 0 4px 0" }}>Downloadables</h3>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Calendar, contract snapshot, and receipt log in case you need to share proof quickly.
        </p>

        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <button
            type="button"
            style={styles.buttonSecondary}
            onClick={() => downloadClassCalendar(className)}
            disabled={!className}
          >
            Download class calendar (.ics)
          </button>
          <button type="button" style={styles.buttonSecondary} onClick={downloadContract}>
            Download contract summary
          </button>
          <button type="button" style={styles.buttonSecondary} onClick={downloadReceipt}>
            Download receipt log
          </button>
        </div>

        <p style={{ ...styles.helperText, margin: 0 }}>
          Calendar downloads need your class name. Receipt and contract summaries use the profile details shown above.
        </p>
      </section>
    </div>
  );
};

export default MyExamFilePage;
