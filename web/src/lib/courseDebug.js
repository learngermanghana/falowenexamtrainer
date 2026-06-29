const DEBUG_EVENT = "falowen-course-debug";
const MAX_ENTRIES = 120;

const browserEnabled = () => {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search || "");
    return params.get("debug") === "1"
      || params.get("courseDebug") === "1"
      || window.localStorage.getItem("falowen:course-debug") === "1";
  } catch (_error) {
    return false;
  }
};

export const isCourseDebugEnabled = () => browserEnabled();

export const getCourseDebugEntries = () => {
  if (typeof window === "undefined") return [];
  return Array.isArray(window.__falowenCourseDebugEntries)
    ? [...window.__falowenCourseDebugEntries]
    : [];
};

export const clearCourseDebugEntries = () => {
  if (typeof window === "undefined") return;
  window.__falowenCourseDebugEntries = [];
  window.dispatchEvent(new CustomEvent(DEBUG_EVENT, { detail: { cleared: true } }));
};

export const courseDebug = (step, data = {}) => {
  if (!browserEnabled() || typeof window === "undefined") return;

  const entry = {
    at: new Date().toISOString(),
    step: String(step || "unknown"),
    path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    ...data,
  };

  const entries = Array.isArray(window.__falowenCourseDebugEntries)
    ? window.__falowenCourseDebugEntries
    : [];
  entries.push(entry);
  window.__falowenCourseDebugEntries = entries.slice(-MAX_ENTRIES);

  console.info("[Falowen course debug]", entry);
  window.dispatchEvent(new CustomEvent(DEBUG_EVENT, { detail: entry }));
};

export const COURSE_DEBUG_EVENT = DEBUG_EVENT;
