import {
  A1_LETTER_ASSIGNMENT_MINIMUM_WORDS,
  A1_STANDARD_ASSIGNMENT_MINIMUM_WORDS,
  buildAssignmentSubmissionWordError,
  buildAssignmentSubmissionWordProgressText,
  getAssignmentSubmissionWordMinimum,
} from "./assignmentSubmissionWordMinimum";

describe("assignment submission word minimum", () => {
  test("does not require filler words for genuinely objective A1 assignments", () => {
    ["0.1", "0.2", "5", "7", "8", "12.1", "12.2"].forEach((chapter) => {
      expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter })).toBe(0);
    });
  });

  test("uses a 10-word minimum for standard A1 writing assignments", () => {
    ["1.1", "1.2", "2", "3", "4", "6", "9", "10", "11"].forEach((chapter) => {
      expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter })).toBe(10);
    });
  });

  test("uses the A1 10-word fallback for uncategorized A1 submit tasks", () => {
    expect(A1_STANDARD_ASSIGNMENT_MINIMUM_WORDS).toBe(10);
    expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter: "unknown" })).toBe(10);
  });

  test("requires 50 words for the A1 letter-writing assignments", () => {
    expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter: "12.3" })).toBe(50);
    expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter: "13" })).toBe(50);
    expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter: "14.1" })).toBe(50);
    expect(getAssignmentSubmissionWordMinimum({ level: "A2", chapter: "12.3" })).toBe(20);
    expect(getAssignmentSubmissionWordMinimum({ level: "A2", chapter: "13" })).toBe(20);
  });

  test("keeps the default 20-word minimum for higher levels", () => {
    expect(getAssignmentSubmissionWordMinimum({ level: "A2", chapter: "3" })).toBe(20);
    expect(getAssignmentSubmissionWordMinimum({ level: "B1", chapter: "3" })).toBe(20);
  });

  test("shows live missing-word and ready feedback", () => {
    expect(buildAssignmentSubmissionWordProgressText({ wordCount: 7, minimumWords: 10 }))
      .toBe("7 / 10 words · Add 3 more words.");
    expect(buildAssignmentSubmissionWordProgressText({ wordCount: 10, minimumWords: 10 }))
      .toBe("10 / 10 words · Ready to submit.");
    expect(buildAssignmentSubmissionWordProgressText({ wordCount: 5, minimumWords: 0 })).toBe("");
  });

  test("explains exactly why a normal writing task cannot submit yet", () => {
    expect(buildAssignmentSubmissionWordError({
      level: "A1",
      chapter: "3",
      wordCount: 7,
      minimumWords: 10,
    })).toBe("Cannot submit yet. Your answer has 7 words. This task needs at least 10 words. Add 3 more words, then press Submit assignment again.");
  });

  test("keeps the higher-level 20-word shortfall explicit", () => {
    expect(buildAssignmentSubmissionWordError({
      level: "A2",
      chapter: "3",
      wordCount: 14,
      minimumWords: 20,
    })).toBe("Cannot submit yet. Your answer has 14 words. This task needs at least 20 words. Add 6 more words, then press Submit assignment again.");
  });

  test("explains that both 12.3 letters are required", () => {
    expect(buildAssignmentSubmissionWordError({
      level: "A1",
      chapter: "12.3",
      wordCount: 42,
      minimumWords: A1_LETTER_ASSIGNMENT_MINIMUM_WORDS,
    })).toBe("Cannot submit yet. Your answer has 42 words. This task needs at least 50 words for both letters. Add 8 more words, then press Submit assignment again.");
  });

  test.each(["13", "14.1"])("explains the letter and answers required for A1 %s", (chapter) => {
    expect(buildAssignmentSubmissionWordError({
      level: "A1",
      chapter,
      wordCount: 35,
      minimumWords: A1_LETTER_ASSIGNMENT_MINIMUM_WORDS,
    })).toBe(`Cannot submit yet. Your answer has 35 words. This task needs at least 50 words for the letter-writing task and answers. Add 15 more words, then press Submit assignment again.`);
  });
});
