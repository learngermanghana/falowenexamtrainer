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
