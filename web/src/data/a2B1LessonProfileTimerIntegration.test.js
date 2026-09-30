import fs from "fs";

describe("lesson profile timer integration", () => {
  test("A2 and B1 workbook shells use canonical assignment identity and the shared timer resolver", () => {
    const a2 = fs.readFileSync("src/components/A2StandardTabbedWorkbookPage.js", "utf8");
    const b1 = fs.readFileSync("src/components/B1StandardWorkbookPage.js", "utf8");
    const timed = fs.readFileSync("src/components/SharedTimedAssignment.jsx", "utf8");
    const profile = fs.readFileSync("src/data/a2B1LessonProfile.js", "utf8");
    const timedConfig = fs.readFileSync("src/data/timedAssignmentConfig.js", "utf8");

    expect(a2).toMatch(/lessonProfile\?\.assignmentKey/);
    expect(a2).not.toMatch(/configOverride=\{lessonProfile\?\.timer/);
    expect(b1).toMatch(/resolvedAssignmentKey = lessonProfile\?\.assignmentKey/);
    expect(b1).not.toMatch(/configOverride=\{lessonProfile\?\.timer/);

    expect(timed).toMatch(/const config = getTimedAssignmentConfig\(assignmentKey\)/);
    expect(timed).not.toMatch(/configOverride/);

    expect(profile).not.toMatch(/from "\.\/timedAssignmentConfig"/);
    expect(profile).not.toMatch(/timer,/);
    expect(timedConfig).toMatch(/from "\.\/a2B1LessonProfile"/);
    expect(timedConfig).toMatch(/alignTimedConfigWithLessonProfile/);
  });
});
