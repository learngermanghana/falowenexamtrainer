import {
  A1_LETTER_ASSIGNMENT_MINIMUM_WORDS,
  buildAssignmentSubmissionWordError,
  getAssignmentSubmissionWordMinimum,
} from "./assignmentSubmissionWordMinimum";

describe("assignment submission word minimum", () => {
  test("requires 50 words for the A1 letter-writing assignments", () => {
    expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter: "12.3" })).toBe(50);
    expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter: "13" })).toBe(50);
    expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter: "14.1" })).toBe(50);
    expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter: "12.2" })).toBe(20);
    expect(getAssignmentSubmissionWordMinimum({ level: "A2", chapter: "12.3" })).toBe(20);
    expect(getAssignmentSubmissionWordMinimum({ level: "A2", chapter: "13" })).toBe(20);
  });

  test("explains that both 12.3 letters are required", () => {
    expect(buildAssignmentSubmissionWordError({
      level: "A1",
      chapter: "12.3",
      wordCount: 42,
      minimumWords: A1_LETTER_ASSIGNMENT_MINIMUM_WORDS,
    })).toBe("A1 12.3 requires both letters. Please submit at least 50 words in total. You currently have 42 words; add 8 more.");
  });

  test.each(["13", "14.1"])("explains the letter and answers required for A1 %s", (chapter) => {
    expect(buildAssignmentSubmissionWordError({
      level: "A1",
      chapter,
      wordCount: 35,
      minimumWords: A1_LETTER_ASSIGNMENT_MINIMUM_WORDS,
    })).toBe(`A1 ${chapter} requires the letter-writing task and answers. Please submit at least 50 words in total. You currently have 35 words; add 15 more.`);
  });
});
