"use strict";

// Read-only student timetable resolver, using the same Firestore classes,
// classSessions and zoomProfiles documents as Falowen Admin. All queries are
// scoped to a verified student profile; never discover cohorts by level alone.
const { getCurriculumEntriesForLevel } = require("../data/curriculumManifest");
const SITE = "https://www.falowen.app";
const DEFAULT_TZ = "Africa/Accra";
const text = (value) => String(value ?? "").trim();
const comparable = (value) => text(value).toLowerCase().replace(/\s+/g, " ");
const validLevel = (value) => (text(value).toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/) || [])[1] || "";
const dateOf = (value) => {
  if (!value) return null;
  const d = typeof value.toDate === "function" ? value.toDate() :
    typeof value.toMillis === "function" ? new Date(value.toMillis()) :
      typeof value.seconds === "number" ? new Date(value.seconds * 1000) :
        value instanceof Date ? value : new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
};
const iso = (value) => dateOf(value)?.toISOString() || "";
const safeTz = (value) => {
  const tz = text(value) || DEFAULT_TZ;
  try { new Intl.DateTimeFormat("en-GB", { timeZone: tz }); return tz; }
  catch (_) { return DEFAULT_TZ; }
};
const formatSession = (date, timezone) => {
  const d = dateOf(date);
  if (!d) return null;
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: safeTz(timezone), weekday: "long", day: "2-digit", month: "short",
    year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(d);
};
const classKeys = (klass) => [...new Set([
  klass.id, klass.classId, klass.classRecordId, klass.name, klass.className, klass.slug,
].map(comparable).filter(Boolean))];
const studentKeys = (data) => [...new Set([
  data.classRecordId, data.assignedClassId, data.classId, data.className,
  data.classname, data.class, data.group, data.groupId, data.groupName,
  data.cohort, data.cohortId, data.cohortName,
].map(comparable).filter(Boolean))];

function matchedStudentClass(data, klass) {
  const keys = classKeys(klass);
  const assigned = studentKeys(data);
  return assigned.length > 0 && assigned.some((item) => keys.includes(item));
}

function sessionMatchesClass(row, klass) {
  const canonical = comparable(row.classRecordId || row.classDocumentId);
  if (canonical) return canonical === comparable(klass.id);
  const aliases = classKeys(klass);
  const nameOrId = comparable(row.classId);
  if (nameOrId) return aliases.includes(nameOrId);
  const className = comparable(row.className);
  return Boolean(className && aliases.includes(className));
}
const CANCELLED = new Set(["cancelled", "canceled", "superseded", "deleted", "postponed"]);
const CLOSED = new Set(["graduated", "archived", "cancelled", "canceled", "inactive", "draft"]);
const zoomUrl = (value) => {
  const raw = text(value);
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || !/(^|\.)zoom\.us$/i.test(url.hostname) ||
        url.username || url.password) return "";
    return url.toString();
  } catch (_) { return ""; }
};
function classNameOf(klass) { return text(klass.name || klass.className || klass.id).slice(0, 160); }
const noClass = (level, reason, clarification) => ({
  level, status: reason, classAssigned: false, timezone: DEFAULT_TZ,
  clarification, campusUrl: SITE + "/campus",
});
const fromSnapshots = (snapshot) => snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() || {}) }));

async function resolveStudentClass(db, data) {
  const keys = studentKeys(data);
  if (!keys.length) return { status: "class_not_assigned" };
  const classes = db.collection("classes");
  const strong = [data.classRecordId, data.assignedClassId, data.classId]
    .map(text).filter(Boolean);
  for (const id of strong) {
    const snap = await classes.doc(id).get();
    if (snap.exists) {
      const klass = { id: snap.id, ...(snap.data() || {}) };
      if (matchedStudentClass(data, klass)) return { klass };
    }
  }

  // Class names are a precise fallback; don't query all active cohorts
  // or choose one based only on "A1" / "B1" course level.
  const names = [...new Set([
    data.className, data.classname, data.class, data.groupName,
    data.cohortName, data.group, data.cohort, data.classId, data.assignedClassId,
  ].map(text).filter((value) => value && value.length <= 160))];
  if (!names.length) return { status: "class_not_found" };
  const results = new Map();
  for (const name of names.slice(0, 2)) {
    for (const field of ["name", "className"]) {
      const snap = await classes.where(field, "==", name).limit(3).get();
      fromSnapshots(snap).forEach((klass) => {
        if (matchedStudentClass(data, klass)) results.set(klass.id, klass);
      });
    }
  }
  if (results.size !== 1) return {
    status: results.size > 1 ? "ambiguous_class" : "class_not_found",
  };
  return { klass: [...results.values()][0] };
}

