import { resolveStrictInAppWorkbookRoute } from "../data/strictInAppWorkbookRoutes";
import { addCompletedRadioToWorkbookRoute } from "../utils/lessonRouteEntry";

describe("A1 completed Radio workbook links", () => {
  test("adds radio=done to the Day 1 workbook route after the hub Radio step", () => {
    expect(
      addCompletedRadioToWorkbookRoute(
        "/campus/course/a1-day-1-greetings-workbook",
        "?chapter=0.1&hub=1&radio=done",
      ),
    ).toBe("/campus/course/a1-day-1-greetings-workbook?radio=done");
  });

  test("keeps radio=done when strict canonical routing resolves the workbook", () => {
    const completedFallback = addCompletedRadioToWorkbookRoute(
      "/campus/course/a1-day-1-greetings-workbook",
      "?chapter=0.1&hub=1&radio=done",
    );

    expect(
      resolveStrictInAppWorkbookRoute({
        level: "A1",
        day: 1,
        chapter: "0.1",
        fallback: completedFallback,
      }),
    ).toBe("/campus/course/a1-day-1-greetings-workbook?radio=done");
  });
});
