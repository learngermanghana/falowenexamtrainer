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

  test("retains word targets for earlier A1 chapters with real writing tasks", () => {
    ["3", "4", "9", "11"].forEach((chapter) => {
      expect(getAssignmentSubmissionWordMinimum({ level: "A1", chapter })).toBe(20);
    });
  });

  test("keeps live writing feedback concise and actionable", () => {
    expect(buildAssignmentSubmissionWordProgressText({ wordCount: 15, minimumWords: 20 }))
      .toBe("15 / 20 words · Add 5 more words.");
    expect(buildAssignmentSubmissionWordProgressText({ wordCount: 22, minimumWords: 20 }))
      .toBe("22 / 20 words · Ready to submit.");
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
      "form.submissionText.trim().length < MIN_SUBMISSION_CHARACTERS",
    );

    expect(wordValidationIndex).toBeGreaterThanOrEqual(0);
    expect(characterGuardIndex).toBeGreaterThanOrEqual(0);
    expect(wordValidationIndex).toBeLessThan(characterGuardIndex);
  });
});
