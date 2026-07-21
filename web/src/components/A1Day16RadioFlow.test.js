import { getA1RadioResource } from "../data/a1RadioResources";
import { resolveA1RadioFirstWorkbookRoute } from "./A1RadioFirstWorkbookRoutes";

describe("A1 Day 16 Kapitel 9 Falowen Radio", () => {
  test("uses the requested radio episode on the direct workbook route", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook",
        "?workbookTab=overview&assignmentKey=A1-9&assignmentId=A1-9&level=A1",
      ),
    ).toEqual({ day: 16, chapter: "9" });

    expect(getA1RadioResource(16, "9")).toEqual(
      expect.objectContaining({
        key: "a1-day16-negation-food-daily-life-falowen-radio",
        chapter: "9",
        title: "Negation, Food and Daily Life · Kapitel 9",
        youtubeId: "cQAsQ14a77c",
      }),
    );
  });

  test("uses the same episode when Kapitel 9 opens through the A1 chapter hub", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/16",
        "?chapter=9&hub=1",
      ),
    ).toEqual({ day: 16, chapter: "9" });
  });

  test("does not leak the Day 16 episode into another chapter", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/16",
        "?chapter=10&hub=1",
      ),
    ).toBeNull();
    expect(getA1RadioResource(16, "10")).toBeNull();
  });
});