async function loadClassSessions(db, klass) {
  const coll = db.collection("classSessions");
  const found = new Map();
  // For modern classes these two indexed equality reads are enough. Only
  // query legacy name aliases if the canonical ID has no recorded sessions.
  async function collect(lookups) {
    for (const [field, value] of lookups) {
      if (!value) continue;
      const snap = await coll.where(field, "==", value).limit(100).get();
      fromSnapshots(snap).forEach((row) => {
        if (sessionMatchesClass(row, klass) && row.superseded !== true) found.set(row.id, row);
      });
    }
  }
  await collect([["classRecordId", klass.id], ["classId", klass.id]]);
  if (!found.size) {
    await collect([["classId", classNameOf(klass)], ["className", classNameOf(klass)]]);
  }
  return [...found.values()];
}

function upcomingSessions(rows, klass, now = new Date(), limit = 3) {
  const nowMs = dateOf(now)?.getTime() || Date.now();
  if (CLOSED.has(comparable(klass.status)) || klass.active === false) return [];
  return rows.filter((row) => {
    if (!sessionMatchesClass(row, klass) || row.superseded === true ||
        CANCELLED.has(comparable(row.status))) return false;
    const start = dateOf(row.startsAt || row.startAt || row.startDateTime);
    if (!start) return false;
    const end = dateOf(row.endsAt || row.endAt || row.endDateTime);
    return (end || start).getTime() >= nowMs;
  }).sort((a,b) => dateOf(a.startsAt).getTime() - dateOf(b.startsAt).getTime())
    .slice(0, limit);
}

function verifiedDayFromAssignment(row, level) {
  if (!level) return null;
  const ids = (Array.isArray(row.assignmentIds) && row.assignmentIds.length ? row.assignmentIds
    : Array.isArray(row.chapterIds) && row.chapterIds.length ? row.chapterIds
      : Array.isArray(row.curriculumIds) && row.curriculumIds.length ? row.curriculumIds
        : [row.assignment_id, row.assignmentId])
    .map((v) => text(v).toUpperCase()).filter(Boolean);
  if (!ids.length) return null;
  const assignments = new Set(ids);
  const matchedDays = new Set((getCurriculumEntriesForLevel(level) || [])
    .filter((entry) => assignments.has(text(entry.assignmentId || entry.assignment_id || entry.id).toUpperCase()))
    .map((entry) => Number(entry.day ?? entry.assignmentDay))
    .filter((day) => Number.isInteger(day) && day >= 1 && day <= 50));
  return matchedDays.size === 1 ? [...matchedDays][0] : null;
}
function topicForSession(row, level) {
  const topic = text(row.topic || row.title || row.sessionLabel).slice(0, 220);
  const explicitDay = Number(row.curriculumDay || row.lessonDay);
  const curriculumDay = verifiedDayFromAssignment(row, level);
  const provisionalIndex = Number(row.curriculumIndex);
  const explicit = Number.isInteger(explicitDay) && explicitDay >= 1 && explicitDay <= 50;
  // Conflicting explicit day and source assignment ID must not produce a confident mapping.
  const conflict = explicit && curriculumDay !== null && explicitDay !== curriculumDay;
  const verified = !conflict && (explicit || curriculumDay !== null);
  const day = conflict ? null : explicit ? explicitDay : curriculumDay !== null ? curriculumDay : provisionalIndex;
  return {
    topic: topic || null,
    topicConfirmed: Boolean(topic),
    lessonDay: Number.isInteger(day) && day >= 1 && day <= 50 ? day : null,
    lessonDaySource: conflict ? "conflicting_source" : !verified ? "curriculum_index_unverified"
      : explicit ? "explicit_session_day" : "assignment_identity",
    lessonUrl: Number.isInteger(day) && day >= 1 && day <= 50 && level
      ? SITE + "/campus/course/lesson/" + level + "/" + day : null,
  };
}
function sessionView(row, klass, level, now) {
  const tz = safeTz(klass.timezone);
  const start = iso(row.startsAt || row.startAt || row.startDateTime);
  const end = iso(row.endsAt || row.endAt || row.endDateTime);
  return {
    startsAt: start, endsAt: end || null, timezone: tz,
    localStart: formatSession(start, tz), localEnd: end ? formatSession(end, tz) : null,
    status: comparable(row.status) || "scheduled",
    ...topicForSession(row, level),
    guidance: "Prepare using the recorded session topic and Falowen Campus. Do not infer an unrecorded lesson topic.",
    isInProgress: Boolean(dateOf(start) && dateOf(start).getTime() <= dateOf(now).getTime() &&
      (!end || dateOf(end).getTime() > dateOf(now).getTime())),
  };
}

