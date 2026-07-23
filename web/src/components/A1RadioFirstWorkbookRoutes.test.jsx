import { getA1RadioResource } from "../data/a1RadioResources";
import {
  hasCompletedA1RadioFirstStep,
  resolveA1RadioFirstWorkbookRoute,
} from "./A1RadioFirstWorkbookRoutes";

describe("A1 route-scoped Falowen Radio", () => {
  test.each([
    [6, "2.3", "0joiZBDlffk", "a1-day6-chapter-2-3-falowen-radio"],
    [7, "3", "hQNDEyMrXds", "a1-day7-chapter-3-falowen-radio"],
    [8, "4", "o1LAiSqPLag", "a1-day8-chapter-4-falowen-radio"],
  ])("maps only A1 Day %i Kapitel %s to its requested Falowen Radio", (day, chapter, youtubeId, key) => {
    const route = resolveA1RadioFirstWorkbookRoute(
      `/campus/course/lesson/A1/${day}`,
      `?chapter=${chapter}&hub=1`,
    );
    expect(route).toEqual({ day, chapter });
    expect(getA1RadioResource(route.day, route.chapter)).toEqual(
      expect.objectContaining({ key, chapter, youtubeId }),
    );
    expect(getA1RadioResource(day, `${chapter}.wrong`)).toBeNull();
  });

  test("navigation does not retain another lesson's radio", () => {
    const visited = [[6, "2.3"], [7, "3"], [8, "4"]].map(([day, chapter]) =>
      getA1RadioResource(day, chapter)?.youtubeId,
    );
    expect(visited).toEqual(["0joiZBDlffk", "hQNDEyMrXds", "o1LAiSqPLag"]);
    expect(new Set(visited).size).toBe(3);
  });

  test.each([
    [2, "Uru9bvr14mw", "a1-day2-chapter-1-1-falowen-radio"],
    [3, "y9LhKQkjsqM", "a1-day3-chapter-1-1-falowen-radio"],
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

  test("opens the restored Day 3 Falowen Radio on the direct Kapitel 1.1 workbook route", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook",
      ),
    ).toEqual({ day: 3, chapter: "1.1" });
    expect(getA1RadioResource(3)).toEqual(
      expect.objectContaining({ youtubeId: "y9LhKQkjsqM" }),
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

  test("keeps separate Falowen Radio episodes for Day 16 Kapitel 9 and Kapitel 10", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/16",
        "?chapter=10&hub=1",
      ),
    ).toEqual({ day: 16, chapter: "10" });
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook",
      ),
    ).toEqual({ day: 16, chapter: "10" });
    expect(getA1RadioResource(16, "10")).toEqual(
      expect.objectContaining({
        key: "a1-day16-food-daily-life-kapitel-10-falowen-radio",
        chapter: "10",
        youtubeId: "lp7ePIbp-Ws",
      }),
    );
    expect(getA1RadioResource(16, "9")).toEqual(
      expect.objectContaining({
        key: "a1-day16-negation-food-daily-life-falowen-radio",
        chapter: "9",
        youtubeId: "cQAsQ14a77c",
      }),
    );
    expect(getA1RadioResource(16, "11")).toBeNull();
  });

  test.each([
    [17, "11", "8Mh4PCSm6QE", "a1-day17-chapter-11-falowen-radio"],
    [18, "12.1", "G6khh2VagPA", "a1-day18-chapter-12-1-falowen-radio"],
    [18, "12.2", "d_iHJMUUl6o", "a1-day18-chapter-12-2-falowen-radio"],
  ])("uses the approved Day %i Kapitel %s Falowen Radio video", (day, chapter, youtubeId, key) => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        `/campus/course/lesson/A1/${day}`,
        `?chapter=${chapter}&hub=1`,
      ),
    ).toEqual({ day, chapter });
    expect(getA1RadioResource(day, chapter)).toEqual(
      expect.objectContaining({ key, chapter, youtubeId }),
    );
    expect(
      resolveA1RadioFirstWorkbookRoute(
        `/campus/course/lesson/A1/${day}`,
        `?chapter=${chapter}.wrong&hub=1`,
      ),
    ).toBeNull();
  });

  test("uses the approved Day 19 Kapitel 5.9 Falowen Radio on dynamic and canonical routes", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/19",
        "?chapter=5.9&hub=1",
      ),
    ).toEqual({ day: 19, chapter: "5.9" });
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/verboten-erlaubt-5-9",
      ),
    ).toEqual({ day: 19, chapter: "5.9" });
    expect(getA1RadioResource(19, "5.9")).toEqual(
      expect.objectContaining({
        key: "a1-day19-verboten-erlaubt-falowen-radio",
        chapter: "5.9",
        youtubeId: "wjBYShPq-RM",
      }),
    );
    expect(getA1RadioResource(19, "5.10")).toBeNull();
  });

  test("uses the requested Day 20 Kapitel 12.3 Falowen Radio on dynamic and canonical routes", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/20",
        "?chapter=12.3&hub=1",
      ),
    ).toEqual({ day: 20, chapter: "12.3" });
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/letter-writing-intro-german-a1-day-12-3/",
      ),
    ).toEqual({ day: 20, chapter: "12.3" });
    expect(getA1RadioResource(20, "12.3")).toEqual(
      expect.objectContaining({
        key: "a1-day20-letter-writing-intro-falowen-radio",
        title: "Letter Writing Introduction · Kapitel 12.3",
        chapter: "12.3",
        youtubeId: "Ve-iOgbgSw4",
      }),
    );
  });

  test("uses the requested Day 21 Kapitel 13 Falowen Radio on dynamic and canonical routes", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/21",
        "?chapter=13&hub=1",
      ),
    ).toEqual({ day: 21, chapter: "13" });
    expect(resolveA1RadioFirstWorkbookRoute("/campus/course/a1-day-21-weather-workbook/"))
      .toEqual({ day: 21, chapter: "13" });
    expect(getA1RadioResource(21, "13")).toEqual(
      expect.objectContaining({
        key: "a1-day21-weather-falowen-radio",
        title: "Weather · Kapitel 13",
        chapter: "13",
        youtubeId: "Ve-iOgbgSw4",
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
