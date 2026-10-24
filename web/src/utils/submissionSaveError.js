export const getSubmissionSaveError = (error, action = "submission") => {
  const code = String(error?.code || "").replace(/^firestore\//, "");
  const prefix = `Could not save your ${action}.`;
  if (code === "unauthenticated") {
    return `${prefix} Copy your answers, then sign out and sign in again before retrying.`;
  }
  if (code === "permission-denied") {
    return `${prefix} Your account could not access this assignment. Your answers are still in the editor; copy them and contact your teacher if signing in again does not help. (permission-denied)`;
  }
  if (["unavailable", "deadline-exceeded"].includes(code)) {
    return `${prefix} Check your internet connection and try again. Your answers are still in the editor.`;
  }
  return `${prefix} Your answers are still in the editor. Please try again.${code ? ` (${code})` : ""}`;
};
