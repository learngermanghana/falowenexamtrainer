import { normalizeA2B1Lesson } from "./lessonModel";
import { getTeacherLectureVideoResources } from "./teacherLectureVideoResources";

const TEACHER_LECTURE_URL = "https://youtu.be/UL-gk2klvWQ";

describe("B1 Day 11 teacher lecture", () => {
  test("registers the requested teacher lecture for Kapitel 4.11", () => {
    expect(getTeacherLectureVideoResources("B1", 11)).toEqual([
      expect.objectContaining({
        chapter: "4.11",
        title: "Kapitel 4.11 · Teacher lecture video",
        url: TEACHER_LECTURE_URL,
      }),
    ]);
  });

  test("exposes it as the teacher lecture without replacing the existing AI video", () => {
    const lesson = normalizeA2B1Lesson(
      {
        day: 11,
        chapter: "4.11",
        topic: "Teamspiele und kooperative Aktivitäten",
      },
      "B1",
    );

    expect(lesson.resources.teacherVideo).toEqual(
      expect.objectContaining({ chapter: "4.11", url: TEACHER_LECTURE_URL }),
    );
    expect(lesson.resources.aiVideo).toEqual(
      expect.objectContaining({ chapter: "4.11", url: "https://youtu.be/XCNpkLMx6gk" }),
    );
  });
});
