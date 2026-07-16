import { useEffect } from "react";

export const MINIMUM_SUBMISSION_WORDS = 80;

const ERROR_ATTRIBUTE = "data-submission-minimum-word-error";
const PROGRESS_ATTRIBUTE = "data-submission-minimum-word-progress";
const HIDDEN_PROGRESS_ATTRIBUTE = "data-submission-word-progress-hidden";
const ERROR_ID_PREFIX = "submission-minimum-word-error";

const normalizeLabel = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

export const countSubmissionWords = (value = "") => {
  const matches = String(value || "").match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu);
  return matches ? matches.length : 0;
};

export const buildMinimumWordMessage = (wordCount, minimumWords = MINIMUM_SUBMISSION_WORDS) => {
  const current = Math.max(0, Number(wordCount) || 0);
  const target = Math.max(1, Number(minimumWords) || MINIMUM_SUBMISSION_WORDS);
  const remaining = Math.max(0, target - current);

  if (!remaining) {
    return `${current} / ${target} words · Ready to submit.`;
  }

  return `${current} / ${target} words · Add ${remaining} more word${remaining === 1 ? "" : "s"} before submitting.`;
};

export const buildMinimumWordError = (wordCount, minimumWords = MINIMUM_SUBMISSION_WORDS) => {
  const current = Math.max(0, Number(wordCount) || 0);
  const target = Math.max(1, Number(minimumWords) || MINIMUM_SUBMISSION_WORDS);
  const remaining = Math.max(0, target - current);

  return `Please type at least ${target} words before submitting. You currently have ${current} word${current === 1 ? "" : "s"}. Add ${remaining} more word${remaining === 1 ? "" : "s"}.`;
};

const isFinalAssignmentSubmitControl = (control) => {
  if (!control) return false;
  if (control.matches?.("[data-a1-final-submit-button]")) return true;

  const label = normalizeLabel(
    control.getAttribute?.("aria-label") || control.value || control.textContent,
  );
  return label === "submit assignment" || label === "submit assignment for tutor marking";
};

const isResubmissionControl = (control) => {
  if (!control) return false;
  return normalizeLabel(control.getAttribute?.("aria-label") || control.value || control.textContent) === "submit resubmission";
};

const findEditableTextarea = (root) =>
  Array.from(root?.querySelectorAll?.("textarea") || []).find(
    (textarea) => !textarea.disabled && !textarea.readOnly,
  ) || null;

const findSubmissionTextarea = (form) => {
  if (!form) return null;
  const controls = Array.from(form.querySelectorAll("button[type='submit'], input[type='submit']"));
  if (!controls.some(isFinalAssignmentSubmitControl)) return null;
  return findEditableTextarea(form);
};

const findResubmissionTextarea = (button) => {
  let container = button?.parentElement || null;
  while (container && container !== document.body) {
    const textareas = Array.from(container.querySelectorAll?.("textarea") || []).filter(
      (textarea) => !textarea.disabled && !textarea.readOnly,
    );
    if (textareas.length) return textareas[0];
    container = container.parentElement;
  }
  return null;
};

const hideLegacyMinimumWordProgress = (textarea) => {
  const field = textarea?.parentElement;
  const legacyBar = field?.querySelector?.('[aria-label^="Minimum word target:"]');
  const legacyRoot = legacyBar?.parentElement;
  if (!legacyRoot || legacyRoot.hasAttribute(HIDDEN_PROGRESS_ATTRIBUTE)) return;
  legacyRoot.setAttribute(HIDDEN_PROGRESS_ATTRIBUTE, legacyRoot.style.display || "");
  legacyRoot.style.display = "none";
};

const getProgressElement = (textarea) => {
  const field = textarea?.parentElement;
  if (!field) return null;

  let progress = field.querySelector(`[${PROGRESS_ATTRIBUTE}="true"]`);
  if (progress) return progress;

  progress = document.createElement("div");
  progress.setAttribute(PROGRESS_ATTRIBUTE, "true");
  progress.setAttribute("aria-live", "polite");
  Object.assign(progress.style, {
    border: "1px solid #f59e0b",
    borderRadius: "10px",
    fontWeight: "800",
    lineHeight: "1.5",
    marginTop: "8px",
    padding: "10px 12px",
  });
  textarea.insertAdjacentElement("afterend", progress);
  hideLegacyMinimumWordProgress(textarea);
  return progress;
};

export const updateMinimumWordProgress = (
  textarea,
  minimumWords = MINIMUM_SUBMISSION_WORDS,
) => {
  if (!textarea) return null;
  const wordCount = countSubmissionWords(textarea.value);
  const ready = wordCount >= minimumWords;
  const progress = getProgressElement(textarea);
  if (!progress) return { wordCount, ready };

  progress.textContent = buildMinimumWordMessage(wordCount, minimumWords);
  progress.style.background = ready ? "#ecfdf5" : "#fffbeb";
  progress.style.borderColor = ready ? "#86efac" : "#f59e0b";
  progress.style.color = ready ? "#166534" : "#92400e";
  progress.setAttribute("data-word-count", String(wordCount));
  progress.setAttribute("data-word-target-reached", ready ? "true" : "false");

  const error = textarea.closest("form")?.querySelector?.(`[${ERROR_ATTRIBUTE}="true"]`)
    || textarea.parentElement?.querySelector?.(`[${ERROR_ATTRIBUTE}="true"]`);
  if (error) {
    if (ready) {
      error.remove();
      textarea.removeAttribute("aria-invalid");
      textarea.removeAttribute("aria-describedby");
    } else {
      error.textContent = buildMinimumWordError(wordCount, minimumWords);
    }
  }

  return { wordCount, ready, progress };
};

