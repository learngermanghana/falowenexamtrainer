import { courseSchedules } from "./courseSchedule";
import { getB2C1RadioResource } from "./b2C1LessonMediaOverrides";
import { normalizeB2C1Lesson } from "./lessonModel";

describe("B2 Day 11 Falowen Radio resource ownership", () => {
  test("keeps the Radio slot while its old YouTube ID is cleared", () => {
    expect(getB2C1RadioResource("B2", 11)).toEqual(
      expect.objectContaining({
        key: "b2-day11-gesellschaft-integration-falowen-radio",
        title: "Gesellschaft und Integration 3.1",
        youtubeId: "",
      }),
    );
  });

  test("normalizeB2C1Lesson keeps the Radio metadata without exposing an old episode", () => {
    const lesson = courseSchedules.B2.find((entry) => Number(entry?.day) === 11);
    expect(lesson).toBeTruthy();

    const normalized = normalizeB2C1Lesson(lesson, "B2");
    expect(normalized.resources.falowenRadio).toEqual(
      expect.objectContaining({
        key: "b2-day11-gesellschaft-integration-falowen-radio",
        youtubeId: "",
      }),
    );
    expect(normalized.resources.videos).toEqual([]);
  });
});
