import {
  SWAHILI_DAY_EIGHT_ASSIGNMENT_VERSION,
  isCurrentSwahiliDayEightSubmission,
  isLegacySwahiliDayEightSubmission,
  isRecognizableSwahiliDayEightNewDraft,
  swahiliDayEightDraftVersion,
} from "./swahiliDayEightVersion";

const fullListening = {
  "listen-age-b": "Miaka ishirini na tano",
  "listen-sibling-age": "Miaka kumi na minne",
  "listen-children": "Watoto wawili",
  "listen-first-child": "Miaka mitatu",
  "listen-second-child": "Mwaka mmoja",
};

test("old Day 8 classroom-number answers are legacy, even though read-1 to read-3 overlap", () => {
  expect(isLegacySwahiliDayEightSubmission(8, {})).toBe(true);
  expect(isLegacySwahiliDayEightSubmission(8, {
    readingAnswers: { "read-1": "Darasa namba ishirini na moja", "read-2": "0725" },
    writing: { response: "Darasa letu ni namba ishirini na moja." },
  })).toBe(true);
  expect(isLegacySwahiliDayEightSubmission(8, { assignmentVersion: 1 })).toBe(true);
  expect(isLegacySwahiliDayEightSubmission(9, {})).toBe(false);
});

test("Day 8 v2 documents with an explicit version restore as the new assignment", () => {
  expect(SWAHILI_DAY_EIGHT_ASSIGNMENT_VERSION).toBe(2);
  expect(isCurrentSwahiliDayEightSubmission({ assignmentVersion: 2 })).toBe(true);
  expect(isLegacySwahiliDayEightSubmission(8, { assignmentVersion: 2 })).toBe(false);
  expect(swahiliDayEightDraftVersion(8)).toBe(2);
  expect(swahiliDayEightDraftVersion(4)).toBeNull();
});

test("recognize unversioned Day 8 family-and-age submissions created before versioning", () => {
  const replacement = {
    readingAnswers: { "read-1": "Miaka ishirini na miwili", "read-4": "Miaka minne", "read-5": "Watu watano" },
    listeningAnswers: fullListening,
  };
  expect(isCurrentSwahiliDayEightSubmission(replacement)).toBe(true);
  expect(isLegacySwahiliDayEightSubmission(8, replacement)).toBe(false);
  expect(isCurrentSwahiliDayEightSubmission({
    readingAnswers: { "read-1": "Miaka ishirini na miwili", "read-4": "Miaka minne" },
    listeningAnswers: { "listen-age-b": "Miaka ishirini na tano" },
  })).toBe(false);
});

test("only identifiable new-task drafts can migrate from the old unversioned key", () => {
  expect(isRecognizableSwahiliDayEightNewDraft({ writing: "0725", reading: { "read-1": "21" } })).toBe(false);
  expect(isRecognizableSwahiliDayEightNewDraft({ reading: { "read-4": "Miaka minne" } })).toBe(true);
  expect(isRecognizableSwahiliDayEightNewDraft({ listeningAnswers: { "listen-age-b": "Miaka ishirini na tano" } })).toBe(true);
  expect(isRecognizableSwahiliDayEightNewDraft({})).toBe(false);
});
