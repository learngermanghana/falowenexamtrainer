import { getStructuredSubmissionProfile } from "./structuredSubmissionTemplate";
import {
  buildWorkbookDraftStorageKey,
  ensureWorkbookObjectiveSection,
  getWorkbookSubmissionReview,
  readWorkbookSubmissionDraft,
  saveWorkbookObjectiveAnswer,
  saveWorkbookSubmissionOverride,
  saveWorkbookWritingDraft,
  serializeWorkbookSubmissionDraft,
} from "./workbookSubmissionDraft";

const context = { studentScope: "student-123", level: "A2", day: 1 };

beforeEach(() => {
  window.localStorage.clear();
});

test("maps Teil 2 writing and Teil 3/4 objective answers into the canonical submission template", () => {
  saveWorkbookWritingDraft(context, "Liebe Mia, ich schreibe dir, weil ich dir von meinem Wochenende erzählen möchte.");
  ensureWorkbookObjectiveSection(context, {
    section: "teil3",
    questionNumbers: [1, 2, 3],
    includeInSubmission: true,
  });
  saveWorkbookObjectiveAnswer(context, {
    section: "teil3",
    questionNumber: 1,
    answer: "B",
    questionNumbers: [1, 2, 3],
    includeInSubmission: true,
  });
  saveWorkbookObjectiveAnswer(context, {
    section: "teil3",
    questionNumber: 2,
    answer: "C",
    questionNumbers: [1, 2, 3],
    includeInSubmission: true,
  });
  saveWorkbookObjectiveAnswer(context, {
    section: "teil3",
    questionNumber: 3,
    answer: "A",
    questionNumbers: [1, 2, 3],
    includeInSubmission: true,
  });
  saveWorkbookObjectiveAnswer(context, {
    section: "teil4",
    questionNumber: 1,
    answer: "A",
    questionNumbers: [1, 2],
    includeInSubmission: true,
  });
  saveWorkbookObjectiveAnswer(context, {
    section: "teil4",
    questionNumber: 2,
    answer: "B",
    questionNumbers: [1, 2],
    includeInSubmission: true,
  });

  const draft = readWorkbookSubmissionDraft(context);
  expect(serializeWorkbookSubmissionDraft(draft)).toBe(
    "TEIL 2\nLiebe Mia, ich schreibe dir, weil ich dir von meinem Wochenende erzählen möchte.\n\n" +
      "TEIL 3\n1. B\n2. C\n3. A\n\n" +
      "TEIL 4\n1. A\n2. B",
  );

  const review = getWorkbookSubmissionReview(draft);
  expect(review.complete).toBe(true);
  expect(review.parts.find((part) => part.partId === "teil3")).toMatchObject({
    answered: 3,
    total: 3,
    missing: [],
  });
});

test("changing a clicked answer replaces the previous answer instead of duplicating it", () => {
  saveWorkbookObjectiveAnswer(context, {
    section: "teil3",
    questionNumber: 1,
    answer: "A",
    questionNumbers: [1],
  });
  saveWorkbookObjectiveAnswer(context, {
    section: "teil3",
    questionNumber: 1,
    answer: "C",
    questionNumbers: [1],
  });

  const draft = readWorkbookSubmissionDraft(context);
  expect(draft.sections.teil3.answers).toEqual({ 1: "C" });
});

test("a manual Submit edit remains current until a newer workbook answer is saved", () => {
  saveWorkbookWritingDraft(context, "Mein erster Text");
  saveWorkbookObjectiveAnswer(context, {
    section: "teil3",
    questionNumber: 1,
    answer: "A",
    questionNumbers: [1],
  });
  const beforeOverride = readWorkbookSubmissionDraft(context);
  saveWorkbookSubmissionOverride(context, "TEIL 2\nManuell verbessert\n\nTEIL 3\n1. B\n\nTEIL 4");

  expect(serializeWorkbookSubmissionDraft(readWorkbookSubmissionDraft(context))).toContain("Manuell verbessert");

  saveWorkbookObjectiveAnswer(context, {
    section: "teil3",
    questionNumber: 1,
    answer: "C",
    questionNumbers: [1],
  });
  const remapped = serializeWorkbookSubmissionDraft(readWorkbookSubmissionDraft(context));
  expect(remapped).not.toContain("Manuell verbessert");
  expect(remapped).toContain("1. C");
  expect(readWorkbookSubmissionDraft(context).revision).toBeGreaterThan(beforeOverride.revision);
});

test("A2 self-check Teil 4 choices are saved but not added to the final structured submission", () => {
  const selfCheckContext = { studentScope: "student-123", level: "A2", day: 22 };
  saveWorkbookWritingDraft(selfCheckContext, "Das ist mein Text für Teil zwei.");
  saveWorkbookObjectiveAnswer(selfCheckContext, {
    section: "teil3",
    questionNumber: 1,
    answer: "B",
    questionNumbers: [1],
  });
  saveWorkbookObjectiveAnswer(selfCheckContext, {
    section: "teil4",
    questionNumber: 1,
    answer: "C",
    questionNumbers: [1],
    includeInSubmission: false,
  });

  const result = serializeWorkbookSubmissionDraft(readWorkbookSubmissionDraft(selfCheckContext));
  expect(result).toContain("TEIL 2");
  expect(result).toContain("TEIL 3\n1. B");
  expect(result).not.toContain("TEIL 4");
});

test("B1 Day 21 does not require the nonexistent Teil 4", () => {
  const profile = getStructuredSubmissionProfile({ level: "B1", day: 21 });
  expect(profile.parts.map((part) => part.partId)).toEqual(["teil2", "teil3"]);
});

test("student/day scope keeps drafts isolated", () => {
  const firstKey = buildWorkbookDraftStorageKey(context);
  const secondKey = buildWorkbookDraftStorageKey({ ...context, day: 2 });
  const otherStudentKey = buildWorkbookDraftStorageKey({ ...context, studentScope: "student-456" });
  expect(firstKey).not.toBe(secondKey);
  expect(firstKey).not.toBe(otherStudentKey);
});
