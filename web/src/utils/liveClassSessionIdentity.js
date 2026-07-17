const normalize = (value) => String(value || "").trim();
const normalizeLower = (value) => normalize(value).toLowerCase();

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

const curriculumIds = (session = {}) => {
  const arrays = [session.assignmentIds, session.chapterIds, session.curriculumIds];
  const source = arrays.find((value) => Array.isArray(value) && value.length)
    || (session.assignment_id || session.assignmentId ? [session.assignment_id || session.assignmentId] : []);
  return [...new Set(source.map((value) => normalize(value).toUpperCase()).filter(Boolean))].sort();
};

const curriculumIndex = (session = {}) => {
  const value = session.storedCurriculumIndex ?? session.curriculumIndex;
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
};

const classIdentity = (session = {}, canonicalClassId = "") => normalize(
  canonicalClassId || session.classRecordId || session.classId || session.className,
).toLowerCase();

export const canonicalLessonIdentity = (session = {}, canonicalClassId = "") => {
  const classKey = classIdentity(session, canonicalClassId);
  const officialId = normalize(
    session.officialSessionId || session.canonicalSessionId || session.originalSessionId,
  );
  if (officialId) return `${classKey}|official:${officialId}`;

  const index = curriculumIndex(session);
  if (index !== null) return `${classKey}|curriculum:${index}`;

  const assignments = curriculumIds(session);
  if (assignments.length) return `${classKey}|assignments:${assignments.join("+")}`;

  const documentId = normalize(session.id);
  if (documentId) return `${classKey}|document:${documentId}`;

  return `${classKey}|fallback:${normalizeLower(session.topic || session.title)}:${toMillis(session.startsAt)}`;
};

const isSuperseded = (session = {}) => {
  const status = normalizeLower(session.status || session.sessionStatus);
  return ["superseded", "deleted"].includes(status)
    || session.superseded === true
    || session.isSuperseded === true
    || Boolean(normalize(session.supersededBySessionId));
};

const statusScore = (session = {}) => {
  const status = normalizeLower(session.status || session.sessionStatus);
  if (isSuperseded(session)) return -100000;
  if (status === "completed") return 40;
  if (status === "live") return 35;
  if (["scheduled", "rescheduled"].includes(status)) return 30;
  if (["cancelled", "canceled"].includes(status)) return 5;
  return 10;
};

const revisionTime = (session = {}) => Math.max(
  toMillis(session.rescheduledAt),
  toMillis(session.manualDateOverrideAt),
  toMillis(session.updatedAt),
  toMillis(session.completedAt),
  toMillis(session.createdAt),
);

export const compareSessionAuthority = (left = {}, right = {}) => {
  const supersededDifference = Number(isSuperseded(left)) - Number(isSuperseded(right));
  if (supersededDifference !== 0) return supersededDifference < 0 ? 1 : -1;

  const sequenceDifference = Number(left.sequence || 0) - Number(right.sequence || 0);
  if (sequenceDifference !== 0) return sequenceDifference;

  const revisionDifference = revisionTime(left) - revisionTime(right);
  if (revisionDifference !== 0) return revisionDifference;

  const statusDifference = statusScore(left) - statusScore(right);
  if (statusDifference !== 0) return statusDifference;

  const startDifference = toMillis(left.startsAt) - toMillis(right.startsAt);
  if (startDifference !== 0) return startDifference;

  return normalize(left.id).localeCompare(normalize(right.id));
};

export const dedupeCanonicalSessions = (sessions = [], { canonicalClassId = "" } = {}) => {
  const preferred = new Map();
  sessions.forEach((session) => {
    const key = canonicalLessonIdentity(session, canonicalClassId);
    const current = preferred.get(key);
    if (!current || compareSessionAuthority(session, current) > 0) preferred.set(key, session);
  });
  return [...preferred.values()].sort((left, right) => {
    const startDifference = toMillis(left.startsAt) - toMillis(right.startsAt);
    if (startDifference !== 0) return startDifference;
    const leftIndex = curriculumIndex(left);
    const rightIndex = curriculumIndex(right);
    if (leftIndex !== null && rightIndex !== null && leftIndex !== rightIndex) return leftIndex - rightIndex;
    return normalize(left.id).localeCompare(normalize(right.id));
  });
};

export const __private__ = {
  curriculumIds,
  curriculumIndex,
  isSuperseded,
  revisionTime,
  statusScore,
  toMillis,
};
