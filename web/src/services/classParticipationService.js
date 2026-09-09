import { auth } from "../firebase";
import { getBackendUrl } from "./backendUrl";

const clean = (value) => String(value ?? "").trim();
const count = (value) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
};

const normalizeQuestionResponses = (value) => (Array.isArray(value) ? value : [])
  .filter((response) => response?.result === "correct" || response?.result === "needs_review")
  .map((response) => ({
    questionId: clean(response.questionId),
    question: clean(response.question),
    result: response.result,
    questionContext: clean(response.questionContext),
    recordedAt: clean(response.recordedAt),
  }))
  .filter((response) => response.question);

const recordDate = (record = {}) => {
  const raw = clean(record.sessionDate);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const [year, month, day] = raw.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const normalizeParticipationRecord = (record = {}) => ({
  id: clean(record.id),
  sessionId: clean(record.sessionId),
  classId: clean(record.classId),
  course: clean(record.course),
  sessionDate: clean(record.sessionDate),
  lessonDay: clean(record.lessonDay),
  lessonTitle: clean(record.lessonTitle),
  assignmentId: clean(record.assignmentId),
  turns: count(record.turns),
  correct: count(record.correct),
  needsReview: count(record.needsReview),
  skipped: count(record.skipped),
  questionResponses: normalizeQuestionResponses(record.questionResponses),
  updatedAt: clean(record.updatedAt),
});

/**
 * Load only the authenticated learner's participation records.
 *
 * The browser never queries the shared Firestore collection directly. The
 * Falowen API verifies the Firebase ID token, looks up rows by that token's uid
 * and email, and returns a student-safe shape with no classmate information or
 * presenter absence state.
 */
export async function fetchMyClassParticipation({ user = auth?.currentUser } = {}) {
  if (!user?.uid) return [];

  const token = await user.getIdToken();
  const response = await fetch(`${getBackendUrl()}/class-participation/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.ok === false) {
    throw new Error(data?.error || `Could not load Class Participation (${response.status}).`);
  }

  return (Array.isArray(data?.participation) ? data.participation : [])
    .map(normalizeParticipationRecord)
    .sort((a, b) => {
      const dateCompare = String(b.sessionDate || "").localeCompare(String(a.sessionDate || ""));
      if (dateCompare !== 0) return dateCompare;
      return String(b.lessonDay || b.assignmentId || "").localeCompare(
        String(a.lessonDay || a.assignmentId || "")
      );
    });
}

export function summarizeClassParticipation(records = [], now = new Date()) {
  const current = now instanceof Date ? now : new Date(now);
  const today = new Date(current.getFullYear(), current.getMonth(), current.getDate());
  const mondayOffset = (today.getDay() + 6) % 7;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - mondayOffset);

  const weekRecords = records.filter((record) => {
    const date = recordDate(record);
    return date && date >= weekStart && date <= today;
  });

  return {
    classesRecorded: weekRecords.length,
    participated: weekRecords.filter((record) => count(record.turns) > 0).length,
    responses: weekRecords.reduce((sum, record) => sum + count(record.turns), 0),
    correct: weekRecords.reduce((sum, record) => sum + count(record.correct), 0),
    needsReview: weekRecords.reduce((sum, record) => sum + count(record.needsReview), 0),
    latest: records.slice(0, 3),
  };
}
