import {
  auth,
  db,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "../firebase";

const RECORD_COLLECTION = "classParticipationRecords";
const DEFAULT_LIMIT = 60;

const clean = (value) => String(value ?? "").trim();
const count = (value) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
};

const recordDate = (record = {}) => {
  const raw = clean(record.sessionDate);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const [year, month, day] = raw.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const normalizeParticipationRecord = (record = {}) => ({
  ...record,
  sessionDate: clean(record.sessionDate),
  lessonDay: clean(record.lessonDay),
  lessonTitle: clean(record.lessonTitle),
  assignmentId: clean(record.assignmentId),
  turns: count(record.turns),
  correct: count(record.correct),
  needsReview: count(record.needsReview),
  skipped: count(record.skipped),
});

const readQuery = async (field, value, maxRecords) => {
  if (!db || !clean(value)) return [];
  const snapshot = await getDocs(
    query(
      collection(db, RECORD_COLLECTION),
      where(field, "==", value),
      limit(maxRecords)
    )
  );
  return snapshot.docs.map((document) =>
    normalizeParticipationRecord({ id: document.id, ...document.data() })
  );
};

/**
 * Load only the authenticated learner's participation records.
 *
 * Firestore rules mirror these two query constraints: a learner may read a
 * record only when its studentUid matches their Firebase uid or its normalized
 * email matches the email in their Firebase auth token. Classmate records are
 * never queried or returned to this client.
 */
export async function fetchMyClassParticipation({
  user = auth?.currentUser,
  maxRecords = DEFAULT_LIMIT,
} = {}) {
  if (!user?.uid || !db) return [];

  const safeLimit = Math.max(1, Math.min(Number(maxRecords) || DEFAULT_LIMIT, 100));
  const lookups = [readQuery("studentUid", user.uid, safeLimit)];
  const email = clean(user.email).toLowerCase();
  if (email) lookups.push(readQuery("studentEmailNormalized", email, safeLimit));

  const settled = await Promise.allSettled(lookups);
  const successful = settled.filter((entry) => entry.status === "fulfilled");
  if (!successful.length) {
    const firstError = settled.find((entry) => entry.status === "rejected")?.reason;
    throw firstError || new Error("Could not load class participation.");
  }

  const unique = new Map();
  successful.forEach((entry) => {
    entry.value.forEach((record) => unique.set(record.id, record));
  });

  return [...unique.values()].sort((a, b) => {
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
