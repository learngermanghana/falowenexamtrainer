export const SUBMISSION_MINIMUM_WORDS_BY_LEVEL = Object.freeze({
  A1: 20,
  A2: 80,
  B1: 80,
});

const MANAGED_ATTRIBUTE = "data-falowen-level-word-minimum";
const MINIMUM_ATTRIBUTE = "data-minimum-words";
const LEVEL_VALUES = new Set(Object.keys(SUBMISSION_MINIMUM_WORDS_BY_LEVEL));
const CANONICAL_A1_SELECTOR =
  '[data-a1-built-in-submission], [data-cloud-draft-persistence="react-owned"]';

const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();

export const getSubmissionMinimumWordsForLevel = (level = "") =>
  SUBMISSION_MINIMUM_WORDS_BY_LEVEL[normalizeLevel(level)] || null;

const readLevelControl = (scope) => {
  if (!scope?.querySelectorAll) return "";

  return Array.from(scope.querySelectorAll("select, input"))
    .map((control) => normalizeLevel(control.value))
    .find((value) => LEVEL_VALUES.has(value)) || "";
};

export const resolveSubmissionLevelForElement = (element, root = null) => {
  if (!element) return "";
  if (element.closest?.(CANONICAL_A1_SELECTOR)) return "A1";

  const form = element.closest?.("form");
  const formLevel = readLevelControl(form);
  if (formLevel) return formLevel;

  const container = element.closest?.("main, section, [role='main'], #root");
  const containerLevel = readLevelControl(container);
  if (containerLevel) return containerLevel;

  const documentRoot = root || element.ownerDocument;
  return readLevelControl(documentRoot);
};

export const applySubmissionWordMinimum = (textarea, root = null) => {
  if (!textarea?.matches?.("textarea")) return null;

  const existingTarget = Number(textarea.getAttribute(MINIMUM_ATTRIBUTE));
  const isManaged = textarea.getAttribute(MANAGED_ATTRIBUTE) === "true";
  if (Number.isInteger(existingTarget) && existingTarget > 0 && !isManaged) {
    return existingTarget;
  }

  const level = resolveSubmissionLevelForElement(textarea, root);
  const minimumWords = getSubmissionMinimumWordsForLevel(level);
  if (!minimumWords) return null;

  textarea.setAttribute(MINIMUM_ATTRIBUTE, String(minimumWords));
  textarea.setAttribute(MANAGED_ATTRIBUTE, "true");
  textarea.setAttribute("data-submission-level", level);
  return minimumWords;
};

export const refreshSubmissionWordMinimums = (root = null) => {
  const documentRoot = root || (typeof document !== "undefined" ? document : null);
  if (!documentRoot?.querySelectorAll) return [];

  return Array.from(documentRoot.querySelectorAll("textarea"))
    .map((textarea) => ({ textarea, minimumWords: applySubmissionWordMinimum(textarea, documentRoot) }))
    .filter((entry) => entry.minimumWords);
};

export const installSubmissionWordMinimums = (root = null) => {
  const documentRoot = root || (typeof document !== "undefined" ? document : null);
  if (!documentRoot?.addEventListener) return () => {};

  const refresh = () => refreshSubmissionWordMinimums(documentRoot);
  const applyFromEvent = (event) => {
    const target = event.target;
    if (target?.matches?.("textarea")) {
      applySubmissionWordMinimum(target, documentRoot);
      return;
    }
    refresh();
  };

  documentRoot.addEventListener("focusin", applyFromEvent, true);
  documentRoot.addEventListener("input", applyFromEvent, true);
  documentRoot.addEventListener("change", applyFromEvent, true);
  documentRoot.addEventListener("submit", refresh, true);

  const observer = typeof MutationObserver !== "undefined"
    ? new MutationObserver(refresh)
    : null;
  observer?.observe(documentRoot.documentElement || documentRoot.body, {
    childList: true,
    subtree: true,
  });

  refresh();

  return () => {
    observer?.disconnect();
    documentRoot.removeEventListener("focusin", applyFromEvent, true);
    documentRoot.removeEventListener("input", applyFromEvent, true);
    documentRoot.removeEventListener("change", applyFromEvent, true);
    documentRoot.removeEventListener("submit", refresh, true);
  };
};
