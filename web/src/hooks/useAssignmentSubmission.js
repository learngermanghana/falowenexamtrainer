import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { resolveAssignmentCanonicalKey } from "../utils/assignmentIdentity";
import { addDoc, collection, db, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "../firebase";

export const SUBMISSION_COLLECTION = "submissions";
export const DRAFT_COLLECTION = "submissionDrafts";
export const LOCK_COLLECTION = "submissionLocks";
export const PASS_THRESHOLD_SCORE = 60;
export const MAX_RESUBMISSION_TRIES = 2;
export const MIN_SUBMISSION_CHARACTERS = 80;
export const ABSOLUTE_MAX_SUBMISSION_CHARACTERS = 12000;
export const BASE_MAX_BY_LEVEL = { A1: 2500, A2: 3200, B1: 4200, B2: 5500, C1: 7000, C2: 8500 };
export const MAX_ASSIGNMENT_DAY_BY_LEVEL = { A1: 22, A2: 28, B1: 28 };

const normalizeIdPart = (value) => String(value || "").toLowerCase().trim().replace(/[^a-z0-9._-]/g, "_").slice(0, 120);
const normalizeLevel = (value) => String(value || "").trim().toUpperCase();
const normalizeText = (value) => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
const toDate = (value) => (typeof value?.toDate === "function" ? value.toDate() : value?.seconds ? new Date(value.seconds * 1000) : value ? new Date(value) : null);
const toMillis = (value) => {
  const date = toDate(value);
  return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
};
export const formatSubmissionDate = (value) => {
  const date = toDate(value);
  if (!date || Number.isNaN(date.getTime())) return "–";
  return date.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

const resolveStudentName = ({ studentProfile, user }) =>
  String(studentProfile?.name || studentProfile?.fullName || studentProfile?.displayName || [studentProfile?.firstName, studentProfile?.lastName].filter(Boolean).join(" ") || user?.displayName || user?.email?.split("@")[0] || "").trim();

export const buildStudentScopeKey = ({ userId, studentCode, studentEmail }) =>
  [userId, studentCode, studentEmail].map(normalizeIdPart).filter(Boolean).join("__") || "anonymous";

export const getChapterKey = (assignment = {}) => {
  if (assignment.chapterKey) return assignment.chapterKey;
  if (assignment.chapter) return `chapter-${normalizeIdPart(assignment.chapter)}`;
  if (assignment.day && assignment.occurrence && Number(assignment.occurrence) > 1) return `day-${assignment.day}-task-${assignment.occurrence}`;
  if (assignment.day) return `day-${assignment.day}`;
  return normalizeIdPart(assignment.assignmentKey || assignment.assignmentId || assignment.title || "assignment");
};

export const getAssignmentCanonicalKey = (assignment = {}) =>
  resolveAssignmentCanonicalKey({ level: assignment.level, assignmentId: assignment.assignmentId || assignment.assignment_id || assignment.assignmentKey || assignment.chapter, assignmentTitle: assignment.title || assignment.assignmentTitle }) ||
  String(assignment.assignmentKey || assignment.assignmentId || assignment.assignment_id || "").toUpperCase();

const getFeedback = (entry = {}) => entry.feedback || entry.tutorFeedback || entry.reviewFeedback || entry.reviewNotes || "";
const toScore = (value) => {
  const parsed = typeof value === "number" ? value : Number(String(value ?? "").replace("%", "").trim());
  return Number.isFinite(parsed) ? parsed : null;
};
const getScore = (entry = {}) => toScore(entry.score ?? entry.finalScore ?? entry.mark ?? entry.grade ?? entry.previousScore);

export function useAssignmentSubmission({ assignment, lockedContext = true, onSubmitted } = {}) {
  const { user, studentProfile } = useAuth();
  const { showToast } = useToast() || {};
  const [text, setText] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [draft, setDraft] = useState(null);
  const [history, setHistory] = useState([]);
  const [lock, setLock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ error: "", success: "" });

  const level = normalizeLevel(assignment?.level);
  const canonicalAssignmentKey = useMemo(() => getAssignmentCanonicalKey(assignment), [assignment]);
  const chapterKey = useMemo(() => getChapterKey(assignment), [assignment]);
  const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || "";
  const studentScopeKey = buildStudentScopeKey({ userId: user?.uid, studentCode, studentEmail: user?.email });
  const deterministicId = `${studentScopeKey}__${normalizeIdPart(level)}__${normalizeIdPart(chapterKey)}`;
  const maxChars = Math.min(ABSOLUTE_MAX_SUBMISSION_CHARACTERS, BASE_MAX_BY_LEVEL[level] || 4200);
  const latest = useMemo(() => history.slice().sort((a, b) => Math.max(toMillis(b.submittedAt), toMillis(b.createdAt), toMillis(b.updatedAt)) - Math.max(toMillis(a.submittedAt), toMillis(a.createdAt), toMillis(a.updatedAt)))[0] || null, [history]);
  const latestScore = getScore(latest);
  const passed = typeof latestScore === "number" && latestScore >= PASS_THRESHOLD_SCORE;
  const failed = typeof latestScore === "number" && latestScore < PASS_THRESHOLD_SCORE;
  const attempt = Math.max(1, Number(latest?.attempt || latest?.attemptNumber || history.length || 0) + (failed ? 1 : 0));
  const canResubmit = failed && attempt <= MAX_RESUBMISSION_TRIES + 1;
  const isLocked = Boolean(lock) && !canResubmit && !failed;
  const displayStatus = passed ? "Passed" : failed ? (canResubmit ? "Correct and resubmit" : "Needs correction") : latest || lock ? "Awaiting score" : draft ? "Continue draft" : "Submit assignment";

  const refresh = useCallback(async () => {
    if (!db || !user?.uid || !canonicalAssignmentKey) return;
    const lockSnap = await getDoc(doc(db, LOCK_COLLECTION, deterministicId));
    setLock(lockSnap.exists() ? { id: deterministicId, ...lockSnap.data() } : null);
    const draftSnap = await getDoc(doc(db, DRAFT_COLLECTION, deterministicId));
    if (draftSnap.exists()) {
      const draftData = { id: deterministicId, ...draftSnap.data() };
      setDraft(draftData);
      setText((current) => current || draftData.submissionText || draftData.answer || draftData.workContent || "");
    }
    const snap = await getDocs(query(collection(db, SUBMISSION_COLLECTION), where("studentId", "==", user.uid)));
    const rows = snap.docs.map((entry) => ({ id: entry.id, ...entry.data() })).filter((row) => String(row.canonicalAssignmentKey || row.assignmentKey || row.assignmentId || row.assignment_id || "").toUpperCase() === String(canonicalAssignmentKey).toUpperCase());
    setHistory(rows);
  }, [canonicalAssignmentKey, deterministicId, user?.uid]);

  useEffect(() => { refresh().catch(() => {}); }, [refresh]);

  const buildPayload = useCallback((submissionStatus) => {
    const clean = text.trim();
    const assignmentTitle = assignment?.title || assignment?.assignmentTitle || `Day ${assignment?.day || ""} assignment`;
    return {
      assignmentTitle, title: assignmentTitle, level, day: Number(assignment?.day) || null, chapter: assignment?.chapter || "",
      assignmentId: canonicalAssignmentKey, assignment_id: canonicalAssignmentKey, assignmentKey: canonicalAssignmentKey, canonicalAssignmentKey, chapterKey,
      submissionText: clean, answer: clean, workContent: clean,
      studentEmail: user?.email || "", studentId: user?.uid || "", studentCode, studentScopeKey, studentName: resolveStudentName({ studentProfile, user }), className: studentProfile?.className || "",
      submissionFingerprint: `${normalizeIdPart(assignmentTitle)}::${normalizeIdPart(chapterKey)}::${normalizeIdPart(normalizeText(clean)).slice(0, 240)}`,
      status: submissionStatus, reviewStatus: submissionStatus === "draft" ? "draft" : "pending_review", attempt: failed ? attempt : 1, attemptNumber: failed ? attempt : 1,
      submittedAt: submissionStatus === "draft" ? null : serverTimestamp(), createdAt: serverTimestamp(), updatedAt: serverTimestamp(), contextLocked: lockedContext,
    };
  }, [assignment, attempt, canonicalAssignmentKey, chapterKey, failed, level, lockedContext, studentCode, studentProfile, studentScopeKey, text, user]);

  const saveDraft = useCallback(async () => {
    if (!text.trim()) return setStatus({ error: "Type your answer before saving a draft.", success: "" });
    setLoading(true);
    try { const payload = buildPayload("draft"); await setDoc(doc(db, DRAFT_COLLECTION, deterministicId), payload, { merge: true }); setDraft({ id: deterministicId, ...payload }); setStatus({ error: "", success: "Draft saved." }); showToast?.("Draft saved.", "success"); }
    catch { setStatus({ error: "Could not save draft. Please try again.", success: "" }); }
    finally { setLoading(false); }
  }, [buildPayload, deterministicId, showToast, text]);

  const submit = useCallback(async () => {
    const clean = text.trim();
    if (clean.length < MIN_SUBMISSION_CHARACTERS) return setStatus({ error: `Please write at least ${MIN_SUBMISSION_CHARACTERS} characters.`, success: "" });
    if (clean.length > maxChars) return setStatus({ error: `Please keep this answer under ${maxChars} characters.`, success: "" });
    if (!confirmed) return setStatus({ error: "Please tick the confirmation checkbox before submitting.", success: "" });
    setLoading(true);
    try {
      const lockSnap = await getDoc(doc(db, LOCK_COLLECTION, deterministicId));
      if (lockSnap.exists() && !canResubmit) { setLock({ id: deterministicId, ...lockSnap.data() }); setStatus({ error: "This assignment is locked because it has already been submitted.", success: "" }); return; }
      const payload = buildPayload(canResubmit ? "resubmitted" : "submitted");
      await addDoc(collection(db, SUBMISSION_COLLECTION), payload);
      await setDoc(doc(db, LOCK_COLLECTION, deterministicId), { studentId: user?.uid || "", studentEmail: user?.email || "", studentCode, level, lockedAt: serverTimestamp(), assignmentTitle: payload.assignmentTitle, day: payload.day, chapter: payload.chapter, chapterKey, canonicalAssignmentKey }, { merge: true });
      setHistory((prev) => [{ id: `local-${Date.now()}`, ...payload, submittedAt: new Date(), createdAt: new Date(), updatedAt: new Date() }, ...prev]);
      setLock({ id: deterministicId, assignmentTitle: payload.assignmentTitle });
      setStatus({ error: "", success: "Assignment submitted. Awaiting tutor score." });
      setConfirmed(false); onSubmitted?.(payload); showToast?.("Assignment submitted.", "success");
    } catch { setStatus({ error: "Could not submit this assignment. Please try again.", success: "" }); }
    finally { setLoading(false); }
  }, [buildPayload, canResubmit, canonicalAssignmentKey, chapterKey, confirmed, deterministicId, level, maxChars, onSubmitted, showToast, studentCode, text, user]);

  return { assignment, canonicalAssignmentKey, chapterKey, text, setText, confirmed, setConfirmed, draft, history, latest, latestScore, feedback: getFeedback(latest), passed, failed, canResubmit, isLocked, displayStatus, loading, status, maxChars, saveDraft, submit, refresh };
}
