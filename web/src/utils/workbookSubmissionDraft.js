import {
  buildStructuredSubmissionTextFromSections,
  getStructuredSubmissionProfile,
} from "./structuredSubmissionTemplate";

export const WORKBOOK_SUBMISSION_DRAFT_EVENT = "falowen:workbook-submission-draft";
export const WORKBOOK_SUBMISSION_DRAFT_VERSION = 1;

const STORAGE_PREFIX = "falowen.workbookSubmissionDraft.v1";

const normalizeIdPart = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._-]/g, "_")
    .slice(0, 160);

const normalizeLevel = (value) => String(value || "").trim().toUpperCase();

const safeInteger = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.trunc(numeric) : fallback;
};

const now = () => Date.now();

const getStorage = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage || null;
  } catch (_error) {
    return null;
  }
};

export const buildWorkbookStudentScope = ({ user = null, studentProfile = null } = {}) => {
  const raw =
    user?.uid ||
    studentProfile?.studentCode ||
    studentProfile?.studentcode ||
    studentProfile?.id ||
    user?.email ||
    "anonymous";
  return normalizeIdPart(raw) || "anonymous";
};

export const buildWorkbookDraftStorageKey = ({ studentScope = "anonymous", level = "", day = 0 } = {}) =>
  [STORAGE_PREFIX, normalizeIdPart(studentScope) || "anonymous", normalizeLevel(level) || "general", `day-${safeInteger(day)}`].join("::");

const emptyDraft = ({ studentScope = "anonymous", level = "", day = 0 } = {}) => ({
  version: WORKBOOK_SUBMISSION_DRAFT_VERSION,
  studentScope: normalizeIdPart(studentScope) || "anonymous",
  level: normalizeLevel(level),
  day: safeInteger(day),
  revision: 0,
  updatedAt: null,
  sections: {},
  manualOverride: null,
});

const normalizeDraft = (value, context) => {
  const base = emptyDraft(context);
  if (!value || typeof value !== "object" || Array.isArray(value)) return base;
  return {
    ...base,
    ...value,
    version: WORKBOOK_SUBMISSION_DRAFT_VERSION,
    studentScope: base.studentScope,
    level: base.level,
    day: base.day,
    revision: Math.max(0, safeInteger(value.revision)),
    sections: value.sections && typeof value.sections === "object" && !Array.isArray(value.sections) ? value.sections : {},
    manualOverride: value.manualOverride && typeof value.manualOverride === "object" ? value.manualOverride : null,
  };
};

export const readWorkbookSubmissionDraft = (context = {}) => {
  const storage = getStorage();
  if (!storage) return emptyDraft(context);
  const storageKey = buildWorkbookDraftStorageKey(context);
  try {
    const raw = storage.getItem(storageKey);
    return raw ? normalizeDraft(JSON.parse(raw), context) : emptyDraft(context);
  } catch (_error) {
    return emptyDraft(context);
  }
};

const publishDraft = (context, draft) => {
  if (typeof window === "undefined") return;
  const storageKey = buildWorkbookDraftStorageKey(context);
  window.dispatchEvent(
    new CustomEvent(WORKBOOK_SUBMISSION_DRAFT_EVENT, {
      detail: { storageKey, draft },
    }),
  );
};

const writeWorkbookSubmissionDraft = (context, draft) => {
  const normalized = normalizeDraft(draft, context);
  const storage = getStorage();
  if (storage) {
    try {
      storage.setItem(buildWorkbookDraftStorageKey(context), JSON.stringify(normalized));
    } catch (_error) {
      // Keep the current in-memory UI usable even if storage is unavailable or full.
    }
  }
  publishDraft(context, normalized);
  return normalized;
};

const nextStructuredDraft = (draft, sections) => ({
  ...draft,
  sections,
  revision: Math.max(0, safeInteger(draft.revision)) + 1,
  updatedAt: now(),
  // A manual edit of the combined Submit box is only valid for the exact
  // structured revision it was based on. Any later Teil 2/3/4 edit wins.
  manualOverride: draft.manualOverride,
});

