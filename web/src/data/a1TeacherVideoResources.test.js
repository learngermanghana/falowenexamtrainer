import {
  A1_TEACHER_VIDEO_RESOURCES,
  getA1TeacherVideoResources,
  getCanonicalA1TeacherVideoResource,
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

  test("Day 2 has no legacy teacher videos while unified replacement is pending", () => {
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

    expect(teacherVideos).toEqual([]);
  });

  test("Day 3 Chapter 1.2 uses the latest canonical teacher lecture", () => {
    const configuredVideo = getCanonicalA1TeacherVideoResource(3, "1.2");

    expect(configuredVideo).toEqual(
      expect.objectContaining({
        chapter: "1.2",
        topic: "Personal Pronouns and Verb Conjugation",
        url: "https://youtu.be/PxV62u_UJko",
      })
    );

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
        url: "https://youtu.be/PxV62u_UJko",
      })
    );
    expect(lesson.resources.videos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "a1-day3-chapter-1-2-teacher-video",
          url: "https://youtu.be/PxV62u_UJko",
        }),
      ])
    );
  });

  test("Day 12 Chapter 8 uses the updated 24-hour clock teacher lecture", () => {
    const configuredVideo = getCanonicalA1TeacherVideoResource(12, "8");
    expect(configuredVideo).toEqual(
      expect.objectContaining({
        chapter: "8",
        topic: "The 24-Hour Clock",
        url: "https://youtu.be/iUaAtLdBXCY",
      })
    );

    const lesson = normalizeLesson(
      {
        day: 12,
        chapter: "8",
        lesen_hören: { chapter: "8" },
      },
      "A1"
    );
    expect(lesson.resources.teacherVideo).toEqual(
      expect.objectContaining({ url: "https://youtu.be/iUaAtLdBXCY" })
    );
  });

  test("Day 14 Chapter 3.6 uses the approved modal-verbs teacher lecture only", () => {
    const lectures = getA1TeacherVideoResources(14, "3.6");
    expect(lectures).toHaveLength(1);
    expect(lectures[0]).toMatchObject({
      key: "a1-day14-chapter-3-6-teacher-video",
      title: "Modal Verbs · Teacher lecture",
      url: "https://youtu.be/fTPhyeHwf68",
    });
    expect(A1_TEACHER_VIDEO_RESOURCES.map(({ url }) => url)).not.toContain(
      "https://youtu.be/0zps4OYwShg"
    );
  });

  test("Day 21 Chapter 13 uses the current Weather teacher lecture", () => {
    const configuredVideo = getCanonicalA1TeacherVideoResource(21, "13");

    expect(configuredVideo).toEqual(
      expect.objectContaining({
        chapter: "13",
        topic: "Weather",
        url: "https://youtu.be/7m2fssEbTd8",
      })
    );
    expect(A1_TEACHER_VIDEO_RESOURCES.map((video) => video.url)).not.toContain(
      "https://youtu.be/ijEY8XVrsZs",
    );
  });

  test("Day 23 Final Mock has no retired Chapter 14.2 teacher lecture", () => {
    expect(getCanonicalA1TeacherVideoResource(23, "14.2")).toBeNull();
    expect(getA1TeacherVideoResources(23, "14.2")).toHaveLength(0);
  });

  test("Day 20 Chapter 12.3 uses the new teacher lecture only", () => {
    const configuredVideo = getCanonicalA1TeacherVideoResource(20, "12.3");

    expect(configuredVideo).toEqual(
      expect.objectContaining({
        chapter: "12.3",
        topic: "Introduction to Letter Writing",
        url: "https://youtu.be/mgfauvqhoCI",
      })
    );

    const allUrls = A1_TEACHER_VIDEO_RESOURCES.map((video) => video.url);
    expect(allUrls).not.toContain("https://youtu.be/NZW4rJsekH4");
    expect(allUrls).not.toContain("https://youtu.be/JtgoO2fmOpU");
  });

  test("Day 13 chapter 3.5 exposes only the latest teacher lecture", () => {
    const configuredVideos = getA1TeacherVideoResources(13, "3.5");

    expect(configuredVideos).toHaveLength(1);
    expect(configuredVideos[0]).toMatchObject({
      key: "a1-day13-chapter-3-5-teacher-video",
      title: "Revision: Numbers, Time and Prices · Teacher lecture",
      url: "https://youtu.be/0aprj_rMWw8",
    });
    expect(configuredVideos.map((video) => video.url)).not.toContain(
      "https://youtu.be/eqSc_5p5uyQ",
    );
    expect(configuredVideos.map((video) => video.url)).not.toContain(
      "https://youtu.be/zizS5WdOYs8",
    );

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
      "https://youtu.be/0aprj_rMWw8",
    ]);
  });

  test("canonical teacher video replaces a stale curated teacher video for the same chapter", () => {
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
      "https://youtu.be/1oOO1aJ8lV0",
    ]);
    expect(teacherVideos.map((video) => video.url)).not.toContain(
      "https://youtu.be/custom-teacher-video"
    );
  });

  test("chapter lookup returns only the canonical resources for that chapter", () => {
    expect(getA1TeacherVideoResources(2, "0.2")).toEqual([]);
    expect(getA1TeacherVideoResources(2, "1.1")).toHaveLength(0);
  });

  test("returns all teacher resources for a multi-chapter A1 day when chapter is omitted", () => {
    expect(getA1TeacherVideoResources(2)).toEqual([]);
  });
});


test("Day 2 no longer declares either original teacher lecture", () => {
  expect(getCanonicalA1TeacherVideoResource(2, "0.2", 2)).toBeNull();
  expect(A1_TEACHER_VIDEO_RESOURCES.some(item => Number(item.day) === 2)).toBe(false);
});

test("A1 Day 4 chapter 2 uses the assigned teacher lecture without changing the AI video", () => {
  expect(getCanonicalA1TeacherVideoResource(4, "2")).toEqual(
    expect.objectContaining({
      topic: "German Numbers",
      url: "https://youtu.be/31pCzRKQ7aA",
    })
  );

  const lesson = normalizeLesson({
    day: 4,
    chapter: "2",
    lesen_hören: { chapter: "2" },
  }, "A1");
  expect(lesson.resources.teacherVideo).toEqual(
    expect.objectContaining({
      chapter: "2",
      url: "https://youtu.be/31pCzRKQ7aA",
    })
  );
  expect(lesson.resources.videos.filter((video) =>
    /teacher/i.test(`${video.key} ${video.title}`)
  ).map((video) => video.url)).toEqual(["https://youtu.be/31pCzRKQ7aA"]);
  expect(lesson.resources.aiVideo?.url).not.toBe("https://youtu.be/31pCzRKQ7aA");
  expect(lesson.resources.videos.map(({ url }) => url)).not.toContain(
    "https://youtu.be/lN7xxSbkPZ4"
  );
});


test("Day 5 chapter 1.3 exposes only the approved teacher lecture", () => {
  expect(getA1TeacherVideoResources(5, "1.3").map(video => video.url)).toEqual(["https://youtu.be/emYqxezL9_U"]);
  const lesson = normalizeLesson({ day: 5, chapter: "1.3", schreiben_sprechen: { chapter: "1.3", video: "https://youtu.be/KuGq_0r0FCY", youtube_link: "https://youtu.be/KuGq_0r0FCY" } }, "A1");
  expect(lesson.resources.teacherVideo?.url).toBe("https://youtu.be/emYqxezL9_U");
  expect(lesson.resources.videos.filter(video => /teacher/i.test(video.key + " " + video.title)).map(video => video.url)).toEqual(["https://youtu.be/emYqxezL9_U"]);
});
