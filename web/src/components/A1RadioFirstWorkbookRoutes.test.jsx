import { getA1RadioResource } from "../data/a1RadioResources";
import {
  hasCompletedA1RadioFirstStep,
  resolveA1RadioFirstWorkbookRoute,
} from "./A1RadioFirstWorkbookRoutes";

describe("A1 route-scoped Falowen Radio", () => {
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

  test("does not affect other A1 workbook routes", () => {
    expect(resolveA1RadioFirstWorkbookRoute("/campus/course/a1-day-12-24-hour-clock-and-dates-workbook"))
      .toBeNull();
  });

  test("recognizes the completed radio query without losing other parameters", () => {
    expect(hasCompletedA1RadioFirstStep("?assignmentKey=A1-13&radio=done&level=A1")).toBe(true);
    expect(hasCompletedA1RadioFirstStep("?assignmentKey=A1-13&level=A1")).toBe(false);
  });
});
