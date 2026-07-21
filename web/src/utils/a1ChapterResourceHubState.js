import { courseSchedules } from "../data/courseSchedule";
import { findCourseBookEntry } from "./courseBookEntries";

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

export const buildA1ChapterResourceHubState = ({ level = "A1", day = "", search = "" } = {}) => {
  const chapter = getRequestedA1Chapter(search);
  const entry = resolveA1ChapterResourceHubEntry({ day, chapter });
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
