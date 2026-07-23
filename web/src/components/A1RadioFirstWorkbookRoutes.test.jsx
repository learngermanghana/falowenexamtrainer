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
        youtubeId: "XrSTHS60LI4",
      }),
    );
  });

  test("requires radio=done before opening the workbook stage", () => {
    expect(hasCompletedA1RadioFirstStep("?radio=done")).toBe(true);
    expect(hasCompletedA1RadioFirstStep("?radio=todo")).toBe(false);
    expect(hasCompletedA1RadioFirstStep("")).toBe(false);
  });
});