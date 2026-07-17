import { getA1RadioResource } from "../data/a1RadioResources";
import {
  hasCompletedA1RadioFirstStep,
  resolveA1RadioFirstWorkbookRoute,
} from "./A1RadioFirstWorkbookRoutes";

describe("A1 route-scoped Falowen Radio", () => {
  test.each([
    [2, "Uru9bvr14mw", "a1-day2-chapter-1-1-falowen-radio"],
    [3, "DnfWKdi6DsA", "a1-day3-chapter-1-1-falowen-radio"],
  ])("uses the approved Day %i Kapitel 1.1 radio video", (day, youtubeId, key) => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        `/campus/course/lesson/A1/${day}`,
        "?chapter=1.1",
      ),
    ).toEqual({ day, chapter: "1.1" });
    expect(getA1RadioResource(day)).toEqual(
      expect.objectContaining({ key, youtubeId }),
    );
  });

  test.each([2, 3])("does not open Day %i radio for another chapter", (day) => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        `/campus/course/lesson/A1/${day}`,
        "?chapter=1.2",
      ),
    ).toBeNull();
  });

  test("keeps Day 2 Falowen Radio on the canonical A1-1.1 workbook route", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/a1-day-2-kapitel-1-1-workbook",
        "?workbookTab=overview&assignmentKey=A1-1.1&level=A1",
      ),
    ).toEqual({ day: 2, chapter: "1.1" });
  });

  test("opens the new Day 3 Falowen Radio on the direct Kapitel 1.1 workbook route", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook",
      ),
    ).toEqual({ day: 3, chapter: "1.1" });
    expect(getA1RadioResource(3)).toEqual(
      expect.objectContaining({ youtubeId: "DnfWKdi6DsA" }),
    );
  });

  test("uses the approved Day 4 Kapitel 2 German numbers video from the resource hub", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/4",
        "?chapter=2&hub=1",
      ),
    ).toEqual({ day: 4, chapter: "2" });
    expect(getA1RadioResource(4)).toEqual(
      expect.objectContaining({
        key: "a1-day4-german-numbers-falowen-radio",
        title: "German Numbers · Kapitel 2",
        youtubeId: "lMeNuJCloD0",
      }),
    );
  });

  test("does not open the Day 4 radio for another chapter", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/4",
        "?chapter=2.1&hub=1",
      ),
    ).toBeNull();
  });

  test("uses the approved Day 5 introductions and articles video", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook",
      ),
    ).toEqual({ day: 5, chapter: "1.3" });
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/5",
        "?chapter=1.3&hub=1",
      ),
    ).toEqual({ day: 5, chapter: "1.3" });
    expect(getA1RadioResource(5)).toEqual(
      expect.objectContaining({
        key: "a1-day5-introducing-yourself-articles-falowen-radio",
        title: "Introducing Yourself and Articles · Kapitel 1.3",
        youtubeId: "4yGJ9-Fz19A",
      }),
    );
  });

  test("does not open the Day 5 radio for another chapter", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/5",
        "?chapter=1.2&hub=1",
      ),
    ).toBeNull();
  });

  test("uses the approved Day 13 revision video", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/a1-day-13-revision-numbers-time-and-prices-workbook",
      ),
    ).toEqual({ day: 13 });
    expect(getA1RadioResource(13)).toEqual(
      expect.objectContaining({
        key: "a1-day13-revision-numbers-time-prices-falowen-radio",
        youtubeId: "owCQscHPmzQ",
      }),
    );
  });

  test("uses the approved Day 20 Kapitel 12.3 letter-writing video", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/letter-writing-intro-german-a1-day-12-3/",
      ),
    ).toEqual({ day: 20, chapter: "12.3" });
    expect(getA1RadioResource(20)).toEqual(
      expect.objectContaining({
        key: "a1-day20-letter-writing-intro-falowen-radio",
        title: "Letter Writing Introduction · Kapitel 12.3",
        youtubeId: "B-LFDrF0zsY",
      }),
    );
  });

  test("uses the approved Day 21 Kapitel 13 weather video", () => {
    expect(resolveA1RadioFirstWorkbookRoute("/campus/course/a1-day-21-weather-workbook/"))
      .toEqual({ day: 21, chapter: "13" });
    expect(getA1RadioResource(21)).toEqual(
      expect.objectContaining({
        key: "a1-day21-weather-falowen-radio",
        title: "Weather · Kapitel 13",
        youtubeId: "fRYM7ojc0Yo",
      }),
    );
  });

  test("uses the approved Day 22 Kapitel 14.1 health video on dynamic and canonical routes", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/22",
        "?chapter=14.1",
      ),
    ).toEqual({ day: 22, chapter: "14.1" });
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/a1-day-22-health-and-body-parts-workbook",
        "?workbookTab=overview&assignmentKey=A1-14.1&level=A1",
      ),
    ).toEqual({ day: 22, chapter: "14.1" });
    expect(getA1RadioResource(22)).toEqual(
      expect.objectContaining({
        key: "a1-day22-health-body-parts-falowen-radio",
        title: "Health and Body Parts · Kapitel 14.1",
        youtubeId: "23uCwszjahg",
      }),
    );
  });

  test("does not open the Day 22 radio for another chapter", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/22",
        "?chapter=14.2",
      ),
    ).toBeNull();
  });

  test("does not affect other A1 workbook routes", () => {
    expect(resolveA1RadioFirstWorkbookRoute("/campus/course/a1-day-12-24-hour-clock-and-dates-workbook"))
      .toBeNull();
  });

  test("recognizes the completed radio query without losing other parameters", () => {
    expect(hasCompletedA1RadioFirstStep("?assignmentKey=A1-13&radio=done&level=A1")).toBe(true);
    expect(hasCompletedA1RadioFirstStep("?assignmentKey=A1-13&level=A1")).toBe(false);
  });
});
