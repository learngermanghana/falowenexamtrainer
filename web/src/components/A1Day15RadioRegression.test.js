import { getA1RadioResource } from "../data/a1RadioResources";
import { buildA1ChapterResourceHubState } from "../utils/a1ChapterResourceHubState";
import { resolveA1RadioFirstWorkbookRoute } from "./A1RadioFirstWorkbookRoutes";

describe("A1 Day 15 Speaking Exams Introduction Falowen Radio", () => {
  test("uses the requested Kapitel 4.7 radio on the hub and entry route", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/15",
        "?chapter=4.7&hub=1",
      ),
    ).toEqual({ day: 15, chapter: "4.7" });
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/speaking-exams-intro-4-7",
        "",
      ),
    ).toEqual({ day: 15, chapter: "4.7" });
    expect(getA1RadioResource(15, "4.7")).toEqual(
      expect.objectContaining({
        key: "a1-day15-speaking-exams-introduction-falowen-radio",
        chapter: "4.7",
        youtubeId: "HfNlBfUwGBo",
      }),
    );
  });

  test("opens the actual workbook after the Kapitel 4.7 radio is complete", () => {
    const state = buildA1ChapterResourceHubState({
      level: "A1",
      day: 15,
      search: "?radio=done&chapter=4.7&hub=1",
    });

    expect(state.entry).toEqual(expect.objectContaining({ chapter: "4.7" }));
    expect(state.entry.workbookRoute).toBe(
      "/campus/course/speaking-exams-intro-4-7?view=workbook&radio=done",
    );
  });

  test("does not reuse the speaking radio for another Day 15 chapter", () => {
    expect(getA1RadioResource(15, "4.8")).toBeNull();
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/15",
        "?chapter=4.8&hub=1",
      ),
    ).toBeNull();
  });
});
