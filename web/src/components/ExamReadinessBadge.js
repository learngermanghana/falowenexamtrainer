import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchAttendanceSummary } from "../services/attendanceService";
import { fetchScoreSummary } from "../services/scoreSummaryService";
import { computeExamReadiness } from "../lib/examReadiness";
import { styles } from "../styles";
import { isFirebaseConfigured } from "../firebase";

const ExamReadinessBadge = ({ studentProfile, onOpenExamFile }) => {
  const navigate = useNavigate();
  const { idToken } = useAuth();
  const [state, setState] = useState({
    loading: false,
    error: "",
    attendanceSessions: 0,
    completedAssignments: [],
  });

  const className = studentProfile?.className || "";
  const studentCode = studentProfile?.studentcode || studentProfile?.studentCode || studentProfile?.id || "";

  const loadReadiness = useCallback(async () => {
    if (!className || !studentCode) {
      setState({
        loading: false,
        error: "Add your class and student code to unlock readiness tracking.",
        attendanceSessions: 0,
        completedAssignments: [],
      });
      return;
    }

    if (!isFirebaseConfigured) {
      setState({
        loading: false,
        error: "Connect Firebase to load exam readiness.",
        attendanceSessions: 0,
        completedAssignments: [],
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const [attendanceResponse, scoreResponse] = await Promise.all([
        fetchAttendanceSummary({ className, studentCode }),
        idToken ? fetchScoreSummary({ idToken, studentCode }) : Promise.resolve(null),
      ]);

      const completedAssignments = scoreResponse?.student?.completedAssignments || [];
      setState({
        loading: false,
        error: "",
        attendanceSessions: attendanceResponse?.sessions || 0,
        completedAssignments,
      });
    } catch (error) {
      setState({
        loading: false,
        error: "Could not load readiness right now.",
        attendanceSessions: 0,
        completedAssignments: [],
      });
    }
  }, [className, idToken, studentCode]);

  useEffect(() => {
    loadReadiness();
  }, [loadReadiness]);

  const readiness = useMemo(
    () =>
      computeExamReadiness({
        attendanceSessions: state.attendanceSessions,
        completedAssignments: state.completedAssignments,
      }),
    [state.attendanceSessions, state.completedAssignments]
  );

  const handleOpenExamFile = () => {
    if (onOpenExamFile) {
      onOpenExamFile();
      return;
    }
    navigate("/campus/examFile");
  };

  return (
    <section style={{ ...styles.card, display: "grid", gap: 10, background: readiness.tone }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div>
          <p style={{ ...styles.helperText, margin: 0 }}>Exam readiness</p>
          <h3 style={{ ...styles.sectionTitle, margin: "4px 0" }}>
            {readiness.icon} {readiness.text}
          </h3>
          <p style={{ ...styles.helperText, margin: 0 }}>{readiness.detail}</p>
        </div>
        <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
          <button type="button" style={styles.secondaryButton} onClick={loadReadiness} disabled={state.loading}>
            {state.loading ? "Checking..." : "Refresh"}
          </button>
          <button type="button" style={styles.primaryButton} onClick={handleOpenExamFile}>
            Open My Exam File
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <span style={styles.badge}>Attendance: {state.attendanceSessions} sessions</span>
        <span style={styles.badge}>Marked identifiers: {state.completedAssignments.length}</span>
        {state.error ? (
          <span style={{ ...styles.badge, background: "#fef2f2", borderColor: "#fecdd3" }}>{state.error}</span>
        ) : null}
      </div>
    </section>
  );
};

export default ExamReadinessBadge;
