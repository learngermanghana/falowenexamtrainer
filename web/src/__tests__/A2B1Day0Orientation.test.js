import fs from "fs";
import path from "path";

const readOrientation = (level) =>
  fs.readFileSync(
    path.resolve(__dirname, `../components/${level}Day0OrientationKnowledgeTestWorkbookPage.js`),
    "utf8"
  );

const a2Source = readOrientation("A2");
const b1Source = readOrientation("B1");

const expectCurrentCourseBookGuidance = (source) => {
  expect(source).toContain('title="All lessons"');
  expect(source).toContain('title="Next lesson"');
  expect(source).toContain('title="Assignments"');
  expect(source).toContain('title="Self-learning"');
  expect(source).toContain("Continue learning");
  expect(source).toContain("Falowen Radio → Continue");
  expect(source).toContain('title="Teil 1 · Sprechen"');
  expect(source).toContain('title="Teil 2 · Schreiben"');
  expect(source).toContain('title="Teil 3 · Lesen"');
  expect(source).toContain('title="Teil 4 · Hören"');
  expect(source).toContain('title="Ref"');
  expect(source).toContain('title="Submit"');
  expect(source).toContain("Assignment pass mark: 60%");
  expect(source).not.toContain("/campus/submit");
};

describe("A2 Day 0 student orientation", () => {
  it("uses a dedicated A2 orientation instead of the generic shared page", () => {
    expect(a2Source).not.toContain("CurrentDay0OrientationPage");
    expect(a2Source).toContain('data-a2-day0-orientation="true"');
    expect(a2Source).toContain("A2 Day 0: How to use Falowen");
  });

  it("explains current Course Book and workbook navigation", () => {
    expectCurrentCourseBookGuidance(a2Source);
    expect(a2Source).toContain("Prepare Teil 1 even when it is not submitted");
    expect(a2Source).toContain("A2 Day 0 orientation + A1 readiness check");
  });
});

describe("B1 Day 0 student orientation", () => {
  it("uses a dedicated B1 orientation instead of the generic shared page", () => {
    expect(b1Source).not.toContain("CurrentDay0OrientationPage");
    expect(b1Source).toContain('data-b1-day0-orientation="true"');
    expect(b1Source).toContain("B1 Day 0: How to use Falowen");
  });

  it("explains current navigation and the move from A2 to B1", () => {
    expectCurrentCourseBookGuidance(b1Source);
    expect(b1Source).toContain("What changes from A2 to B1");
    expect(b1Source).toContain("idea → reason → example → conclusion or consequence");
    expect(b1Source).toContain("B1 Day 0 orientation + A2 readiness check");
  });
});
