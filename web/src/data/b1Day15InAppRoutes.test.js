import { getB1LessonResourceOverride } from "./b1LessonResourceOverrides";
import { getConfiguredInAppWorkbookResourceRoute } from "./inAppWorkbookRoutes";

describe("B1 Day 15 in-app lesson resources", () => {
  test("uses the built grammar and workbook routes", () => {
    const override = getB1LessonResourceOverride(15);

    expect(override).toMatchObject({
      chapter: "5.15",
      grammarBook: "/campus/course/lesson/B1/15?view=grammar",
      workbook: "/campus/course/lesson/B1/15?view=workbook",
    });
  });

  test("routes Chapter 5.15 to the built workbook", () => {
    expect(
      getConfiguredInAppWorkbookResourceRoute({
        level: "B1",
        day: 15,
        chapter: "5.15",
      })
    ).toBe("/campus/course/lesson/B1/15?view=workbook");
  });
});
