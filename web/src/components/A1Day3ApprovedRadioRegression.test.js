import { getA1RadioResource } from "../data/a1RadioResources";
import {
  hasCompletedA1RadioFirstStep,
  resolveA1RadioFirstWorkbookRoute,
} from "./A1RadioFirstWorkbookRoutes";

describe("A1 Day 3 approved Falowen Radio handoff", () => {
  const workbookPath = "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook";

  test("uses the restored Day 3 Kapitel 1.1 Falowen Radio episode", () => {
    expect(resolveA1RadioFirstWorkbookRoute(workbookPath)).toEqual({ day: 3, chapter: "1.1" });
    expect(getA1RadioResource(3, "1.1")).toEqual(
      expect.objectContaining({
        key: "a1-day3-chapter-1-1-falowen-radio",
        youtubeId: "y9LhKQkjsqM",
      }),
    );
  });

  test("does not reopen Radio after the Course Book handoff is completed", () => {
    expect(hasCompletedA1RadioFirstStep("?chapter=1.1&radio=done")).toBe(true);
  });
});
