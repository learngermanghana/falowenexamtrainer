import { resolveA1RadioFirstWorkbookRoute } from "../components/A1RadioFirstWorkbookRoutes";
import { B1_DAY18_WEGE_ZUM_WUNSCHBERUF_WORKBOOK_CONFIG } from "../components/B1Day18WegeZumWunschberufWorkbookPage";
import { getA1RadioResource } from "./a1RadioResources";
import { getAdditionalLessonVideoResources } from "./additionalLessonVideoResources";

describe("requested B1 Day 18 and A1 Day 12 media", () => {
  test("uses the requested B1 Day 18 AI video", () => {
    expect(getAdditionalLessonVideoResources("B1", 18)).toEqual([
      expect.objectContaining({
        key: "b1-day18-wege-zum-wunschberuf-ai-video",
        chapter: "6.18",
        url: "https://youtu.be/kCFkWHcOakc",
      }),
    ]);
  });

  test("replaces the B1 Day 18 Teil 4 Hören source", () => {
    expect(B1_DAY18_WEGE_ZUM_WUNSCHBERUF_WORKBOOK_CONFIG.listening).toEqual(
      expect.objectContaining({
        embedUrl: "https://www.youtube-nocookie.com/embed/t0OIJ3Upz18",
        externalUrl: "https://youtu.be/t0OIJ3Upz18",
      }),
    );
    expect(B1_DAY18_WEGE_ZUM_WUNSCHBERUF_WORKBOOK_CONFIG.listening.embedUrl).not.toContain(
      "1PjAshI9u_u9BIaUg3Ff0lLOQ-OgmTZO_",
    );
  });

  test("uses the requested A1 Day 12 Kapitel 8 Falowen Radio", () => {
    expect(getA1RadioResource(12, "8")).toEqual(
      expect.objectContaining({
        key: "a1-day12-24-hour-clock-dates-falowen-radio",
        chapter: "8",
        youtubeId: "nfr-oVo4lco",
      }),
    );
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/12",
        "?chapter=8&hub=1",
      ),
    ).toEqual({ day: 12, chapter: "8" });
  });
});
