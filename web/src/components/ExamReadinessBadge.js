import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { fetchAttendanceSummary } from "../services/attendanceService";
import { fetchScoreSummary } from "../services/scoreSummaryService";
import { isFirebaseConfigured } from "../firebase";
import { computeExamReadiness } from "../lib/examReadiness";

const ExamReadinessBadge = ({ studentProfile, onOpenExamFile, variant = "card", refreshToken = 0 }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { idToken } = useAuth();

  const [state, setState] = useState({
    loading: false,
    error: "",
    attendanceSessions: 0,
    completedAssignments: [],
    totalAssignments: null,
  });

  const className = studentProfile?.className || "";
  const studentCode = studentProfile?.studentcode || studentProfile?.studentCode || studentProfile?.id || "";
  const levelKey = String(studentProfile?.level || studentProfile?.course || "").trim().toUpperCase();

  const handleOpenExamFile = () => {
    if (typeof onOpenExamFile === "function") return onOpenExamFile();
    navigate("/campus/examFile");
  };

  const loadReadiness = useCallback(async () => {
    if (!className || !studentCode) {
      setState({
        loading: false,
        error: t("examReadiness.errorMissingProfile"),
        attendanceSessions: 0,
        completedAssignments: [],
        totalAssignments: null,
      });
      return;
    }

    // NOTE: if isFirebaseConfigured is a function in your project, change to:
    // if (!isFirebaseConfigured()) { ... }
    if (!isFirebaseConfigured) {
      setState({
        loading: false,
        error: t("examReadiness.errorFirebase"),
        attendanceSessions: 0,
        completedAssignments: [],
        totalAssignments: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const [attendance, score] = await Promise.all([
        fetchAttendanceSummary({ className, studentCode, level: levelKey }),
        idToken ? fetchScoreSummary({ idToken, studentCode }) : Promise.resolve(null),
      ]);

      const completedAssignments = score?.student?.completedAssignments || [];
      const totalAssignments = score?.student?.totalAssignments ?? null;

      setState({
        loading: false,
        error: "",
        attendanceSessions: attendance?.sessions || 0,
        completedAssignments,
        totalAssignments,
      });
    } catch (_e) {
      setState({
        loading: false,
        error: t("examReadiness.errorLoad"),
        attendanceSessions: 0,
        completedAssignments: [],
        totalAssignments: null,
      });
    }
  }, [className, idToken, levelKey, studentCode, t]);

  useEffect(() => {
    loadReadiness();
  }, [loadReadiness, refreshToken]);

  const readiness = useMemo(
    () =>
      computeExamReadiness({
        attendanceSessions: state.attendanceSessions,
        completedAssignments: state.completedAssignments,
        totalAssignments: state.totalAssignments,
      }),
    [state.attendanceSessions, state.completedAssignments, state.totalAssignments]
  );

  const assignmentsLabel = state.totalAssignments
    ? `${state.completedAssignments.length}/${state.totalAssignments}`
    : `${state.completedAssignments.length}`;

  const title = `${t("examReadiness.title")}: ${readiness.text}\n${t("examReadiness.attendanceTitle")}: ${state.attendanceSessions} ${t(
    "examReadiness.sessions"
  )}\n${t("examReadiness.markedIdentifiers")}: ${assignmentsLabel}`;

  // ✅ Compact button (for hero row)
  if (variant === "button") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          title={title}
          onClick={handleOpenExamFile}
          disabled={state.loading}
          style={{
            ...styles.primaryButton,
            background: "#f8fafc",
            color: "#111827",
            borderColor: "#e5e7eb",
            whiteSpace: "nowrap",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span aria-hidden>{state.loading ? "⏳" : readiness.icon}</span>
            <span style={{ fontWeight: 800 }}>
              {state.loading ? t("examReadiness.refresh") : t("examReadiness.openExamFile")}
            </span>
          </span>

          {!state.loading ? (
            <>
              <span
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: `1px solid ${readiness.statusPillBorder || "#e5e7eb"}`,
                  background: readiness.statusPillBg || "#f3f4f6",
                  color: readiness.statusPillText || "#111827",
                  fontSize: 12,
                  fontWeight: 800,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                Exams: {readiness.statusLabel || "Status"}
              </span>
            </>
          ) : null}
        </button>
      </div>
    );
  }

  // ✅ Card mode
  return (
    <section style={{ ...styles.card, display: "grid", gap: 10, background: readiness.tone }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 240 }}>
          <p style={{ ...styles.helperText, margin: 0 }}>{t("examReadiness.title")}</p>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
            <h3 style={{ ...styles.sectionTitle, margin: 0 }}>
              {readiness.icon} {readiness.text}
            </h3>

            {/* status pill */}
            <span
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: `1px solid ${readiness.statusPillBorder || "#e5e7eb"}`,
                background: readiness.statusPillBg || "#f3f4f6",
                color: readiness.statusPillText || "#111827",
                fontSize: 12,
                fontWeight: 900,
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {readiness.statusLabel || "Status"}
            </span>
          </div>

          <p style={{ ...styles.helperText, margin: "6px 0 0" }}>{readiness.detail}</p>
        </div>

        <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
          <button type="button" style={styles.secondaryButton} onClick={loadReadiness} disabled={state.loading}>
            {t("examReadiness.refresh")}
          </button>

          <button type="button" style={styles.primaryButton} onClick={handleOpenExamFile}>
            {t("examReadiness.openExamFile")}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <span style={styles.badge}>Attendance: {state.attendanceSessions} sessions</span>
        <span style={styles.badge}>Marked identifiers: {assignmentsLabel}</span>

        {state.error ? (
          <span style={{ ...styles.badge, background: "#fef2f2", borderColor: "#fecdd3" }}>{state.error}</span>
        ) : null}
      </div>
    </section>
  );
};

export default ExamReadinessBadge;
