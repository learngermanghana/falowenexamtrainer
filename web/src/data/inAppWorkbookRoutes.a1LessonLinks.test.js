import fs from "fs";
import path from "path";
import { getA1GrammarRoute } from "./a1GrammarRoutes";
import { getA1TeacherVideoResources } from "./a1TeacherVideoResources";
import {
  A1_DAY23_CHAPTER142_GRAMMAR_ROUTE,
  getConfiguredInAppWorkbookResourceRoute,
  getConfiguredInAppWorkbookRoute,
} from "./inAppWorkbookRoutes";
import { getLessonVideoResources } from "./lessonVideoDictionary";
import {
  buildA1ChapterResourceHubState,
  resolveA1ChapterResourceHubEntry,
} from "../utils/a1ChapterResourceHubState";
import {
  getRequiredChecklist,
  syncSubmitCompletionGuide,
} from "../components/SubmitPageLevelGuidanceInjector";

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

const getAiVideoUrls = (day, chapter) =>
  getLessonVideoResources("A1", day, { day, chapter })
    .filter((video) => !`${video.key || ""} ${video.title || ""}`.toLowerCase().includes("teacher"))
    .map((video) => video.url);

const getTeacherVideoUrls = (day, chapter) =>
  getA1TeacherVideoResources(day)
    .filter((video) => String(video.chapter) === String(chapter))
    .map((video) => video.url);

