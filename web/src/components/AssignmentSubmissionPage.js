import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { ALLOWED_LEVELS } from "../context/ExamContext";
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

  const [form, setForm] = useState({
    title: "",
    level: preferredLevel,
    chapter: "",
    submissionLink: "",
    submissionText: "",
  });
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  useEffect(() => {
    setForm((prev) => ({ ...prev, level: preferredLevel }));
  }, [preferredLevel]);

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
        setRecentSubmissions(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
      } catch (error) {
        console.error("Failed to load submissions", error);
        setStatus((prev) => ({
          ...prev,
          error: "Konnte bisherige Abgaben nicht laden.",
        }));
      } finally {
        setSubmissionsLoading(false);
      }
    };

    loadSubmissions();
  }, [user]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    if (!form.title.trim() || !form.submissionText.trim()) {
      setStatus({ loading: false, error: "Titel und Text dürfen nicht leer sein.", success: "" });
      return;
    }

    try {
      await addDoc(collection(db, "submissions"), {
        title: form.title.trim(),
        level: ALLOWED_LEVELS.includes(form.level) ? form.level : preferredLevel,
        chapter: form.chapter.trim() || null,
        submissionLink: form.submissionLink.trim() || null,
        submissionText: form.submissionText.trim(),
        studentEmail: user?.email || "",
        studentId: user?.uid || "",
        studentCode: studentProfile?.id || "",
        studentName: studentProfile?.name || "",
        className: studentProfile?.className || "",
        status: "submitted",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setStatus({ loading: false, error: "", success: "Danke! Deine Abgabe wurde gespeichert." });
      setForm((prev) => ({ ...prev, title: "", chapter: "", submissionLink: "", submissionText: "" }));

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
      setStatus({ loading: false, error: "Konnte die Abgabe nicht speichern.", success: "" });
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div>
          <h2 style={styles.sectionTitle}>Aufgabe einreichen</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Lade deine Lösung als Text hoch. Optional kannst du einen Link zu Google Docs oder einem geteilten Dokument
            hinzufügen.
          </p>
        </div>

        {status.error ? <div style={styles.errorBox}>{status.error}</div> : null}
        {status.success ? <div style={styles.successBox}>{status.success}</div> : null}

        <form style={{ display: "grid", gap: 12 }} onSubmit={handleSubmit}>
          <div style={styles.row}>
            <label style={styles.field}>
              <span style={styles.label}>Titel der Aufgabe *</span>
              <input
                type="text"
                value={form.title}
                onChange={handleChange("title")}
                placeholder="z.B. Modul 5 – Bibliothek E-Mail"
                style={styles.textArea}
              />
            </label>
            <label style={styles.field}>
              <span style={styles.label}>Niveau</span>
              <select value={form.level} onChange={handleChange("level")} style={styles.select}>
                {ALLOWED_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={styles.row}>
            <label style={styles.field}>
              <span style={styles.label}>Kapitel / Fokus</span>
              <input
                type="text"
                value={form.chapter}
                onChange={handleChange("chapter")}
                placeholder="Kapitel 5 – Termine machen"
                style={styles.textArea}
              />
            </label>
            <label style={styles.field}>
              <span style={styles.label}>Optionaler Link</span>
              <input
                type="url"
                value={form.submissionLink}
                onChange={handleChange("submissionLink")}
                placeholder="https://..."
                style={styles.textArea}
              />
            </label>
          </div>

          <div>
            <label style={{ ...styles.field, margin: 0 }}>
              <span style={styles.label}>Dein Text *</span>
              <textarea
                value={form.submissionText}
                onChange={handleChange("submissionText")}
                style={{ ...styles.textArea, minHeight: 200 }}
                placeholder="Schreibe hier deine Lösung oder füge sie ein."
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button type="submit" style={styles.primaryButton} disabled={status.loading}>
              {status.loading ? "Wird gespeichert ..." : "Abgabe speichern"}
            </button>
            <span style={styles.helperText}>Titel und Text sind Pflichtfelder.</span>
          </div>
        </form>
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <h3 style={{ margin: 0 }}>Letzte Abgaben</h3>
          {submissionsLoading ? <span style={styles.helperText}>Lade ...</span> : null}
        </div>
        {recentSubmissions.length === 0 && !submissionsLoading ? (
          <p style={{ ...styles.helperText, margin: 0 }}>Noch keine Abgaben gespeichert.</p>
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
                <strong>{entry.title}</strong>
                <span style={styles.levelPill}>{entry.level}</span>
              </div>
              <div style={{ ...styles.helperText, margin: 0 }}>
                {entry.chapter ? `Kapitel: ${entry.chapter}` : "Ohne Kapitel"}
              </div>
              <div style={{ ...styles.helperText, margin: 0 }}>
                Gespeichert: {formatDate(entry.createdAt)}
              </div>
              {entry.submissionLink ? (
                <a href={entry.submissionLink} target="_blank" rel="noreferrer">
                  Link öffnen
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissionPage;
