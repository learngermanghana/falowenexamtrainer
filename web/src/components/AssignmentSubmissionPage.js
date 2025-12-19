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
  const assignmentDictionary = useMemo(() => {
    const levelSchedule = courseSchedules[preferredLevel] || [];
    return levelSchedule
      .filter((entry) => typeof entry.day !== "undefined" && entry.topic)
      .map((entry) => ({ day: entry.day, topic: entry.topic, label: `Day ${entry.day}: ${entry.topic}` }));
  }, [preferredLevel]);
  const assignmentOptions = useMemo(() => {
    const names = [];
    const addName = (value) => {
      if (!value) return;
      const label = value.toString();
      if (!names.includes(label)) {
        names.push(label);
      }
    };

    assignmentDictionary.forEach(({ label }) => addName(label));
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

    return names.length ? names : ["General submission", "Standard assignment"];
  }, [
    assignmentDictionary,
    studentProfile?.assignmentTitle,
    studentProfile?.assignmentTitles,
    studentProfile?.assignments,
    studentProfile?.className,
  ]);

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
      setStatus({ loading: false, error: "Please select an assignment and enter your text.", success: "" });
      return;
    }

    if (!form.confirmed) {
      setStatus({ loading: false, error: "Please confirm that you are submitting the correct task.", success: "" });
      return;
    }

    try {
      await persistSubmission({ statusLabel: "submitted" });

      setStatus({ loading: false, error: "", success: "Thanks! Your submission has been saved." });
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
      if (!saved) {
        setStatus({ loading: false, error: "Add your text before saving a draft.", success: "" });
        return;
      }

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
            Upload your solution as text. Your class, level, student code, and email are auto-filled to avoid mistakes.
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
              <span style={styles.label}>Assignment</span>
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
                Choose the assignment using the Day/Topic list from the course schedule – no typing needed.
              </p>
            </div>
            <div style={{ ...styles.field, margin: 0 }}>
              <span style={styles.label}>Your details</span>
              <div style={{ ...styles.metaRow, padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 10 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{user?.email || "–"}</div>
                  <div style={styles.helperText}>Email • Level {preferredLevel}</div>
                </div>
                <span style={styles.badge}>{studentCode || "No code"}</span>
              </div>
              <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
                Class: {studentProfile?.className || "–"}
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
              I confirm this is the correct assignment.
            </span>
          </label>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button type="button" style={styles.secondaryButton} onClick={handleSaveDraft} disabled={status.loading}>
              {status.loading ? "Saving ..." : "Save draft"}
            </button>
            <button type="submit" style={styles.primaryButton} disabled={status.loading || confirmationLocked}>
              {status.loading
                ? "Submitting ..."
                : confirmationLocked
                  ? "Submission locked"
                  : "Submit assignment"}
            </button>
            <span style={styles.helperText}>
              Only the text field is required. Drafts can be saved anytime; submission is locked after the first confirmed send.
            </span>
          </div>
        </form>
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <h3 style={{ margin: 0 }}>Resubmission</h3>
          <span style={styles.badge}>{hasSubmitted ? "Active" : "After first submission"}</span>
        </div>
        <p style={{ ...styles.helperText, margin: 0 }}>
          If you need to correct something, contact us via email. This option unlocks after your first submission.
        </p>
        {hasSubmitted ? (
          <a
            href={`mailto:learngermanghana@gmail.com?subject=${encodeURIComponent("Resubmission request")}&body=${encodeURIComponent(
              `Hello team,

I would like to resubmit.

Assignment: ${form.assignmentTitle || assignmentOptions[0]}
Student code: ${studentCode || "-"}
Email: ${user?.email || "-"}
Level: ${preferredLevel}`
            )}`}
            style={styles.primaryButton}
          >
            Request resubmission via email
          </a>
        ) : (
          <span style={{ ...styles.helperText, margin: 0 }}>Resubmission is available after you submit once.</span>
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
                <strong>{entry.assignmentTitle || entry.title || "Submission"}</strong>
                <span style={styles.levelPill}>{entry.level || preferredLevel}</span>
              </div>
              <div style={{ ...styles.helperText, margin: 0 }}>
                Class: {entry.className || "–"}
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
