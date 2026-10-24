import fs from "fs";
import path from "path";

const readComponent = (name) =>
  fs.readFileSync(path.resolve(__dirname, `../components/${name}`), "utf8");

const generalHome = readComponent("GeneralHome.js");
const homeMetrics = readComponent("HomeMetrics.js");
const courseTab = readComponent("CourseTab.js");

describe("Home and Course Book responsibility split", () => {
  it("keeps the homepage focused on useful cards without a redundant course access guide", () => {
    expect(generalHome).not.toContain('data-home-course-access-guide="open"');
    expect(generalHome).not.toContain("Course access and navigation");
    expect(generalHome).not.toContain("<NavigationGuide />");
    expect(generalHome).not.toContain("CompactCourseGuide");
    expect(generalHome).toContain("<QuickMainAccess");
    expect(generalHome).toContain("<HomeMetrics");
    expect(generalHome).toContain("<ClassCalendarCard");
    expect(generalHome).toContain("<FirstLessonGuide");
  });

  it("does not restore the removed course guide actions on Home", () => {
    expect(generalHome).not.toContain("Open Day 0 Orientation");
    expect(generalHome).not.toContain("Continue Course Book");
  });

  it("keeps canonical course progress out of Home metrics", () => {
    expect(homeMetrics).not.toContain("CourseCompletionProgressCard");
    expect(homeMetrics).not.toContain("useCourseCompletionProgress");
    expect(homeMetrics).not.toContain("progress: courseCompletion");
  });

  it("keeps canonical course progress in Course Book", () => {
    expect(courseTab).toContain("buildCourseCompletionProgress");
    expect(courseTab).toMatch(/courseCompletion(?:\?\.|\.)completionPercent/);
    expect(courseTab).toMatch(/courseCompletion(?:\?\.|\.)total/);
    expect(courseTab).toMatch(/courseCompletion(?:\?\.|\.)completed/);
  });
});
