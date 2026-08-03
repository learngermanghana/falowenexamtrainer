import {
  A1_TEACHER_VIDEO_RESOURCES,
  getA1TeacherVideoResources,
  hasTeacherVideoForEveryConfiguredA1Chapter,
} from "./a1TeacherVideoResources";
import { normalizeLesson } from "./lessonModel";

describe("standardized A1 teacher videos", () => {
  test("all configured teacher resources have a day, chapter and YouTube URL", () => {
    expect(hasTeacherVideoForEveryConfiguredA1Chapter()).toBe(true);
    expect(A1_TEACHER_VIDEO_RESOURCES.length).toBeGreaterThan(20);
  });

  test.each(A1_TEACHER_VIDEO_RESOURCES)(
    "Day $day chapter $chapter exposes its teacher lecture in the lesson hub",
    ({ day, chapter, url }) => {
      const lesson = normalizeLesson(
        {
          day,
          chapter,
          lesen_hören: {
            chapter,
            workbook_link: `/campus/course/a1-day-${day}-test-workbook`,
          },
        },
        "A1"
      );

      expect(lesson.resources.videos.some((video) => video.url === url)).toBe(true);
      expect(lesson.resources.videos.find((video) => video.url === url)?.key).toMatch(/teacher/i);
    }
  );

  test("chapter-specific Day 2 pages only receive their own teacher video", () => {
    const lesson = normalizeLesson(
      {
        day: 2,
        chapter: "0.2",
        lesen_hören: { chapter: "0.2" },
      },
      "A1"
    );

    const teacherVideos = lesson.resources.videos.filter((video) =>
      `${video.key} ${video.title}`.toLowerCase().includes("teacher")
    );

    expect(teacherVideos.map((video) => video.url)).toEqual([
      "https://youtu.be/uhFgKp4WVEc",
    ]);
  });

  test("Day 3 Chapter 1.2 restores its teacher lecture in the chapter hub", () => {
    expect(getA1TeacherVideoResources(3)).toEqual([
      expect.objectContaining({
        chapter: "1.2",
        topic: "Personal Information, Articles, Adjectives and W-Questions",
        url: "https://youtu.be/iZDv1rcYWsQ",
      }),
    ]);

    const lesson = normalizeLesson(
      {
        day: 3,
        chapter: "1.2",
        lesen_hören: { chapter: "1.2" },
      },
      "A1"
    );

    expect(lesson.resources.teacherVideo).toEqual(
      expect.objectContaining({
        chapter: "1.2",
        url: "https://youtu.be/iZDv1rcYWsQ",
      })
    );
    expect(lesson.resources.videos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "a1-day3-chapter-1-2-teacher-video",
          url: "https://youtu.be/iZDv1rcYWsQ",
        }),
      ])
    );
  });

  test("Day 13 chapter 3.5 exposes the new recording as Teacher Video 2", () => {
    const configuredVideos = getA1TeacherVideoResources(13).filter(
      (video) => video.chapter === "3.5"
    );

    expect(configuredVideos.map((video) => video.url)).toEqual([
      "https://youtu.be/eqSc_5p5uyQ",
      "https://youtu.be/zizS5WdOYs8",
    ]);
    expect(configuredVideos.map((video) => video.videoNumber)).toEqual([1, 2]);
    expect(configuredVideos[0].title).toContain("Teacher video 1");
    expect(configuredVideos[1]).toMatchObject({
      key: "a1-day13-chapter-3-5-teacher-video-2",
      title: "Revision: Numbers, Time and Prices · Teacher video 2",
    });

    const lesson = normalizeLesson(
      {
        day: 13,
        chapter: "3.5",
        lesen_hören: { chapter: "3.5" },
      },
      "A1"
    );
    const teacherVideos = lesson.resources.videos.filter((video) =>
      `${video.key} ${video.title}`.toLowerCase().includes("teacher")
    );

    expect(teacherVideos.map((video) => video.url)).toEqual([
      "https://youtu.be/eqSc_5p5uyQ",
      "https://youtu.be/zizS5WdOYs8",
    ]);
    expect(new Set(teacherVideos.map((video) => video.key)).size).toBe(2);
  });

  test("does not replace an existing curated teacher video for the same chapter", () => {
    const lesson = normalizeLesson(
      {
        day: 16,
        chapter: "9",
        lesen_hören: {
          chapter: "9",
          videoResources: [
            {
              key: "teacher-video-lecture",
              chapter: "9",
              title: "Teacher video lecture",
              url: "https://youtu.be/custom-teacher-video",
            },
          ],
        },
      },
      "A1"
    );

    const teacherVideos = lesson.resources.videos.filter((video) =>
      `${video.key} ${video.title}`.toLowerCase().includes("teacher")
    );

    expect(teacherVideos.map((video) => video.url)).toEqual([
      "https://youtu.be/custom-teacher-video",
    ]);
  });

  test("returns all teacher resources for a multi-chapter A1 day", () => {
    expect(getA1TeacherVideoResources(2).map((video) => video.chapter)).toEqual([
      "0.2",
      "1.1",
    ]);
  });
});
