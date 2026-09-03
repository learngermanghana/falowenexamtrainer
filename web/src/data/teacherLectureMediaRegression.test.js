import { normalizeA2B1Lesson } from "./lessonModel";
import { getLessonVideoResources } from "./lessonVideoDictionary";
import { getTeacherLectureVideoResources } from "./teacherLectureVideoResources";

describe("teacher lecture media regressions", () => {
  test("renders the A2 Day 14 tutor lecture alongside the AI video", () => {
    const lesson = normalizeA2B1Lesson(
      {
        day: 14,
        chapter: "5.14",
        topic: "Beruf und Karriere",
      },
      "A2",
    );

    expect(lesson.resources.teacherVideo).toEqual(
      expect.objectContaining({
        chapter: "5.14",
        url: "https://youtu.be/hGK64aXtARk",
      }),
    );
    expect(lesson.resources.aiVideo).toEqual(
      expect.objectContaining({
        url: "https://youtu.be/qWy7yMgwmvQ",
      }),
    );
    expect(lesson.resources.videos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: "https://youtu.be/hGK64aXtARk" }),
        expect.objectContaining({ url: "https://youtu.be/qWy7yMgwmvQ" }),
      ]),
    );
  });

  test("accepts a configured tutor-only legacy media key", () => {
    const resources = getTeacherLectureVideoResources("A2", 14);

    expect(resources).toHaveLength(1);
    expect(resources[0]).toEqual(
      expect.objectContaining({
        chapter: "5.14",
        title: "Kapitel 5.14 · Teacher lecture video",
        url: "https://youtu.be/hGK64aXtARk",
      }),
    );
  });

  test("preserves case-sensitive paths and query values for generic video URLs", () => {
    const urls = [
      "https://example.com/Video.mp4?Token=AbC",
      "https://example.com/video.mp4?Token=AbC",
      "https://example.com/video.mp4?Token=abc",
    ];

    const resources = getLessonVideoResources("C1", 99, {
      day: 99,
      chapter: "99",
      videoResources: urls.map((url, index) => ({
        key: `case-sensitive-video-${index + 1}`,
        chapter: "99",
        title: `Case-sensitive video ${index + 1}`,
        url,
      })),
    });

    expect(resources.map((resource) => resource.url)).toEqual(urls);
  });
});
