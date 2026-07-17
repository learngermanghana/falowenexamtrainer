import { findCourseBookEntry } from "./courseBookEntries";

export const resolveLessonRouteEntry = ({ entries = [], day, chapter = "", stateEntry = null } = {}) => {
  const requestedChapter = String(chapter || "").trim();
  const stateChapter = String(stateEntry?.displayChapter || stateEntry?.chapter || "").trim();
  if (stateEntry && (!requestedChapter || stateChapter === requestedChapter)) return stateEntry;

  const resolved = findCourseBookEntry({ entries, day, chapter: requestedChapter });
  if (!requestedChapter) return resolved;
  const resolvedChapter = String(resolved?.displayChapter || resolved?.chapter || "").trim();
  return resolvedChapter === requestedChapter ? resolved : null;
};
