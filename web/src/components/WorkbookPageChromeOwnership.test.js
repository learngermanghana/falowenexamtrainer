import fs from "fs";
import path from "path";
import { shouldUseUniversalWorkbookNavigator } from "./UniversalWorkbookLessonNavigator";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("workbook page chrome ownership", () => {
  test("mounts the learning-path header only once in the main app shell", () => {
    const app = read("../App.js");
    const routeServices = read("RouteScopedAppServices.js");

    expect((app.match(/<BookPdfDownloadInjector\b/g) || [])).toHaveLength(1);
    expect(routeServices).not.toContain("BookPdfDownloadInjector");
  });

  test("does not stack universal next-lesson navigation under A2 or B1 workbook headers", () => {
    expect(
      shouldUseUniversalWorkbookNavigator({
        pathname: "/campus/course/a2-day-15-mein-lieblingssport-workbook",
      }),
    ).toBe(false);

    expect(
      shouldUseUniversalWorkbookNavigator({
        pathname: "/campus/course/lesson/B1/15",
        search: "?view=workbook",
      }),
    ).toBe(false);
  });

  test("does not add previous/next course chrome to the terminal A1 final mock", () => {
    expect(
      shouldUseUniversalWorkbookNavigator({
        pathname: "/campus/course/a1-final-mock-exam",
      }),
    ).toBe(false);
  });

  test("keeps universal navigation available for levels that do not use the A2/B1 header", () => {
    expect(
      shouldUseUniversalWorkbookNavigator({
        pathname: "/campus/course/a1-day-21-weather-workbook",
      }),
    ).toBe(true);

    expect(
      shouldUseUniversalWorkbookNavigator({
        pathname: "/campus/course/lesson/C1/15",
        search: "?view=workbook",
      }),
    ).toBe(true);
  });
});


describe("workbook navigation stays in page flow", () => {
  test("advanced workbook tabs are not sticky on tablets or desktop", () => {
    const source = read("StandardWorkbookComponents.js");
    const advanced = source.slice(source.indexOf("export const AdvancedSelfLearningTabNav"), source.indexOf("export const WorkbookTaskCard"));
    expect(advanced).toContain('data-sticky-navigation="false"');
    expect(advanced).not.toContain('position: "sticky"');
    expect(advanced).toContain("onChange={selectAdvancedTab}");
    expect(advanced).toContain("C1StudyPartner");
    const css = read("WorkbookMobileLayout.css");
    expect(css).toMatch(/\[data-advanced-self-learning-navigation\]\s*\{\s*position: static !important/);
  });
  test("tablet and touch device rules neutralize legacy workbook sticky wrappers", () => {
    const css = read("WorkbookMobileLayout.css");
    expect(css).toMatch(/@media \(max-width: 1024px\), \(pointer: coarse\)\s*\{\s*\[data-workbook-sticky-wrapper\]/);
    expect(css).toContain("@media (max-width: 768px)");
    expect(css).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
  });
});
