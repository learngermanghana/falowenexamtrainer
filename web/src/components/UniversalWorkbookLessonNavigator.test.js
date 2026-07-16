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

  test("keeps both A1 Day 2 chapters in the lesson sequence", () => {
    const entries = buildWorkbookNavigationEntries();
    const day2Entries = entries.A1.filter((entry) => entry.day === 2);

    expect(day2Entries).toEqual([
      expect.objectContaining({
        chapter: "0.2",
        destination: "/campus/course/a1-day-2-german-alphabet-reviewing-workbook",
      }),
      expect.objectContaining({
        chapter: "1.1",
        destination: "/campus/course/a1-day-2-kapitel-1-1-workbook",
      }),
    ]);
  });

  test("moves from the A1 Day 2 Kapitel 0.2 lesson hub to Kapitel 1.1", () => {
    const navigation = resolveWorkbookNavigation({
      pathname: "/campus/course/lesson/A1/2",
      search: "?chapter=0.2",
    });

    expect(navigation).toEqual(
      expect.objectContaining({
        level: "A1",
        current: expect.objectContaining({ day: 2, chapter: "0.2" }),
        next: expect.objectContaining({
          day: 2,
          chapter: "1.1",
          destination: "/campus/course/a1-day-2-kapitel-1-1-workbook",
        }),
      })
    );
  });

  test("identifies Kapitel 1.1 instead of falling back to the first Day 2 chapter", () => {
    const navigation = resolveWorkbookNavigation({
      pathname: "/campus/course/lesson/A1/2",
      search: "?chapter=1.1",
    });

    expect(navigation).toEqual(
      expect.objectContaining({
        current: expect.objectContaining({ day: 2, chapter: "1.1" }),
        previous: expect.objectContaining({ day: 2, chapter: "0.2" }),
      })
    );
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
