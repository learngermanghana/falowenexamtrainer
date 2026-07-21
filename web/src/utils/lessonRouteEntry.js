import { getA1Assignment } from "../data/a1AssignmentRegistry";
import { getLessonsByLevel, toLegacyCurriculumEntry } from "../data/lessonCatalog";
import { findCourseBookEntry } from "./courseBookEntries";

const FALOWEN_ORIGIN = "https://www.falowen.app";
const normalizeToken = (value = "") => String(value || "").trim().toLowerCase();
const entryDay = (entry = {}) => Number(entry?.displayDay ?? entry?.day);
const entryChapter = (entry = {}) => normalizeToken(entry?.displayChapter || entry?.chapter);
const entryLevel = (entry = {}) => {
  const explicit = String(entry?.level || entry?.courseLevel || entry?.course || "").trim().toUpperCase();
  if (explicit) return explicit;
  return String(entry?.assignmentId || entry?.assignment_id || entry?.lessonId || entry?.id || "")
    .trim()
    .toUpperCase()
    .match(/^(A1|A2|B1|B2|C1|C2)(?:-|$)/)?.[1] || "";
};

const stateEntryMatchesRoute = ({ stateEntry, level = "", day, chapter = "" } = {}) => {
  if (!stateEntry) return false;
  const requestedLevel = String(level || "").trim().toUpperCase();
  const requestedDay = Number(day);
  const requestedChapter = normalizeToken(chapter);
  const stateLevel = entryLevel(stateEntry);

  if (Number.isFinite(requestedDay) && entryDay(stateEntry) !== requestedDay) return false;
  if (requestedLevel && stateLevel && stateLevel !== requestedLevel) return false;
  if (requestedChapter && entryChapter(stateEntry) !== requestedChapter) return false;
  return true;
};

const patchCanonicalResource = ({ lesson, workbookRoute }) => ({
  kind: lesson.kind,
  chapter: lesson.chapter,
  title: lesson.title,
  video: lesson.teacherVideo || lesson.video || "",
  youtube_link: lesson.teacherVideo || lesson.video || null,
  teacherVideo: lesson.teacherVideo || lesson.video || null,
  aiVideo: lesson.aiVideo || lesson.ai_video || lesson.grammarExplainerVideo || null,
  grammarPage: lesson.grammarPage || "",
  grammarbook_link: lesson.grammarPage || null,
  grammar_link: lesson.grammarPage || null,
  workbookRoute: workbookRoute || "",
  workbook_link: workbookRoute || null,
  submissionRequired: Boolean(lesson.submissionRequired),
  assignment: Boolean(lesson.submissionRequired),
  ...(lesson.assignmentId && lesson.submissionRequired
    ? { assignmentId: lesson.assignmentId, assignment_id: lesson.assignmentId }
    : {}),
});

export const addA1WorkbookHubBypass = ({ lesson = {}, workbookRoute = "" } = {}) => {
  if (lesson.id !== "A1-4.7" || !workbookRoute) return workbookRoute;

  const parsed = new URL(workbookRoute, FALOWEN_ORIGIN);
  parsed.searchParams.set("view", "workbook");
  const query = parsed.searchParams.toString();
  return `${parsed.pathname}${query ? `?${query}` : ""}${parsed.hash || ""}`;
};

export const addCompletedRadioToWorkbookRoute = (workbookRoute = "", search = "") => {
  if (!workbookRoute) return workbookRoute;

  const sourceQuery = new URLSearchParams(String(search || "").replace(/^\?/, ""));
  if (sourceQuery.get("radio") !== "done") return workbookRoute;

  try {
    const parsed = new URL(workbookRoute, FALOWEN_ORIGIN);
    if (parsed.origin !== FALOWEN_ORIGIN) return workbookRoute;
    parsed.searchParams.set("radio", "done");
    const query = parsed.searchParams.toString();
    return `${parsed.pathname}${query ? `?${query}` : ""}${parsed.hash || ""}`;
  } catch (_error) {
    return workbookRoute;
  }
};

