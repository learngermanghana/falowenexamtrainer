import {
  A1_LETTER_ASSIGNMENT_MINIMUM_WORDS,
  buildAssignmentSubmissionWordError,
  buildAssignmentSubmissionWordProgressText,
  getAssignmentSubmissionWordMinimum,
} from "./assignmentSubmissionWordMinimum";

describe("assignment submission word minimum", () => {
  test("does not require filler words for A1 objective assignments", () => {
    ["0.1", "0.2", "1.1", "1.2", "12.2"].forEach((chapter) => {
      expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter })).toBe(0);
    });
  });

  test("requires 50 words for the A1 letter-writing assignments", () => {
    expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter: "12.3" })).toBe(50);
    expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter: "13" })).toBe(50);
    expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter: "14.1" })).toBe(50);
    expect(getAssignmentSubmissionWordMinimum({ level: "A2", chapter: "12.3" })).toBe(20);
    expect(getAssignmentSubmissionWordMinimum({ level: "A2", chapter: "13" })).toBe(20);
    expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter: "unknown" })).toBe(20);
  });

  test("shows live missing-word and ready feedback", () => {
    expect(buildAssignmentSubmissionWordProgressText({ wordCount: 15, minimumWords: 20 }))
      .toBe("15 / 20 words · Add 5 more words.");
    expect(buildAssignmentSubmissionWordProgressText({ wordCount: 20, minimumWords: 20 }))
      .toBe("20 / 20 words · Ready to submit.");
    expect(buildAssignmentSubmissionWordProgressText({ wordCount: 5, minimumWords: 0 })).toBe("");
  });

  test("explains exactly how many words are missing for a normal writing task", () => {
    expect(buildAssignmentSubmissionWordError({
      level: "A2",
      chapter: "13",
      wordCount: 15,
      minimumWords: 20,
    })).toBe("Your answer has 15 words. You need at least 20 words. Add 5 more words before submitting.");
  });

  test("explains that both 12.3 letters are required", () => {
    expect(buildAssignmentSubmissionWordError({
      level: "A1",
      chapter: "12.3",
      wordCount: 42,
      minimumWords: A1_LETTER_ASSIGNMENT_MINIMUM_WORDS,
    })).toBe("Your answer has 42 words. You need at least 50 words for both letters. Add 8 more words before submitting.");
  });

  test.each(["13", "14.1"])("explains the letter and answers required for A1 %s", (chapter) => {
    expect(buildAssignmentSubmissionWordError({
      level: "A1",
      chapter,
      wordCount: 35,
      minimumWords: A1_LETTER_ASSIGNMENT_MINIMUM_WORDS,
    })).toBe(`Your answer has 35 words. You need at least 50 words for the letter-writing task and answers. Add 15 more words before submitting.`);
  });
});
