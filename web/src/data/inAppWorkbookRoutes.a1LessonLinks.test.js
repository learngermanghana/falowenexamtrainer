import { getConfiguredInAppWorkbookRoute } from "./inAppWorkbookRoutes";

describe("A1 lesson links resolve to workbook pages", () => {
  const originalPath = window.location.pathname;

  afterEach(() => {
    window.history.replaceState({}, "", originalPath || "/");
  });

  test.each([
    {
      lessonPath: "/campus/course/lesson/A1/17?chapter=11",
      day: 17,
      chapter: "11",
      workbookPath: "/campus/course/a1-day-17-instructions-and-directions-kapitel-11-workbook",
    },
    {
      lessonPath: "/campus/course/lesson/A1/18?chapter=12.1",
      day: 18,
      chapter: "12.1",
      workbookPath: "/campus/course/two-case-prepositions-wechselpraepositionen-day-18?view=workbook",
    },
    {
      lessonPath: "/campus/course/lesson/A1/18?chapter=12.2",
      day: 18,
      chapter: "12.2",
      workbookPath: "/campus/course/a1-12-2-dative-articles-mit-bei-zu?view=workbook",
    },
  ])("$lessonPath resolves to $workbookPath", ({ lessonPath, day, chapter, workbookPath }) => {
    window.history.replaceState({}, "", lessonPath);

    expect(getConfiguredInAppWorkbookRoute({ level: "A1", day, chapter })).toBe(workbookPath);
  });
});
