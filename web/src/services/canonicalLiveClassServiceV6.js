import { getLessonsByLevel } from "../data/lessonCatalog";
import * as base from "./canonicalLiveClassServiceV5";

export {
  findCanonicalClass,
  normalizeCurriculumIds,
} from "./canonicalLiveClassServiceV5";

const OFFICIAL_CURRICULUM_SOURCE = "coursedictionarydaygroups";
const INACTIVE_STATUSES = new Set(["cancelled", "superseded", "deleted"]);

const text = (value) => String(value || "").trim();
const normalized = (value) => text(value).toLowerCase().replace(/[^a-z0-9]+/g, "");
const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};
const integer = (value) => {
  if (value === null || value === undefined || text(value) === "") return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
};
const sessionStatus = (session = {}) => text(session.status || session.sessionStatus || "scheduled").toLowerCase();
const curriculumIds = (session = {}) => {
  const values = [session.assignmentIds, session.chapterIds, session.curriculumIds]
    .find((candidate) => Array.isArray(candidate) && candidate.length)
    || (session.assignment_id ? [session.assignment_id] : []);
  return [...new Set(values.map((value) => text(value).toUpperCase()).filter(Boolean))];
};

function isA1Summary(summary = {}) {
  const source = [summary?.klass?.levelId, summary?.klass?.level, summary?.klass?.name, summary?.klass?.className]
    .join(" ")
    .toUpperCase();
  return /\bA1\b/.test(source);
}

function isOfficialSession(session = {}) {
  return normalized(session.curriculumSource) === OFFICIAL_CURRICULUM_SOURCE
    && Number(session.curriculumVersion || 0) >= 2
    && integer(session.curriculumIndex) !== null;
}

function buildA1DayGroups() {
  const groups = new Map();
  getLessonsByLevel("A1")
    .filter((lesson) => lesson.contentStatus !== "planned")
    .forEach((lesson) => {
      const day = integer(lesson.day);
      if (day === null) return;
      if (!groups.has(day)) groups.set(day, { day, lessons: [] });
      groups.get(day).lessons.push(lesson);
    });

  return [...groups.values()]
    .sort((left, right) => left.day - right.day)
    .map((group) => ({
      ...group,
      assignmentIds: [...new Set(group.lessons
        .map((lesson) => text(lesson.assignmentId || lesson.id))
        .filter(Boolean))],
      titles: [...new Set(group.lessons.map((lesson) => text(lesson.title)).filter(Boolean))],
    }));
}

const A1_DAY_GROUPS = buildA1DayGroups();
const A1_GROUP_BY_DAY = new Map(A1_DAY_GROUPS.map((group) => [group.day, group]));
const A1_DAY_BY_ASSIGNMENT = new Map();
A1_DAY_GROUPS.forEach((group) => group.assignmentIds.forEach((id) => A1_DAY_BY_ASSIGNMENT.set(id.toUpperCase(), group.day)));

function knownA1Day(session = {}) {
  const direct = integer(session.curriculumDay);
  if (direct !== null) return direct;
  const topicDay = text(session.topic || session.title).match(/\bday\s*(\d+)\b/i)?.[1];
  if (topicDay !== undefined) return Number(topicDay);
  for (const id of curriculumIds(session)) {
    if (A1_DAY_BY_ASSIGNMENT.has(id)) return A1_DAY_BY_ASSIGNMENT.get(id);
  }
  return null;
}

function startingA1Day(orderedActive = []) {
  const first = orderedActive[0];
  if (!first) return 0;
  const ids = curriculumIds(first);
  const topic = text(first.topic || first.title).toLowerCase();
  if (ids.includes("A1-TUTORIAL") || /\b(orientation|tutorial)\b/.test(topic)) return 0;
  const known = knownA1Day(first);
  return known !== null ? known : 1;
}

function repairLegacyA1Session(session = {}, targetDay) {
  if (isOfficialSession(session)) return session;
  const group = A1_GROUP_BY_DAY.get(targetDay);
  if (!group) return session;
  const currentDay = knownA1Day(session);
  if (currentDay === targetDay) return { ...session, curriculumDay: targetDay };

  const assignmentIds = group.assignmentIds;
  const topic = `Day ${targetDay}: ${group.titles.join(" + ")}`;
  return {
    ...session,
    topic,
    title: topic,
    assignmentIds,
    chapterIds: assignmentIds,
    curriculumIds: assignmentIds,
    assignment_id: assignmentIds[0] || null,
    curriculumDay: targetDay,
    chronologyRepaired: true,
    chronologyPreviousDay: currentDay,
  };
}

export function repairA1LiveClassChronology(summary = {}) {
  if (!isA1Summary(summary) || !Array.isArray(summary.sessions) || !summary.sessions.length) return summary;

  const ordered = [...summary.sessions]
    .sort((left, right) => toMillis(left.startsAt) - toMillis(right.startsAt));
  const active = ordered.filter((session) => !INACTIVE_STATUSES.has(sessionStatus(session)) && session.superseded !== true);
  const firstDay = startingA1Day(active);
  const targetDayById = new Map();
  active.forEach((session, index) => targetDayById.set(text(session.id), firstDay + index));

  const repairedById = new Map();
  const sessions = ordered.map((session) => {
    const targetDay = targetDayById.get(text(session.id));
    const repaired = targetDay === undefined ? session : repairLegacyA1Session(session, targetDay);
    repairedById.set(text(session.id), repaired);
    return repaired;
  });
  const resolve = (session) => session ? (repairedById.get(text(session.id)) || session) : session;

  return {
    ...summary,
    sessions,
    nextSession: resolve(summary.nextSession),
    latestCompletedSession: resolve(summary.latestCompletedSession),
    cancelledSessions: Array.isArray(summary.cancelledSessions)
      ? summary.cancelledSessions.map(resolve)
      : summary.cancelledSessions,
    chronologyRepairedSessionCount: sessions.filter((session) => session.chronologyRepaired).length,
  };
}

export function buildCanonicalLiveClassSummary(options = {}) {
  return repairA1LiveClassChronology(base.buildCanonicalLiveClassSummary(options));
}

export function subscribeCanonicalLiveClass(options = {}) {
  const { onChange } = options;
  return base.subscribeCanonicalLiveClass({
    ...options,
    onChange: (summary) => onChange?.(repairA1LiveClassChronology(summary)),
  });
}

export const __private__ = {
  A1_DAY_GROUPS,
  isOfficialSession,
  knownA1Day,
  startingA1Day,
};
