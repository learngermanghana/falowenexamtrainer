// Tutor-marked workbook timers are based on actual required submissions,
// not every visible navigation tab. A2/B1 profiles supply the graded tabs;
// B2 can use the same policy when a tutor-marked submission is available.
export const MINUTES_PER_GRADED_TAB = 10;
const SUPPORTED_LEVELS = new Set(["A2", "B1", "B2"]);
const GRADED_TABS = new Set(["schreiben", "lesen", "hoeren"]);
// Reserve this registry for genuine approved exceptions. All regular B1
// tutor-marked workbooks—including Days 22, 27 and 28—use 10 minutes per
// submitted tab; only a separate full mock may use an examination limit.
export const TIMED_LESSON_EXCEPTIONS = Object.freeze({});

export const getGradedTabDurationMinutes = ({
  level = "",
  assignmentKey = "",
  timedTabs = [],
  mode = "practice",
  configuredDurationMinutes = null,
} = {}) => {
  const fallback = Number(configuredDurationMinutes);
  const configured = Number.isFinite(fallback) && fallback > 0 ? fallback : null;
  const normalizedLevel = String(level || "").trim().toUpperCase();
  if (!SUPPORTED_LEVELS.has(normalizedLevel)) return configured;

  // Full mocks deliberately keep their own examination-style limits.
  if (String(mode || "").trim().toLowerCase() === "mock") return configured;

  const key = String(assignmentKey || "").trim().toUpperCase();
  if (Object.prototype.hasOwnProperty.call(TIMED_LESSON_EXCEPTIONS, key)) {
    return TIMED_LESSON_EXCEPTIONS[key];
  }

  // Count each actually submitted section once; exclude study, speaking practice,
  // reference tabs and Hören self-check (not present in requiredSubmissionParts).
  const graded = new Set(
    (Array.isArray(timedTabs) ? timedTabs : [])
      .map((tab) => String(tab || "").trim().toLowerCase())
      .filter((tab) => GRADED_TABS.has(tab)),
  );
  return graded.size ? graded.size * MINUTES_PER_GRADED_TAB : configured;
};
