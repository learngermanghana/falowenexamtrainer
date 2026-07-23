import fs from "fs";
import path from "path";
import { courseSchedules } from "../data/courseSchedule";
import { findCourseBookEntry } from "../utils/courseBookEntries";
import {
  getSelfLearningCourseDestination,
  isSelfLearningCourseDestination,
} from "./SelfLearningLessonDirectNavigationFix";

const resolveFreshTabLesson = (url) => {
  const parsed = new URL(url, "https://www.falowen.app");
  const routeMatch = parsed.pathname.match(/^\/campus\/course\/lesson\/([^/]+)\/(\d+)$/i);
  if (!routeMatch) return null;

  const level = String(routeMatch[1] || "").toUpperCase();
  const day = Number(routeMatch[2]);
  const chapter = parsed.searchParams.get("chapter") || "";
  const entry = findCourseBookEntry({
    entries: courseSchedules[level] || [],
    level,
    day,
    chapter,
  });

  return { level, day, chapter, entry };
};

describe("B2 and C1 lesson links", () => {
  test("the top-level wildcard-safe A1 resource-hub route no longer owns B2 or C1 URLs", () => {
    const indexSource = fs.readFileSync(path.resolve(__dirname, "../index.jsx"), "utf8");
    const hubSource = fs.readFileSync(path.resolve(__dirname, "./A1ChapterResourceHubRoute.jsx"), "utf8");
    const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");

    expect(hubSource).toContain('A1_CHAPTER_RESOURCE_HUB_PARENT_PATH = "/campus/course/lesson/A1/:day/*"');
    expect(indexSource).toContain("path={A1_CHAPTER_RESOURCE_HUB_PARENT_PATH}");
    expect(indexSource).toContain('<A1ChapterResourceHubRoute level="A1" fallback={<App />} />');
    expect(indexSource).not.toContain('path="/campus/course/lesson/:level/:day"');
    expect(appSource).toContain('path="/campus/course/lesson/:level/:day" element={<CourseLessonPage />}');
  });

  test.each([
    ["B2", "https://www.falowen.app/campus/course/lesson/B2/10?chapter=2.5"],
    ["C1", "https://www.falowen.app/campus/course/lesson/C1/10?chapter=2.5"],
  ])("resolves %s Day 10 Kapitel 2.5 using only the clean URL", (level, url) => {
    const resolved = resolveFreshTabLesson(url);

    expect(resolved).toMatchObject({ level, day: 10, chapter: "2.5" });
    expect(resolved.entry).toEqual(
      expect.objectContaining({
        day: 10,
        chapter: "2.5",
      }),
    );
  });

  test("normal same-tab clicks preserve the exact C1 Day 10 URL", () => {
    const url = "https://www.falowen.app/campus/course/lesson/C1/10?chapter=2.5";

    expect(isSelfLearningCourseDestination(url)).toBe(true);
    expect(getSelfLearningCourseDestination(url)).toBe(
      "/campus/course/lesson/C1/10?chapter=2.5",
    );
  });

  test.each([
    [
      "Day 23 Kapitel 14.2",
      "https://www.falowen.app/campus/course/lesson/A1/23?chapter=14.2",
      "/campus/course/dative-and-accusative-verbs-14-2",
    ],
    [
      "Day 24 Kapitel 5.10",
      "https://www.falowen.app/campus/course/lesson/A1/24?chapter=5.10",
      "/campus/course/conjunctions-5-10",
    ],
  ])("opens A1 practice-only %s on its owned page", (_label, url, destination) => {
    expect(isSelfLearningCourseDestination(url)).toBe(true);
    expect(getSelfLearningCourseDestination(url)).toBe(destination);
  });

  test("does not bypass the A1 assignment hub for Day 3 Kapitel 1.2", () => {
    const url = "https://www.falowen.app/campus/course/lesson/A1/3?chapter=1.2";

    expect(isSelfLearningCourseDestination(url)).toBe(false);
    expect(getSelfLearningCourseDestination(url)).toBe("");
  });

  test("the direct navigation fix is mounted for authenticated course links", () => {
    const indexSource = fs.readFileSync(path.resolve(__dirname, "../index.jsx"), "utf8");

    expect(indexSource).toContain("SelfLearningLessonDirectNavigationFix");
    expect(indexSource).toContain("<SelfLearningLessonDirectNavigationFix />");
  });
});
