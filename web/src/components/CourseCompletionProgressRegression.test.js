import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("canonical course completion wiring", () => {
  test("Home uses the shared completion hook and card", () => {
    const home = read("HomeMetrics.js");
    expect(home).toContain('import CourseCompletionProgressCard from "./CourseCompletionProgressCard";');
    expect(home).toContain('import useCourseCompletionProgress from "../hooks/useCourseCompletionProgress";');
    expect(home).toContain("<CourseCompletionProgressCard");
    expect(home).toContain("Boolean(courseCompletion?.courseWorkCompleted)");
  });

  test("Course Book progress is canonical rather than page-count based", () => {
    const courseTab = read("CourseTab.js");
    expect(courseTab).toContain("buildCourseCompletionProgress({");
    expect(courseTab).toContain("findCourseBookEntryForRequirement");
    expect(courseTab).toContain("courseCompletion.completed");
    expect(courseTab).toContain("courseCompletion.masteryAvailable");
    expect(courseTab).toContain("Complete inside lesson");
    expect(courseTab).not.toContain(
      "const completedCount = courseLessons.filter((entry) => isCourseBookEntryComplete(entry, practiceProgress)).length;",
    );
  });

  test("B2/C1 guided writing publishes a real Write-complete signal", () => {
    const writing = read("GuidedWritingWorkspace.js");
    expect(writing).toContain("getSelfLearningProgressStorageKey");
    expect(writing).toContain("writeDone: true");
    expect(writing).toContain('section: "write"');
  });

  test("normal web lifecycle applies completion normalization", () => {
    const packageJson = JSON.parse(read("../../package.json"));
    for (const hook of ["prestart", "prebuild", "pretest", "pretest:ci"]) {
      expect(packageJson.scripts[hook]).toContain("sync:course-completion-progress");
    }
  });
});