const focusMinimumWordError = (error) => {
  window.requestAnimationFrame(() => {
    error.scrollIntoView?.({ behavior: "smooth", block: "center" });
    try {
      error.focus({ preventScroll: true });
    } catch (_error) {
      error.focus?.();
    }
  });
};

export const showMinimumWordError = (
  textarea,
  minimumWords = MINIMUM_SUBMISSION_WORDS,
) => {
  if (!textarea) return null;
  const wordCount = countSubmissionWords(textarea.value);
  const form = textarea.closest("form");
  const host = form || textarea.parentElement;
  if (!host) return null;

  let error = host.querySelector(`[${ERROR_ATTRIBUTE}="true"]`);
  if (!error) {
    error = document.createElement("div");
    error.setAttribute(ERROR_ATTRIBUTE, "true");
    error.setAttribute("role", "alert");
    error.setAttribute("aria-live", "assertive");
    error.tabIndex = -1;
    error.id = `${ERROR_ID_PREFIX}-${Math.random().toString(36).slice(2, 9)}`;
    Object.assign(error.style, {
      background: "#fef2f2",
      border: "2px solid #ef4444",
      borderRadius: "12px",
      color: "#991b1b",
      fontSize: "16px",
      fontWeight: "900",
      lineHeight: "1.55",
      padding: "14px",
    });
    host.insertBefore(error, host.firstChild);
  }

  error.textContent = buildMinimumWordError(wordCount, minimumWords);
  textarea.setAttribute("aria-invalid", "true");
  textarea.setAttribute("aria-describedby", error.id);
  updateMinimumWordProgress(textarea, minimumWords);
  focusMinimumWordError(error);
  return error;
};

export const blockShortSubmission = ({
  event,
  textarea,
  minimumWords = MINIMUM_SUBMISSION_WORDS,
}) => {
  if (!textarea) return false;
  const wordCount = countSubmissionWords(textarea.value);
  updateMinimumWordProgress(textarea, minimumWords);
  if (wordCount >= minimumWords) return false;

  event?.preventDefault?.();
  event?.stopPropagation?.();
  event?.stopImmediatePropagation?.();
  event?.nativeEvent?.stopImmediatePropagation?.();
  showMinimumWordError(textarea, minimumWords);
  return true;
};

const decorateSubmissionControls = (root = document) => {
  Array.from(root.querySelectorAll?.("form") || []).forEach((form) => {
    const textarea = findSubmissionTextarea(form);
    if (textarea) updateMinimumWordProgress(textarea);
  });

  Array.from(root.querySelectorAll?.("button") || [])
    .filter(isResubmissionControl)
    .forEach((button) => {
      const textarea = findResubmissionTextarea(button);
      if (textarea) updateMinimumWordProgress(textarea);
    });
};

export default function SubmissionMinimumWordGuard() {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    let scheduled = false;

    const scheduleDecoration = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        scheduled = false;
        decorateSubmissionControls(document);
      });
    };

    const handleSubmitCapture = (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const submitter = event.submitter || null;
      if (submitter && !isFinalAssignmentSubmitControl(submitter)) return;
      const textarea = findSubmissionTextarea(form);
      if (!textarea) return;
      blockShortSubmission({ event, textarea });
    };

    const handleClickCapture = (event) => {
      const button = event.target?.closest?.("button");
      if (!isResubmissionControl(button)) return;
      const textarea = findResubmissionTextarea(button);
      if (!textarea) return;
      blockShortSubmission({ event, textarea });
    };

    const handleInputCapture = (event) => {
      const textarea = event.target;
      if (!(textarea instanceof HTMLTextAreaElement)) return;
      if (!textarea.parentElement?.querySelector?.(`[${PROGRESS_ATTRIBUTE}="true"]`)) return;
      updateMinimumWordProgress(textarea);
    };

    decorateSubmissionControls(document);
    const observer = new MutationObserver(scheduleDecoration);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("submit", handleSubmitCapture, true);
    document.addEventListener("click", handleClickCapture, true);
    document.addEventListener("input", handleInputCapture, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("submit", handleSubmitCapture, true);
      document.removeEventListener("click", handleClickCapture, true);
      document.removeEventListener("input", handleInputCapture, true);
      document.querySelectorAll(`[${PROGRESS_ATTRIBUTE}="true"], [${ERROR_ATTRIBUTE}="true"]`).forEach((node) => node.remove());
      document.querySelectorAll(`[${HIDDEN_PROGRESS_ATTRIBUTE}]`).forEach((node) => {
        node.style.display = node.getAttribute(HIDDEN_PROGRESS_ATTRIBUTE) || "";
        node.removeAttribute(HIDDEN_PROGRESS_ATTRIBUTE);
      });
    };
  }, []);

  return null;
}

export const __TESTING__ = {
  decorateSubmissionControls,
  findEditableTextarea,
  findResubmissionTextarea,
  findSubmissionTextarea,
  isFinalAssignmentSubmitControl,
  isResubmissionControl,
};
