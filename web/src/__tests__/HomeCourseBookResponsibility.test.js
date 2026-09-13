import fs from "fs";
import path from "path";

const readComponent = (name) =>
  fs.readFileSync(path.resolve(__dirname, `../components/${name}`), "utf8");

const generalHome = readComponent("GeneralHome.js");
const homeMetrics = readComponent("HomeMetrics.js");
const courseTab = readComponent("CourseTab.js");

describe("Home and Course Book responsibility split", () => {
  it("keeps Home course access and navigation help permanently visible", () => {
    expect(generalHome).toContain('data-home-course-access-guide="open"');
    expect(generalHome).toContain("Course access and navigation");
    expect(generalHome).toContain("<NavigationGuide />");
    expect(generalHome).not.toContain("Expand course guide, access and navigation help");
  });

  it("does not duplicate learning actions inside the Home navigation guide", () => {
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
    expect(courseTab).toContain("courseCompletion.completionPercent");
    expect(courseTab).toContain("courseCompletion.total");
    expect(courseTab).toContain("Required work");
  });
});
