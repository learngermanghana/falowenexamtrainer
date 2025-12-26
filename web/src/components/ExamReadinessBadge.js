import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchAttendanceSummary } from "../services/attendanceService";
import { fetchScoreSummary } from "../services/scoreSummaryService";
import { computeExamReadiness } from "../lib/examReadiness";
import { isFirebaseConfigured } from "../firebase";
import { styles } from "../styles";

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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        padding: "8px 12px",
        borderRadius: 12,
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700 }}>
        <span aria-hidden>{readiness.icon}</span>
        <span>Exam readiness: {readiness.text}</span>
      </span>
      <span style={{ ...styles.helperText, margin: 0 }}>
        {state.error || readiness.detail}{" "}
        <button
          type="button"
          style={{ ...styles.linkButton, padding: 0, marginLeft: 8 }}
          onClick={loadReadiness}
          disabled={state.loading}
        >
          {state.loading ? "Checking..." : "Refresh"}
        </button>
      </span>
      <button type="button" style={styles.secondaryButton} onClick={handleOpenExamFile}>
        Open My Exam File
      </button>
    </div>
  );
};

export default ExamReadinessBadge;
