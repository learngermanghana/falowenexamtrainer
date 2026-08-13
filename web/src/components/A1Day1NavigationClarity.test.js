import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A1 Day 1 navigation clarity", () => {
  test("removes the duplicate outer Assignment and Submit navigation for A1", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "../utils/courseWorkbookSubmission.js"), "utf8");
    expect(source).toContain('if (normalizedLevel === "A1") return []');
  });

  test("makes the learning path explicit", () => {
    const guidance = read("A1TutorMarkedOverviewGuidance.jsx");
    const shell = read("A1TutorMarkedWorkbookShell.js");
    expect(guidance).toContain("<strong>Grammar</strong>");
    expect(guidance).toContain("<strong>Teil 1</strong>");
    expect(guidance).toContain("<strong>Submit</strong>");
    expect(shell).toContain("Grammar only.");
    expect(shell).toContain("Your final answers are sent from the <strong>Submit</strong> tab");
    expect(shell).toContain('assignment.assignmentKey === "A1-0.1"');
  });
});