describe("A1 lesson links preserve the lesson resource hub", () => {
  const originalPath = window.location.pathname;

  afterEach(() => {
    window.history.replaceState({}, "", originalPath || "/");
    document.body.innerHTML = "";
  });

  test.each(A1_RESOURCE_HUB_CASES)(
    "Day $day Chapter $chapter opens the resource hub before $workbookPath",
    ({ day, chapter, workbookPath }) => {
      window.history.replaceState({}, "", `/campus/course/lesson/A1/${day}?chapter=${chapter}`);

      expect(getConfiguredInAppWorkbookRoute({ level: "A1", day, chapter })).toBe("");
      expect(getConfiguredInAppWorkbookResourceRoute({ level: "A1", day, chapter })).toBe(workbookPath);
    },
  );

  it("keeps the Day 1 teacher, AI, grammar and workbook resources configured for their separate stages", () => {
    expect(getTeacherVideoUrls(1, "0.1")).toContain("https://youtu.be/CqFbBQG9M3U");
    expect(getAiVideoUrls(1, "0.1")).toContain("https://youtu.be/5WIMkENgdGE");
    expect(getA1GrammarRoute({ day: 1, chapter: "0.1" })).toBe(
      "/campus/course/basic-greetings-goodbyes-and-how-you-are-day-1",
    );
    expect(getConfiguredInAppWorkbookResourceRoute({ level: "A1", day: 1, chapter: "0.1" })).toBe(
      "/campus/course/a1-day-1-greetings-workbook",
    );
  });

  it("keeps the Day 2 Chapter 1.1 resources configured for their separate stages", () => {
    expect(getTeacherVideoUrls(2, "1.1")).toContain("https://youtu.be/AjsnO1hxDs4");
    expect(getAiVideoUrls(2, "1.1")).toContain("https://youtu.be/kqagu9qsOcc");
    expect(getA1GrammarRoute({ day: 2, chapter: "1.1" })).toBe(
      "/campus/course/singular-pronouns-verb-conjugation-day-2",
    );
    expect(getConfiguredInAppWorkbookResourceRoute({ level: "A1", day: 2, chapter: "1.1" })).toBe(
      "/campus/course/a1-day-2-kapitel-1-1-workbook",
    );
  });

  it("mounts the wildcard-safe A1 chapter hub route before the app can redirect straight to a workbook", () => {
    const indexSource = fs.readFileSync(path.resolve(__dirname, "../index.jsx"), "utf8");
    const hubRouteSource = fs.readFileSync(
      path.resolve(__dirname, "../components/A1ChapterResourceHubRoute.jsx"),
      "utf8",
    );

    expect(indexSource).toContain("A1ChapterResourceHubRoute");
    expect(indexSource).toContain("path={A1_CHAPTER_RESOURCE_HUB_PARENT_PATH}");
    expect(indexSource).toContain('<A1ChapterResourceHubRoute level="A1" fallback={<App />} />');
    expect(indexSource).not.toContain('path="/campus/course/lesson/:level/:day"');
    expect(hubRouteSource).toContain('A1_CHAPTER_RESOURCE_HUB_PARENT_PATH = "/campus/course/lesson/A1/:day/*"');
    expect(hubRouteSource).toContain('query.get("hub") === "1"');
    expect(hubRouteSource).toContain("<CourseLessonPageLegacy />");
  });

  it("makes the requested Day 2 Kapitel 1.1 entry authoritative even after radio completion", () => {
    const search = "?chapter=1.1&hub=1&radio=done";
    const entry = resolveA1ChapterResourceHubEntry({ day: 2, chapter: "1.1" });
    const state = buildA1ChapterResourceHubState({ level: "A1", day: 2, search });

    expect(entry).toEqual(expect.objectContaining({ chapter: "1.1" }));
    expect(entry.topic).toMatch(/Personal Pronouns/i);
    expect(state.entry).toEqual(expect.objectContaining({ chapter: "1.1" }));
    expect(state.entry.chapter).not.toBe("0.2");
  });

  it("embeds the approved YouTube Hören video in A1 Day 3 Kapitel 1.2 and removes Drive", () => {
    const workbookSource = fs.readFileSync(
      path.resolve(__dirname, "../components/A1Day3PronounsIntroducingYourselfWorkbookPage.js"),
      "utf8",
    );

    expect(workbookSource).toContain('const HOEREN_YOUTUBE_ID = "3p-Vl1HsOok"');
    expect(workbookSource).toContain("youtube-nocookie.com/embed");
    expect(workbookSource).toContain("A1 Day 3 Kapitel 1.2 Hören");
    expect(workbookSource).not.toContain("drive.google.com");
    expect(workbookSource).not.toContain("CoursebookAudioPlayer");
  });

  it("shows the exact two-part consent checklist on the inline A1-1.1 Submit tab", () => {
    expect(getRequiredChecklist("A1", "A1-1.1")).toEqual([
      expect.objectContaining({ id: "teil-1", label: expect.stringMatching(/Teil 1 · Hören/i) }),
      expect.objectContaining({ id: "teil-2", label: expect.stringMatching(/Teil 2 · Schreiben/i) }),
    ]);

    document.body.innerHTML = `
      <div data-a1-built-in-submission data-assignment-key="A1-1.1">
        <form>
          <textarea></textarea>
          <button type="submit">Submit assignment</button>
        </form>
      </div>
    `;

    syncSubmitCompletionGuide({
      pathname: "/campus/course/a1-day-2-kapitel-1-1-workbook",
      search: "?workbookTab=submit&assignmentKey=A1-1.1&level=A1",
    });

    const checklist = document.querySelector('[data-submission-completion-checklist="true"]');
    const submitButton = document.querySelector('button[type="submit"]');
    expect(checklist).toHaveTextContent("Teil 1 · Hören");
    expect(checklist).toHaveTextContent("Teil 2 · Schreiben");
    expect(checklist.querySelectorAll('input[name="falowen-submit-completion-check"]')).toHaveLength(2);
    expect(submitButton).toBeDisabled();
  });

  it("keeps Day 2 Chapter 1.1 on the original two-part assignment", () => {
    const workbookSource = fs.readFileSync(
      path.resolve(__dirname, "../components/A1Day2Kapitel11WorkbookPage.js"),
      "utf8",
    );

    expect(workbookSource).toContain("Personal Pronouns and Verb Conjugation");
    expect(workbookSource).toContain('fallbackAssignmentKey="A1-1.1"');
    expect(workbookSource).toContain("Teil 1 · Hören");
    expect(workbookSource).toContain("Teil 2 · Schreiben");
    expect(workbookSource).toContain("1. Wie heißt sie?");
    expect(workbookSource).toContain("C) Anna");
    expect(workbookSource).toContain("A) A, B, C, D, E, F, G");
    expect(workbookSource).not.toContain("Teil 3 ·");
  });

  it("keeps A1 workbook navigation static while students read", () => {
    const layoutSource = fs.readFileSync(
      path.resolve(__dirname, "../components/A1SharedAssignmentWorkbookLayout.jsx"),
      "utf8",
    );

    expect(layoutSource).toContain('data-workbook-navigation-behavior="static"');
    expect(layoutSource).not.toContain('position: "sticky"');
  });

  it("keeps both A1 Day 13 teacher videos and uses the new recording as video 2", () => {
    const teacherVideos = getA1TeacherVideoResources(13).filter(
      (video) => String(video.chapter) === "3.5",
    );

    expect(teacherVideos.map((video) => video.url)).toEqual([
      "https://youtu.be/eqSc_5p5uyQ",
      "https://youtu.be/zizS5WdOYs8",
    ]);
    expect(teacherVideos[1]).toMatchObject({
      videoNumber: 2,
      key: "a1-day13-chapter-3-5-teacher-video-2",
      title: "Revision: Numbers, Time and Prices · Teacher video 2",
    });
  });

  it("keeps the A1 Day 4 resources configured for their separate stages", () => {
    expect(getTeacherVideoUrls(4, "2")).toContain("https://youtu.be/lN7xxSbkPZ4");
    expect(getAiVideoUrls(4, "2")).toContain("https://youtu.be/GyhH8zPXDy4");
    expect(getA1GrammarRoute({ day: 4, chapter: "2" })).toBe(
      "/campus/course/german-numbers-1-10-with-pronunciation",
    );
    expect(getConfiguredInAppWorkbookResourceRoute({ level: "A1", day: 4, chapter: "2" })).toBe(
      "/campus/course/a1-day-4-numbers-for-beginners-workbook",
    );
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
