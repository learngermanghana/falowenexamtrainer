import fs from "fs";
import path from "path";
import { getConfiguredInAppWorkbookRoute } from "./inAppWorkbookRoutes";

const LESSON_LINK_CASES = [
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
  {
    lessonPath: "/campus/course/lesson/A1/19?chapter=5.9",
    day: 19,
    chapter: "5.9",
    workbookPath: "/campus/course/verboten-erlaubt-5-9",
  },
  {
    lessonPath: "/campus/course/lesson/A1/20?chapter=12.3",
    day: 20,
    chapter: "12.3",
    workbookPath: "/campus/course/letter-writing-intro-german-a1-day-12-3",
  },
  {
    lessonPath: "/campus/course/lesson/A1/21?chapter=13",
    day: 21,
    chapter: "13",
    workbookPath: "/campus/course/a1-day-21-weather-workbook",
  },
  {
    lessonPath: "/campus/course/lesson/A1/22?chapter=14.1",
    day: 22,
    chapter: "14.1",
    workbookPath: "/campus/course/a1-day-22-health-and-body-parts-workbook",
  },
  {
    lessonPath: "/campus/course/lesson/A1/23?chapter=14.2",
    day: 23,
    chapter: "14.2",
    workbookPath: "/campus/course/dative-and-accusative-verbs-14-2",
  },
  {
    lessonPath: "/campus/course/lesson/A1/24?chapter=5.10",
    day: 24,
    chapter: "5.10",
    workbookPath: "/campus/course/conjunctions-5-10",
  },
];

describe("A1 lesson links resolve to workbook pages", () => {
  const originalPath = window.location.pathname;

  afterEach(() => {
    window.history.replaceState({}, "", originalPath || "/");
  });

  test.each(LESSON_LINK_CASES)(
    "$lessonPath resolves to $workbookPath",
    ({ lessonPath, day, chapter, workbookPath }) => {
      window.history.replaceState({}, "", lessonPath);

      expect(getConfiguredInAppWorkbookRoute({ level: "A1", day, chapter })).toBe(workbookPath);
    },
  );

  it("keeps the Day 19 to Day 24 destination pages registered", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
    const indexSource = fs.readFileSync(path.resolve(__dirname, "../index.jsx"), "utf8");

    [
      "/campus/course/verboten-erlaubt-5-9",
      "/campus/course/a1-day-21-weather-workbook",
      "/campus/course/a1-day-22-health-and-body-parts-workbook",
      "/campus/course/dative-and-accusative-verbs-14-2",
      "/campus/course/conjunctions-5-10",
    ].forEach((route) => expect(appSource).toContain(route));

    expect(indexSource).toContain("A1_DAY20_CHAPTER123_DIRECT_WORKBOOK_PATH");
    expect(indexSource).toContain("A1Day20Chapter123DirectWorkbookRoute");
  });
});
