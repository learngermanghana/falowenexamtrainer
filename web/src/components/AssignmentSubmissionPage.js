import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { ALLOWED_LEVELS } from "../context/ExamContext";
import { courseSchedules } from "../data/courseSchedule";
import {
  addDoc,
  collection,
  db,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "../firebase";

const SUBMISSION_COLLECTION = "submissions";
const DRAFT_COLLECTION = "submissionDrafts";
const LOCK_COLLECTION = "submissionLocks";

const formatDate = (timestamp) => {
  if (!timestamp) return "–";

  const date =
    typeof timestamp?.toDate === "function"
      ? timestamp.toDate()
      : new Date(timestamp?.seconds ? timestamp.seconds * 1000 : timestamp);

  if (!date || Number.isNaN(date.getTime())) return "–";

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeIdPart = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, "_")
    .slice(0, 120);

const safeLower = (v) => String(v || "").toLowerCase();

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
      if (!names.includes(label)) names.push(label);
    };

    assignmentDictionary.forEach(({ label }) => addName(label));
    addName(studentProfile?.assignmentTitle);

    if (Array.isArray(studentProfile?.assignments)) studentProfile.assignments.forEach(addName);
    if (Array.isArray(studentProfile?.assignmentTitles)) studentProfile.assignmentTitles.forEach(addName);

    if (studentProfile?.className) addName(`${studentProfile.className} Assignment`);

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

  const [lockedChapters, setLockedChapters] = useState(new Set());
  const [lockInfoByChapterKey, setLockInfoByChapterKey] = useState({}); // { [chapterKey]: { lockedAt, assignmentTitle } }

  const [confirmationLocked, setConfirmationLocked] = useState(false);
  const [draftsByAssignment, setDraftsByAssignment] = useState({});

  const [preview, setPreview] = useState(null); // { assignmentTitle, submissionText, createdAt }
  const [copyStatus, setCopyStatus] = useState("");

  const lastAssignmentRef = useRef(assignmentOptions[0]);

  const buildChapterKey = useCallback(
    (title) => {
      if (!title) return null;

      const entry = assignmentDictionary.find((item) => item.label === title);
      if (typeof entry?.day !== "undefined") return `day-${entry.day}`;

      const dayMatch = /^day\s*(\d+)/i.exec(title);
      if (dayMatch?.[1]) return `day-${dayMatch[1]}`;

      return String(title).toLowerCase().trim();
    },
    [assignmentDictionary]
  );

  const deriveChapterValue = useCallback(
    (title) => {
      const entry = assignmentDictionary.find((item) => item.label === title);
      if (typeof entry?.day !== "undefined") return entry.day;

      const dayMatch = /^day\s*(\d+)/i.exec(title || "");
      return dayMatch?.[1] ? Number(dayMatch[1]) : null;
    },
    [assignmentDictionary]
  );

  const getLockDocId = useCallback(
    (assignmentTitle) => {
      const chapterKey = buildChapterKey(assignmentTitle) || "unknown";
      return `${normalizeIdPart(user?.uid)}__${normalizeIdPart(preferredLevel)}__${normalizeIdPart(chapterKey)}`;
    },
    [buildChapterKey, preferredLevel, user?.uid]
  );

  const getDraftDocId = useCallback(
    (assignmentTitle) => {
      const chapterKey = buildChapterKey(assignmentTitle) || "unknown";
      return `${normalizeIdPart(user?.uid)}__${normalizeIdPart(preferredLevel)}__${normalizeIdPart(chapterKey)}`;
    },
    [buildChapterKey, preferredLevel, user?.uid]
  );

  const buildSubmissionPayload = useCallback(
    (statusLabel) => ({
      title: form.assignmentTitle,
      assignmentTitle: form.assignmentTitle,
      level: ALLOWED_LEVELS.includes(preferredLevel) ? preferredLevel : "GENERAL",
      chapter: deriveChapterValue(form.assignmentTitle),
      chapterKey: buildChapterKey(form.assignmentTitle),
      submissionLink: null,
      submissionText: form.submissionText.trim(),
      studentEmail: user?.email || "",
      studentId: user?.uid || "",
      studentCode,
      studentName: studentProfile?.name || "",
      className: studentProfile?.className || "",
      status: statusLabel,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
    [
      buildChapterKey,
      deriveChapterValue,
      form.assignmentTitle,
      form.submissionText,
      preferredLevel,
      studentCode,
      studentProfile?.className,
      studentProfile?.name,
      user?.email,
      user?.uid,
    ]
  );

  const persistSubmission = async ({ statusLabel = "submitted" } = {}) => {
    const trimmedText = form.submissionText.trim();
    if (!form.assignmentTitle || !trimmedText || !db || !user?.uid) return { ok: false, reason: "missing" };

    const submissionPayload = buildSubmissionPayload(statusLabel);

    // Drafts: deterministic doc ID -> no duplicates
    if (statusLabel === "draft") {
      const draftId = getDraftDocId(form.assignmentTitle);
      const draftRef = doc(db, DRAFT_COLLECTION, draftId);

      const existingDraft = draftsByAssignment[form.assignmentTitle];
      const payloadWithTimestamps = {
        ...submissionPayload,
        createdAt: existingDraft?.createdAt || submissionPayload.createdAt,
      };

      await setDoc(draftRef, payloadWithTimestamps, { merge: true });

      setDraftsByAssignment((prev) => ({
        ...prev,
        [form.assignmentTitle]: { id: draftId, ...payloadWithTimestamps },
      }));

      return { ok: true };
    }

    // Submitted: check lock first
    const lockId = getLockDocId(form.assignmentTitle);
    const lockRef = doc(db, LOCK_COLLECTION, lockId);

    const lockSnap = await getDoc(lockRef);
    if (lockSnap.exists()) {
      const chapterKey = buildChapterKey(form.assignmentTitle);
      if (chapterKey) setLockedChapters((prev) => new Set([...prev, chapterKey]));
      setConfirmationLocked(true);
      return { ok: false, reason: "locked" };
    }

    // Add submission history
    await addDoc(collection(db, SUBMISSION_COLLECTION), submissionPayload);

    // Create lock deterministically
    const nowLocal = new Date();
    await setDoc(
      lockRef,
      {
        studentId: user?.uid || "",
        studentEmail: user?.email || "",
        studentCode,
        level: ALLOWED_LEVELS.includes(preferredLevel) ? preferredLevel : "GENERAL",
        lockedAt: serverTimestamp(),
        assignmentTitle: form.assignmentTitle,
        chapter: deriveChapterValue(form.assignmentTitle),
        chapterKey: buildChapterKey(form.assignmentTitle),
      },
      { merge: true }
    );

    const currentChapterKey = buildChapterKey(form.assignmentTitle);
    if (currentChapterKey) {
      setLockedChapters((prev) => new Set([...prev, currentChapterKey]));
      setLockInfoByChapterKey((prev) => ({
        ...prev,
        [currentChapterKey]: { lockedAt: nowLocal, assignmentTitle: form.assignmentTitle },
      }));
    }

    // Preview (use local time immediately)
    setPreview({
      assignmentTitle: form.assignmentTitle,
      submissionText: trimmedText,
      createdAt: nowLocal,
    });

    return { ok: true };
  };

  useEffect(() => {
    const defaultAssignment = assignmentOptions[0];
    const currentAssignment = form.assignmentTitle;
    const hasCurrentAssignment = currentAssignment && assignmentOptions.includes(currentAssignment);

    if (hasCurrentAssignment || !defaultAssignment) return;

    const defaultDraft = draftsByAssignment[defaultAssignment];
    setForm((prev) => ({
      ...prev,
      assignmentTitle: defaultAssignment,
      submissionText: defaultDraft?.submissionText || prev.submissionText,
    }));
  }, [assignmentOptions, draftsByAssignment, form.assignmentTitle]);

  useEffect(() => {
    const loadDraftsAndSubmissions = async () => {
      if (!db || !user?.uid) return;

      setSubmissionsLoading(true);
      try {
        // Recent submissions
        const submissionsRef = collection(db, SUBMISSION_COLLECTION);
        const submissionSnapshot = await getDocs(
          query(submissionsRef, where("studentId", "==", user.uid), orderBy("createdAt", "desc"), limit(25))
        );

        const entries = submissionSnapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
        setRecentSubmissions(entries);

        // Locks
        const lockRef = collection(db, LOCK_COLLECTION);
        const lockSnapshot = await getDocs(query(lockRef, where("studentId", "==", user.uid)));

        if (!lockSnapshot.empty) {
          const locked = new Set();
          const lockMeta = {};

          lockSnapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            const chapterKey =
              data.chapterKey ||
              buildChapterKey(data.assignmentTitle) ||
              (data.chapter ? `day-${data.chapter}` : null);

            if (chapterKey) {
              locked.add(chapterKey);
              lockMeta[chapterKey] = {
                assignmentTitle: data.assignmentTitle || "",
                lockedAt: data.lockedAt || data.createdAt || null,
              };
            }
          });

          setLockedChapters(locked);
          setLockInfoByChapterKey(lockMeta);
        }

        // Drafts
        const draftsRef = collection(db, DRAFT_COLLECTION);
        const draftSnapshot = await getDocs(
          query(draftsRef, where("studentId", "==", user.uid), orderBy("updatedAt", "desc"), limit(30))
        );

        if (!draftSnapshot.empty) {
          const latestDrafts = {};
          draftSnapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            const assignmentKey = data.assignmentTitle || data.title || assignmentOptions[0];
            if (!latestDrafts[assignmentKey]) latestDrafts[assignmentKey] = { id: docSnap.id, ...data };
          });
          setDraftsByAssignment(latestDrafts);
        }
      } catch (error) {
        console.error("Failed to load submissions", error);
        setStatus((prev) => ({ ...prev, error: "Could not load your previous submissions." }));
      } finally {
        setSubmissionsLoading(false);
      }
    };

    loadDraftsAndSubmissions();
  }, [assignmentOptions, buildChapterKey, user?.uid]);

  // When assignment changes, pull draft text (if any) into editor.
  useEffect(() => {
    const currentAssignment = form.assignmentTitle;
    const draft = draftsByAssignment[currentAssignment];
    const assignmentChanged = lastAssignmentRef.current !== currentAssignment;
    lastAssignmentRef.current = currentAssignment;

    if (assignmentChanged) {
      setForm((prev) => ({
        ...prev,
        submissionText: draft?.submissionText || "",
        confirmed: false,
      }));
      setStatus((prev) => ({ ...prev, error: "", success: "" }));
      setCopyStatus("");
    } else if (!form.submissionText && draft?.submissionText) {
      setForm((prev) => ({
        ...prev,
        submissionText: draft.submissionText,
        confirmed: false,
      }));
    }
  }, [draftsByAssignment, form.assignmentTitle, form.submissionText]);

  // Locked state for currently selected assignment.
  const selectedChapterKey = useMemo(
    () => buildChapterKey(form.assignmentTitle),
    [buildChapterKey, form.assignmentTitle]
  );

  const selectedLockInfo = useMemo(
    () => (selectedChapterKey ? lockInfoByChapterKey[selectedChapterKey] : null),
    [lockInfoByChapterKey, selectedChapterKey]
  );

  const isSelectedLocked = Boolean(selectedChapterKey && lockedChapters.has(selectedChapterKey));

  useEffect(() => {
    setConfirmationLocked(isSelectedLocked);
    if (isSelectedLocked) setForm((prev) => ({ ...prev, confirmed: true }));
  }, [isSelectedLocked]);

  // Preview for selected assignment:
  const selectedPreview = useMemo(() => {
    if (preview && safeLower(preview.assignmentTitle) === safeLower(form.assignmentTitle)) return preview;

    const match = recentSubmissions.find(
      (s) => safeLower(s.assignmentTitle || s.title) === safeLower(form.assignmentTitle)
    );

    if (!match?.submissionText) return null;

    return {
      assignmentTitle: match.assignmentTitle || match.title || form.assignmentTitle,
      submissionText: match.submissionText,
      createdAt: match.createdAt || match.updatedAt || null,
    };
  }, [form.assignmentTitle, preview, recentSubmissions]);

  const decoratedAssignmentOptions = useMemo(() => {
    return assignmentOptions.map((opt) => {
      const key = buildChapterKey(opt);
      const locked = key ? lockedChapters.has(key) : false;
      return { label: locked ? `${opt}  ✅ locked` : opt, value: opt, locked };
    });
  }, [assignmentOptions, buildChapterKey, lockedChapters]);

  const handleChange = (field) => (event) => {
    const value = field === "confirmed" ? event.target.checked : event.target.value;

    if (field === "assignmentTitle") {
      const draft = draftsByAssignment[value];
      lastAssignmentRef.current = value;
      setForm((prev) => ({
        ...prev,
        assignmentTitle: value,
        submissionText: draft?.submissionText || "",
        confirmed: false,
      }));
      setStatus((prev) => ({ ...prev, error: "", success: "" }));
      setCopyStatus("");
      return;
    }

    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "confirmed") setStatus((prev) => ({ ...prev, error: "" }));
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
      const saved = await persistSubmission({ statusLabel: "submitted" });

      if (!saved.ok && saved.reason === "locked") {
        setStatus({
          loading: false,
          error: "This assignment is already submitted (locked). If you need changes, use the resubmission request for THIS assignment.",
          success: "",
        });
        return;
      }

      if (!saved.ok) {
        setStatus({ loading: false, error: "Could not submit. Please try again.", success: "" });
        return;
      }

      setStatus({ loading: false, error: "", success: "Thanks! Your submission has been saved." });

      // Clear editor after submission (preview remains available below)
      setForm((prev) => ({ ...prev, submissionText: "", confirmed: true }));

      // Refresh list
      if (user?.uid) {
        const submissionsRef = collection(db, SUBMISSION_COLLECTION);
        const snapshot = await getDocs(
          query(submissionsRef, where("studentId", "==", user.uid), orderBy("createdAt", "desc"), limit(25))
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
      if (!saved.ok) {
        setStatus({ loading: false, error: "Add your text before saving a draft.", success: "" });
        return;
      }
      setStatus({ loading: false, error: "", success: "Draft saved. You can keep editing before submitting." });
    } catch (error) {
      console.error("Failed to save draft", error);
      setStatus({ loading: false, error: "Could not save your draft.", success: "" });
    }
  };

  const handleCopyPreview = async () => {
    setCopyStatus("");
    const text = selectedPreview?.submissionText || "";
    if (!text) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopyStatus("Copied ✅");
      setTimeout(() => setCopyStatus(""), 1500);
    } catch (err) {
      console.error("Copy failed", err);
      setCopyStatus("Copy failed");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  // ✅ Resubmission mailto (per selected assignment)
  const selectedDayNumber = useMemo(() => deriveChapterValue(form.assignmentTitle), [deriveChapterValue, form.assignmentTitle]);
  const assignmentInfo = useMemo(() => {
    const base = form.assignmentTitle || assignmentOptions[0] || "Assignment";
    return selectedDayNumber ? `${base} (Day ${selectedDayNumber})` : base;
  }, [assignmentOptions, form.assignmentTitle, selectedDayNumber]);

  const resubmissionMailto = useMemo(() => {
    const subject = `Resubmission request - ${assignmentInfo} - ${studentCode || "no-code"}`;

    const body = `Hello team,

I would like to resubmit.

IMPORTANT (please keep these details):
- Assignment name + day number: ${assignmentInfo}
- Student code: ${studentCode || "-"}
- Email: ${user?.email || "-" }
- Level: ${preferredLevel}
- Class: ${studentProfile?.className || "-"}

Please paste your corrected letter/text below (do NOT attach screenshots):

--- PASTE YOUR CORRECTED TEXT HERE ---
`;

    return `mailto:learngermanghana@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [assignmentInfo, preferredLevel, studentCode, studentProfile?.className, user?.email]);

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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 10,
            }}
          >
            <div style={{ ...styles.field, margin: 0 }}>
              <span style={styles.label}>Assignment</span>
              <select
                value={form.assignmentTitle || assignmentOptions[0]}
                onChange={handleChange("assignmentTitle")}
                style={styles.select}
              >
                {decoratedAssignmentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {isSelectedLocked ? (
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span
                    style={{
                      ...styles.badge,
                      background: "#ecfdf5",
                      borderColor: "#bbf7d0",
                      color: "#065f46",
                    }}
                  >
                    Locked ✅ submitted on {formatDate(selectedLockInfo?.lockedAt || selectedPreview?.createdAt)}
                  </span>
                  <span style={styles.helperText}>This assignment is locked. Resubmission is available for THIS assignment only.</span>
                </div>
              ) : (
                <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
                  Choose the assignment using the Day/Topic list from the course schedule – no typing needed.
                </p>
              )}
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
              <p style={{ ...styles.helperText, margin: "6px 0 0" }}>Class: {studentProfile?.className || "–"}</p>
            </div>
          </div>

          <div>
            <label style={{ ...styles.field, margin: 0 }}>
              <span style={styles.label}>Your text *</span>
              <textarea
                value={form.submissionText}
                onChange={handleChange("submissionText")}
                style={{ ...styles.textArea, minHeight: 200 }}
                placeholder={
                  isSelectedLocked
                    ? "This assignment is locked. Your previous submission is shown below."
                    : "Type your answer here or paste it in."
                }
                disabled={isSelectedLocked}
              />
            </label>
          </div>

          <label style={{ ...styles.field, flexDirection: "row", alignItems: "center", gap: 8, margin: 0 }}>
            <input
              type="checkbox"
              checked={form.confirmed || confirmationLocked}
              onChange={handleChange("confirmed")}
              disabled={confirmationLocked || status.loading || isSelectedLocked}
            />
            <span style={{ ...styles.label, margin: 0 }}>I confirm this is the correct assignment.</span>
          </label>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={handleSaveDraft}
              disabled={status.loading || isSelectedLocked}
            >
              {status.loading ? "Saving ..." : "Save draft"}
            </button>

            <button
              type="submit"
              style={styles.primaryButton}
              disabled={status.loading || confirmationLocked || isSelectedLocked}
            >
              {status.loading ? "Submitting ..." : confirmationLocked || isSelectedLocked ? "Submission locked" : "Submit assignment"}
            </button>

            <span style={styles.helperText}>Drafts can be saved anytime. Submission is locked after the first confirmed send.</span>
          </div>
        </form>

        {/* ✅ UX: Read-only preview + copy */}
        {selectedPreview ? (
          <div style={{ marginTop: 6, borderTop: "1px solid #e5e7eb", paddingTop: 12, display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 800 }}>Submitted preview</div>
                <div style={styles.helperText}>
                  {selectedPreview.assignmentTitle} · Saved {formatDate(selectedPreview.createdAt)}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  type="button"
                  style={{ ...styles.secondaryButton, padding: "10px 12px" }}
                  onClick={handleCopyPreview}
                >
                  Copy submission text
                </button>
                {copyStatus ? (
                  <span style={{ ...styles.badge, background: "#ecfeff", borderColor: "#a5f3fc", color: "#0ea5e9" }}>
                    {copyStatus}
                  </span>
                ) : null}
              </div>
            </div>

            <textarea
              readOnly
              value={selectedPreview.submissionText}
              style={{ ...styles.textArea, minHeight: 160, background: "#f9fafb" }}
            />
          </div>
        ) : null}
      </div>

      {/* ✅ Resubmission (PER ASSIGNMENT) */}
      <div style={{ ...styles.card, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <h3 style={{ margin: 0 }}>Resubmission</h3>
          <span style={styles.badge}>{isSelectedLocked ? "Available" : "Not available"}</span>
        </div>

        {isSelectedLocked ? (
          <>
            <p style={{ ...styles.helperText, margin: 0 }}>
              You can request resubmission for <strong>{assignmentInfo}</strong>. Please paste your corrected text in the email.
            </p>

            <a href={resubmissionMailto} style={styles.primaryButton}>
              Request resubmission for this assignment
            </a>

            <p style={{ ...styles.helperText, margin: 0 }}>
              Tip: Do not send screenshots. Paste the corrected letter/text so we can review quickly.
            </p>
          </>
        ) : (
          <p style={{ ...styles.helperText, margin: 0 }}>
            Resubmission is only available after you submit <strong>this selected assignment</strong>.  
            If you haven’t submitted it yet, submit first — then the resubmission button will appear here.
          </p>
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
              <div style={{ ...styles.helperText, margin: 0 }}>Class: {entry.className || "–"}</div>
              <div style={{ ...styles.helperText, margin: 0 }}>Saved: {formatDate(entry.createdAt)}</div>
              {entry.submissionText ? (
                <div style={{ ...styles.helperText, margin: 0 }}>
                  Preview: {String(entry.submissionText).slice(0, 110)}
                  {String(entry.submissionText).length > 110 ? "..." : ""}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissionPage;
