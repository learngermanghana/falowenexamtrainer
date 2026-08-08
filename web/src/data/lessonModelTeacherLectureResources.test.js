import { normalizeA2B1Lesson } from "./lessonModel";

describe("configured teacher lecture lesson normalization", () => {
  test("keeps the configured A2 Day 2 lecture in normalized lesson resources", () => {
    const lesson = normalizeA2B1Lesson(
      {
        day: 2,
        chapter: "1.2",
        topic: "Personen beschreiben",
      },
      "A2",
    );

    expect(lesson.resources.teacherVideo).toEqual(
      expect.objectContaining({
        title: "Kapitel 1.2 · Teacher lecture video",
        url: "https://youtu.be/iB-yVVqI1DQ",
      }),
    );
    expect(lesson.resources.videos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "https://youtu.be/iB-yVVqI1DQ",
        }),
      ]),
    );
  });

  test("still filters teacher-like resources on unconfigured A2 days", () => {
    const lesson = normalizeA2B1Lesson(
      {
        day: 23,
        chapter: "8.23",
        teacher_video: "https://example.com/unconfigured-teacher",
      },
      "A2",
    );

    expect(lesson.resources.teacherVideo).toBeNull();
    expect(lesson.resources.videos).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "https://example.com/unconfigured-teacher",
        }),
      ]),
    );
  });
});
