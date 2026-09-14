const A1_MINIMUM_WORDS = 20;
const A1_MAXIMUM_CHARACTERS = 2500;
const INLINE_WORD_FEEDBACK_ATTRIBUTE = "data-submission-word-feedback";
const MOBILE_STATUS_ATTRIBUTE = "data-a1-mobile-word-status";
const ERROR_ATTRIBUTE = "data-a1-submit-error";
const MANAGED_ORDER_ATTRIBUTE = "data-a1-mobile-order-managed";
const GLOBAL_WORD_PANEL_SELECTOR = '[data-submission-minimum-word-panel="true"]';
const A1_ROOT_SELECTOR =
  '[data-a1-built-in-submission], [data-cloud-draft-persistence="react-owned"]';

const normalize = (value = "") => String(value || "").trim();

export const countA1SubmissionWords = (value = "") => {
  const normalized = normalize(value);
  return normalized ? normalized.split(/\s+/).filter(Boolean).length : 0;
};

export const buildA1WordStatus = (wordCount, minimumWords = A1_MINIMUM_WORDS) => {
  const current = Math.max(0, Number(wordCount) || 0);
  const target = Math.max(1, Number(minimumWords) || A1_MINIMUM_WORDS);
  const remaining = Math.max(0, target - current);
  if (!remaining) return `${current} / ${target} words · Ready to submit`;
  return `${current} / ${target} words · ${remaining} more word${remaining === 1 ? "" : "s"} required`;
};

const isMobileViewport = () => {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(max-width: 640px)").matches;
  }
  return Number(window.innerWidth || 0) <= 640;
};

const isCanonicalA1Form = (form) => Boolean(
  form?.matches?.("form")
    && form.querySelector?.("textarea")
    && form.querySelector?.("[data-a1-final-submit-button]")
    && form.closest?.(A1_ROOT_SELECTOR),
);

const findA1Forms = (root = document) =>
  Array.from(root?.querySelectorAll?.("form") || []).filter(isCanonicalA1Form);

const findEditor = (form) => {
  const textarea = form?.querySelector?.("textarea");
  return textarea?.closest?.("label") || textarea?.parentElement || null;
};

const findQuickKeys = (form) =>
  Array.from(form?.children || []).find((child) =>
    /quick umlaut keys/i.test(String(child.textContent || ""))
      && child.querySelector?.("button"),
  ) || null;

const findAssignmentConfirmation = (form) =>
  Array.from(form?.querySelectorAll?.("label") || []).find((label) =>
    /i checked that this is the correct assignment/i.test(String(label.textContent || "")),
  ) || null;

const findInlineCounter = (textarea) => {
  const editor = textarea?.closest?.("label") || textarea?.parentElement;
  return Array.from(editor?.querySelectorAll?.("span") || []).find((span) =>
    /characters\s*·/i.test(String(span.textContent || "")),
  ) || null;
};

const hideGlobalWordPanel = () => {
  const panel = document.querySelector(GLOBAL_WORD_PANEL_SELECTOR);
  if (panel) panel.hidden = true;
};

const getMobileStatus = (quickKeys) => {
  if (!quickKeys) return null;
  let status = quickKeys.querySelector(`[${MOBILE_STATUS_ATTRIBUTE}="true"]`);
  if (status) return status;

  status = document.createElement("div");
  status.setAttribute(MOBILE_STATUS_ATTRIBUTE, "true");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  Object.assign(status.style, {
    border: "1px solid #f59e0b",
    borderRadius: "10px",
    boxSizing: "border-box",
    fontSize: "14px",
    fontWeight: "800",
    lineHeight: "1.45",
    marginTop: "10px",
    padding: "10px 12px",
    width: "100%",
  });
  quickKeys.appendChild(status);
  return status;
};

const updateMobileStatus = (quickKeys, message, ready) => {
  const status = getMobileStatus(quickKeys);
  if (!status) return null;
  status.textContent = message;
  status.hidden = !isMobileViewport();
  status.dataset.wordTargetReached = ready ? "true" : "false";
  status.style.background = ready ? "#ecfdf5" : "#fffbeb";
  status.style.borderColor = ready ? "#86efac" : "#f59e0b";
  status.style.color = ready ? "#166534" : "#92400e";
  return status;
};

const getSubmitError = (form, create = true) => {
  let error = form?.querySelector?.(`[${ERROR_ATTRIBUTE}="true"]`) || null;
  if (error || !create) return error;

  const actions = form?.querySelector?.("[data-a1-submission-actions]");
  const submit = actions?.querySelector?.("[data-a1-final-submit-button]");
  if (!actions || !submit) return null;

  error = document.createElement("div");
  error.id = "a1-submit-error-near-button";
  error.setAttribute(ERROR_ATTRIBUTE, "true");
  error.setAttribute("role", "alert");
  error.setAttribute("aria-live", "assertive");
  error.tabIndex = -1;
  error.hidden = true;
  Object.assign(error.style, {
    background: "#fef2f2",
    border: "1px solid #fecdd3",
    borderRadius: "10px",
    color: "#b91c1c",
    fontSize: "14px",
    fontWeight: "700",
    gridColumn: "1 / -1",
    lineHeight: "1.5",
    padding: "10px 12px",
    width: "100%",
    boxSizing: "border-box",
  });
  actions.insertBefore(error, submit);
  return error;
};

