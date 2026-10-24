import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.resolve(process.cwd(), "src/components/AssignmentSubmissionPage.js"), "utf8");

describe("compact resubmission UI", () => {
  test("keeps only the essential failed-assignment resubmission guidance visible", () => {
    expect(source).toContain("Resubmit this assignment");
    expect(source).toContain("Review your tutor feedback, correct the work");
    expect(source).toContain("Corrected work");
    expect(source).toContain("What did you improve?");
    expect(source).toContain("Submit resubmission");
    expect(source).not.toContain("First submission is #1, followed by two resubmissions");
    expect(source).not.toContain("Resubmissions must include clear edits. For full text");
    expect(source).not.toContain("Tip: if your text is mostly the same");
  });

  test("collapses recent submissions by default", () => {
    expect(source).toContain('<details style={{ ...styles.card }}>');
    expect(source).toContain("<span>Recent submissions</span>");
  });
});
