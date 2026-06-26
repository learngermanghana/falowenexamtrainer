import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "../firebase";

const CANCELLED = "cancelled";
const COMPLETED = "completed";
const ACTIVE_CLASS_STATUSES = new Set(["active", "ongoing", "upcoming"]);
const INACTIVE_CLASS_STATUSES = new Set(["archived", "deleted"]);

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeClassIdentity(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .toLowerCase()
    .replace(/\b(muenchen|munchen)\b/g, "munich")
    .replace(/\b(koeln|cologne)\b/g, "koln")
    .replace(/\b(klasse|class|course|cohort)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function classIdentityKey(value) {
  const normalized = normalizeClassIdentity(value);
  if (!normalized) return "";
  const level = normalized.match(/\b(a1|a2|b1|b2|c1|c2)\b/)?.[1] || "";
  const remainder = level
    ? normalized.replace(new RegExp(`\\b${level}\\b`, "g"), " ").replace(/\s+/g, " ").trim()
    : normalized;
  return [level, remainder].filter(Boolean).join(" ");
}

function normalizeIdArray(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(
    value
      .map((item) => String(item || "").trim().toUpperCase())
      .filter(Boolean),
  )];
}

export function normalizeCurriculumIds(data = {}) {
  const candidates = [
    normalizeIdArray(data.assignmentIds),
    normalizeIdArray(data.chapterIds),
    normalizeIdArray(data.curriculumIds),
    normalizeIdArray(data.assignment_id ? [data.assignment_id] : []),
  ];
  return candidates.find((ids) => ids.length) || [];
}

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function classDateMillis(value, endOfDay = false) {
  if (!value) return 0;
  const text = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return new Date(`${text}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`).getTime();
  }
  return toDate(value)?.getTime() || 0;
}

function sessionTime(session, field) {
  return toDate(session?.[field])?.getTime() || 0;
}

function normalizeSession(snapshot) {
  const data = snapshot.data();
  const assignmentIds = normalizeCurriculumIds(data);
  return {
    id: snapshot.id,
    ...data,
    startsAt: toDate(data.startsAt),
    endsAt: toDate(data.endsAt),
    assignmentIds,
    chapterIds: assignmentIds,
    curriculumIds: assignmentIds,
    curriculumIndex: Number(data.curriculumIndex || 0),
    curriculumSource: String(data.curriculumSource || "").trim(),
    curriculumVersion: Number(data.curriculumVersion || 0),
  };
}

function resolveZoomDetails(profile = {}, klass = {}) {
  const source = profile || {};
  return {
    url: String(source.url || source.joinUrl || source.zoomUrl || klass.zoomUrl || "").trim(),
    meetingId: String(source.meetingId || source.meetingID || source.idLabel || klass.meetingId || "").trim(),
    passcode: String(source.passcode || source.password || klass.passcode || "").trim(),
  };
}

function classStatusRank(klass = {}) {
  const status = normalize(klass.status);
  if (INACTIVE_CLASS_STATUSES.has(status) || klass.archived === true || klass.isArchived === true) return -1000;
  if (ACTIVE_CLASS_STATUSES.has(status)) return 100;
  if (status === "draft") return 20;
  if (status === "graduated") return 5;
  return 10;
}

function candidateFields(klass = {}) {
  return [klass.id, klass.classId, klass.name, klass.className, klass.slug, klass.city]
    .map((value) => String(value || "").trim())
    .filter(Boolean);
}

function scoreClassCandidate(klass, targets = []) {
  const targetIdentities = new Set(targets.map(normalizeClassIdentity).filter(Boolean));
  const targetKeys = new Set(targets.map(classIdentityKey).filter(Boolean));
  const fields = candidateFields(klass);
  const identities = fields.map(normalizeClassIdentity).filter(Boolean);
  const keys = fields.map(classIdentityKey).filter(Boolean);

  let matchScore = 0;
  if (identities.some((identity) => targetIdentities.has(identity))) matchScore += 500;
  if (keys.some((key) => targetKeys.has(key))) matchScore += 350;

  const targetLevel = [...targetKeys].map((key) => key.match(/^(a1|a2|b1|b2|c1|c2)\b/)?.[1]).find(Boolean);
  const targetPlaces = [...targetKeys]
    .map((key) => key.replace(/^(a1|a2|b1|b2|c1|c2)\b/, "").trim())
    .filter(Boolean);
  const candidateKey = keys.find((key) => key.match(/^(a1|a2|b1|b2|c1|c2)\b/)) || "";
  const candidateLevel = candidateKey.match(/^(a1|a2|b1|b2|c1|c2)\b/)?.[1] || "";
  const candidatePlace = candidateKey.replace(/^(a1|a2|b1|b2|c1|c2)\b/, "").trim();

  if (targetLevel && candidateLevel === targetLevel && candidatePlace && targetPlaces.includes(candidatePlace)) {
    matchScore += 250;
  }

  if (matchScore <= 0) return 0;

  let score = matchScore + classStatusRank(klass);
  const startDate = classDateMillis(klass.startDate);
  if (startDate > 0) score += Math.min(50, Math.floor(startDate / 86400000) / 100000);
  return score;
}

