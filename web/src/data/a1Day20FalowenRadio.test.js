import { resolveA1RadioFirstWorkbookRoute } from "../components/A1RadioFirstWorkbookRoutes";
import { getA1RadioResource } from "./a1RadioResources";

describe("A1 Day 20 letter-writing Falowen Radio", () => {
  test("uses the requested video on the canonical and dynamic Kapitel 12.3 routes", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/letter-writing-intro-german-a1-day-12-3",
      ),
    ).toEqual({ day: 20, chapter: "12.3" });

    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/20",
        "?chapter=12.3&hub=1",
      ),
    ).toEqual({ day: 20, chapter: "12.3" });

    expect(getA1RadioResource(20, "12.3")).toEqual(
      expect.objectContaining({
        key: "a1-day20-letter-writing-intro-falowen-radio",
        chapter: "12.3",
        youtubeId: "65Hs65fX9Ms",
      }),
    );
  });

  test("removes the old video from Day 20 without changing Day 21 Weather", () => {
    expect(getA1RadioResource(20, "12.3")?.youtubeId).not.toBe("Ve-iOgbgSw4");
    expect(getA1RadioResource(21, "13")).toEqual(
      expect.objectContaining({
        key: "a1-day21-weather-falowen-radio",
        youtubeId: "Ve-iOgbgSw4",
      }),
    );
  });

  test("does not expose the Day 20 radio for another chapter", () => {
    expect(getA1RadioResource(20, "12.2")).toBeNull();
  });
});
