import { auth } from "../firebase";
import { getBackendUrl } from "./backendUrl";

const clean = (value) => String(value ?? "").trim();
const count = (value) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
};
const revisionNumber = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const normalizeConceptList = (value) => [...new Set(
  (Array.isArray(value) ? value : [])
    .map(clean)
    .filter(Boolean)
)].slice(0, 6);

const normalizeQuestionResponses = (value) => (Array.isArray(value) ? value : [])
  .filter((response) => response?.result === "correct" || response?.result === "needs_review")
  .map((response) => ({
    questionId: clean(response.questionId),
    question: clean(response.question),
    conceptLabel: clean(response.conceptLabel),
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

const timestampValue = (value) => {
  const parsed = Date.parse(clean(value));
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const normalizeParticipationRecord = (record = {}) => {
  const questionResponses = normalizeQuestionResponses(record.questionResponses);
  const reviewConcepts = normalizeConceptList(
    Array.isArray(record.reviewConcepts)
      ? record.reviewConcepts
      : questionResponses
        .filter((response) => response.result === "needs_review")
        .map((response) => response.conceptLabel)
  );
  const strongConcepts = normalizeConceptList(
    questionResponses
      .filter((response) => response.result === "correct")
      .map((response) => response.conceptLabel)
      .filter((concept) => !reviewConcepts.includes(concept))
  );

  return {
    id: clean(record.id),
    classSessionId: clean(record.classSessionId),
    sessionId: clean(record.sessionId),
    revision: revisionNumber(record.revision),
    classId: clean(record.classId),
    className: clean(record.className),
    course: clean(record.course),
    sessionDate: clean(record.sessionDate),
    markedDate: clean(record.markedDate),
    lessonDay: clean(record.lessonDay),
    lessonTitle: clean(record.lessonTitle),
    assignmentId: clean(record.assignmentId),
    turns: count(record.turns),
    correct: count(record.correct),
    needsReview: count(record.needsReview),
    skipped: count(record.skipped),
    questionResponses,
    strongConcepts,
    reviewConcepts,
    focusConcept: clean(record.focusConcept || reviewConcepts[0]),
    reviewRecommendation: clean(
      record.reviewRecommendation
      || (reviewConcepts.length ? `Review next: ${reviewConcepts.join(" · ")}` : "")
    ),
    updatedAt: clean(record.updatedAt),
  };
};

const canonicalIdentityKey = (record = {}, index = 0) => {
  const classSessionId = clean(record.classSessionId);
  if (classSessionId) return `classSession:${classSessionId}`;
  const sessionId = clean(record.sessionId);
  if (sessionId) return `session:${sessionId}`;
  const id = clean(record.id);
  return id ? `record:${id}` : `anonymous:${index}`;
};

const isNewerParticipationRecord = (candidate, current) => {
  if (candidate.revision !== current.revision) return candidate.revision > current.revision;

  const updatedCompare = timestampValue(candidate.updatedAt) - timestampValue(current.updatedAt);
  if (updatedCompare !== 0) return updatedCompare > 0;

  const sessionCompare = clean(candidate.sessionDate).localeCompare(clean(current.sessionDate));
  return sessionCompare > 0;
};

export const deduplicateParticipationRecords = (records = []) => {
  const selected = new Map();

  (Array.isArray(records) ? records : []).forEach((rawRecord, index) => {
    const record = normalizeParticipationRecord(rawRecord);
    const key = canonicalIdentityKey(record, index);
    const current = selected.get(key);
    if (!current || isNewerParticipationRecord(record, current)) selected.set(key, record);
  });

  return [...selected.values()].sort((a, b) => {
    const dateCompare = clean(b.sessionDate).localeCompare(clean(a.sessionDate));
    if (dateCompare !== 0) return dateCompare;
    const updatedCompare = timestampValue(b.updatedAt) - timestampValue(a.updatedAt);
    if (updatedCompare !== 0) return updatedCompare;
    return clean(b.lessonDay || b.assignmentId).localeCompare(clean(a.lessonDay || a.assignmentId));
  });
};

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

  return deduplicateParticipationRecords(
    Array.isArray(data?.participation) ? data.participation : []
  );
}

export function summarizeClassParticipation(records = [], now = new Date()) {
  const canonicalRecords = deduplicateParticipationRecords(records);
  const current = now instanceof Date ? now : new Date(now);
  const today = new Date(current.getFullYear(), current.getMonth(), current.getDate());
  const mondayOffset = (today.getDay() + 6) % 7;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - mondayOffset);

  const weekRecords = canonicalRecords.filter((record) => {
    const date = recordDate(record);
    return date && date >= weekStart && date <= today;
  });

  return {
    classesRecorded: weekRecords.length,
    participated: weekRecords.filter((record) => count(record.turns) > 0).length,
    responses: weekRecords.reduce((sum, record) => sum + count(record.turns), 0),
    correct: weekRecords.reduce((sum, record) => sum + count(record.correct), 0),
    needsReview: weekRecords.reduce((sum, record) => sum + count(record.needsReview), 0),
    latest: canonicalRecords.slice(0, 3),
  };
}
