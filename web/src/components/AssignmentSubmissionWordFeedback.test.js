import fs from "node:fs";
import path from "node:path";
import {
  buildAssignmentSubmissionWordProgressText,
  getAssignmentSubmissionWordMinimum,
} from "../utils/assignmentSubmissionWordMinimum";

describe("AssignmentSubmissionPage word feedback", () => {
  const source = fs.readFileSync(
    path.resolve(process.cwd(), "src/components/AssignmentSubmissionPage.js"),
    "utf8",
  );

  test("does not impose a word target on the Day 1 objective assignment", () => {
    expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter: "0.1" })).toBe(0);
  });

  test("uses the reduced 10-word target for earlier A1 chapters with writing tasks", () => {
    ["3", "4", "9", "11"].forEach((chapter) => {
      expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter })).toBe(10);
    });
  });

  test("keeps live A1 writing feedback concise and actionable", () => {
    expect(buildAssignmentSubmissionWordProgressText({ wordCount: 7, minimumWords: 10 }))
      .toBe("7 / 10 words · Add 3 more words.");
    expect(buildAssignmentSubmissionWordProgressText({ wordCount: 12, minimumWords: 10 }))
      .toBe("12 / 10 words · Ready to submit.");
  });

  test("lets the React form own validation instead of the floating global guard", () => {
    expect(source).toContain('data-submission-word-feedback="inline"');
    expect(source).toContain('data-submission-word-error="true"');
    expect(source).toContain("minimumSubmissionWords > 0 && submissionWordCount < minimumSubmissionWords");
    expect(source).toContain('textarea?.scrollIntoView?.({ behavior: "smooth", block: "center" });');
  });

  test("runs exact word feedback before the generic 20-character guard", () => {
    const wordValidationIndex = source.indexOf(
      "minimumSubmissionWords > 0 && submissionWordCount < minimumSubmissionWords",
    );
    const characterGuardIndex = source.indexOf(
      "submissionAnswerText.length < MIN_SUBMISSION_CHARACTERS",
    );

    expect(wordValidationIndex).toBeGreaterThanOrEqual(0);
    expect(characterGuardIndex).toBeGreaterThanOrEqual(0);
    expect(wordValidationIndex).toBeLessThan(characterGuardIndex);
  });
});
