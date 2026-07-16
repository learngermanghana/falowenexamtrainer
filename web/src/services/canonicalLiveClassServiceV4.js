import {
  db,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "../firebase";
import * as base from "./canonicalLiveClassServiceV3";

export {
  buildCanonicalLiveClassSummary,
  findCanonicalClass,
  normalizeCurriculumIds,
} from "./canonicalLiveClassServiceV3";

const OFFICIAL_CURRICULUM_SOURCE = "coursedictionarydaygroups";

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function curriculumIndex(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function normalizedCurriculumSource(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function canonicalCurriculumIndex(data = {}) {
  const storedIndex = curriculumIndex(data.curriculumIndex);
  if (storedIndex === null) return { storedIndex: null, canonicalIndex: null };

  const isOfficialOneBasedIndex =
    normalizedCurriculumSource(data.curriculumSource) === OFFICIAL_CURRICULUM_SOURCE
    && Number(data.curriculumVersion || 0) >= 2;

  return {
    storedIndex,
    canonicalIndex: isOfficialOneBasedIndex && storedIndex > 0 ? storedIndex - 1 : storedIndex,
  };
}

function normalizeSession(snapshot) {
  const data = snapshot.data();
  const assignmentIds = base.normalizeCurriculumIds(data);
  const { storedIndex, canonicalIndex } = canonicalCurriculumIndex(data);
  return {
    id: snapshot.id,
    ...data,
    startsAt: toDate(data.startsAt),
    endsAt: toDate(data.endsAt),
    assignmentIds,
    chapterIds: assignmentIds,
    curriculumIds: assignmentIds,
    curriculumIndex: canonicalIndex,
    storedCurriculumIndex: storedIndex,
    curriculumSource: String(data.curriculumSource || "").trim(),
    curriculumVersion: Number(data.curriculumVersion || 0),
  };
}

async function loadZoomProfile(klass) {
  const profileId = String(klass?.zoomProfileId || "").trim();
  if (!profileId || !db) return null;
  const snap = await getDoc(doc(db, "zoomProfiles", profileId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

async function findPreferredCanonicalClass({ classId, className, slug } = {}) {
  const directClassId = String(classId || "").trim();
  if (directClassId && db) {
    const directSnapshot = await getDoc(doc(db, "classes", directClassId));
    if (directSnapshot.exists()) {
      return { id: directSnapshot.id, ...directSnapshot.data() };
    }
  }
  return base.findCanonicalClass({ classId, className, slug });
}

function canonicalSessionLookups(klass = {}) {
  const identifiers = [...new Set([klass.id, klass.classId]
    .map((value) => String(value || "").trim())
    .filter(Boolean))];
  return identifiers.flatMap((identifier) => [
    { field: "classId", identifier },
    { field: "classRecordId", identifier },
  ]);
}

export function subscribeCanonicalLiveClass({ classId, className, slug, onChange, onUnavailable, onError }) {
  let stopped = false;
  const unsubscribe = [];
  let currentClass = null;
  let zoomProfile = null;
  const sessionBuckets = new Map();

  const emit = () => {
    if (stopped || !currentClass) return;
    onChange?.(base.buildCanonicalLiveClassSummary({
      klass: currentClass,
      sessions: [...sessionBuckets.values()].flat(),
      zoomProfile,
      now: new Date(),
    }));
  };

  (async () => {
    try {
      const klass = await findPreferredCanonicalClass({ classId, className, slug });
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

      canonicalSessionLookups(klass).forEach(({ field, identifier }) => {
        const key = `${field}:${identifier}`;
        unsubscribe.push(onSnapshot(
          query(collection(db, "classSessions"), where(field, "==", identifier)),
          (snapshot) => {
            sessionBuckets.set(key, snapshot.docs.map(normalizeSession));
            emit();
          },
          (error) => console.warn(`Could not subscribe to ${key}`, error),
        ));
      });
    } catch (error) {
      if (!stopped) onError?.(error);
    }
  })();

  return () => {
    stopped = true;
    unsubscribe.forEach((stop) => stop());
  };
}

export const __private__ = {
  canonicalCurriculumIndex,
  findPreferredCanonicalClass,
  normalizeSession,
};
