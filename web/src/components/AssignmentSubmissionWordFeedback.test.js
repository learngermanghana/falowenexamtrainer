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
});
