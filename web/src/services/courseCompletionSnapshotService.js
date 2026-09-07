import { db, doc, serverTimestamp, setDoc } from "../firebase";

export const COURSE_COMPLETION_SNAPSHOT_COLLECTION = "courseCompletionSnapshots";
export const COURSE_COMPLETION_ENGINE_VERSION = 1;

const lastPersistedFingerprintById = new Map();

const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();
const normalizeIdPart = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "_")
    .slice(0, 160);

const finiteNumber = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const nullableNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const preferredStudentName = ({ studentProfile, user } = {}) =>
  String(
    studentProfile?.name ||
      studentProfile?.fullName ||
      studentProfile?.displayName ||
      [studentProfile?.firstName, studentProfile?.lastName].filter(Boolean).join(" ") ||
      user?.displayName ||
      ""
  ).trim();

export const getCourseCompletionSnapshotId = ({ user, level } = {}) => {
  const uid = normalizeIdPart(user?.uid);
  const normalizedLevel = normalizeIdPart(normalizeLevel(level));
  if (!uid || !normalizedLevel) return "";
  return `${uid}__${normalizedLevel}`;
};

export const buildCourseCompletionSnapshot = ({ progress, level, user, studentProfile } = {}) => {
  const normalizedLevel = normalizeLevel(level || progress?.level || studentProfile?.level);
  const total = finiteNumber(progress?.total, 0);
  if (!user?.uid || !normalizedLevel || total <= 0) return null;

  const next = progress?.next || null;
  return {
    studentId: user.uid,
    userId: user.uid,
    studentCode: String(
      studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || ""
    ).trim(),
    studentEmail: String(user?.email || studentProfile?.email || "").trim(),
    studentName: preferredStudentName({ studentProfile, user }),
    className: String(studentProfile?.className || "").trim(),
    level: normalizedLevel,
    mode: String(progress?.mode || "").trim(),
    completed: finiteNumber(progress?.completed, 0),
    total,
    completionPercent: finiteNumber(progress?.completionPercent, 0),
    passed: finiteNumber(progress?.passed, 0),
    needsImprovement: finiteNumber(progress?.needsImprovement, 0),
    awaitingReview: finiteNumber(progress?.awaitingReview, 0),
    masteryAvailable: progress?.masteryAvailable === true,
    masteryPercent: nullableNumber(progress?.masteryPercent),
    milestone: finiteNumber(progress?.milestone, 0),
    nextMilestone: nullableNumber(progress?.nextMilestone),
    courseWorkCompleted: progress?.courseWorkCompleted === true,
    nextAssignmentKey: next?.assignmentKey ? String(next.assignmentKey) : null,
    nextDay: nullableNumber(next?.day),
    nextChapter: next?.chapter ? String(next.chapter) : null,
    nextLabel: next?.label ? String(next.label) : null,
    nextRoute: next?.route ? String(next.route) : null,
    engineVersion: COURSE_COMPLETION_ENGINE_VERSION,
  };
};

export const getCourseCompletionSnapshotFingerprint = (snapshot = null) =>
  snapshot ? JSON.stringify(snapshot) : "";

export const persistCourseCompletionSnapshot = async ({
  progress,
  level,
  user,
  studentProfile,
  dbInstance = db,
} = {}) => {
  const snapshot = buildCourseCompletionSnapshot({ progress, level, user, studentProfile });
  const snapshotId = getCourseCompletionSnapshotId({ user, level: snapshot?.level || level });
  if (!snapshot || !snapshotId || !dbInstance) return { ok: false, reason: "missing" };

  const fingerprint = getCourseCompletionSnapshotFingerprint(snapshot);
  if (lastPersistedFingerprintById.get(snapshotId) === fingerprint) {
    return { ok: true, skipped: true, snapshotId, snapshot };
  }

  await setDoc(
    doc(dbInstance, COURSE_COMPLETION_SNAPSHOT_COLLECTION, snapshotId),
    {
      ...snapshot,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  lastPersistedFingerprintById.set(snapshotId, fingerprint);
  return { ok: true, skipped: false, snapshotId, snapshot };
};

export const __resetCourseCompletionSnapshotCacheForTests = () => {
  lastPersistedFingerprintById.clear();
};
