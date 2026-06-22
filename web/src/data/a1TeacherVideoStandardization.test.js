import { applyA1LessonVideoResourceOverrides } from "./a1LessonVideoResourceOverrides";
import { getCurriculumEntriesForLevel } from "./curriculumManifest";
import {
  getLessonVideoResources,
  LESSON_VIDEO_DICTIONARY,
} from "./lessonVideoDictionary";

const teacherVideoUrl = (entry = {}) =>
  String(entry.teacherVideo || entry.video || entry.youtube_link || "").trim();

const isTeacherResource = (resource = {}) =>
  `${resource.key || ""} ${resource.title || ""}`.toLowerCase().includes("teacher");

describe("standardized A1 teacher video resources", () => {
  beforeAll(() => {
    applyA1LessonVideoResourceOverrides(LESSON_VIDEO_DICTIONARY);
  });

  test("every published A1 lesson with a teacher video exposes it in the lesson hub", () => {
    const canonicalLessons = getCurriculumEntriesForLevel("A1").filter(
      (entry) =>
        Number(entry.day) > 0 &&
        entry.contentStatus !== "planned" &&
        teacherVideoUrl(entry)
    );

    expect(canonicalLessons.length).toBeGreaterThan(10);

    canonicalLessons.forEach((entry) => {
      const resources = getLessonVideoResources("A1", entry.day, {
        day: entry.day,
        chapter: entry.chapter,
        lesen_hören: { chapter: entry.chapter },
      });
      const matchingTeacher = resources.find(
        (resource) => resource.url === teacherVideoUrl(entry)
      );

      expect(matchingTeacher).toBeTruthy();
      expect(isTeacherResource(matchingTeacher)).toBe(true);
    });
  });

  test("teacher videos appear before AI videos and URLs are not duplicated", () => {
    Object.entries(LESSON_VIDEO_DICTIONARY.A1 || {}).forEach(([day, entry]) => {
      if (Number(day) === 0) return;
      const resources = entry.videoResources || [];
      const urls = resources.map((resource) => resource.url).filter(Boolean);
      expect(new Set(urls).size).toBe(urls.length);

      const firstAiIndex = resources.findIndex((resource) => !isTeacherResource(resource));
      const lastTeacherIndex = resources.reduce(
        (last, resource, index) => (isTeacherResource(resource) ? index : last),
        -1
      );
      if (firstAiIndex >= 0 && lastTeacherIndex >= 0) {
        expect(lastTeacherIndex).toBeLessThan(firstAiIndex);
      }
    });
  });
});