export const saveWorkbookWritingDraft = (context = {}, value = "") => {
  const draft = readWorkbookSubmissionDraft(context);
  const text = String(value ?? "");
  const previous = draft.sections?.teil2 || {};
  if (String(previous.value ?? "") === text && previous.kind === "text") return draft;

  const updatedAt = now();
  return writeWorkbookSubmissionDraft(
    context,
    nextStructuredDraft(draft, {
      ...draft.sections,
      teil2: {
        ...previous,
        kind: "text",
        value: text,
        updatedAt,
        revision: safeInteger(previous.revision) + 1,
      },
    }),
  );
};

const normalizeQuestionNumbers = (questionNumbers = [], questionCount = 0) => {
  const explicit = Array.isArray(questionNumbers)
    ? questionNumbers.map((item) => safeInteger(item)).filter((item) => item > 0)
    : [];
  if (explicit.length) return [...new Set(explicit)].sort((a, b) => a - b);
  const count = Math.max(0, safeInteger(questionCount));
  return Array.from({ length: count }, (_item, index) => index + 1);
};

export const ensureWorkbookObjectiveSection = (
  context = {},
  {
    section = "teil3",
    questionNumbers = [],
    questionCount = 0,
    includeInSubmission = true,
  } = {},
) => {
  const sectionKey = String(section || "").toLowerCase();
  if (!/^teil[34]$/.test(sectionKey)) return readWorkbookSubmissionDraft(context);

  const draft = readWorkbookSubmissionDraft(context);
  const previous = draft.sections?.[sectionKey] || {};
  const normalizedNumbers = normalizeQuestionNumbers(questionNumbers, questionCount);
  const sameNumbers =
    JSON.stringify(previous.questionNumbers || []) === JSON.stringify(normalizedNumbers);
  const sameSubmissionMode = previous.includeInSubmission !== false === Boolean(includeInSubmission);
  if (previous.kind === "objective" && sameNumbers && sameSubmissionMode) return draft;

  return writeWorkbookSubmissionDraft(
    context,
    nextStructuredDraft(draft, {
      ...draft.sections,
      [sectionKey]: {
        ...previous,
        kind: "objective",
        answers: previous.answers && typeof previous.answers === "object" ? previous.answers : {},
        questionNumbers: normalizedNumbers,
        questionCount: normalizedNumbers.length,
        includeInSubmission: Boolean(includeInSubmission),
        updatedAt: now(),
        revision: safeInteger(previous.revision) + 1,
      },
    }),
  );
};

export const saveWorkbookObjectiveAnswer = (
  context = {},
  {
    section = "teil3",
    questionNumber,
    answer = "",
    questionNumbers = [],
    questionCount = 0,
    includeInSubmission = true,
  } = {},
) => {
  const sectionKey = String(section || "").toLowerCase();
  const numericQuestion = safeInteger(questionNumber);
  const normalizedAnswer = String(answer || "").trim().toUpperCase();
  if (!/^teil[34]$/.test(sectionKey) || numericQuestion <= 0 || !normalizedAnswer) {
    return readWorkbookSubmissionDraft(context);
  }

  const draft = readWorkbookSubmissionDraft(context);
  const previous = draft.sections?.[sectionKey] || {};
  const normalizedNumbers = normalizeQuestionNumbers(questionNumbers, questionCount);
  const effectiveNumbers = normalizedNumbers.length
    ? normalizedNumbers
    : normalizeQuestionNumbers(previous.questionNumbers, previous.questionCount);
  const answers = {
    ...(previous.answers && typeof previous.answers === "object" ? previous.answers : {}),
    [numericQuestion]: normalizedAnswer,
  };

  const metadataUnchanged =
    JSON.stringify(previous.questionNumbers || []) === JSON.stringify(effectiveNumbers) &&
    previous.includeInSubmission !== false === Boolean(includeInSubmission);
  if (
    previous.kind === "objective" &&
    String(previous.answers?.[numericQuestion] || "").toUpperCase() === normalizedAnswer &&
    metadataUnchanged
  ) {
    return draft;
  }

  return writeWorkbookSubmissionDraft(
    context,
    nextStructuredDraft(draft, {
      ...draft.sections,
      [sectionKey]: {
        ...previous,
        kind: "objective",
        answers,
        questionNumbers: effectiveNumbers,
        questionCount: effectiveNumbers.length,
        includeInSubmission: Boolean(includeInSubmission),
        updatedAt: now(),
        revision: safeInteger(previous.revision) + 1,
      },
    }),
  );
};

