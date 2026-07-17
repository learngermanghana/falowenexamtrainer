import fs from "fs";
import path from "path";
import { courseSchedules } from "../data/courseSchedule";
import { findCourseBookEntry } from "../utils/courseBookEntries";

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

describe("lesson links opened in a fresh browser tab", () => {
  test("the top-level A1 resource-hub route no longer owns B2 or C1 URLs", () => {
    const indexSource = fs.readFileSync(path.resolve(__dirname, "../index.jsx"), "utf8");
    const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");

    expect(indexSource).toContain('path="/campus/course/lesson/A1/:day"');
    expect(indexSource).toContain('<A1ChapterResourceHubRoute level="A1" fallback={<App />} />');
    expect(indexSource).not.toContain('path="/campus/course/lesson/:level/:day"');
    expect(appSource).toContain('path="/campus/course/lesson/:level/:day" element={<CourseLessonPage />}');
  });

  test.each([
    ["B2", "https://www.falowen.app/campus/course/lesson/B2/10?chapter=2.5"],
    ["C1", "https://www.falowen.app/campus/course/lesson/C1/10?chapter=2.5"],
  ])("resolves %s Day 10 Kapitel 2.5 using only the fresh-tab URL", (level, url) => {
    const resolved = resolveFreshTabLesson(url);

    expect(resolved).toMatchObject({ level, day: 10, chapter: "2.5" });
    expect(resolved.entry).toEqual(
      expect.objectContaining({
        day: 10,
        chapter: "2.5",
      }),
    );
  });
});
