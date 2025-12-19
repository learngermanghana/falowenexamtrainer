import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { ALLOWED_LEVELS } from "../context/ExamContext";
import { courseSchedules } from "../data/courseSchedule";
import {
  addDoc,
  collection,
  db,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "../firebase";

const formatDate = (timestamp) => {
  if (!timestamp) return "–";

  const date =
    typeof timestamp.toDate === "function"
      ? timestamp.toDate()
      : new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp);

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AssignmentSubmissionPage = () => {
  const { user, studentProfile } = useAuth();
  const preferredLevel = useMemo(
    () => (studentProfile?.level || "A1").toUpperCase(),
    [studentProfile?.level]
  );
  const studentCode = useMemo(
    () => studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || "",
    [studentProfile?.id, studentProfile?.studentCode, studentProfile?.studentcode]
  );
  const assignmentOptions = useMemo(() => {
    const names = [];
    const addName = (value) => {
      if (!value) return;
      const label = value.toString();
      if (!names.includes(label)) {
        names.push(label);
      }
    };

    addName(studentProfile?.assignmentTitle);
    if (Array.isArray(studentProfile?.assignments)) {
      studentProfile.assignments.forEach(addName);
    }
    if (Array.isArray(studentProfile?.assignmentTitles)) {
      studentProfile.assignmentTitles.forEach(addName);
    }
    if (studentProfile?.className) {
      addName(`${studentProfile.className} Assignment`);
    }

    return names.length ? names : ["Allgemeine Abgabe", "Standardaufgabe"];
  }, [studentProfile?.assignmentTitle, studentProfile?.assignmentTitles, studentProfile?.assignments, studentProfile?.className]);

  const [form, setForm] = useState({
    assignmentTitle: assignmentOptions[0],
    submissionText: "",
    confirmed: false,
  });
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [confirmationLocked, setConfirmationLocked] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    setForm((prev) => ({ ...prev, assignmentTitle: assignmentOptions[0] }));
  }, [assignmentOptions]);

  const persistSubmission = async ({ statusLabel = "submitted" } = {}) => {
    const trimmedText = form.submissionText.trim();
    if (!form.assignmentTitle || !trimmedText) {
      return false;
    }

    const submissionPayload = {
      title: form.assignmentTitle,
      assignmentTitle: form.assignmentTitle,
      level: ALLOWED_LEVELS.includes(preferredLevel) ? preferredLevel : "GENERAL",
      chapter: null,
      submissionLink: null,
      submissionText: trimmedText,
      studentEmail: user?.email || "",
      studentId: user?.uid || "",
      studentCode,
      studentName: studentProfile?.name || "",
      className: studentProfile?.className || "",
      status: statusLabel,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await addDoc(collection(db, "submissions"), submissionPayload);
    return true;
  };

  useEffect(() => {
    const loadSubmissions = async () => {
      if (!db || !user) return;
      setSubmissionsLoading(true);
      try {
        const submissionsRef = collection(db, "submissions");
        const constraints = [
          where("studentId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(10),
        ];
        const snapshot = await getDocs(query(submissionsRef, ...constraints));
        const entries = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
        setRecentSubmissions(entries);
        if (entries.length > 0) {
          setConfirmationLocked(true);
          setHasSubmitted(true);
          setForm((prev) => ({ ...prev, confirmed: true }));
        }
      } catch (error) {
        console.error("Failed to load submissions", error);
        setStatus((prev) => ({
          ...prev,
          error: "Could not load your previous submissions.",
        }));
      } finally {
        setSubmissionsLoading(false);
      }
    };

    loadSubmissions();
  }, [user]);

  const handleChange = (field) => (event) => {
    const value = field === "confirmed" ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "confirmed") {
      setStatus((prev) => ({ ...prev, error: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    if (!form.assignmentTitle || !form.submissionText.trim()) {
      setStatus({ loading: false, error: "Bitte wähle eine Aufgabe und trage deinen Text ein.", success: "" });
      return;
    }

    if (!form.confirmed) {
      setStatus({ loading: false, error: "Bitte bestätige, dass du die richtige Aufgabe abgibst.", success: "" });
      return;
    }

    try {
      await persistSubmission({ statusLabel: "submitted" });

      setStatus({ loading: false, error: "", success: "Danke! Deine Abgabe wurde gespeichert." });
      setForm((prev) => ({ ...prev, submissionText: "", confirmed: true }));
      setConfirmationLocked(true);
      setHasSubmitted(true);

      if (user) {
        const submissionsRef = collection(db, "submissions");
        const snapshot = await getDocs(
          query(
            submissionsRef,
            where("studentId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(10)
          )
        );
        setRecentSubmissions(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
      }
    } catch (error) {
      console.error("Failed to save submission", error);
      setStatus({ loading: false, error: "Could not save your submission.", success: "" });
    }
  };

  const handleSaveDraft = async () => {
    setStatus({ loading: true, error: "", success: "" });

    try {
      const saved = await persistSubmission({ statusLabel: "draft" });
      if (!saved) return;

      setStatus({ loading: false, error: "", success: "Draft saved. You can keep editing before submitting." });
    } catch (error) {
      console.error("Failed to save draft", error);
      setStatus({ loading: false, error: "Could not save your draft.", success: "" });
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div>
          <h2 style={styles.sectionTitle}>Submit Assignment</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Lade deine Lösung als Text hoch. Kurs, Level, Studenten-Code und E-Mail werden automatisch übernommen, damit keine
            Tippfehler passieren.
          </p>
        </div>

        {status.error ? <div style={styles.errorBox}>{status.error}</div> : null}
        {status.success ? <div style={styles.successBox}>{status.success}</div> : null}

        <form style={{ display: "grid", gap: 12 }} onSubmit={handleSubmit}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 10,
          }}>
            <div style={{ ...styles.field, margin: 0 }}>
              <span style={styles.label}>Zuordnung</span>
              <select
                value={form.assignmentTitle || assignmentOptions[0]}
                onChange={handleChange("assignmentTitle")}
                style={styles.select}
              >
                {assignmentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
                Aufgabe aus deinem Verzeichnis auswählen – kein Tippen nötig.
              </p>
            </div>
            <div style={{ ...styles.field, margin: 0 }}>
              <span style={styles.label}>Deine Daten</span>
              <div style={{ ...styles.metaRow, padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 10 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{user?.email || "–"}</div>
                  <div style={styles.helperText}>Email • Stufe {preferredLevel}</div>
                </div>
                <span style={styles.badge}>{studentCode || "kein Code"}</span>
              </div>
              <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
                Kurs: {studentProfile?.className || "–"}
              </p>
            </div>
          </div>

          <div>
            <label style={{ ...styles.field, margin: 0 }}>
              <span style={styles.label}>Your text *</span>
              <textarea
                value={form.submissionText}
                onChange={handleChange("submissionText")}
                style={{ ...styles.textArea, minHeight: 200 }}
                placeholder="Type your answer here or paste it in."
              />
            </label>
          </div>

          <label style={{ ...styles.field, flexDirection: "row", alignItems: "center", gap: 8, margin: 0 }}>
            <input
              type="checkbox"
              checked={form.confirmed || confirmationLocked}
              onChange={handleChange("confirmed")}
              disabled={confirmationLocked || status.loading}
            />
            <span style={{ ...styles.label, margin: 0 }}>
              Ich bestätige, dass dies die richtige Aufgabe ist.
            </span>
          </label>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button type="submit" style={styles.primaryButton} disabled={status.loading || confirmationLocked}>
              {status.loading ? "Wird gespeichert ..." : confirmationLocked ? "Abgabe gesperrt" : "Abgabe speichern"}
            </button>
            <span style={styles.helperText}>Nur Textfeld erforderlich. Bestätigung nach erster Abgabe gesperrt.</span>
          </div>
        </form>
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <h3 style={{ margin: 0 }}>Resubmission</h3>
          <span style={styles.badge}>{hasSubmitted ? "Aktiv" : "Nach erster Abgabe"}</span>
        </div>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Falls du einen Fehler bemerkt hast, kontaktiere uns per E-Mail. Die Option wird nach deiner ersten Abgabe freigeschaltet.
        </p>
        {hasSubmitted ? (
          <a
            href={`mailto:learngermanghana@gmail.com?subject=${encodeURIComponent("Resubmission request")}&body=${encodeURIComponent(
              `Hallo Team,

ich möchte erneut einreichen.

Aufgabe: ${form.assignmentTitle || assignmentOptions[0]}
Studenten-Code: ${studentCode || "-"}
Email: ${user?.email || "-"}
Level: ${preferredLevel}`
            )}`}
            style={styles.primaryButton}
          >
            Resubmit per E-Mail anfordern
          </a>
        ) : (
          <span style={{ ...styles.helperText, margin: 0 }}>Resubmit ist verfügbar, nachdem du einmal eingereicht hast.</span>
        )}
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <h3 style={{ margin: 0 }}>Recent submissions</h3>
          {submissionsLoading ? <span style={styles.helperText}>Loading ...</span> : null}
        </div>
        {recentSubmissions.length === 0 && !submissionsLoading ? (
          <p style={{ ...styles.helperText, margin: 0 }}>No submissions saved yet.</p>
        ) : null}
        <div style={{ display: "grid", gap: 8 }}>
          {recentSubmissions.map((entry) => (
            <div
              key={entry.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 10,
                background: "#f9fafb",
                display: "grid",
                gap: 4,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <strong>{entry.assignmentTitle || entry.title || "Abgabe"}</strong>
                <span style={styles.levelPill}>{entry.level || preferredLevel}</span>
              </div>
              <div style={{ ...styles.helperText, margin: 0 }}>
                Kurs: {entry.className || "–"}
              </div>
              <div style={{ ...styles.helperText, margin: 0 }}>
                Saved: {formatDate(entry.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissionPage;
