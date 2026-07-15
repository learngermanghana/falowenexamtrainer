import fs from "fs";
import path from "path";
import { courseSchedules } from "./courseSchedule";
import {
  getConfiguredInAppWorkbookResourceRoute,
  getConfiguredInAppWorkbookRoute,
} from "./inAppWorkbookRoutes";
import { normalizeLesson } from "./lessonModel";

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

const DAY1_LESSON_PATH = "/campus/course/lesson/A1/1?chapter=0.1";
const DAY1_WORKBOOK_PATH = "/campus/course/a1-day-1-greetings-workbook";
const DAY20_LESSON_PATH = "/campus/course/lesson/A1/20?chapter=12.3";
const DAY20_WORKBOOK_PATH = "/campus/course/letter-writing-intro-german-a1-day-12-3";

describe("A1 lesson links preserve the intended lesson flow", () => {
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

  it("keeps Day 1 Chapter 0.1 on the lesson resource hub", () => {
    window.history.replaceState({}, "", DAY1_LESSON_PATH);

    expect(getConfiguredInAppWorkbookRoute({ level: "A1", day: 1, chapter: "0.1" })).toBe("");
    expect(getConfiguredInAppWorkbookResourceRoute({ level: "A1", day: 1, chapter: "0.1" })).toBe(
      DAY1_WORKBOOK_PATH,
    );
  });

  it("keeps all four A1 Day 1 resource-hub choices configured", () => {
    const day1Entry = courseSchedules.A1.find((entry) => Number(entry.day) === 1);
    const lesson = normalizeLesson(day1Entry, "A1");

    expect(lesson.resources.resourceGroups[0]).toEqual(
      expect.objectContaining({
        chapter: "0.1",
        grammarBook: { url: "/campus/course/basic-greetings-goodbyes-and-how-you-are-day-1" },
        workbook: { url: DAY1_WORKBOOK_PATH },
      }),
    );
    expect(lesson.resources.videos.map((video) => video.url)).toEqual([
      "https://youtu.be/CqFbBQG9M3U",
      "https://youtu.be/5WIMkENgdGE",
    ]);
  });

  it("keeps Day 20 Chapter 12.3 on the lesson resource hub", () => {
    window.history.replaceState({}, "", DAY20_LESSON_PATH);

    expect(getConfiguredInAppWorkbookRoute({ level: "A1", day: 20, chapter: "12.3" })).toBe("");
    expect(getConfiguredInAppWorkbookResourceRoute({ level: "A1", day: 20, chapter: "12.3" })).toBe(
      DAY20_WORKBOOK_PATH,
    );
  });

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
