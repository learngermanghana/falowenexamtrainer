const STORAGE_PREFIX = "falowen:a1:workbook-draft:v1";
export const A1_WORKBOOK_DRAFT_UPDATED_EVENT = "falowen:a1:workbook-draft-updated";

const normalizeAssignmentKey = (value = "") =>
  String(value || "").trim().toUpperCase().replace(/[^A-Z0-9._-]/g, "-");

// Changed reading exercises must not reuse answers to the former questions.
// Retain sections whose questions have not changed.
const READING_REVISIONS = {
  "A1-2": { revision: "a1-day4-number-form-words-speaking-v2", sections: { "teil-1": 5, "teil-2": 5, "teil-3": 0 } },
  "A1-12.1": { revision: "a1-12.1-bahnhof-hoeren-v3", sections: { "teil-1": 5, "teil-2": 0, "teil-3": 5 } },
  "A1-4": { revision: "a1-4-goethe-speaking-v3", sections: { "teil-2": 0, "teil-3": 5 } },
  "A1-6": { revision: "objects-and-colors-reading-listening-v2", sections: { "teil-1": 5, "teil-2": 5, "teil-3": 0 } },
  // Reading only changed again. Preserve saved listening answers (Teil 2).
  "A1-7": { revision: "five-opening-hours-signs-v3", sections: { "teil-1": 5 } },
  "A1-8": { revision: "day12-two-reading-parts-v4", sections: { "teil-1": 5, "teil-2": 3 } },
  "A1-11": { revision: "goethe-requests-and-bahnhof-listening-v2", sections: { "teil-1": 0, "teil-2": 5, "teil-3": 0 } },
  "A1-13": { revision: "weather-situations-and-radio-5-each-v1", sections: { "teil-1": 5, "teil-2": 5 } },
  "A1-14.1": { revision: "health-advertisements-and-appointment-5-each-v1", sections: { "teil-1": 5, "teil-2": 5 } },
};
// Previous homework revisions contain valid answers for the Teile that were
// not replaced. Retain them instead of deleting students' Hören/Lesen work.
const COMPATIBLE_UNCHANGED_SECTIONS = {
  "A1-12.1": { from: "a1-12.1-bahn-auto-beruf-v2", keys: ["teil-1"] },
  "A1-4": { from: "a1-4-listening-v2", keys: ["teil-3"] },
  "A1-11": { from: "tourist-info-and-bahnhof-directions-5-each-v1", keys: ["teil-2"] },
};
const readingRevision = (assignmentKey) => {
  const config = READING_REVISIONS[normalizeAssignmentKey(assignmentKey)];
  return config ? { readingRevision: config.revision } : {};
};
const sanitizeA1WorkbookDraft = (draft) => {
  const config = READING_REVISIONS[normalizeAssignmentKey(draft.assignmentKey)];
  if (normalizeAssignmentKey(draft.assignmentKey) === "A1-3" && draft.sections?.["teil-3"]?.revision !== "a1-3-recorded-family-grammar-v2") {
    const sections = { ...draft.sections };
    delete sections["teil-3"];
    draft = { ...draft, sections };
  }
  if (!config) return draft;
  const sections = { ...(draft.sections || {}) };
  Object.entries(config.sections).forEach(([sectionKey, questionCount]) => {
    const compatible = COMPATIBLE_UNCHANGED_SECTIONS[normalizeAssignmentKey(draft.assignmentKey)];
    const keepFromOlderRevision = compatible && draft.readingRevision === compatible.from && compatible.keys.includes(sectionKey);
    if (draft.readingRevision !== config.revision && !keepFromOlderRevision) {
      delete sections[sectionKey];
    } else if (sections[sectionKey]) {
      sections[sectionKey] = questionCount === 0 ? { text: String(sections[sectionKey].text || "").trim() } : {
        answers: Object.fromEntries(Object.entries(sections[sectionKey].answers || {})
          .filter(([number]) => /^\d+$/.test(number) && (normalizeAssignmentKey(draft.assignmentKey) === "A1-8" && sectionKey === "teil-2" ? Number(number) >= 6 && Number(number) <= 8 : Number(number) >= 1 && Number(number) <= questionCount))),
      };
    }
  });
  // A1-7's new five-sign reading does not replace the five-question
  // listening recording. Preserve only listening from the prior V2 workbook.
  if (normalizeAssignmentKey(draft.assignmentKey) === "A1-7") {
    const compatibleListening = ["thomas-time-and-new-listening-5-each-v2", config.revision].includes(draft.readingRevision);
    if (!compatibleListening) delete sections["teil-2"];
    else if (sections["teil-2"]) {
      sections["teil-2"] = {
        answers: Object.fromEntries(Object.entries(sections["teil-2"].answers || {})
          .filter(([number]) => /^\d+$/.test(number) && Number(number) >= 1 && Number(number) <= 5)),
      };
    }
  }
  return { ...draft, ...readingRevision(draft.assignmentKey), sections };
};

export const buildA1WorkbookDraftStorageKey = (assignmentKey = "") =>
  `${STORAGE_PREFIX}:${normalizeAssignmentKey(assignmentKey) || "UNKNOWN"}`;

export const makeEmptyA1WorkbookDraft = (assignmentKey = "") => ({
  version: 1,
  assignmentKey: normalizeAssignmentKey(assignmentKey),
  ...readingRevision(assignmentKey),
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
    return sanitizeA1WorkbookDraft({
      ...empty,
      ...parsed,
      assignmentKey: empty.assignmentKey,
      ...(READING_REVISIONS[empty.assignmentKey] ? { readingRevision: parsed.readingRevision } : {}),
      sections: parsed.sections && typeof parsed.sections === "object" ? parsed.sections : {},
    });
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
  const next = sanitizeA1WorkbookDraft({
    version: 1,
    assignmentKey: normalizeAssignmentKey(assignmentKey),
    ...readingRevision(assignmentKey),
    sections: sections && typeof sections === "object" ? sections : {},
    updatedAt: new Date().toISOString(),
  });

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
  const currentDraft = sanitizeA1WorkbookDraft({ ...draft, assignmentKey: assignment.assignmentKey || assignment.assignmentId || assignment.id || draft.assignmentKey });

  return (assignment.sections || [])
    .map(({ key, number }) => {
      const section = currentDraft.sections?.[key] || {};
      const answerLines = sortedAnswerEntries(section.answers).map(
        ([answerNumber, value]) => `${answerNumber}. ${value}`,
      );
      const isRecordedFamily = String(assignment.assignmentKey || "").toUpperCase() === "A1-3" && key === "teil-2";
      const body = isRecordedFamily
        ? String(section.recording?.transcript || "").trim()
        : section.text ? String(section.text).trim() : answerLines.join("\n");
      if (!body) return "";
      const normalizedAssignment = String(assignment.assignmentKey || "").toUpperCase();
      const exerciseVersion = normalizedAssignment === "A1-12.1" && key === "teil-1"
        ? "A1-12.1-BAHNHOF-HOEREN-V3\n"
        : normalizedAssignment === "A1-4" && key === "teil-3"
        ? "A1-4-LISTENING-V2\n"
        : normalizedAssignment === "A1-6" && key === "teil-1"
          ? "A1-6-WORKBOOK-V2\n"
          : normalizedAssignment === "A1-7" && key === "teil-1"
            ? "A1-7-READING-V2\n"
            : "";
      return `TEIL ${number}\n${exerciseVersion}${body}`;
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