function chooseCanonicalClass(candidates = [], targets = []) {
  return candidates
    .map((klass) => ({ klass, score: scoreClassCandidate(klass, targets) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return classDateMillis(right.klass.startDate) - classDateMillis(left.klass.startDate);
    })[0]?.klass || null;
}

function calculateTimelineProgress(klass = {}, nonCancelled = [], now = new Date()) {
  const nowMs = now.getTime();
  const startMs = classDateMillis(klass.startDate);
  const endMs = classDateMillis(klass.endDate, true);

  if (startMs > 0 && endMs > startMs) {
    if (nowMs <= startMs) return 0;
    if (nowMs >= endMs) return 100;
    return Math.max(1, Math.min(99, Math.round(((nowMs - startMs) / (endMs - startMs)) * 100)));
  }

  if (!nonCancelled.length) return 0;
  const elapsed = nonCancelled.filter((session) => {
    if (normalize(session.status) === COMPLETED) return true;
    const end = sessionTime(session, "endsAt");
    return end > 0 && end < nowMs;
  });
  return Math.round((elapsed.length / nonCancelled.length) * 100);
}

function curriculumSessionsOnly(sessions = []) {
  const ordered = [...sessions].sort((a, b) => sessionTime(a, "startsAt") - sessionTime(b, "startsAt"));
  const mapped = ordered.filter((session) => normalizeCurriculumIds(session).length > 0);

  // A generated class can contain many contract-date occurrences after the
  // level dictionary has ended. Once curriculum mappings exist, only those
  // mapped rows are real course sessions. This prevents blank "Live class"
  // entries from appearing on the homepage and becoming the next session.
  return mapped.length ? mapped : ordered;
}

export function buildCanonicalLiveClassSummary({ klass, sessions = [], zoomProfile = null, now = new Date() }) {
  const nowMs = now.getTime();
  const allOrderedSessions = [...sessions].sort((a, b) => sessionTime(a, "startsAt") - sessionTime(b, "startsAt"));
  const ordered = curriculumSessionsOnly(allOrderedSessions);
  const nonCancelled = ordered.filter((session) => normalize(session.status) !== CANCELLED);
  const elapsed = nonCancelled.filter((session) => {
    if (normalize(session.status) === COMPLETED) return true;
    const endsAt = sessionTime(session, "endsAt");
    return endsAt > 0 && endsAt < nowMs;
  });
  const nextSession = nonCancelled.find((session) => {
    const startsAt = sessionTime(session, "startsAt");
    const endsAt = sessionTime(session, "endsAt");
    return normalize(session.status) === "live" || startsAt >= nowMs || endsAt >= nowMs;
  }) || null;
  const latestCompletedSession = [...elapsed]
    .sort((a, b) => sessionTime(b, "startsAt") - sessionTime(a, "startsAt"))[0] || null;
  const cancelledSessions = ordered
    .filter((session) => normalize(session.status) === CANCELLED)
    .sort((a, b) => sessionTime(b, "startsAt") - sessionTime(a, "startsAt"));
  const progress = calculateTimelineProgress(klass, nonCancelled, now);

  return {
    klass,
    sessions: ordered,
    nextSession,
    latestCompletedSession,
    cancelledSessions,
    progress,
    progressMode: klass?.startDate && klass?.endDate ? "timeline" : "sessions",
    completedCount: elapsed.length,
    totalCount: nonCancelled.length,
    hiddenUnmappedSessionCount: Math.max(0, allOrderedSessions.length - ordered.length),
    zoom: resolveZoomDetails(zoomProfile, klass),
  };
}

export async function findCanonicalClass({ classId, className, slug } = {}) {
  if (!db) return null;
  const targets = [classId, className, slug].map((value) => String(value || "").trim()).filter(Boolean);
  if (!targets.length) return null;

  const directId = String(classId || "").trim();
  let directMatch = null;
  if (directId) {
    const snap = await getDoc(doc(db, "classes", directId));
    if (snap.exists()) directMatch = { id: snap.id, ...snap.data() };
  }

  const all = await getDocs(collection(db, "classes"));
  const candidates = all.docs.map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }));
  if (directMatch && !candidates.some((candidate) => candidate.id === directMatch.id)) candidates.push(directMatch);

  return chooseCanonicalClass(candidates, targets);
}

async function loadZoomProfile(klass) {
  const profileId = String(klass?.zoomProfileId || "").trim();
  if (!profileId || !db) return null;
  const snap = await getDoc(doc(db, "zoomProfiles", profileId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function subscribeCanonicalLiveClass({ classId, className, slug, onChange, onUnavailable, onError }) {
  let stopped = false;
  const unsubscribe = [];
  let currentClass = null;
  let currentSessions = [];
  let zoomProfile = null;

  const emit = () => {
    if (stopped || !currentClass) return;
    onChange?.(buildCanonicalLiveClassSummary({
      klass: currentClass,
      sessions: currentSessions,
      zoomProfile,
      now: new Date(),
    }));
  };

  (async () => {
    try {
      const klass = await findCanonicalClass({ classId, className, slug });
      if (stopped) return;
      if (!klass) {
        onUnavailable?.();
        return;
      }
      currentClass = klass;
      zoomProfile = await loadZoomProfile(klass).catch(() => null);
      if (stopped) return;

      unsubscribe.push(onSnapshot(
        doc(db, "classes", klass.id),
        async (snapshot) => {
          if (!snapshot.exists() || stopped) return;
          currentClass = { id: snapshot.id, ...snapshot.data() };
          zoomProfile = await loadZoomProfile(currentClass).catch(() => null);
          emit();
        },
        (error) => onError?.(error),
      ));

      unsubscribe.push(onSnapshot(
        query(collection(db, "classSessions"), where("classId", "==", klass.id)),
        (snapshot) => {
          currentSessions = snapshot.docs.map(normalizeSession);
          emit();
        },
        (error) => onError?.(error),
      ));
    } catch (error) {
      if (!stopped) onError?.(error);
    }
  })();

  return () => {
    stopped = true;
    unsubscribe.forEach((stop) => stop());
  };
}
