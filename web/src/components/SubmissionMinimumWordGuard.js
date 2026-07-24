import { useEffect } from "react";

export const MINIMUM_SUBMISSION_WORDS = 80;
export const A1_MINIMUM_SUBMISSION_WORDS = 20;

const PANEL_ATTRIBUTE = "data-submission-minimum-word-panel";
const PANEL_ID = "submission-minimum-word-panel";
const HIDDEN_PROGRESS_ATTRIBUTE = "data-submission-word-progress-hidden";
const EXPLICIT_TARGET_ATTRIBUTES = ["data-minimum-words", "data-min-words", "data-word-target"];

const normalizeLabel = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

const toPositiveInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export const countSubmissionWords = (value = "") => {
  const matches = String(value || "").match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu);
  return matches ? matches.length : 0;
};

export const buildMinimumWordMessage = (wordCount, minimumWords = MINIMUM_SUBMISSION_WORDS) => {
  const current = Math.max(0, Number(wordCount) || 0);
  const target = Math.max(1, Number(minimumWords) || MINIMUM_SUBMISSION_WORDS);
  const remaining = Math.max(0, target - current);

  if (!remaining) return `${current} / ${target} words · Ready to submit.`;
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

const findFinalAssignmentSubmitControl = (form) =>
  Array.from(form?.querySelectorAll?.("button[type='submit'], input[type='submit']") || [])
    .find(isFinalAssignmentSubmitControl) || null;

const findSubmissionTextarea = (form) => {
  if (!form || !findFinalAssignmentSubmitControl(form)) return null;
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

const findResubmissionControlForTextarea = (textarea) => {
  let container = textarea?.parentElement || null;
  while (container && container !== document.body) {
    const button = Array.from(container.querySelectorAll?.("button") || []).find(isResubmissionControl);
    if (button && findResubmissionTextarea(button) === textarea) return button;
    container = container.parentElement;
  }
  return null;
};

const readExplicitMinimumWords = (textarea, control) => {
  const form = textarea?.closest?.("form");
  const explicitContainer = textarea?.closest?.(
    EXPLICIT_TARGET_ATTRIBUTES.map((attribute) => `[${attribute}]`).join(", "),
  );
  const candidates = [textarea, control, form, explicitContainer].filter(Boolean);

  for (const candidate of candidates) {
    for (const attribute of EXPLICIT_TARGET_ATTRIBUTES) {
      const target = toPositiveInteger(candidate.getAttribute?.(attribute));
      if (target) return target;
    }
  }
  return null;
};

export const parseMinimumWordsFromProgressLabel = (value = "") => {
  const text = String(value || "");
  const match = text.match(/(?:\bof\b|\/)\s*(\d+)\s*words?\b/i)
    || text.match(/minimum[^\d]*(\d+)\s*words?\b/i);
  return match?.[1] ? toPositiveInteger(match[1]) : null;
};

const readRenderedMinimumWords = (textarea) => {
  const field = textarea?.parentElement;
  const form = textarea?.closest?.("form");
  const progress = field?.querySelector?.('[aria-label*="word"]')
    || form?.querySelector?.('[aria-label*="word"]');
  return parseMinimumWordsFromProgressLabel(progress?.getAttribute?.("aria-label"));
};

const isCanonicalA1Submission = (textarea, control) => Boolean(
  control?.matches?.("[data-a1-final-submit-button]")
  || textarea?.closest?.('[data-a1-built-in-submission], [data-cloud-draft-persistence="react-owned"]'),
);

export const resolveMinimumSubmissionWords = ({ textarea, control = null } = {}) => {
  if (!textarea) return null;
  return readExplicitMinimumWords(textarea, control)
    || readRenderedMinimumWords(textarea)
    || (isCanonicalA1Submission(textarea, control) ? A1_MINIMUM_SUBMISSION_WORDS : null);
};

const resolveTextareaContext = (textarea) => {
  if (!(textarea instanceof HTMLTextAreaElement)) return null;
  const form = textarea.closest("form");
  const finalControl = findFinalAssignmentSubmitControl(form);
  if (finalControl && findSubmissionTextarea(form) === textarea) {
    const minimumWords = resolveMinimumSubmissionWords({ textarea, control: finalControl });
    return minimumWords ? { control: finalControl, minimumWords, mode: "submission" } : null;
  }

  const resubmissionControl = findResubmissionControlForTextarea(textarea);
  if (resubmissionControl) {
    const minimumWords = resolveMinimumSubmissionWords({ textarea, control: resubmissionControl });
    return minimumWords ? { control: resubmissionControl, minimumWords, mode: "resubmission" } : null;
  }
  return null;
};

const isGuardedTextarea = (textarea) => Boolean(resolveTextareaContext(textarea));

const hideLegacyMinimumWordProgress = (textarea) => {
  const field = textarea?.parentElement;
  const legacyBar = field?.querySelector?.('[aria-label^="Minimum word target:"]');
  const legacyRoot = legacyBar?.parentElement;
  if (!legacyRoot || legacyRoot.hasAttribute(HIDDEN_PROGRESS_ATTRIBUTE)) return;
  legacyRoot.setAttribute(HIDDEN_PROGRESS_ATTRIBUTE, legacyRoot.style.display || "");
  legacyRoot.style.display = "none";
};

const getPanel = () => {
  if (typeof document === "undefined") return null;
  let panel = document.querySelector(`[${PANEL_ATTRIBUTE}="true"]`);
  if (panel) return panel;

  panel = document.createElement("div");
  panel.id = PANEL_ID;
  panel.setAttribute(PANEL_ATTRIBUTE, "true");
  panel.setAttribute("role", "status");
  panel.setAttribute("aria-live", "polite");
  panel.tabIndex = -1;
  panel.hidden = true;
  Object.assign(panel.style, {
    border: "2px solid #f59e0b",
    borderRadius: "14px",
    bottom: "16px",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.22)",
    boxSizing: "border-box",
    fontSize: "16px",
    fontWeight: "900",
    left: "50%",
    lineHeight: "1.55",
    maxWidth: "720px",
    padding: "14px 16px",
    position: "fixed",
    transform: "translateX(-50%)",
    width: "calc(100% - 24px)",
    zIndex: "10050",
  });
  document.body.appendChild(panel);
  return panel;
};

export const hideMinimumWordPanel = () => {
  if (typeof document === "undefined") return;
  const panel = document.querySelector(`[${PANEL_ATTRIBUTE}="true"]`);
  if (panel) panel.hidden = true;
};

const focusPanel = (panel) => {
  window.requestAnimationFrame(() => {
    panel.scrollIntoView?.({ behavior: "smooth", block: "center" });
    try {
      panel.focus({ preventScroll: true });
    } catch (_error) {
      panel.focus?.();
    }
  });
};

export const updateMinimumWordPanel = ({
  textarea,
  minimumWords = MINIMUM_SUBMISSION_WORDS,
  error = false,
  focus = false,
}) => {
  if (!textarea) return null;
  const panel = getPanel();
  if (!panel) return null;

  const wordCount = countSubmissionWords(textarea.value);
  const ready = wordCount >= minimumWords;
  const showError = error && !ready;
  const message = showError
    ? buildMinimumWordError(wordCount, minimumWords)
    : buildMinimumWordMessage(wordCount, minimumWords);

  if (panel.textContent !== message) panel.textContent = message;
  panel.hidden = false;
  panel.setAttribute("role", showError ? "alert" : "status");
  panel.setAttribute("aria-live", showError ? "assertive" : "polite");
  panel.setAttribute("data-word-count", String(wordCount));
  panel.setAttribute("data-word-target", String(minimumWords));
  panel.setAttribute("data-word-target-reached", ready ? "true" : "false");
  panel.setAttribute("data-word-error-visible", showError ? "true" : "false");
  panel.style.background = showError ? "#fef2f2" : ready ? "#ecfdf5" : "#fffbeb";
  panel.style.borderColor = showError ? "#ef4444" : ready ? "#86efac" : "#f59e0b";
  panel.style.color = showError ? "#991b1b" : ready ? "#166534" : "#92400e";

  hideLegacyMinimumWordProgress(textarea);
  if (showError) {
    textarea.setAttribute("aria-invalid", "true");
    textarea.setAttribute("aria-describedby", PANEL_ID);
  } else if (ready) {
    textarea.removeAttribute("aria-invalid");
    textarea.removeAttribute("aria-describedby");
  }

  if (focus) focusPanel(panel);
  return { panel, wordCount, ready, showError };
};

export const blockShortSubmission = ({
  event,
  textarea,
  minimumWords = MINIMUM_SUBMISSION_WORDS,
}) => {
  if (!textarea) return false;
  const wordCount = countSubmissionWords(textarea.value);
  if (wordCount >= minimumWords) {
    updateMinimumWordPanel({ textarea, minimumWords });
    return false;
  }

  event?.preventDefault?.();
  event?.stopPropagation?.();
  event?.stopImmediatePropagation?.();
  event?.nativeEvent?.stopImmediatePropagation?.();
  updateMinimumWordPanel({ textarea, minimumWords, error: true, focus: true });
  return true;
};

export default function SubmissionMinimumWordGuard() {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    let activeTextarea = null;

    const activateTextarea = (textarea) => {
      const context = resolveTextareaContext(textarea);
      if (!context) return false;
      activeTextarea = textarea;
      updateMinimumWordPanel({
        textarea,
        minimumWords: context.minimumWords,
        error: textarea.getAttribute("aria-invalid") === "true",
      });
      return true;
    };

    const handleFocusCapture = (event) => {
      if (event.target?.matches?.(`[${PANEL_ATTRIBUTE}="true"]`)) return;
      if (!activateTextarea(event.target)) hideMinimumWordPanel();
    };

    const handleInputCapture = (event) => {
      const textarea = event.target;
      const context = resolveTextareaContext(textarea);
      if (!context) return;
      activeTextarea = textarea;
      updateMinimumWordPanel({
        textarea,
        minimumWords: context.minimumWords,
        error: textarea.getAttribute("aria-invalid") === "true",
      });
    };

    const handleSubmitCapture = (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const submitter = event.submitter || findFinalAssignmentSubmitControl(form);
      if (submitter && !isFinalAssignmentSubmitControl(submitter)) return;
      const textarea = findSubmissionTextarea(form);
      if (!textarea) return;
      const minimumWords = resolveMinimumSubmissionWords({ textarea, control: submitter });
      if (!minimumWords) return;
      activeTextarea = textarea;
      blockShortSubmission({ event, textarea, minimumWords });
    };

    const handleClickCapture = (event) => {
      const button = event.target?.closest?.("button");
      if (!isResubmissionControl(button)) return;
      const textarea = findResubmissionTextarea(button);
      if (!textarea) return;
      const minimumWords = resolveMinimumSubmissionWords({ textarea, control: button });
      if (!minimumWords) return;
      activeTextarea = textarea;
      blockShortSubmission({ event, textarea, minimumWords });
    };

    document.addEventListener("focusin", handleFocusCapture, true);
    document.addEventListener("input", handleInputCapture, true);
    document.addEventListener("submit", handleSubmitCapture, true);
    document.addEventListener("click", handleClickCapture, true);
    window.addEventListener("popstate", hideMinimumWordPanel);

    return () => {
      document.removeEventListener("focusin", handleFocusCapture, true);
      document.removeEventListener("input", handleInputCapture, true);
      document.removeEventListener("submit", handleSubmitCapture, true);
      document.removeEventListener("click", handleClickCapture, true);
      window.removeEventListener("popstate", hideMinimumWordPanel);
      activeTextarea?.removeAttribute?.("aria-invalid");
      activeTextarea?.removeAttribute?.("aria-describedby");
      document.querySelector(`[${PANEL_ATTRIBUTE}="true"]`)?.remove();
      document.querySelectorAll(`[${HIDDEN_PROGRESS_ATTRIBUTE}]`).forEach((node) => {
        node.style.display = node.getAttribute(HIDDEN_PROGRESS_ATTRIBUTE) || "";
        node.removeAttribute(HIDDEN_PROGRESS_ATTRIBUTE);
      });
    };
  }, []);

  return null;
}

export const __TESTING__ = {
  findEditableTextarea,
  findFinalAssignmentSubmitControl,
  findResubmissionControlForTextarea,
  findResubmissionTextarea,
  findSubmissionTextarea,
  getPanel,
  isFinalAssignmentSubmitControl,
  isGuardedTextarea,
  isResubmissionControl,
  resolveTextareaContext,
};
