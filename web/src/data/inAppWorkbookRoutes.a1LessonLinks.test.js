import fs from "fs";
import path from "path";
import { courseSchedules } from "./courseSchedule";
import {
  A1_DAY23_CHAPTER142_GRAMMAR_ROUTE,
  getConfiguredInAppWorkbookResourceRoute,
  getConfiguredInAppWorkbookRoute,
} from "./inAppWorkbookRoutes";
import { normalizeLesson } from "./lessonModel";

const A1_RESOURCE_HUB_CASES = [
  [1, "0.1", "/campus/course/a1-day-1-greetings-workbook"],
  [2, "0.2", "/campus/course/a1-day-2-german-alphabet-reviewing-workbook"],
  [2, "1.1", "/campus/course/a1-day-2-kapitel-1-1-workbook"],
  [3, "1.1", "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook"],
  [3, "1.2", "/campus/course/a1-day-3-pronouns-introducing-yourself-workbook"],
  [4, "2", "/campus/course/a1-day-4-numbers-for-beginners-workbook"],
  [5, "1.3", "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook"],
  [6, "2.3", "/campus/course/a1-day-6-family-and-hobbies-workbook"],
  [7, "3", "/campus/course/a1-chapter-3-asking-about-prices-workbook"],
  [8, "4", "/campus/course/a1-day-8-countries-and-languages-workbook"],
  [9, "5", "/campus/course/a1-chapter-5-german-cases-workbook"],
  [10, "6", "/campus/course/a1-day-10-objects-colors-possessive-articles-workbook"],
  [11, "7", "/campus/course/a1-day-11-understanding-time-workbook"],
  [12, "8", "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook"],
  [13, "3.5", "/campus/course/a1-day-13-revision-numbers-time-and-prices-workbook"],
  [14, "3.6", "/campus/course/modal-verbs-day-14-3-6"],
  [15, "4.7", "/campus/course/speaking-exams-intro-4-7"],
  [16, "9", "/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook"],
  [16, "10", "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook"],
  [17, "11", "/campus/course/a1-day-17-instructions-and-directions-kapitel-11-workbook"],
  [18, "12.1", "/campus/course/two-case-prepositions-wechselpraepositionen-day-18?view=workbook"],
  [18, "12.2", "/campus/course/a1-12-2-dative-articles-mit-bei-zu?view=workbook"],
  [19, "5.9", "/campus/course/verboten-erlaubt-5-9"],
  [20, "12.3", "/campus/course/letter-writing-intro-german-a1-day-12-3"],
  [21, "13", "/campus/course/a1-day-21-weather-workbook"],
  [22, "14.1", "/campus/course/a1-day-22-health-and-body-parts-workbook"],
  [24, "5.10", "/campus/course/conjunctions-5-10"],
].map(([day, chapter, workbookPath]) => ({ day, chapter, workbookPath }));

const getCanonicalA1Lesson = (day) => {
  const entry = courseSchedules.A1.find((lesson) => Number(lesson.day) === Number(day));
  return normalizeLesson(entry, "A1");
};

describe("A1 lesson links preserve the lesson resource hub", () => {
  const originalPath = window.location.pathname;

  afterEach(() => {
    window.history.replaceState({}, "", originalPath || "/");
  });

  test.each(A1_RESOURCE_HUB_CASES)(
    "Day $day Chapter $chapter opens the resource hub before $workbookPath",
    ({ day, chapter, workbookPath }) => {
      window.history.replaceState({}, "", `/campus/course/lesson/A1/${day}?chapter=${chapter}`);

      expect(getConfiguredInAppWorkbookRoute({ level: "A1", day, chapter })).toBe("");
      expect(getConfiguredInAppWorkbookResourceRoute({ level: "A1", day, chapter })).toBe(workbookPath);
    },
  );

  it("keeps all four A1 Day 1 resource-hub choices configured", () => {
    const lesson = getCanonicalA1Lesson(1);

    expect(lesson.resources.resourceGroups[0]).toEqual(
      expect.objectContaining({
        chapter: "0.1",
        grammarBook: { url: "/campus/course/basic-greetings-goodbyes-and-how-you-are-day-1" },
        workbook: { url: "/campus/course/a1-day-1-greetings-workbook" },
      }),
    );
    expect(lesson.resources.videos.map((video) => video.url)).toEqual([
      "https://youtu.be/CqFbBQG9M3U",
      "https://youtu.be/5WIMkENgdGE",
    ]);
  });

  it("keeps all four A1 Day 4 resource-hub choices configured", () => {
    const lesson = getCanonicalA1Lesson(4);

    expect(lesson.resources.resourceGroups[0]).toEqual(
      expect.objectContaining({
        chapter: "2",
        grammarBook: { url: "/campus/course/german-numbers-1-10-with-pronunciation" },
        workbook: { url: "/campus/course/a1-day-4-numbers-for-beginners-workbook" },
      }),
    );
    expect(lesson.resources.videos.map((video) => video.url)).toEqual([
      "https://youtu.be/lN7xxSbkPZ4",
      "https://youtu.be/GyhH8zPXDy4",
    ]);
  });

  it("keeps Day 23 Chapter 14.2 as the intentional grammar-only exception", () => {
    window.history.replaceState({}, "", "/campus/course/lesson/A1/23?chapter=14.2");

    expect(getConfiguredInAppWorkbookRoute({ level: "A1", day: 23, chapter: "14.2" })).toBe(
      A1_DAY23_CHAPTER142_GRAMMAR_ROUTE,
    );
    expect(getConfiguredInAppWorkbookResourceRoute({ level: "A1", day: 23, chapter: "14.2" })).toBe("");
  });

  it("keeps the later A1 destination pages registered", () => {
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
