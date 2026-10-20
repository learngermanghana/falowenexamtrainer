import fs from "fs";
import path from "path";

describe("SharedTimedAssignment marked result review unlock", () => {
  test("uses live lesson progress to reopen passed timed work for review", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "SharedTimedAssignment.jsx"),
      "utf8",
    );

    expect(source).toContain("useLessonProgress");
    expect(source).toContain("isTimedAssignmentReviewUnlocked");
    expect(source).toContain("data-timed-review-unlocked");
    expect(source).toContain("Passed · review unlocked");
    expect(source).toContain("reopen the timed sections to cross-check your work");
    expect(source).toContain("marked attempts reopen for review.");
  });

  test("explains failed review access while keeping pending attempts locked", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "SharedTimedAssignment.jsx"),
      "utf8",
    );

    expect(source).toContain("Needs improvement · review unlocked");
    expect(source).toContain("a teacher must authorize another attempt");
    expect(source).toContain("timed sections stay locked while the result is pending");
  });
});