async function readZoomDetails(db, klass) {
  const direct = zoomUrl(klass.zoomUrl || klass.zoomLink || klass.meetingUrl || klass.joinUrl);
  if (direct) return direct;
  const id = text(klass.zoomProfileId);
  if (!id) return "";
  const snap = await db.collection("zoomProfiles").doc(id).get();
  if (!snap.exists) return "";
  const profile = snap.data() || {};
  return zoomUrl(profile.joinUrl || profile.url || profile.zoomUrl);
}

async function getStudentTimetable({ db, student, now = new Date(), includeZoom = true }) {
  const data = student?.data || {};
  const level = validLevel(data.level || data.course);
  const selfLearning = ["B2","C1","C2"].includes(level);
  const resolved = await resolveStudentClass(db, data);
  if (!resolved.klass) {
    return noClass(level, resolved.status, selfLearning
      ? "This is a self-study course. No live class is assigned to this account. Falowen Campus remains available."
      : "The account is not linked to exactly one current class. Falowen cannot confirm a timetable or topic; ask Admin to verify the student's class assignment.");
  }
  const klass = resolved.klass;
  const enrolledLevel = validLevel(klass.levelId || klass.level || klass.name);
  if (enrolledLevel && level && level !== enrolledLevel) {
    return noClass(level, "class_level_mismatch",
      "The enrolled course and assigned live-class level differ. Falowen Admin should correct the class assignment.");
  }
  const tz = safeTz(klass.timezone);
  const sessions = upcomingSessions(await loadClassSessions(db, klass), klass, now);
  const next = sessions[0];
  if (!next) return {
    level, classAssigned: true, className: classNameOf(klass), timezone: tz,
    status: "no_upcoming_session", nextSession: null, upcomingSessions: [],
    clarification: "There is no confirmed upcoming session in the Falowen Admin timetable. No date or topic was guessed.",
    campusUrl: SITE + "/campus",
  };
  const zoom = includeZoom ? await readZoomDetails(db, klass) : "";
  return {
    level, classAssigned: true, className: classNameOf(klass), timezone: tz,
    status: "upcoming_session", checkedAt: iso(now),
    nextSession: sessionView(next, klass, level, now),
    upcomingSessions: sessions.map((row) => sessionView(row, klass, level, now)),
    zoomUrl: zoom || null,
    zoomAvailable: Boolean(zoom),
    zoomClarification: zoom ? "This is the class's saved Zoom join URL, not a newly created meeting."
      : "No Zoom join URL is configured for this class. Use Falowen Campus or contact Admin.",
    campusUrl: SITE + "/campus",
    clarification: "Times and topics come from this class's saved Falowen Admin sessions. Reschedules and cancellations are respected. Class times are shown in the timetable timezone.",
  };
}

module.exports = {
  getStudentTimetable, resolveStudentClass, matchedStudentClass, sessionMatchesClass,
  upcomingSessions, sessionView, zoomUrl, dateOf, verifiedDayFromAssignment,
};