export const resolveCanonicalA1LessonRouteEntry = ({ day, chapter = "" } = {}) => {
  const requestedDay = Number(day);
  const requestedChapter = normalizeToken(chapter);
  if (!Number.isFinite(requestedDay) || !requestedChapter) return null;

  const matches = getLessonsByLevel("A1").filter(
    (lesson) => Number(lesson.day) === requestedDay && normalizeToken(lesson.chapter) === requestedChapter,
  );
  if (matches.length !== 1) return null;

  const lesson = matches[0];
  const registeredAssignment = getA1Assignment(lesson.assignmentId);
  const rawWorkbookRoute = registeredAssignment?.day === requestedDay
    ? registeredAssignment.workbookRoute
    : lesson.workbookRoute || "";
  const workbookRoute = addA1WorkbookHubBypass({ lesson, workbookRoute: rawWorkbookRoute });
  const resource = patchCanonicalResource({ lesson, workbookRoute });
  const legacy = toLegacyCurriculumEntry(lesson);
  const assignmentId = lesson.assignmentId || null;
  const resourceSection = lesson.kind === "schreiben_sprechen" ? "schreiben_sprechen" : "lesen_hören";

  return {
    ...legacy,
    id: lesson.id,
    lessonId: lesson.id,
    courseBookId: lesson.id,
    level: "A1",
    day: requestedDay,
    displayDay: requestedDay,
    chapter: lesson.chapter,
    displayChapter: lesson.chapter,
    topic: lesson.title,
    title: lesson.title,
    lessonTitle: lesson.title,
    assignment: Boolean(lesson.submissionRequired),
    submissionRequired: Boolean(lesson.submissionRequired),
    progressionEligible: Boolean(lesson.progressionEligible),
    assignmentId,
    assignment_id: assignmentId,
    grammarPage: lesson.grammarPage || "",
    workbookRoute,
    video: lesson.teacherVideo || lesson.video || "",
    hideAiVideoInLessonHub: true,
    resources: [resource],
    primaryResource: resource,
    lesen_hören: resourceSection === "lesen_hören" ? [resource] : undefined,
    schreiben_sprechen: resourceSection === "schreiben_sprechen" ? [resource] : undefined,
  };
};

export const resolveLessonRouteEntry = ({
  entries = [],
  level = "",
  day,
  chapter = "",
  stateEntry = null,
} = {}) => {
  const requestedChapter = String(chapter || "").trim();
  const canonicalA1Entry = requestedChapter
    ? resolveCanonicalA1LessonRouteEntry({ day, chapter: requestedChapter })
    : null;
  const requestedLevel = String(level || "").trim().toUpperCase()
    || entryLevel(stateEntry)
    || entries.map(entryLevel).find(Boolean)
    || (canonicalA1Entry ? "A1" : "");

  // The A1 hub normalizer stores a route-matched canonical entry in navigation
  // state. Prefer that matching state so completion flags such as radio=done can
  // be carried into the workbook link without trusting stale state from another
  // chapter.
  if (
    requestedLevel === "A1"
    && stateEntryMatchesRoute({ stateEntry, level: requestedLevel, day, chapter: requestedChapter })
  ) {
    return stateEntry;
  }

  // A1 hub URLs otherwise resolve from the immutable lesson catalog. Runtime
  // course schedule data is mutable and can be split by other modules.
  if (requestedLevel === "A1" && canonicalA1Entry) {
    return canonicalA1Entry;
  }

  if (stateEntryMatchesRoute({ stateEntry, level: requestedLevel, day, chapter: requestedChapter })) {
    return stateEntry;
  }

  const resolved = findCourseBookEntry({
    entries,
    level: requestedLevel,
    day,
    chapter: requestedChapter,
  });
  if (!requestedChapter) return resolved;
  return entryChapter(resolved) === normalizeToken(requestedChapter) ? resolved : null;
};
