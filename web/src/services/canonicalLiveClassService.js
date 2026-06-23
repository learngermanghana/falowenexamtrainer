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

function normalize(value) {
  return String(value || "").trim().toLowerCase();
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

export function buildCanonicalLiveClassSummary({ klass, sessions = [], zoomProfile = null, now = new Date() }) {
  const nowMs = now.getTime();
  const ordered = [...sessions].sort((a, b) => sessionTime(a, "startsAt") - sessionTime(b, "startsAt"));
  const nonCancelled = ordered.filter((session) => session.status !== CANCELLED);
  const completed = nonCancelled.filter((session) => session.status === COMPLETED);
  const nextSession = nonCancelled.find((session) => {
    const startsAt = sessionTime(session, "startsAt");
    const endsAt = sessionTime(session, "endsAt");
    return session.status === "live" || startsAt >= nowMs || endsAt >= nowMs;
  }) || null;
  const latestCompletedSession = [...nonCancelled]
    .filter((session) => session.status === COMPLETED || (sessionTime(session, "endsAt") > 0 && sessionTime(session, "endsAt") < nowMs))
    .sort((a, b) => sessionTime(b, "startsAt") - sessionTime(a, "startsAt"))[0] || null;
  const cancelledSessions = ordered
    .filter((session) => session.status === CANCELLED)
    .sort((a, b) => sessionTime(b, "startsAt") - sessionTime(a, "startsAt"));
  const progress = nonCancelled.length ? Math.round((completed.length / nonCancelled.length) * 100) : 0;

  return {
    klass,
    sessions: ordered,
    nextSession,
    latestCompletedSession,
    cancelledSessions,
    progress,
    completedCount: completed.length,
    totalCount: nonCancelled.length,
    zoom: resolveZoomDetails(zoomProfile, klass),
  };
}

export async function findCanonicalClass({ classId, className, slug } = {}) {
  if (!db) return null;
  const directId = String(classId || "").trim();
  if (directId) {
    const snap = await getDoc(doc(db, "classes", directId));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
  }

  const targetName = String(className || "").trim();
  if (targetName) {
    const exact = await getDocs(query(collection(db, "classes"), where("name", "==", targetName)));
    if (!exact.empty) return { id: exact.docs[0].id, ...exact.docs[0].data() };
  }

  const targetTokens = new Set([className, slug].map(normalize).filter(Boolean));
  if (!targetTokens.size) return null;
  const all = await getDocs(collection(db, "classes"));
  const match = all.docs.find((snapshot) => {
    const data = snapshot.data();
    return [snapshot.id, data.name, data.slug].some((value) => targetTokens.has(normalize(value)));
  });
  return match ? { id: match.id, ...match.data() } : null;
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
