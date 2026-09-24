import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("canonical course completion wiring", () => {
  test("Home does not duplicate Course Book completion progress", () => {
    const home = read("HomeMetrics.js");
    const generalHome = read("GeneralHome.js");

    expect(home).not.toContain('import CourseCompletionProgressCard from "./CourseCompletionProgressCard";');
    expect(home).not.toContain('import useCourseCompletionProgress from "../hooks/useCourseCompletionProgress";');
    expect(home).not.toContain("<CourseCompletionProgressCard");
    expect(generalHome).toContain('data-home-course-access-guide="open"');
    expect(generalHome).toContain("Course access and navigation");
  });

  test("Course Book keeps canonical A1-C1 completion and separate C2 cloud progress", () => {
    const courseTab = read("CourseTab.js");

    expect(courseTab).toContain("buildCourseCompletionProgress({");
    expect(courseTab).toContain("findCourseBookEntryForRequirement");
    expect(courseTab).toContain("courseCompletion?.completed");
    expect(courseTab).toContain("courseCompletion.masteryAvailable");
    expect(courseTab).toContain("Complete inside lesson");

    expect(courseTab).toContain('source: "c2-cloud-progress"');
    expect(courseTab).toContain("effectivePracticeProgress");
    expect(courseTab).toContain("isC2CourseBook");
    expect(courseTab).toContain("c2SkillSummary");

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
