const normalizeState = (value = "") => String(value || "").trim().toLowerCase();
const normalizeTab = (value = "") => String(value || "").trim().toLowerCase();

export const isTimedAssignmentReviewUnlocked = ({ attemptState = "", progress = null } = {}) => {
  const state = normalizeState(attemptState);
  // Never interrupt an active attempt. Keep the existing passed-review
  // behavior even when the timer record is absent, as other lesson surfaces
  // use it to open completed study work.
  if (state === "active") return false;

  // Keep the previous pass-review flow, but also let students inspect marked
  // failed work. A failed score is not permission to start a second attempt.
  // An expired timer alone is not proof that a final submission was saved.
  const markedFailure = state === "submitted" &&
    progress?.failed === true && progress?.hasResult === true;
  return Boolean(progress?.passed === true || markedFailure);
};

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
