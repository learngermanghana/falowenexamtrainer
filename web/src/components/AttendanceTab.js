import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { fetchAttendanceRecords } from "../services/attendanceService";
import { isFirebaseConfigured } from "../firebase";

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
          error: "Add your class and student code in Account to see attendance.",
        });
        return;
      }

      const firebaseReady = typeof isFirebaseConfigured === "function" ? isFirebaseConfigured() : isFirebaseConfigured;
      if (!firebaseReady) {
        setState({ loading: false, records: [], error: "Connect Firebase to load attendance." });
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        const response = await fetchAttendanceRecords({ className, studentCode, studentUid: user?.uid, level });
        if (!mounted) return;
        setState({ loading: false, records: response?.records || [], error: "" });
      } catch (error) {
        if (!mounted) return;
        setState({ loading: false, records: [], error: "Could not load attendance right now." });
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [className, level, studentCode, user?.uid]);

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

  return (
    <section style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "grid", gap: 4 }}>
          <h2 style={styles.sectionTitle}>{t("appNav.tabs.attendance")}</h2>
          <p style={styles.helper}>
            {level ? `Showing session records for level ${level}.` : "Showing all available session records."}
          </p>
        </div>
        <span style={styles.badge}>{levelRecords.length} sessions</span>
      </div>

      {state.loading ? <p style={styles.helper}>Loading attendance...</p> : null}
      {state.error ? <div style={styles.error}>{state.error}</div> : null}

      {!state.loading && !state.error ? (
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div>
            <h3 style={styles.listHeading}>Present ({presentRecords.length})</h3>
            {presentRecords.length ? (
              <ul style={styles.list}>
                {presentRecords.map((record) => (
                  <li key={record.id}>{record.title || record.dateLabel || "Session"}</li>
                ))}
              </ul>
            ) : (
              <p style={styles.helper}>No marked present sessions yet.</p>
            )}
          </div>

          <div>
            <h3 style={styles.listHeading}>Not present / pending ({notPresentRecords.length})</h3>
            {notPresentRecords.length ? (
              <ul style={styles.list}>
                {notPresentRecords.map((record) => (
                  <li key={record.id}>{record.title || record.dateLabel || "Session"}</li>
                ))}
              </ul>
            ) : (
              <p style={styles.helper}>Great! No absences or pending marks.</p>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default AttendanceTab;
