import {
  buildWorkbookNavigationEntries,
  resolveWorkbookNavigation,
} from "./UniversalWorkbookLessonNavigator";

describe("UniversalWorkbookLessonNavigator", () => {
  test("builds navigation entries for every German course level", () => {
    const entries = buildWorkbookNavigationEntries();

    ["A1", "A2", "B1", "B2", "C1"].forEach((level) => {
      expect(entries[level].length).toBeGreaterThan(1);
      expect(entries[level][0]).toEqual(
        expect.objectContaining({
          level,
          destination: expect.stringContaining("/campus/course/"),
        })
      );
    });
  });

  test("moves directly from A2 Day 2 to A2 Day 3", () => {
    const navigation = resolveWorkbookNavigation({
      pathname: "/campus/course/a2-day-2-personen-beschreiben-workbook",
      search: "?radio=done",
    });

    expect(navigation).toEqual(
      expect.objectContaining({
        level: "A2",
        current: expect.objectContaining({ day: 2 }),
        next: expect.objectContaining({
          day: 3,
          destination: "/campus/course/a2-day-3-dinge-und-personen-vergleichen-workbook",
        }),
      })
    );
  });

  test("supports generic B1 workbook lesson routes", () => {
    const navigation = resolveWorkbookNavigation({
      pathname: "/campus/course/lesson/B1/9",
      search: "?view=workbook",
    });

    expect(navigation).toEqual(
      expect.objectContaining({
        level: "B1",
        current: expect.objectContaining({ day: 9 }),
        next: expect.objectContaining({ day: 10 }),
      })
    );
  });

  test("returns no next lesson after the final A2 workbook", () => {
    const navigation = resolveWorkbookNavigation({
      pathname: "/campus/course/a2-day-28-ueber-die-zukunft-sprechen-workbook",
      search: "",
    });

    expect(navigation).toEqual(
      expect.objectContaining({
        level: "A2",
        current: expect.objectContaining({ day: 28 }),
        next: null,
        isFinalLesson: true,
      })
    );
  });
});
