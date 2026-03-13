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
  const studentName = useMemo(
    () =>
      studentProfile?.name ||
      studentProfile?.fullName ||
      studentProfile?.displayName ||
      user?.displayName ||
      "Student",
    [studentProfile, user?.displayName]
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
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const rowHeight = 22;
    const generatedAt = new Date().toLocaleString();
    const details = [
      ["Student Name", studentName],
      ["Student Code", studentCode || "—"],
      ["Class", className || "—"],
      ["Level", level || "—"],
      ["Total Sessions", String(levelRecords.length)],
      ["Attendance Rate", attendanceRate !== null ? `${attendanceRate}%` : "—"],
      ["Present", String(presentRecords.length)],
      ["Not Present", String(notPresentRecords.length)],
      ["Generated", generatedAt],
    ];

    doc.setFillColor(17, 24, 39);
    doc.rect(0, 0, pageWidth, 92, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Attendance Record", margin, 38);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Learn Language Education Academy", margin, 58);
    doc.text("Official Student Attendance Transcript", margin, 74);

    doc.setTextColor(17, 24, 39);
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(margin, 108, pageWidth - margin * 2, 200, 8, 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Student Information", margin + 14, 128);

    let infoY = 150;
    details.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      doc.text(label, margin + 14, infoY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(17, 24, 39);
      doc.text(String(value), margin + 150, infoY);
      infoY += 18;
    });

    let y = 340;
    const drawTableHeader = () => {
      doc.setFillColor(243, 244, 246);
      doc.rect(margin, y, pageWidth - margin * 2, rowHeight, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(31, 41, 55);
      doc.text("#", margin + 8, y + 15);
      doc.text("Session", margin + 28, y + 15);
      doc.text("Date", margin + 285, y + 15);
      doc.text("Status", margin + 390, y + 15);
      y += rowHeight;
    };

    drawTableHeader();

    const safeRecords = levelRecords.length
      ? levelRecords
      : [{ id: "none", title: "No sessions found", date: "", status: "Pending" }];

    safeRecords.forEach((record, index) => {
      if (y > pageHeight - 120) {
        doc.addPage();
        y = 60;
        drawTableHeader();
      }

      doc.setDrawColor(229, 231, 235);
      doc.line(margin, y, pageWidth - margin, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39);

      const sessionTitle = String(record.title || t("attendanceTab.fallback.session")).slice(0, 44);
      doc.text(String(index + 1), margin + 8, y + 15);
      doc.text(sessionTitle, margin + 28, y + 15);
      doc.text(formatDate(record.date) || "—", margin + 285, y + 15);
      doc.text(String(record.status || t("attendanceTab.fallback.pending")), margin + 390, y + 15);
      y += rowHeight;
    });

    const signatureY = pageHeight - 74;
    doc.setDrawColor(156, 163, 175);
    doc.line(pageWidth - 220, signatureY, pageWidth - margin, signatureY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81);
    doc.text("Signed by Learn Language Education Academy", pageWidth - 220, signatureY + 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text("This attendance statement is generated from academy records.", margin, pageHeight - 32);

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
