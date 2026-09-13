import fs from "fs";
import path from "path";

const readComponent = (name) =>
  fs.readFileSync(path.resolve(__dirname, `../components/${name}`), "utf8");

const b2Day0 = readComponent("B2Day0SelfLearningOrientationWorkbookPage.js");
const resultHistory = readComponent("ResultHistory.js");

describe("B2 Day 0 orientation", () => {
  it("uses a dedicated B2 self-learning orientation instead of the shared Day 0 template", () => {
    expect(b2Day0).toContain("B2 Day 0: How to use Falowen");
    expect(b2Day0).toContain('data-b2-day0-orientation="true"');
    expect(b2Day0).not.toContain("CurrentDay0OrientationPage");
    expect(b2Day0).toContain("Course Book → Falowen Radio → Learn → Speak → Write → Finish");
    expect(b2Day0).toContain("Confidence is an honest self-assessment");
    expect(b2Day0).toContain("70% or higher");
    expect(b2Day0).not.toMatch(/["']\/campus\/submit/);
  });
});

describe("Results correction recovery", () => {
  it("routes failed work back to the exact lesson and preserves the existing resubmission workflow", () => {
    expect(resultHistory).toContain("getImproveLessonDestination");
    expect(resultHistory).toContain("getCanonicalCourseRequirements");
    expect(resultHistory).toContain("resolveAssignmentCanonicalKey");
    expect(resultHistory).toContain('data-result-recovery="true"');
    expect(resultHistory).toContain('data-improve-this-lesson="true"');
    expect(resultHistory).toContain("Improve this lesson");
    expect(resultHistory).toContain("Your previous submission stays in Falowen");
    expect(resultHistory).toContain("recoveryFromResults: true");
    expect(resultHistory).not.toContain("Improve and resubmit");
    expect(resultHistory).not.toContain("/campus/course?submitWork=1");
  });
});