const focusError = (error) => {
  if (!error || !isMobileViewport()) return;
  window.requestAnimationFrame(() => {
    error.scrollIntoView?.({ behavior: "smooth", block: "center" });
    try {
      error.focus({ preventScroll: true });
    } catch (_error) {
      error.focus?.();
    }
  });
};

export const showA1SubmitError = (form, message, { focus = true } = {}) => {
  const error = getSubmitError(form, true);
  if (!error) return null;
  const nextMessage = normalize(message);
  const changed = error.textContent !== nextMessage || error.hidden;
  error.textContent = nextMessage;
  error.hidden = !nextMessage;
  const submit = form.querySelector("[data-a1-final-submit-button]");
  if (nextMessage) submit?.setAttribute("aria-describedby", error.id);
  if (nextMessage && changed && focus) focusError(error);
  return error;
};

export const clearA1SubmitError = (form) => {
  const error = getSubmitError(form, false);
  if (!error) return;
  error.hidden = true;
  error.textContent = "";
  form.querySelector("[data-a1-final-submit-button]")?.removeAttribute("aria-describedby");
};

const collectChecklistInputs = (form) => {
  const moved = form?.querySelector?.("#falowen-submit-completion-check-below-editor");
  const guidance = form?.querySelector?.("#falowen-submit-level-guidance");
  const scope = moved || guidance;
  return Array.from(scope?.querySelectorAll?.('input[type="checkbox"][name="falowen-submit-completion-check"], input[type="checkbox"][data-check-id]') || []);
};

const checklistIsComplete = (form) => {
  const checks = collectChecklistInputs(form);
  return !checks.length || checks.every((check) => check.checked);
};

const syncSubmitButton = (form, textarea, wordCount) => {
  const button = form.querySelector("[data-a1-final-submit-button]");
  if (!button) return;

  const root = form.closest(A1_ROOT_SELECTOR);
  const finalState = String(root?.getAttribute("data-final-submission-state") || "").toLowerCase();
  const blockedByBusyState = textarea.disabled || finalState === "saving";
  const blockedByChecklist = !checklistIsComplete(form);
  const shouldDisable = blockedByBusyState || blockedByChecklist;

  if (button.disabled !== shouldDisable) button.disabled = shouldDisable;
  button.dataset.a1WordCountReady = wordCount >= A1_MINIMUM_WORDS ? "true" : "false";
  button.dataset.a1WordCount = String(wordCount);
};

const applyMobileVisualOrder = (form, editor, quickKeys) => {
  const managed = Array.from(form?.children || []).filter((child) =>
    child.hasAttribute?.(MANAGED_ORDER_ATTRIBUTE),
  );
  managed.forEach((child) => {
    child.style.order = "";
    child.removeAttribute(MANAGED_ORDER_ATTRIBUTE);
  });

  if (!isMobileViewport() || !editor || !quickKeys) return;

  const guidance = form.querySelector("#falowen-submit-level-guidance");
  const movedChecklist = form.querySelector("#falowen-submit-completion-check-below-editor");
  const confirmation = findAssignmentConfirmation(form);
  const special = new Set([quickKeys, guidance, movedChecklist, confirmation].filter(Boolean));
  const children = Array.from(form.children);
  const beforeEditor = [];
  const afterEditor = [];
  let seenEditor = false;

  children.forEach((child) => {
    if (child === editor) {
      seenEditor = true;
      return;
    }
    if (special.has(child)) return;
    (seenEditor ? afterEditor : beforeEditor).push(child);
  });

  const desired = [
    ...beforeEditor,
    editor,
    quickKeys,
    guidance,
    movedChecklist,
    confirmation,
    ...afterEditor,
  ].filter(Boolean);

  desired.forEach((child, index) => {
    child.style.order = String(index + 1);
    child.setAttribute(MANAGED_ORDER_ATTRIBUTE, "true");
  });
};

export const validateA1SubmissionForm = (form) => {
  if (!isCanonicalA1Form(form)) return "";
  const textarea = form.querySelector("textarea");
  const wordCount = countA1SubmissionWords(textarea?.value || "");
  if (wordCount < A1_MINIMUM_WORDS) {
    const remaining = A1_MINIMUM_WORDS - wordCount;
    return `${buildA1WordStatus(wordCount)}. Add ${remaining} more word${remaining === 1 ? "" : "s"} before submitting.`;
  }

  const confirmation = findAssignmentConfirmation(form)?.querySelector('input[type="checkbox"]');
  if (confirmation && !confirmation.checked) {
    return "Please check ‘I checked that this is the correct assignment.’ before submitting.";
  }

  const root = form.closest(A1_ROOT_SELECTOR);
  if (root?.getAttribute("data-draft-conflict") === "true") {
    return "Resolve the newer cloud draft before submitting.";
  }
  return "";
};

