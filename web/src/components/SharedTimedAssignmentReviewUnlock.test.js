import fs from "fs";
import path from "path";

describe("SharedTimedAssignment passed review unlock", () => {
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
    expect(source).toContain("They reopen automatically after you pass.");
  });

  test("keeps failed and pending timed work locked", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "SharedTimedAssignment.jsx"),
      "utf8",
    );

    expect(source).toContain("This timed assignment has not passed.");
    expect(source).toContain("timed sections stay locked until another attempt is reset and started");
    expect(source).toContain("timed sections stay locked while the result is pending");
  });
});
