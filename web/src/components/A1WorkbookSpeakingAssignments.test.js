import { A1_WORKBOOK_SPEAKING } from "./A1WorkbookSpeakingCheckpoint";
import { getA1Assignment } from "../data/a1AssignmentRegistry";
import {
  getA1TutorDraftProfile, getA1TutorDraftSectionProgress,
  validateA1TutorDraftSubmissionSections,
} from "../data/a1TutorDraftProfiles";
import { buildA1WorkbookSubmissionText, readA1WorkbookDraft, saveA1WorkbookDraft } from "../utils/a1WorkbookDraft";

beforeEach(() => window.localStorage.clear());

const cases = [
  ["A1-4", "teil-2", 1, 3],
  ["A1-8", "teil-2", 2, 2],
  ["A1-11", "teil-1", 3, 2],
];

test.each(cases)("%s replaces its old Teil with Goethe speaking without adding sections", (assignmentKey, sectionKey, part, count) => {
  const assignment = getA1Assignment(assignmentKey);
  expect(assignment.sections).toHaveLength(count);
  expect(assignment.sections.find((entry) => entry.key === sectionKey).label).toMatch(/Sprechen/);
  expect(getA1TutorDraftProfile(assignmentKey).sections[sectionKey].speaking).toBe(true);
  expect(A1_WORKBOOK_SPEAKING[assignmentKey]).toMatchObject({ sectionKey, part });
});

test.each(cases)("%s refuses old choice drafts and saves score, not audio", (assignmentKey, sectionKey) => {
  const assignment = getA1Assignment(assignmentKey);
  saveA1WorkbookDraft({ assignmentKey, sections: { [sectionKey]: { answers: { 1: "A", 2: "B" } } } });
  let draft = readA1WorkbookDraft(assignmentKey);
  expect(getA1TutorDraftSectionProgress({ assignmentKey, sectionKey, draft }).complete).toBe(false);

  saveA1WorkbookDraft({
    assignmentKey,
    sections: { [sectionKey]: { text: "SPEAKING_SCORE: 8/10\nSTRENGTH: Clear question.\nIMPROVE: Verb position." } },
  });
  draft = readA1WorkbookDraft(assignmentKey);
  expect(draft.sections[sectionKey]).toEqual({ text: expect.stringContaining("SPEAKING_SCORE: 8/10") });
  const submission = buildA1WorkbookSubmissionText({ assignment, draft });
  expect(submission).toContain("SPEAKING_SCORE: 8/10");
  expect(submission).not.toMatch(/audioUrl|transcript|\.webm/);
  expect(getA1TutorDraftSectionProgress({ assignmentKey, sectionKey, draft }).complete).toBe(true);
});

test("missing speaking score blocks canonical workbook submission", () => {
  const assignment = getA1Assignment("A1-8");
  const missing = new Map([["teil-1", Array.from({length: 5}, (_, i) => (i+1) + ". A")]]);
  expect(validateA1TutorDraftSubmissionSections({ assignmentKey: "A1-8", sections: missing }).ok).toBe(false);
  missing.set("teil-2", ["SPEAKING_SCORE: 8/10", "STRENGTH: Good", "IMPROVE: More verbs"]);
  expect(validateA1TutorDraftSubmissionSections({ assignmentKey: "A1-8", sections: missing }).ok).toBe(true);
});