const mirrorFinalSubmissionError = (form) => {
  const root = form.closest(A1_ROOT_SELECTOR);
  const finalError = normalize(root?.getAttribute("data-final-submission-error") || "");
  const finalState = String(root?.getAttribute("data-final-submission-state") || "").toLowerCase();
  if (finalError) {
    showA1SubmitError(form, `Could not save your submission. ${finalError}`, { focus: true });
    return;
  }
  if (finalState === "verified") clearA1SubmitError(form);
};

export const syncA1SubmissionForm = (form) => {
  if (!isCanonicalA1Form(form)) return null;

  const textarea = form.querySelector("textarea");
  const editor = findEditor(form);
  const quickKeys = findQuickKeys(form);
  const wordCount = countA1SubmissionWords(textarea.value);
  const ready = wordCount >= A1_MINIMUM_WORDS;
  const wordStatus = buildA1WordStatus(wordCount);

  textarea.setAttribute(INLINE_WORD_FEEDBACK_ATTRIBUTE, "inline");
  textarea.setAttribute("data-a1-word-count", String(wordCount));
  textarea.setAttribute("data-a1-word-target", String(A1_MINIMUM_WORDS));

  const inlineCounter = findInlineCounter(textarea);
  if (inlineCounter) {
    const counterText = `${textarea.value.length.toLocaleString()} / ${A1_MAXIMUM_CHARACTERS.toLocaleString()} characters · ${wordStatus}`;
    if (inlineCounter.textContent !== counterText) inlineCounter.textContent = counterText;
    inlineCounter.setAttribute("data-a1-shared-word-status", "true");
  }

  updateMobileStatus(quickKeys, wordStatus, ready);
  applyMobileVisualOrder(form, editor, quickKeys);
  syncSubmitButton(form, textarea, wordCount);
  mirrorFinalSubmissionError(form);
  hideGlobalWordPanel();

  return { textarea, wordCount, ready, wordStatus };
};

export const syncAllA1SubmissionForms = (root = document) =>
  findA1Forms(root).map((form) => syncA1SubmissionForm(form)).filter(Boolean);

const installA1SubmissionConsistencyRuntime = () => {
  if (typeof document === "undefined") return () => {};
  let scheduled = false;
  let observer = null;

  const scheduleSync = () => {
    if (scheduled) return;
    scheduled = true;
    const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
    schedule(() => {
      scheduled = false;
      syncAllA1SubmissionForms(document);
    });
  };

  const handleInput = (event) => {
    const form = event.target?.closest?.("form");
    if (!isCanonicalA1Form(form)) return;
    if (event.target?.matches?.("textarea")) clearA1SubmitError(form);
    scheduleSync();
  };

  const handleChange = (event) => {
    const form = event.target?.closest?.("form");
    if (!isCanonicalA1Form(form)) return;
    scheduleSync();
  };

  const handleSubmit = (event) => {
    const form = event.target;
    if (!isCanonicalA1Form(form)) return;
    const validationMessage = validateA1SubmissionForm(form);
    if (!validationMessage) {
      clearA1SubmitError(form);
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    event.nativeEvent?.stopImmediatePropagation?.();
    showA1SubmitError(form, validationMessage, { focus: true });
    scheduleSync();
  };

  document.addEventListener("input", handleInput, true);
  document.addEventListener("change", handleChange, true);
  document.addEventListener("submit", handleSubmit, true);
  window.addEventListener("resize", scheduleSync);

  observer = typeof MutationObserver !== "undefined"
    ? new MutationObserver(scheduleSync)
    : null;
  observer?.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [
      "disabled",
      "data-completion-checklist-ready",
      "data-disabled-by-completion-checklist",
      "data-final-submission-error",
      "data-final-submission-state",
      "data-draft-conflict",
    ],
    childList: true,
    characterData: true,
    subtree: true,
  });

  scheduleSync();
  [80, 250, 700].forEach((delay) => window.setTimeout(scheduleSync, delay));

  return () => {
    observer?.disconnect();
    document.removeEventListener("input", handleInput, true);
    document.removeEventListener("change", handleChange, true);
    document.removeEventListener("submit", handleSubmit, true);
    window.removeEventListener("resize", scheduleSync);
  };
};

if (process.env.NODE_ENV !== "test" && typeof window !== "undefined") {
  installA1SubmissionConsistencyRuntime();
}

export { A1_MINIMUM_WORDS, A1_MAXIMUM_CHARACTERS, installA1SubmissionConsistencyRuntime };
