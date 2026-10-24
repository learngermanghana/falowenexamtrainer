import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("Course Book layout standardizer", () => {
  it("compacts the Course Book banner without changing lesson data", () => {
    const source = read("CourseBookLayoutStandardizer.js");
    expect(source).toContain('data-compact-course-book-banner');
    expect(source).toContain('maxWidth: "1120px"');
    expect(source).toContain('padding: "14px"');
    expect(source).not.toContain("courseSchedules");
  });

  it("creates one shared A1 tutor navigation with overview, assignment, Teil and submit", () => {
    const source = read("CourseBookLayoutStandardizer.js");
    expect(source).toContain('aria-label="Unified A1 tutor-marked workbook navigation"');
    expect(source).toContain('assignmentButton.textContent = "Assignment"');
    expect(source).toContain('button.textContent = `Teil ${number}`');
    expect(source).toContain('normalizeText(button.textContent) === "submit"');
  });

  it("keeps Day 0 inside Week 1 and places the orientation video in that lesson card", () => {
    const layout = read("CourseBookLayoutStandardizer.js");
    const injector = read("A2CourseBookOrientationVideoInjector.js");
    const courseTab = read("CourseTab.js");
    const progression = read("../utils/courseBookProgression.js");

    expect(courseTab).toContain("Math.max(1, Math.ceil(numericDay / 5))");
    expect(injector).toContain('const HOST_ATTR = "data-course-book-orientation-video"');
    expect(injector).toContain('dayZeroCard.setAttribute(HOST_ATTR, "true")');
    expect(injector).toContain('firstContentBlock.insertAdjacentElement("afterend", panel)');
    expect(layout).toContain('article.closest(\'[data-course-book-orientation-video="true"]\')');
    expect(progression).not.toContain("!isPinnedCourseBookOrientationEntry(entry)");
  });

  it("is mounted beside the existing shared A1 navigation service", () => {
    const services = read("RouteScopedAppServices.js");
    expect(services).toContain('import CourseBookLayoutStandardizer from "./CourseBookLayoutStandardizer"');
    expect(services).toContain("<A1UnifiedTutorWorkbookNavigation />");
    expect(services).toContain("<CourseBookLayoutStandardizer />");
  });
});
