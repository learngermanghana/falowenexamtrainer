import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getActiveAttendanceSession, submitFalowenAttendanceCheckin } from "../services/attendanceCheckinService";

const getStudentCode = (profile = {}, user = {}) => profile.studentCode || profile.studentcode || profile.id || user?.uid || "";
const getSessionTitle = (session = {}) => session.sessionLabel || session.topic || session.title || session.chapter || "today's class";

export default function AttendanceCheckinCard() {
  const { user, studentProfile, idToken } = useAuth();
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const className = studentProfile?.className || "";
  const studentCode = getStudentCode(studentProfile, user);
  const studentDocumentId = studentProfile?.id || "";

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      if (!className || !studentCode) {
        setSession(null);
        return;
      }
      try {
        const activeSession = await getActiveAttendanceSession({
          className,
          studentCode,
          studentUid: user?.uid,
          studentDocumentId,
        });
        if (!cancelled) setSession(activeSession);
      } catch (err) {
        if (!cancelled) setSession(null);
      }
    };
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [className, studentCode, studentDocumentId, user?.uid]);

  if (!session || status === "done") return null;

  const handleCheckin = async () => {
    setStatus("submitting");
    setError("");
    try {
      await submitFalowenAttendanceCheckin({ idToken, className, sessionId: session.id });
      setStatus("done");
      setSession(null);
    } catch (err) {
      setStatus("idle");
      setError(err?.message || "Could not check in now.");
    }
  };

  return (
    <aside style={styles.card} aria-live="polite">
      <p style={styles.kicker}>Attendance open</p>
      <h3 style={styles.title}>Check in now</h3>
      <p style={styles.copy}>Use your Falowen profile to mark yourself present for {getSessionTitle(session)}.</p>
      {error ? <p style={styles.error}>{error}</p> : null}
      <button style={styles.button} onClick={handleCheckin} disabled={status === "submitting"}>
        {status === "submitting" ? "Checking in…" : "Check in now"}
      </button>
    </aside>
  );
}

const styles = {
  card: { position: "fixed", right: 18, bottom: 18, zIndex: 50, width: "min(340px, calc(100vw - 36px))", borderRadius: 18, padding: 18, boxShadow: "0 18px 45px rgba(15,23,42,.22)", background: "#0f172a", color: "#fff" },
  kicker: { margin: 0, color: "#93c5fd", fontWeight: 800, fontSize: 12, textTransform: "uppercase" },
  title: { margin: "4px 0 6px", fontSize: 22 },
  copy: { margin: "0 0 12px", color: "#dbeafe", lineHeight: 1.45 },
  error: { margin: "0 0 10px", color: "#fecaca", fontWeight: 700 },
  button: { width: "100%", border: 0, borderRadius: 12, padding: "12px 14px", fontWeight: 900, cursor: "pointer", background: "#facc15", color: "#111827" },
};
