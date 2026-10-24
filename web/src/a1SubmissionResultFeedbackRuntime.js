import { playFeedbackSound } from "./services/interactionFeedback";

const A1_FINAL_ROOT_SELECTOR =
  '[data-a1-built-in-submission] [data-cloud-draft-persistence="react-owned"]';
const FAILURE_TOAST_ATTRIBUTE = "data-a1-submission-result-toast";
const FAILURE_FEEDBACK_SIGNATURE_ATTRIBUTE = "data-a1-last-failure-feedback";

export const A1_SUBMISSION_FAILURE_MESSAGE =
  "Submission failed — your work was not submitted. Please try again.";

const removeExistingFailureToast = () => {
  document
    .querySelectorAll(`[${FAILURE_TOAST_ATTRIBUTE}="error"]`)
    .forEach((toast) => toast.remove());
};

export const showA1SubmissionFailureToast = (
  message = A1_SUBMISSION_FAILURE_MESSAGE,
) => {
  if (typeof document === "undefined") return null;

  removeExistingFailureToast();

  const toast = document.createElement("div");
  toast.setAttribute(FAILURE_TOAST_ATTRIBUTE, "error");
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  Object.assign(toast.style, {
    alignItems: "flex-start",
    background: "#fef2f2",
    border: "2px solid #ef4444",
    borderRadius: "12px",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.22)",
    boxSizing: "border-box",
    color: "#991b1b",
    display: "flex",
    gap: "12px",
    left: "50%",
    lineHeight: "1.45",
    maxWidth: "420px",
    padding: "13px 14px",
    position: "fixed",
    top: "18px",
    transform: "translateX(-50%)",
    width: "calc(100vw - 24px)",
    zIndex: "2147483600",
  });

  const copy = document.createElement("div");
  copy.style.flex = "1";
  copy.style.fontSize = "14px";
  copy.style.fontWeight = "800";
  copy.textContent = message;

  const close = document.createElement("button");
  close.type = "button";
  close.setAttribute("aria-label", "Dismiss submission failure message");
  close.textContent = "×";
  Object.assign(close.style, {
    background: "transparent",
    border: "0",
    color: "#991b1b",
    cursor: "pointer",
    fontSize: "22px",
    lineHeight: "1",
    padding: "0 2px",
  });
  close.addEventListener("click", () => toast.remove());

  toast.append(copy, close);
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 6500);
  return toast;
};

export const syncA1SubmissionResultFeedback = (root) => {
  if (!root?.matches?.('[data-cloud-draft-persistence="react-owned"]')) return false;

  const state = String(root.getAttribute("data-final-submission-state") || "").toLowerCase();
  if (state !== "error") {
    root.removeAttribute(FAILURE_FEEDBACK_SIGNATURE_ATTRIBUTE);
    return false;
  }

  const exactError = String(root.getAttribute("data-final-submission-error") || "").trim();
  if (!exactError) return false;

  const signature = exactError;
  if (root.getAttribute(FAILURE_FEEDBACK_SIGNATURE_ATTRIBUTE) === signature) return false;
  root.setAttribute(FAILURE_FEEDBACK_SIGNATURE_ATTRIBUTE, signature);

  showA1SubmissionFailureToast();
  playFeedbackSound("error").catch(() => {});
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate([120, 60, 120]);
  }
  return true;
};

export const syncAllA1SubmissionResultFeedback = (scope = document) => {
  if (!scope?.querySelectorAll) return [];
  return Array.from(scope.querySelectorAll(A1_FINAL_ROOT_SELECTOR)).map((root) => ({
    root,
    notified: syncA1SubmissionResultFeedback(root),
  }));
};

export const installA1SubmissionResultFeedbackRuntime = () => {
  if (typeof document === "undefined") return () => {};
  let scheduled = false;

  const scheduleSync = () => {
    if (scheduled) return;
    scheduled = true;
    const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
    schedule(() => {
      scheduled = false;
      syncAllA1SubmissionResultFeedback(document);
    });
  };

  const observer = typeof MutationObserver !== "undefined"
    ? new MutationObserver(scheduleSync)
    : null;

  observer?.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-final-submission-state", "data-final-submission-error"],
    childList: true,
    subtree: true,
  });

  scheduleSync();

  return () => {
    observer?.disconnect();
  };
};

if (process.env.NODE_ENV !== "test" && typeof window !== "undefined") {
  installA1SubmissionResultFeedbackRuntime();
}
