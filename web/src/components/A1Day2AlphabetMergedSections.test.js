import fs from "fs";
import path from "path";
import { A1_ASSIGNMENT_REGISTRY } from "../data/a1AssignmentRegistry";

describe("A1 Day 2 alphabet merged sections", () => {
  test("shows only Teil 1 and Teil 3 after the questions were merged into Teil 1", () => {
    const assignment = A1_ASSIGNMENT_REGISTRY["A1-0.2"];
    expect(assignment.sections.map(({ key }) => key)).toEqual(["teil-1", "teil-3"]);
    expect(assignment.sections.map(({ label }) => label)).toEqual([
      "Teil 1 · Reading and Questions",
      "Teil 3 · Hören",
    ]);

    const source = fs.readFileSync(
      path.join(__dirname, "A1Day3GermanAlphabetReviewingWorkbookPage.js"),
      "utf8",
    );
    expect(source).toContain("Complete Teil 1 and Teil 3");
    expect(source).toContain("The reading text and its questions are combined in Teil 1.");
    expect(source).not.toContain("Teil 1 + Teil 2");
  });
});
