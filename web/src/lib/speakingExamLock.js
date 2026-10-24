const VALID_LEVELS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
const VALID_TEILE = new Set(["1", "2", "3"]);

export const normalizeLockedSpeakingLevel = (value = "") => {
  const level = String(value || "").trim().toUpperCase();
  return VALID_LEVELS.has(level) ? level : "";
};

export const normalizeLockedSpeakingTeil = (value = "") => {
  const match = String(value || "").match(/(?:teil\s*)?(\d+)/i);
  const teil = match?.[1] || "";
  return VALID_TEILE.has(teil) ? teil : "";
};

export const getVisibleSpeakingTabs = ({ isCourseMode = false, examOnly = false } = {}) => {
  if (examOnly) return [{ key: "exam", label: "Exam prompts" }];
  if (isCourseMode) return [{ key: "custom", label: "Custom chat" }];
  return [
    { key: "exam", label: "Exam prompts" },
    { key: "custom", label: "Custom chat" },
  ];
};

export const resolveInitialSpeakingFilters = ({ lockedLevel = "", lockedTeil = "", examLevel = "" } = {}) => ({
  level: normalizeLockedSpeakingLevel(lockedLevel) || normalizeLockedSpeakingLevel(examLevel) || "A1",
  teil: normalizeLockedSpeakingTeil(lockedTeil) || "all",
});
