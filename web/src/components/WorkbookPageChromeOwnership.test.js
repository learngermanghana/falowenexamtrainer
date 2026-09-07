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
