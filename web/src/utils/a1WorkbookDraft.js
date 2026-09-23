const STORAGE_PREFIX = "falowen:a1:workbook-draft:v1";
export const A1_WORKBOOK_DRAFT_UPDATED_EVENT = "falowen:a1:workbook-draft-updated";

const normalizeAssignmentKey = (value = "") =>
  String(value || "").trim().toUpperCase().replace(/[^A-Z0-9._-]/g, "-");

export const buildA1WorkbookDraftStorageKey = (assignmentKey = "") =>
  `${STORAGE_PREFIX}:${normalizeAssignmentKey(assignmentKey) || "UNKNOWN"}`;

export const makeEmptyA1WorkbookDraft = (assignmentKey = "") => ({
  version: 1,
  assignmentKey: normalizeAssignmentKey(assignmentKey),
  sections: {},
  updatedAt: "",
});

export const readA1WorkbookDraft = (assignmentKey = "") => {
  const empty = makeEmptyA1WorkbookDraft(assignmentKey);
  if (typeof window === "undefined" || !window.localStorage) return empty;

  try {
    const raw = window.localStorage.getItem(buildA1WorkbookDraftStorageKey(assignmentKey));
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return empty;
    return {
      ...empty,
      ...parsed,
      assignmentKey: empty.assignmentKey,
      sections: parsed.sections && typeof parsed.sections === "object" ? parsed.sections : {},
    };
  } catch (error) {
    console.warn("Could not read A1 workbook draft", error);
    return empty;
  }
};

const announceA1WorkbookDraftUpdated = (draft) => {
  if (typeof window === "undefined" || typeof window.dispatchEvent !== "function") return;
  const EventCtor = window.CustomEvent;
  if (typeof EventCtor !== "function") return;

  const dispatch = () => {
    window.dispatchEvent(new EventCtor(A1_WORKBOOK_DRAFT_UPDATED_EVENT, {
      detail: {
        assignmentKey: draft.assignmentKey,
        draft,
      },
    }));
  };

  if (typeof queueMicrotask === "function") queueMicrotask(dispatch);
  else Promise.resolve().then(dispatch);
};

export const saveA1WorkbookDraft = ({ assignmentKey = "", sections = {} } = {}) => {
  const next = {
    version: 1,
    assignmentKey: normalizeAssignmentKey(assignmentKey),
    sections: sections && typeof sections === "object" ? sections : {},
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(buildA1WorkbookDraftStorageKey(assignmentKey), JSON.stringify(next));
    } catch (error) {
      console.warn("Could not save A1 workbook draft", error);
    }
  }

  // Same-page localStorage writes do not emit the browser "storage" event.
  // Notify the workbook shell immediately so Review & Submit reflects answers
  // typed directly inside a Teil without waiting for the cloud autosave round-trip.
  announceA1WorkbookDraftUpdated(next);

  return next;
};

const sortedAnswerEntries = (answers = {}) =>
  Object.entries(answers || {})
    .map(([number, value]) => [Number(number), String(value || "").trim()])
    .filter(([number, value]) => Number.isInteger(number) && number > 0 && value)
    .sort(([left], [right]) => left - right);

export const buildA1WorkbookSubmissionText = ({ assignment, draft } = {}) => {
  if (!assignment || !draft) return "";

  return (assignment.sections || [])
    .map(({ key, number }) => {
      const section = draft.sections?.[key] || {};
      const answerLines = sortedAnswerEntries(section.answers).map(
        ([answerNumber, value]) => `${answerNumber}. ${value}`,
      );
      const body = section.text ? String(section.text).trim() : answerLines.join("\n");
      if (!body) return "";
      return `TEIL ${number}\n${body}`;
    })
    .filter(Boolean)
    .join("\n\n");
};

export const countCompletedA1Answers = (answers = {}, total = 0) => {
  const completed = Array.from({ length: total }, (_, index) => index + 1)
    .filter((number) => String(answers?.[number] || "").trim()).length;
  return { completed, total, complete: completed === total };
};

export const __TESTING__ = { normalizeAssignmentKey, sortedAnswerEntries };
