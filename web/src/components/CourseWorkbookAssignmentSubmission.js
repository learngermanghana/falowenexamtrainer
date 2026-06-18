import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  addDoc,
  collection,
  db,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "../firebase";
import { resolveAssignmentCanonicalKey } from "../utils/assignmentIdentity";
import { normalizeCourseAssignmentKey } from "../utils/courseLessonAssignments";

const SUBMISSION_COLLECTION = "submissions";
const DRAFT_COLLECTION = "submissionDrafts";
const LOCK_COLLECTION = "submissionLocks";
const MIN_ANSWER_CHARACTERS = 3;
const GERMAN_CHARACTERS = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"];

const normalizeText = (value) => String(value || "").trim().toLowerCase().replace(/\s+/g, " ");

const toDate = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (value?.seconds) return new Date(value.seconds * 1000);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (value) => {
  const date = toDate(value);
  if (!date) return "";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const resolveWorkbookRecordAssignmentKey = ({ record = {}, fallbackLevel = "" } = {}) => {
  const directKey =
    record.assignmentKey ||
    record.canonicalAssignmentKey ||
    record.assignmentId ||
    record.assignment_id ||
    "";
  if (directKey) return normalizeCourseAssignmentKey(directKey);

  const resolved = resolveAssignmentCanonicalKey({
    level: record.level || fallbackLevel,
    assignmentId: record.assignmentId || record.assignment_id || "",
    assignmentTitle: record.assignmentTitle || record.title || "",
  });
  return normalizeCourseAssignmentKey(resolved);
};

export const doesWorkbookRecordMatchAssignment = ({
  record = {},
  assignmentKey = "",
  assignmentTitle = "",
  level = "",
} = {}) => {
  const normalizedSelectedKey = normalizeCourseAssignmentKey(assignmentKey);
  const normalizedRecordKey = resolveWorkbookRecordAssignmentKey({ record, fallbackLevel: level });

  if (normalizedRecordKey) return normalizedRecordKey === normalizedSelectedKey;

  const recordTitle = normalizeText(record.assignmentTitle || record.title);
  const selectedTitle = normalizeText(assignmentTitle);
  return Boolean(recordTitle && selectedTitle && recordTitle === selectedTitle);
};

const resolveStudentName = (studentProfile, user) => {
  const candidates = [
    studentProfile?.name,
    studentProfile?.fullName,
    studentProfile?.displayName,
    [studentProfile?.firstName, studentProfile?.lastName].filter(Boolean).join(" "),
    user?.displayName,
    String(user?.email || "").split("@")[0],
  ];
  return candidates.map((value) => String(value || "").trim()).find(Boolean) || "";
};

const CourseWorkbookAssignmentSubmission = ({
  assignment,
  assignmentKey,
  canonicalLockId,
  legacyLockId,
  legacyChapterKey,
  level,
  day,
  studentScopeKey,
}) => {
  const { user, studentProfile } = useAuth();
  const [answer, setAnswer] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locked, setLocked] = useState(false);
  const [lockInfo, setLockInfo] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [draftSavedAt, setDraftSavedAt] = useState(null);

  const normalizedAssignmentKey = normalizeCourseAssignmentKey(assignmentKey);
  const assignmentTitle = assignment?.label || assignment?.title || `${level} Day ${day} assignment`;
  const studentCode =
    studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || "";
  const studentName = resolveStudentName(studentProfile, user);
  const draftId = canonicalLockId;

  const basePayload = useMemo(
    () => ({
      title: assignmentTitle,
      assignmentTitle,
      level,
      day,
      chapter: assignment?.chapter || "",
      chapterKey: legacyChapterKey || "",
      assignmentId: assignmentKey,
      assignment_id: assignmentKey,
      assignmentKey,
      canonicalAssignmentKey: assignmentKey,
      studentEmail: user?.email || "",
      studentId: user?.uid || "",
      studentCode,
      studentScopeKey,
      studentName,
      className: studentProfile?.className || "",
      submissionSource: "course_book",
      source: "course_book",
      courseLevel: level,
      lessonDay: day,
      lessonPath: typeof window !== "undefined" ? window.location.pathname : "",
    }),
    [
      assignment?.chapter,
      assignmentKey,
      assignmentTitle,
      day,
      legacyChapterKey,
      level,
      studentCode,
      studentName,
      studentProfile?.className,
      studentScopeKey,
      user?.email,
      user?.uid,
    ]
  );

  const applyLockedRecord = useCallback((record = {}) => {
    setLocked(true);
    setLockInfo({
      assignmentTitle: record.assignmentTitle || assignmentTitle,
      lockedAt: record.lockedAt || record.createdAt || null,
    });
  }, [assignmentTitle]);

  const loadSubmissionState = useCallback(async () => {
    if (!db || !user?.uid || !canonicalLockId || !normalizedAssignmentKey) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const canonicalRef = doc(db, LOCK_COLLECTION, canonicalLockId);
      const canonicalSnapshot = await getDoc(canonicalRef);
      if (canonicalSnapshot.exists()) {
        applyLockedRecord(canonicalSnapshot.data() || {});
      } else if (legacyLockId) {
        const legacyRef = doc(db, LOCK_COLLECTION, legacyLockId);
        const legacySnapshot = await getDoc(legacyRef);
        const legacyData = legacySnapshot.exists() ? legacySnapshot.data() || {} : null;

        if (
          legacyData &&
          doesWorkbookRecordMatchAssignment({
            record: legacyData,
            assignmentKey,
            assignmentTitle,
            level,
          })
        ) {
          const migratedRecord = {
            ...legacyData,
            ...basePayload,
            lockIdentity: "canonical_assignment",
            canonicalLockId,
            legacyLockId,
            migratedAt: serverTimestamp(),
          };
          await setDoc(canonicalRef, migratedRecord, { merge: true });
          applyLockedRecord(migratedRecord);
        }
      }

      if (draftId) {
        const draftSnapshot = await getDoc(doc(db, DRAFT_COLLECTION, draftId));
        if (draftSnapshot.exists()) {
          const draft = draftSnapshot.data() || {};
          if (
            doesWorkbookRecordMatchAssignment({
              record: draft,
              assignmentKey,
              assignmentTitle,
              level,
            })
          ) {
            setAnswer(String(draft.submissionText || draft.answer || draft.workContent || ""));
            setDraftSavedAt(draft.updatedAt || draft.createdAt || null);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load course workbook submission", error);
      setMessage({ type: "error", text: "Could not load this assignment submission. Please refresh and try again." });
    } finally {
      setLoading(false);
    }
  }, [
    applyLockedRecord,
    assignmentKey,
    assignmentTitle,
    basePayload,
    canonicalLockId,
    draftId,
    legacyLockId,
    level,
    normalizedAssignmentKey,
    user?.uid,
  ]);

  useEffect(() => {
    setAnswer("");
    setConfirmed(false);
    setLocked(false);
    setLockInfo(null);
    setMessage({ type: "", text: "" });
    setDraftSavedAt(null);
    loadSubmissionState();
  }, [loadSubmissionState]);

  const insertCharacter = (character) => {
    setAnswer((current) => `${current}${character}`);
  };

  const saveDraft = async () => {
    const trimmedAnswer = answer.trim();
    if (!trimmedAnswer) {
      setMessage({ type: "error", text: "Type your answers before saving a draft." });
      return;
    }
    if (!db || !user?.uid || !draftId) {
      setMessage({ type: "error", text: "Your draft could not be saved right now." });
      return;
    }

    setSavingDraft(true);
    setMessage({ type: "", text: "" });
    try {
      const now = new Date();
      await setDoc(
        doc(db, DRAFT_COLLECTION, draftId),
        {
          ...basePayload,
          submissionText: trimmedAnswer,
          answer: trimmedAnswer,
          workContent: trimmedAnswer,
          status: "draft",
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
      setDraftSavedAt(now);
      setMessage({ type: "success", text: "Draft saved. You can continue later from this workbook." });
    } catch (error) {
      console.error("Failed to save course workbook draft", error);
      setMessage({ type: "error", text: "Could not save your draft. Please try again." });
    } finally {
      setSavingDraft(false);
    }
  };

  const submitAssignment = async () => {
    const trimmedAnswer = answer.trim();
    if (trimmedAnswer.length < MIN_ANSWER_CHARACTERS) {
      setMessage({ type: "error", text: "Type your answers before submitting." });
      return;
    }
    if (!confirmed) {
      setMessage({ type: "error", text: "Confirm that this is your own work before submitting." });
      return;
    }
    if (!db || !user?.uid || !canonicalLockId) {
      setMessage({ type: "error", text: "This assignment cannot be submitted right now." });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });
    try {
      const canonicalRef = doc(db, LOCK_COLLECTION, canonicalLockId);
      const canonicalSnapshot = await getDoc(canonicalRef);
      if (canonicalSnapshot.exists()) {
        applyLockedRecord(canonicalSnapshot.data() || {});
        setMessage({ type: "error", text: "This assignment has already been submitted." });
        return;
      }

      if (legacyLockId) {
        const legacySnapshot = await getDoc(doc(db, LOCK_COLLECTION, legacyLockId));
        const legacyData = legacySnapshot.exists() ? legacySnapshot.data() || {} : null;
        if (
          legacyData &&
          doesWorkbookRecordMatchAssignment({
            record: legacyData,
            assignmentKey,
            assignmentTitle,
            level,
          })
        ) {
          await setDoc(
            canonicalRef,
            {
              ...legacyData,
              ...basePayload,
              lockIdentity: "canonical_assignment",
              canonicalLockId,
              legacyLockId,
              migratedAt: serverTimestamp(),
            },
            { merge: true }
          );
          applyLockedRecord(legacyData);
          setMessage({ type: "error", text: "This assignment has already been submitted." });
          return;
        }
      }

      const submittedAt = new Date();
      const submissionPayload = {
        ...basePayload,
        submissionText: trimmedAnswer,
        answer: trimmedAnswer,
        workContent: trimmedAnswer,
        submissionLink: null,
        status: "submitted",
        attempt: 1,
        attemptNumber: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const submissionReference = await addDoc(collection(db, SUBMISSION_COLLECTION), submissionPayload);
      const lockPayload = {
        ...basePayload,
        submissionId: submissionReference.id,
        lockIdentity: "canonical_assignment",
        canonicalLockId,
        legacyLockId: legacyLockId || "",
        lockedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(canonicalRef, lockPayload, { merge: true });

      if (draftId) {
        await setDoc(
          doc(db, DRAFT_COLLECTION, draftId),
          {
            ...submissionPayload,
            submissionId: submissionReference.id,
            status: "submitted",
          },
          { merge: true }
        );
      }

      setLocked(true);
      setLockInfo({ assignmentTitle, lockedAt: submittedAt });
      setMessage({
        type: "success",
        text: "Assignment submitted successfully. Your tutor can now mark it.",
      });
    } catch (error) {
      console.error("Failed to submit course workbook assignment", error);
      setMessage({ type: "error", text: "Your assignment was not submitted. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p style={{ color: "#475569", margin: 8 }}>Preparing the correct assignment submission…</p>;
  }

  return (
    <section style={{ display: "grid", gap: 14, padding: 8 }}>
      <div
        style={{
          background: locked ? "#ecfdf5" : "#eff6ff",
          border: `1px solid ${locked ? "#86efac" : "#bfdbfe"}`,
          borderRadius: 12,
          padding: 12,
        }}
      >
        <strong style={{ color: "#0f172a", display: "block" }}>{assignmentTitle}</strong>
        <span style={{ color: "#475569", display: "block", fontSize: 12, marginTop: 4 }}>
          Canonical assignment: {assignmentKey}
        </span>
        <span
          style={{
            color: locked ? "#166534" : "#1d4ed8",
            display: "inline-block",
            fontSize: 12,
            fontWeight: 800,
            marginTop: 8,
          }}
        >
          {locked ? "Submitted" : draftSavedAt ? "Draft saved" : "Ready for submission"}
        </span>
        {locked && lockInfo?.lockedAt ? (
          <span style={{ color: "#475569", display: "block", fontSize: 12, marginTop: 4 }}>
            Submitted {formatDate(lockInfo.lockedAt)}
          </span>
        ) : null}
      </div>

      {message.text ? (
        <div
          role="status"
          style={{
            background: message.type === "error" ? "#fef2f2" : "#ecfdf5",
            border: `1px solid ${message.type === "error" ? "#fecaca" : "#86efac"}`,
            borderRadius: 10,
            color: message.type === "error" ? "#991b1b" : "#166534",
            padding: 10,
          }}
        >
          {message.text}
        </div>
      ) : null}

      {locked ? (
        <div style={{ color: "#334155", lineHeight: 1.6 }}>
          Your work is safely recorded under <strong>{assignmentKey}</strong>. Check the Results page after your tutor marks it.
        </div>
      ) : (
        <>
          <label style={{ color: "#0f172a", display: "grid", fontWeight: 800, gap: 8 }}>
            Type your workbook answers
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder={"Example:\nTeil 1\n1. A\n2. C\n\nTeil 2\n1. Guten Morgen …"}
              rows={14}
              maxLength={12000}
              style={{
                border: "1px solid #94a3b8",
                borderRadius: 12,
                boxSizing: "border-box",
                font: "inherit",
                fontWeight: 400,
                lineHeight: 1.55,
                minHeight: 220,
                padding: 12,
                resize: "vertical",
                width: "100%",
              }}
            />
          </label>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {GERMAN_CHARACTERS.map((character) => (
              <button
                key={character}
                type="button"
                onClick={() => insertCharacter(character)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 800,
                  minWidth: 38,
                  padding: "7px 10px",
                }}
              >
                {character}
              </button>
            ))}
          </div>

          <div style={{ color: "#64748b", display: "flex", fontSize: 12, justifyContent: "space-between", gap: 10 }}>
            <span>{answer.length.toLocaleString()} / 12,000 characters</span>
            {draftSavedAt ? <span>Last draft: {formatDate(draftSavedAt)}</span> : null}
          </div>

          <label style={{ alignItems: "flex-start", color: "#334155", display: "flex", gap: 10, lineHeight: 1.5 }}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              style={{ marginTop: 4 }}
            />
            <span>I confirm that these are my own answers and I am ready to submit them for marking.</span>
          </label>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button
              type="button"
              onClick={saveDraft}
              disabled={savingDraft || submitting}
              style={{
                background: "#ffffff",
                border: "1px solid #2563eb",
                borderRadius: 10,
                color: "#1d4ed8",
                cursor: savingDraft || submitting ? "not-allowed" : "pointer",
                fontWeight: 800,
                padding: "10px 16px",
              }}
            >
              {savingDraft ? "Saving…" : "Save draft"}
            </button>
            <button
              type="button"
              onClick={submitAssignment}
              disabled={submitting || savingDraft}
              style={{
                background: "#2563eb",
                border: "1px solid #2563eb",
                borderRadius: 10,
                color: "#ffffff",
                cursor: submitting || savingDraft ? "not-allowed" : "pointer",
                fontWeight: 800,
                padding: "10px 18px",
              }}
            >
              {submitting ? "Submitting…" : "Submit assignment"}
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default CourseWorkbookAssignmentSubmission;
