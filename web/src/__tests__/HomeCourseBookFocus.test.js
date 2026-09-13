import fs from "fs";
import path from "path";

const readComponent = (name) =>
  fs.readFileSync(path.resolve(__dirname, `../components/${name}`), "utf8");

const generalHome = readComponent("GeneralHome.js");
const homeMetrics = readComponent("HomeMetrics.js");
const courseTab = readComponent("CourseTab.js");

describe("Home and Course Book responsibility split", () => {
  it("keeps course access and navigation visible without a collapsed guide or duplicate study actions", () => {
    expect(generalHome).toContain('data-home-access-navigation="open"');
    expect(generalHome).toContain("Your access and navigation");
    expect(generalHome).toContain("<NavigationGuide />");
    expect(generalHome).not.toContain("Expand course guide, access and navigation help");
    expect(generalHome).not.toContain("Open Day 0 Orientation");
    expect(generalHome).not.toContain("Continue Course Book");
    expect(generalHome).not.toContain("day0WorkbookByLevel");
  });

  it("keeps canonical course progress in Course Book instead of Home metrics", () => {
    expect(homeMetrics).not.toContain("CourseCompletionProgressCard");
    expect(homeMetrics).not.toContain("useCourseCompletionProgress");
    expect(courseTab).toContain("CourseCompletionProgressCard");
    expect(courseTab).toContain('layout="compact"');
  });

  it("keeps the existing Exams Room access on Home", () => {
    expect(generalHome).toContain("Open Exams Room");
  });
});
