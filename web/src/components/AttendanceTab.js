import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { fetchAttendanceRecords } from "../services/attendanceService";
import { isFirebaseConfigured } from "../firebase";
import { jsPDF } from "jspdf";

const styles = {
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 16,
    display: "grid",
    gap: 12,
  },
  sectionTitle: { margin: 0, fontSize: 18, color: "#111827" },
  helper: { margin: 0, fontSize: 13, color: "#6b7280" },
  badge: {
    borderRadius: 999,
    padding: "4px 10px",
    fontSize: 12,
    fontWeight: 700,
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    color: "#111827",
  },
  list: {
    margin: 0,
    paddingLeft: 18,
    display: "grid",
    gap: 6,
  },
  listHeading: { margin: 0, fontSize: 14, color: "#111827" },
  error: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 13,
  },
  controls: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  button: {
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
    padding: "8px 10px",
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
  },
  alert: {
    borderRadius: 12,
    padding: "10px 12px",
    border: "1px solid #fcd34d",
    background: "#fffbeb",
    color: "#92400e",
    fontSize: 13,
  },
};

const AttendanceTab = () => {
  const { t } = useTranslation();
  const { user, studentProfile } = useAuth();
  const [state, setState] = useState({ loading: true, records: [], error: "" });

  const studentCode = useMemo(
    () => studentProfile?.studentcode || studentProfile?.studentCode || studentProfile?.id || "",
    [studentProfile]
  );
  const className = useMemo(() => studentProfile?.className || "", [studentProfile]);
  const level = useMemo(() => String(studentProfile?.level || "").toUpperCase(), [studentProfile?.level]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!className || !studentCode) {
        setState({
          loading: false,
          records: [],
          error: t("attendanceTab.errors.missingProfile"),
        });
        return;
      }

      const firebaseReady = typeof isFirebaseConfigured === "function" ? isFirebaseConfigured() : isFirebaseConfigured;
      if (!firebaseReady) {
        setState({ loading: false, records: [], error: t("attendanceTab.errors.firebase") });
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        const response = await fetchAttendanceRecords({ className, studentCode, studentUid: user?.uid, level });
        if (!mounted) return;
        setState({ loading: false, records: response?.records || [], error: "" });
      } catch (error) {
        if (!mounted) return;
        setState({ loading: false, records: [], error: t("attendanceTab.errors.load") });
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [className, level, studentCode, t, user?.uid]);

  const levelRecords = useMemo(() => {
    if (!level) return state.records;
    const filtered = state.records.filter((record) => {
      const recordLevel = String(record.level || "").toUpperCase();
      return !recordLevel || recordLevel === level;
    });

    return filtered.length ? filtered : state.records;
  }, [level, state.records]);

  const presentRecords = useMemo(() => levelRecords.filter((record) => record.present === true), [levelRecords]);
  const notPresentRecords = useMemo(
    () => levelRecords.filter((record) => record.present === false || record.present === null),
    [levelRecords]
  );

  const attendanceRate = useMemo(() => {
    if (!levelRecords.length) return null;
    return Math.round((presentRecords.length / levelRecords.length) * 100);
  }, [levelRecords.length, presentRecords.length]);

  const attendanceAlerts = useMemo(() => {
    const alerts = [];
    if (attendanceRate !== null && attendanceRate < 75) {
      alerts.push(t("attendanceTab.alerts.lowAttendance", { percent: attendanceRate }));
    }
    if (notPresentRecords.length >= 3) {
      alerts.push(t("attendanceTab.alerts.multipleMissed", { count: notPresentRecords.length }));
    }
    return alerts;
  }, [attendanceRate, notPresentRecords.length, t]);

  const formatDate = (value) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleDateString();
  };

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(16);
    doc.text(t("attendanceTab.export.pdfTitle"), 40, 42);
    doc.setFontSize(11);
    doc.text(`${t("attendanceTab.export.sessionCount")}: ${levelRecords.length}`, 40, 62);
    doc.text(`${t("attendanceTab.export.attendanceRate")}: ${attendanceRate !== null ? `${attendanceRate}%` : "—"}`, 40, 78);

    let y = 106;
    levelRecords.forEach((record, index) => {
      if (y > 760) {
        doc.addPage();
        y = 50;
      }
      const line = `${index + 1}. ${record.title || t("attendanceTab.fallback.session")} • ${formatDate(record.date)} • ${record.status || t("attendanceTab.fallback.pending")}`;
      doc.text(line, 40, y);
      y += 18;
    });
    doc.save("attendance-summary.pdf");
  };

  return (
    <section style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "grid", gap: 4 }}>
          <h2 style={styles.sectionTitle}>{t("appNav.tabs.attendance")}</h2>
          <p style={styles.helper}>
            {level
              ? t("attendanceTab.helper.withLevel", { level })
              : t("attendanceTab.helper.allLevels")}
          </p>
        </div>
        <span style={styles.badge}>{t("attendanceTab.sessionBadge", { count: levelRecords.length })}</span>
      </div>

      {!state.loading && !state.error ? (
        <div style={styles.controls}>
          <button type="button" style={styles.button} onClick={downloadPdf}>
            {t("attendanceTab.export.pdf")}
          </button>
        </div>
      ) : null}

      {state.loading ? <p style={styles.helper}>{t("attendanceTab.loading")}</p> : null}
      {state.error ? <div style={styles.error}>{state.error}</div> : null}
      {!state.loading && !state.error && attendanceAlerts.length ? (
        <div style={styles.alert}>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
            {attendanceAlerts.map((alert) => (
              <li key={alert}>{alert}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {!state.loading && !state.error ? (
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div>
            <h3 style={styles.listHeading}>{t("attendanceTab.present", { count: presentRecords.length })}</h3>
            {presentRecords.length ? (
              <ul style={styles.list}>
                {presentRecords.map((record) => (
                  <li key={record.id}>{record.title || record.dateLabel || t("attendanceTab.fallback.session")}</li>
                ))}
              </ul>
            ) : (
              <p style={styles.helper}>{t("attendanceTab.empty.present")}</p>
            )}
          </div>

          <div>
            <h3 style={styles.listHeading}>{t("attendanceTab.notPresent", { count: notPresentRecords.length })}</h3>
            {notPresentRecords.length ? (
              <ul style={styles.list}>
                {notPresentRecords.map((record) => (
                  <li key={record.id}>{record.title || record.dateLabel || t("attendanceTab.fallback.session")}</li>
                ))}
              </ul>
            ) : (
              <p style={styles.helper}>{t("attendanceTab.empty.notPresent")}</p>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default AttendanceTab;
