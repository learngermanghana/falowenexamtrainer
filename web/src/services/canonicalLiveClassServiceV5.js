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
import * as base from "./canonicalLiveClassServiceV4";

export {
  buildCanonicalLiveClassSummary,
  findCanonicalClass,
  normalizeCurriculumIds,
} from "./canonicalLiveClassServiceV4";

const ACTIVE_CLASS_STATUSES = new Set(["active", "ongoing", "upcoming"]);
const INACTIVE_CLASS_STATUSES = new Set(["archived", "deleted"]);
const OFFICIAL_SESSION_REQUIREMENTS = Object.freeze({ A1: 25, A2: 28, B1: 28 });

function normalize(value) {
  return String(value || "").trim();
}

function normalizeIdentity(value) {
  return normalize(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .toLowerCase()
    .replace(/\b(klasse|class|course|cohort)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toMillis(value) {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function requiredSessionCount(klass = {}) {
  const level = base.__private__.extractClassLevel(klass);
  return OFFICIAL_SESSION_REQUIREMENTS[level] || 0;
}

function hasCompleteOfficialRepair(klass = {}) {
  const requiredCount = requiredSessionCount(klass);
  if (!requiredCount) return false;
  const repairComplete = normalize(klass.sessionRepairStatus).toLowerCase() === "complete"
    || normalize(klass.lastSessionChangeType).toLowerCase() === "official-schedule-repair";
  return repairComplete
    && Number(klass.curriculumMappedSessionCount) === requiredCount;
}

function classStartDate(klass = {}) {
  return normalize(klass.configuredStartDate || klass.startDate).slice(0, 10);
}

function sameClassCohort(left = {}, right = {}) {
  const leftStart = classStartDate(left);
  const rightStart = classStartDate(right);
  return Boolean(leftStart && rightStart && leftStart === rightStart);
}

function officialRepairScore(klass = {}, requestedClassName = "") {
  const requestedIdentity = normalizeIdentity(requestedClassName);
  const candidateIdentities = [klass.name, klass.className, klass.slug]
    .map(normalizeIdentity)
    .filter(Boolean);
  const status = normalize(klass.status).toLowerCase();
  const requiredCount = requiredSessionCount(klass);
  let score = 0;

  if (requestedIdentity && candidateIdentities.includes(requestedIdentity)) score += 10000;
  if (INACTIVE_CLASS_STATUSES.has(status) || klass.archived === true || klass.isArchived === true) score -= 100000;
  if (ACTIVE_CLASS_STATUSES.has(status)) score += 500;
  if (normalize(klass.sessionRepairStatus).toLowerCase() === "complete") score += 5000;
  if (normalize(klass.lastSessionChangeType).toLowerCase() === "official-schedule-repair") score += 5000;
  if (requiredCount && Number(klass.curriculumMappedSessionCount) === requiredCount) score += 3000;
  if (requiredCount && Number(klass.officialSessionCount) === requiredCount) score += 2000;
  if (requiredCount && Number(klass.generatedSessionCount) === requiredCount) score += 1000;

  return {
    score,
    startDate: toMillis(klass.startDate),
    updatedAt: Math.max(toMillis(klass.updatedAt), toMillis(klass.sessionRepairAt), toMillis(klass.sessionScheduleUpdatedAt)),
  };
}

function chooseAuthoritativeClass(candidates = [], className = "") {
  return [...candidates]
    .sort((left, right) => {
      const leftRank = officialRepairScore(left, className);
      const rightRank = officialRepairScore(right, className);
      if (rightRank.score !== leftRank.score) return rightRank.score - leftRank.score;
      if (rightRank.startDate !== leftRank.startDate) return rightRank.startDate - leftRank.startDate;
      if (rightRank.updatedAt !== leftRank.updatedAt) return rightRank.updatedAt - leftRank.updatedAt;
      return normalize(right.id).localeCompare(normalize(left.id));
    })[0] || null;
}

async function findClassesByExactName(className = "") {
  const requestedName = normalize(className);
  if (!requestedName || !db) return [];

  const lookups = ["name", "className"].map((field) =>
    getDocs(query(collection(db, "classes"), where(field, "==", requestedName)))
  );
  const results = await Promise.allSettled(lookups);
  const found = new Map();
  results.forEach((result) => {
    if (result.status !== "fulfilled") return;
    result.value.docs.forEach((snapshot) => {
      found.set(snapshot.id, { id: snapshot.id, ...snapshot.data() });
    });
  });
  return [...found.values()];
}

async function findPreferredCanonicalClass({ classId, className, slug } = {}) {
  const directClassId = normalize(classId);
  let directClass = null;
  if (directClassId && db) {
    const directSnapshot = await getDoc(doc(db, "classes", directClassId));
    if (directSnapshot.exists()) {
      directClass = { id: directSnapshot.id, ...directSnapshot.data() };
    }
  }

  const resolvedClassName = normalize(className || directClass?.name || directClass?.className);
  const exactNameCandidates = await findClassesByExactName(resolvedClassName).catch(() => []);

  if (directClass) {
    if (hasCompleteOfficialRepair(directClass)) {
      return base.__private__.applyOfficialSessionRequirement(directClass);
    }
    const sameCohortCandidates = exactNameCandidates.filter((candidate) =>
      sameClassCohort(candidate, directClass)
    );
    const repairedSameCohort = chooseAuthoritativeClass(sameCohortCandidates, resolvedClassName);
    if (hasCompleteOfficialRepair(repairedSameCohort)) {
      return base.__private__.applyOfficialSessionRequirement(repairedSameCohort);
    }
    return base.__private__.applyOfficialSessionRequirement(directClass);
  }

  const authoritative = chooseAuthoritativeClass(exactNameCandidates, resolvedClassName);
  if (authoritative) {
    return base.__private__.applyOfficialSessionRequirement(authoritative);
  }

  const matched = await base.findCanonicalClass({ classId, className, slug });
  return base.__private__.applyOfficialSessionRequirement(matched);
}

async function loadZoomProfile(klass) {
  const profileId = normalize(klass?.zoomProfileId);
  if (!profileId || !db) return null;
  const snapshot = await getDoc(doc(db, "zoomProfiles", profileId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

function canonicalSessionLookups(klass = {}) {
  const identifiers = [...new Set([klass.id, klass.classId]
    .map(normalize)
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
          currentClass = base.__private__.applyOfficialSessionRequirement({
            id: snapshot.id,
            ...snapshot.data(),
          });
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
            sessionBuckets.set(key, snapshot.docs.map(base.__private__.normalizeSession));
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
  chooseAuthoritativeClass,
  hasCompleteOfficialRepair,
  sameClassCohort,
  findClassesByExactName,
  findPreferredCanonicalClass,
  officialRepairScore,
};
