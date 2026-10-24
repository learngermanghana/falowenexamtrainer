import { auth, collection, db, getDocs } from "../firebase";
import * as base from "./attendanceServiceBase";

export * from "./attendanceServiceBase";

const normalizeValue = (value = "") => String(value || "").trim();
const emptyAttendanceResult = () => ({
  records: [],
  sessions: 0,
  hours: 0,
  excludedSessions: 0,
});

const normalizeClassIdentity = (value = "") =>
  normalizeValue(value)
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

const classFields = (klass = {}) =>
  [klass.id, klass.classId, klass.name, klass.className, klass.slug]
    .map(normalizeValue)
    .filter(Boolean);

const classStatusRank = (klass = {}) => {
  const status = normalizeValue(klass.status).toLowerCase();
  if (klass.archived === true || klass.isArchived === true || ["archived", "deleted"].includes(status)) return -100;
  if (["active", "ongoing", "upcoming"].includes(status)) return 20;
  return 0;
};

const resolveAttendanceRoots = async (className = "") => {
  const requested = normalizeValue(className);
  if (!requested || !db) return requested ? [requested] : [];

  const target = normalizeClassIdentity(requested);
  const roots = new Set([requested]);

  try {
    const snapshot = await getDocs(collection(db, "classes"));
    const matches = snapshot.docs
      .map((item) => ({ id: item.id, ...(item.data() || {}) }))
      .map((klass) => {
        const identities = classFields(klass).map(normalizeClassIdentity).filter(Boolean);
        const exact = identities.includes(target);
        const score = (exact ? 100 : 0) + classStatusRank(klass);
        return { klass, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score);

    const canonical = matches[0]?.klass;
    if (canonical) {
      [canonical.id, canonical.classId, canonical.name, canonical.className]
        .map(normalizeValue)
        .filter(Boolean)
        .forEach((value) => roots.add(value));
    }
  } catch (error) {
    console.warn("Could not resolve canonical attendance class", error);
  }

  return Array.from(roots);
};

const recordSignature = (record = {}) => {
  const date = normalizeValue(record.date || record.sessionDate);
  const time = normalizeValue(record.startTime || record.startsAt);
  const title = normalizeValue(record.sessionLabel || record.title || record.topic).toLowerCase();
  return [date, time, title].filter(Boolean).join("|");
};

const recordTime = (record = {}) => {
  for (const value of [record.startsAt, record.date, record.sessionDate, record.id]) {
    const parsed = new Date(value || 0).getTime();
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return 0;
};

const getCourseDayNumber = (record = {}) => {
  for (const value of [record.dayNumber, record.courseDay, record.lessonDay, record.assignmentDay]) {
    if (value === null || value === undefined || value === "") continue;
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 0) return parsed;
  }

  const label = [
    record.sessionLabel,
    record.title,
    record.topic,
    record.chapter,
    record.note,
  ]
    .map(normalizeValue)
    .filter(Boolean)
    .join(" ");
  const match = label.match(/\b(?:day|tag|jour)\s*[:#-]?\s*0*(\d{1,3})\b/i);
  return match ? Number(match[1]) : null;
};

const attendanceStatusRank = (record = {}) => {
  if (record.present === true) return 3;
  if (record.present === false && record.marked !== false) return 2;
  return 1;
};

const mergeCourseDayRecords = (current = {}, candidate = {}) => {
  const currentRank = attendanceStatusRank(current);
  const candidateRank = attendanceStatusRank(candidate);
  const candidateWins =
    candidateRank > currentRank ||
    (candidateRank === currentRank && recordTime(candidate) > recordTime(current));
  const winner = candidateWins ? candidate : current;
  const fallback = candidateWins ? current : candidate;

  return {
    ...fallback,
    ...winner,
    id: winner.id || fallback.id,
    sessionLabel: normalizeValue(winner.sessionLabel) || fallback.sessionLabel || "",
    title: normalizeValue(winner.title) || fallback.title || "",
    topic: normalizeValue(winner.topic) || fallback.topic || "",
    date: winner.date || fallback.date || "",
    sessionDate: winner.sessionDate || fallback.sessionDate || "",
  };
};

export const reconcileAttendanceRecords = (records = []) => {
  const reconciled = [];
  const courseDayIndexes = new Map();

  records.forEach((record) => {
    const dayNumber = getCourseDayNumber(record);
    if (dayNumber === null) {
      reconciled.push(record);
      return;
    }

    const level = normalizeValue(record.level).toUpperCase() || "ANY";
    const key = `${level}:DAY:${dayNumber}`;
    const existingIndex = courseDayIndexes.get(key);
    if (existingIndex === undefined) {
      courseDayIndexes.set(key, reconciled.length);
      reconciled.push(record);
      return;
    }

    reconciled[existingIndex] = mergeCourseDayRecords(reconciled[existingIndex], record);
  });

  return reconciled;
};

const mergeAttendanceResults = (results = []) => {
  const recordsByKey = new Map();
  const idIndex = new Map();
  const signatureIndex = new Map();

  results.forEach((result) => {
    (result?.records || []).forEach((record) => {
      const id = normalizeValue(record.id);
      const signature = recordSignature(record);
      let key = (id && idIndex.get(id)) || (signature && signatureIndex.get(signature));
      if (!key) key = id ? `id:${id}` : `signature:${signature || recordsByKey.size}`;

      recordsByKey.set(key, { ...(recordsByKey.get(key) || {}), ...record });
      if (id) idIndex.set(id, key);
      if (signature) signatureIndex.set(signature, key);
    });
  });

  const records = reconcileAttendanceRecords(Array.from(recordsByKey.values()))
    .sort((left, right) => recordTime(left) - recordTime(right));
  const presentRecords = records.filter((record) => record.present === true);

  return {
    records,
    sessions: presentRecords.length,
    hours: presentRecords.reduce(
      (total, record) => total + Number(record.creditedHours || record.hours || 0),
      0,
    ),
    excludedSessions: Math.max(0, ...results.map((result) => Number(result?.excludedSessions || 0))),
  };
};

export const fetchAttendanceRecords = async (options = {}) => {
  // Attendance is private student data. Do not query Firestore on public pages
  // or during the brief period before Firebase restores the signed-in user.
  if (auth && !auth.currentUser) return emptyAttendanceResult();

  const roots = await resolveAttendanceRoots(options.className);
  if (!roots.length) return emptyAttendanceResult();

  const results = [];
  for (const root of roots) {
    try {
      results.push(await base.fetchAttendanceRecords({ ...options, className: root }));
    } catch (error) {
      console.warn(`Could not load attendance root ${root}`, error);
    }
  }

  return mergeAttendanceResults(results);
};

export const fetchAttendanceSummary = async (options = {}) => {
  const result = await fetchAttendanceRecords(options);
  return {
    ...base.buildAttendanceSummary(result.records, result.hours),
    sessions: result.sessions,
    hours: result.hours,
    excludedSessions: result.excludedSessions,
  };
};
