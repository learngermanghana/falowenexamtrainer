import { getTeacherLectureVideoResources } from "./teacherLectureVideoResources";
import { normalizeA2B1Lesson } from "./lessonModel";

describe("A2 Day 24 teacher lecture", () => {
  const url = "https://youtu.be/F73WxoLqusc";

  test("registers the teacher lecture under Kapitel 9.24", () => {
    expect(getTeacherLectureVideoResources("A2", 24)).toEqual([
      expect.objectContaining({
        chapter: "9.24",
        title: "Kapitel 9.24 · Teacher lecture video",
        url,
      }),
    ]);
  });

  test("shows the lecture as a teacher video, without changing the Hören resource", () => {
    const lesson = normalizeA2B1Lesson({
      day: 24,
      chapter: "9.24",
      lesen_hören: {
        chapter: "9.24",
        workbook_link: "/campus/course/a2-day-24-einen-urlaub-planen-workbook",
      },
    }, "A2");

    expect(lesson.resources.teacherVideo).toEqual(
      expect.objectContaining({ chapter: "9.24", url }),
    );
    expect(lesson.resources.videos.filter((video) =>
      /teacher|tutor lecture/i.test(`${video.key} ${video.title}`)
    ).map((video) => video.url)).toContain(url);
  });
});
