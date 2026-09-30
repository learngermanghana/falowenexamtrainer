import fs from "fs";

describe("lesson profile timer integration", () => {
  test("A2 and B1 workbook shells pass canonical timer rules to SharedTimedAssignment", () => {
    const a2 = fs.readFileSync("src/components/A2StandardTabbedWorkbookPage.js", "utf8");
    const b1 = fs.readFileSync("src/components/B1StandardWorkbookPage.js", "utf8");
    const timed = fs.readFileSync("src/components/SharedTimedAssignment.jsx", "utf8");

    expect(a2).toMatch(/configOverride=\{lessonProfile\?\.timer \|\| null\}/);
    expect(a2).toMatch(/lessonProfile\?\.assignmentKey/);
    expect(b1).toMatch(/configOverride=\{lessonProfile\?\.timer \|\| null\}/);
    expect(b1).toMatch(/resolvedAssignmentKey = lessonProfile\?\.assignmentKey/);
    expect(timed).toMatch(/configOverride = null/);
    expect(timed).toMatch(/configOverride \|\| getTimedAssignmentConfig/);
  });
});
