import {
  addCompletedRadioToWorkbookRoute,
  resolveCanonicalA1LessonRouteEntry,
} from "./lessonRouteEntry";

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

  const entry = resolveCanonicalA1LessonRouteEntry({ day, chapter: requestedChapter });
  const resolvedChapter = normalizeChapter(entry?.displayChapter || entry?.chapter);
  return resolvedChapter === requestedChapter ? entry : null;
};

const addRadioCompletionToResource = (resource = {}, search = "") => {
  if (!resource || typeof resource !== "object") return resource;
  const currentRoute = resource.workbookRoute || resource.workbook_link || "";
  const workbookRoute = addCompletedRadioToWorkbookRoute(currentRoute, search);
  if (!workbookRoute || workbookRoute === currentRoute) return resource;

  return {
    ...resource,
    workbookRoute,
    workbook_link: workbookRoute,
  };
};

export const addRadioCompletionToA1HubEntry = (entry = null, search = "") => {
  if (!entry) return null;
  const query = new URLSearchParams(String(search || ""));
  if (query.get("radio") !== "done") return entry;

  const workbookRoute = addCompletedRadioToWorkbookRoute(entry.workbookRoute || "", search);
  const resources = Array.isArray(entry.resources)
    ? entry.resources.map((resource) => addRadioCompletionToResource(resource, search))
    : entry.resources;
  const primaryResource = addRadioCompletionToResource(entry.primaryResource, search);
  const lesenHoeren = Array.isArray(entry.lesen_hören)
    ? entry.lesen_hören.map((resource) => addRadioCompletionToResource(resource, search))
    : entry.lesen_hören;
  const schreibenSprechen = Array.isArray(entry.schreiben_sprechen)
    ? entry.schreiben_sprechen.map((resource) => addRadioCompletionToResource(resource, search))
    : entry.schreiben_sprechen;

  return {
    ...entry,
    workbookRoute,
    resources,
    primaryResource,
    lesen_hören: lesenHoeren,
    schreiben_sprechen: schreibenSprechen,
  };
};

export const buildA1ChapterResourceHubState = ({ level = "A1", day = "", search = "" } = {}) => {
  const chapter = getRequestedA1Chapter(search);
  const entry = addRadioCompletionToA1HubEntry(
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
  const expectedWorkbookRoute = expectedState.entry?.workbookRoute || "";
  const stateWorkbookRoute = state?.entry?.workbookRoute || "";

  return (
    !state ||
    normalizeLevel(state.level) !== expectedState.level ||
    normalizeDay(state.day) !== expectedState.day ||
    (Boolean(expectedState.entry) && stateChapter !== requestedChapter) ||
    (!expectedState.entry && Boolean(state?.entry)) ||
    expectedWorkbookRoute !== stateWorkbookRoute
  );
};
