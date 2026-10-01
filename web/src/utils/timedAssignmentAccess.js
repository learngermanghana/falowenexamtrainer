const normalizeState = (value = "") => String(value || "").trim().toLowerCase();
const normalizeTab = (value = "") => String(value || "").trim().toLowerCase();

export const isTimedAssignmentReviewUnlocked = ({ attemptState = "", progress = null } = {}) =>
  Boolean(progress?.passed === true && normalizeState(attemptState) !== "active");

export const isTimedAssignmentTabLocked = ({
  enabled = false,
  timedTabs = [],
  attemptState = "",
  secondsLeft = 0,
  tabKey = "",
  reviewUnlocked = false,
} = {}) => {
  if (!enabled) return false;
  if (reviewUnlocked) return false;

  const normalizedState = normalizeState(attemptState);
  const normalizedTab = normalizeTab(tabKey);
  const timedTabSet = new Set((timedTabs || []).map(normalizeTab).filter(Boolean));
  const isTimedWork = timedTabSet.has(normalizedTab);
  const isSubmit = normalizedTab === "submit";

  if (normalizedState === "active" && Number(secondsLeft) > 0) return false;
  if (normalizedState === "expired" || normalizedState === "submitted") return isTimedWork;

  return isTimedWork || isSubmit;
};

export default isTimedAssignmentTabLocked;
