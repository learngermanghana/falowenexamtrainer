import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("B2 self-learning submission isolation", () => {
  const registry = read("SelfLearningLessonRegistry.js");
  const assignmentUtility = read("../utils/courseLessonAssignments.js");

  test("self-learning lesson frame does not append the tutor submission panel", () => {
    const frameStart = registry.indexOf("export const SelfLearningLessonFrame");
    const renderStart = registry.indexOf("const renderSelfLearningPage", frameStart);
    const frameSource = registry.slice(frameStart, renderStart);

    expect(frameStart).toBeGreaterThan(-1);
    expect(frameSource).not.toContain("AdvancedTutorMarkedSubmissionPanel");
    expect(frameSource).toContain("<>{children}</>");
  });

  test("B2 remains excluded from inline tutor submissions", () => {
    expect(assignmentUtility).toContain('const INLINE_SUBMISSION_LEVELS = new Set(["A1", "A2", "B1"])');
    expect(assignmentUtility).not.toContain('new Set(["A1", "A2", "B1", "B2"])');
  });

  test("registry no longer imports the advanced tutor panel into self-learning pages", () => {
    expect(registry).not.toContain('import AdvancedTutorMarkedSubmissionPanel from "./AdvancedTutorMarkedSubmissionPanel"');
  });
});
