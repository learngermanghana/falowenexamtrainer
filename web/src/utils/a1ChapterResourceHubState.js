import { courseSchedules } from "../data/courseSchedule";
import { findCourseBookEntry } from "./courseBookEntries";
import { addCompletedRadioToWorkbookRoute } from "./lessonRouteEntry";

const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();
const normalizeDay = (value = "") => String(value ?? "").trim();
const normalizeChapter = (value = "") => String(value || "").trim();

export const getRequestedA1Chapter = (search = "") => {
  const query = new URLSearchParams(String(search || ""));
  return normalizeChapter(query.get("chapter"));
};

export const isA1ChapterResourceHubRequest = ({ level = "", search = "" } = {}) => {
  const query = new URLSearchParams(String(search || ""));
  return (
    normalizeLevel(level) === "A1" &&
    query.get("hub") === "1" &&
    Boolean(getRequestedA1Chapter(search))
  );
};

export const resolveA1ChapterResourceHubEntry = ({ day = "", chapter = "" } = {}) => {
  const requestedChapter = normalizeChapter(chapter);
  if (!requestedChapter) return null;

  const entry = findCourseBookEntry({
    entries: courseSchedules.A1 || [],
    day,
    chapter: requestedChapter,
    level: "A1",
  });
  const resolvedChapter = normalizeChapter(entry?.displayChapter || entry?.chapter);
  return resolvedChapter === requestedChapter ? entry : null;
};

const patchWorkbookRoute = (resource = null, search = "") => {
  if (!resource || typeof resource !== "object") return resource;
  const workbookRoute = addCompletedRadioToWorkbookRoute(
    resource.workbookRoute || resource.workbook_link || "",
    search,
  );
  if (!workbookRoute) return resource;
  return {
    ...resource,
    workbookRoute,
    workbook_link: workbookRoute,
  };
};

const preserveCompletedRadioOnEntry = (entry = null, search = "") => {
  if (!entry) return entry;
  const workbookRoute = addCompletedRadioToWorkbookRoute(
    entry.workbookRoute || entry.workbook_link || "",
    search,
  );

  return {
    ...entry,
    ...(workbookRoute ? { workbookRoute, workbook_link: workbookRoute } : {}),
    resources: Array.isArray(entry.resources)
      ? entry.resources.map((resource) => patchWorkbookRoute(resource, search))
      : entry.resources,
    primaryResource: patchWorkbookRoute(entry.primaryResource, search),
    lesen_hören: Array.isArray(entry.lesen_hören)
      ? entry.lesen_hören.map((resource) => patchWorkbookRoute(resource, search))
      : patchWorkbookRoute(entry.lesen_hören, search),
    schreiben_sprechen: Array.isArray(entry.schreiben_sprechen)
      ? entry.schreiben_sprechen.map((resource) => patchWorkbookRoute(resource, search))
      : patchWorkbookRoute(entry.schreiben_sprechen, search),
  };
};

export const buildA1ChapterResourceHubState = ({ level = "A1", day = "", search = "" } = {}) => {
  const chapter = getRequestedA1Chapter(search);
  const entry = preserveCompletedRadioOnEntry(
    resolveA1ChapterResourceHubEntry({ day, chapter }),
    search,
  );
  return {
    level: normalizeLevel(level) || "A1",
    day: normalizeDay(day),
    ...(entry ? { entry } : {}),
  };
};

export const shouldNormalizeA1ChapterResourceHubState = ({
  level = "",
  day = "",
  search = "",
  state = null,
} = {}) => {
  if (!isA1ChapterResourceHubRequest({ level, search })) return false;

  const expectedState = buildA1ChapterResourceHubState({ level, day, search });
  const requestedChapter = getRequestedA1Chapter(search);
  const stateChapter = normalizeChapter(state?.entry?.displayChapter || state?.entry?.chapter);

  return (
    !state ||
    normalizeLevel(state.level) !== expectedState.level ||
    normalizeDay(state.day) !== expectedState.day ||
    (Boolean(expectedState.entry) && stateChapter !== requestedChapter) ||
    (!expectedState.entry && Boolean(state?.entry))
  );
};