export const saveWorkbookSubmissionOverride = (context = {}, value = "") => {
  const draft = readWorkbookSubmissionDraft(context);
  const text = String(value ?? "");
  if (
    draft.manualOverride &&
    safeInteger(draft.manualOverride.baseRevision) === safeInteger(draft.revision) &&
    String(draft.manualOverride.value ?? "") === text
  ) {
    return draft;
  }
  return writeWorkbookSubmissionDraft(context, {
    ...draft,
    manualOverride: {
      value: text,
      baseRevision: safeInteger(draft.revision),
      updatedAt: now(),
    },
    updatedAt: now(),
  });
};

const objectiveSectionText = (section = {}) =>
  Object.entries(section.answers || {})
    .map(([questionNumber, answer]) => [safeInteger(questionNumber), String(answer || "").trim().toUpperCase()])
    .filter(([questionNumber, answer]) => questionNumber > 0 && answer)
    .sort((left, right) => left[0] - right[0])
    .map(([questionNumber, answer]) => `${questionNumber}. ${answer}`)
    .join("\n");

export const serializeWorkbookSubmissionDraft = (draft = null) => {
  if (!draft) return "";
  const currentRevision = safeInteger(draft.revision);
  const override = draft.manualOverride;
  if (
    override &&
    safeInteger(override.baseRevision, -1) === currentRevision &&
    String(override.value || "").trim()
  ) {
    return String(override.value).trim();
  }

  const profile = getStructuredSubmissionProfile({
    level: draft.level,
    day: draft.day,
  });
  if (!profile) return "";

  const sections = {
    teil2: String(draft.sections?.teil2?.value || "").trim(),
    teil3: objectiveSectionText(draft.sections?.teil3),
    teil4:
      draft.sections?.teil4?.includeInSubmission === false
        ? ""
        : objectiveSectionText(draft.sections?.teil4),
  };

  return buildStructuredSubmissionTextFromSections(profile, sections);
};

export const getWorkbookSubmissionReview = (draft = null) => {
  if (!draft) return { hasContent: false, parts: [], manualOverrideActive: false };
  const profile = getStructuredSubmissionProfile({ level: draft.level, day: draft.day });
  if (!profile) return { hasContent: false, parts: [], manualOverrideActive: false };

  const parts = profile.parts.map((part) => {
    const section = draft.sections?.[part.partId] || {};
    if (part.partId === "teil2") {
      const value = String(section.value || "").trim();
      const wordCount = value ? value.split(/\s+/).filter(Boolean).length : 0;
      return {
        partId: part.partId,
        heading: part.heading,
        label: part.label,
        kind: "text",
        complete: Boolean(value),
        wordCount,
        value,
      };
    }

    const questionNumbers = normalizeQuestionNumbers(section.questionNumbers, section.questionCount);
    const answers = section.answers && typeof section.answers === "object" ? section.answers : {};
    const answeredNumbers = Object.keys(answers)
      .map((value) => safeInteger(value))
      .filter((value) => value > 0 && String(answers[value] || "").trim())
      .sort((a, b) => a - b);
    const expectedNumbers = questionNumbers.length ? questionNumbers : answeredNumbers;
    const missing = expectedNumbers.filter((questionNumber) => !String(answers[questionNumber] || "").trim());
    return {
      partId: part.partId,
      heading: part.heading,
      label: part.label,
      kind: "objective",
      complete: answeredNumbers.length > 0 && missing.length === 0,
      answered: answeredNumbers.length,
      total: expectedNumbers.length,
      missing,
      answers: answeredNumbers.map((questionNumber) => `${questionNumber}. ${String(answers[questionNumber]).toUpperCase()}`),
    };
  });

  const manualOverrideActive = Boolean(
    draft.manualOverride &&
      safeInteger(draft.manualOverride.baseRevision, -1) === safeInteger(draft.revision) &&
      String(draft.manualOverride.value || "").trim(),
  );

  return {
    hasContent: parts.some((part) => (part.kind === "text" ? part.wordCount > 0 : part.answered > 0)),
    complete: parts.every((part) => part.complete),
    parts,
    manualOverrideActive,
  };
};
