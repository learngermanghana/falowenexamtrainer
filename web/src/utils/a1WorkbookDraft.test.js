import { getA1Assignment } from "../data/a1AssignmentRegistry";
import {
  A1_WORKBOOK_DRAFT_UPDATED_EVENT,
  buildA1WorkbookDraftStorageKey,
  buildA1WorkbookSubmissionText,
  countCompletedA1Answers,
  readA1WorkbookDraft,
  saveA1WorkbookDraft,
} from "./a1WorkbookDraft";

beforeEach(() => {
  window.localStorage.clear();
});

test("stores A1 drafts by canonical assignment key instead of day", () => {
  expect(buildA1WorkbookDraftStorageKey("A1-3")).not.toBe(buildA1WorkbookDraftStorageKey("A1-4"));
});


test("announces same-page A1 draft updates so Review & Submit can refresh immediately", async () => {
  const listener = jest.fn();
  window.addEventListener(A1_WORKBOOK_DRAFT_UPDATED_EVENT, listener);

  const saved = saveA1WorkbookDraft({
    assignmentKey: "A1-3",
    sections: {
      "teil-1": { answers: { 1: "Es" } },
    },
  });

  await Promise.resolve();

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener.mock.calls[0][0].detail).toEqual({
    assignmentKey: "A1-3",
    draft: saved,
  });

  window.removeEventListener(A1_WORKBOOK_DRAFT_UPDATED_EVENT, listener);
});

test("maps A1 Chapter 3 workbook responses into one canonical tutor submission", () => {
  const assignment = getA1Assignment("A1-3");
  const sections = {
    "teil-1": { answers: { 1: "Es", 2: "Sie", 3: "Es", 4: "Er" } },
    "teil-2": { text: "Meine Familie ist klein. Wir wohnen in Accra." },
    "teil-3": {
      answers: {
        1: "Ja, ich spiele gern Fußball.",
        2: "Nein, ich schwimme nicht gern.",
        3: "Ja, ich lese gern.",
        4: "Nein, ich male nicht gern.",
        5: "Ja, ich höre gern Musik.",
        6: "Ja, ich koche gern.",
        7: "Ja, ich reise gern.",
        8: "Nein, ich mache nicht gern Gartenarbeit.",
        9: "Ja, ich fahre gern Rad.",
        10: "Ja, ich wandere gern.",
      },
    },
  };

  saveA1WorkbookDraft({ assignmentKey: "A1-3", sections });
  const draft = readA1WorkbookDraft("A1-3");
  const submissionText = buildA1WorkbookSubmissionText({ assignment, draft });

  expect(submissionText).toContain("TEIL 1\n1. Es\n2. Sie\n3. Es\n4. Er");
  expect(submissionText).toContain("TEIL 2\nMeine Familie ist klein. Wir wohnen in Accra.");
  expect(submissionText).toContain("TEIL 3\n1. Ja, ich spiele gern Fußball.");
  expect(submissionText).toContain("10. Ja, ich wandere gern.");
});

test("counts only non-empty required answers", () => {
  expect(countCompletedA1Answers({ 1: "Es", 2: "", 3: "  ", 4: "Er" }, 4)).toEqual({
    completed: 2,
    total: 4,
    complete: false,
  });
});


test("replaces legacy A1-7 Lesen and Hören drafts after both tasks changed", () => {
  const legacy = {
    assignmentKey: "A1-7",
    readingRevision: "maria-time-7-v1",
    sections: {
      "teil-1": { answers: Object.fromEntries(Array.from({ length: 10 }, (_, i) => [i + 1, "B"])) },
      "teil-2": { answers: { 1: "B", 10: "B" } },
    },
  };
  window.localStorage.setItem(buildA1WorkbookDraftStorageKey("A1-7"), JSON.stringify(legacy));
  const draft = readA1WorkbookDraft("A1-7");
  expect(draft.sections["teil-1"]).toBeUndefined();
  expect(draft.sections["teil-2"]).toBeUndefined();
  expect(draft.readingRevision).toBe("thomas-time-and-new-listening-5-each-v2");
  const submission = buildA1WorkbookSubmissionText({ assignment: getA1Assignment("A1-7"), draft: legacy });
  expect(submission).not.toContain("TEIL 1");
  expect(submission).not.toContain("TEIL 2");
});

test("retains new A1-7 answers and drops obsolete numbers in both replaced sections", () => {
  saveA1WorkbookDraft({ assignmentKey: "A1-7", sections: {
    "teil-1": { answers: { 1: "B", 5: "B", 6: "OLD", 7: "OLD" } },
    "teil-2": { answers: { 1: "A", 5: "A", 6: "OLD", 10: "OLD" } },
  } });
  const draft = readA1WorkbookDraft("A1-7");
  expect(draft.sections["teil-1"].answers).toEqual({ 1: "B", 5: "B" });
  expect(draft.sections["teil-2"].answers).toEqual({ 1: "A", 5: "A" });
  const submission = buildA1WorkbookSubmissionText({ assignment: getA1Assignment("A1-7"), draft });
  expect(submission).toBe("TEIL 1\n1. B\n5. B\n\nTEIL 2\n1. A\n5. A");
});


test.each(["A1-13", "A1-14.1"])("new %s reading clears both former reading parts while retaining unchanged tasks", (assignmentKey) => {
  const unchangedKey = assignmentKey === "A1-13" ? "teil-4" : "teil-3";
  const legacy = {
    assignmentKey,
    sections: {
      "teil-1": { answers: { 1: "A", 6: "B" } },
      "teil-2": { text: "Former email", answers: { 1: "B" } },
      [unchangedKey]: { answers: { 1: "A", 6: "A" } },
      ...(assignmentKey === "A1-13" ? { "teil-3": { text: "Liebe Bina, ich kann leider nicht kommen." } } : {}),
    },
  };
  window.localStorage.setItem(buildA1WorkbookDraftStorageKey(assignmentKey), JSON.stringify(legacy));
  const migrated = readA1WorkbookDraft(assignmentKey);
  expect(migrated.sections["teil-1"]).toBeUndefined();
  expect(migrated.sections["teil-2"]).toBeUndefined();
  expect(migrated.sections[unchangedKey]).toEqual(legacy.sections[unchangedKey]);
  if (assignmentKey === "A1-13") expect(migrated.sections["teil-3"].text).toBe(legacy.sections["teil-3"].text);
  saveA1WorkbookDraft({ assignmentKey, sections: {
    ...migrated.sections,
    "teil-1": { answers: { 1: "B", 5: "A", 6: "OBSOLETE" } },
    "teil-2": { text: "OBSOLETE", answers: { 1: "Richtig", 5: "Falsch", 6: "OBSOLETE" } },
  } });
  const submission = buildA1WorkbookSubmissionText({ assignment: getA1Assignment(assignmentKey), draft: readA1WorkbookDraft(assignmentKey) });
  expect(submission).toContain("TEIL 1\n1. B\n5. A");
  expect(submission).toContain("TEIL 2\n1. Richtig\n5. Falsch");
  expect(submission).not.toContain("OBSOLETE");
});
