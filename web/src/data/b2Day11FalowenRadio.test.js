import { courseSchedules } from "./courseSchedule";
import { getB2C1RadioResource } from "./b2C1LessonMediaOverrides";
import { normalizeB2C1Lesson } from "./lessonModel";

describe("B2 Falowen Radio removal after the topic redesign", () => {
  test("does not expose the retired Day 11 Radio slot", () => {
    expect(getB2C1RadioResource("B2", 11)).toBeNull();
  });

  test("normalized B2 lessons do not inherit an old Falowen Radio episode", () => {
    const lesson = courseSchedules.B2.find((entry) => Number(entry?.day) === 11);
    expect(lesson).toBeTruthy();

    const normalized = normalizeB2C1Lesson(lesson, "B2");
    expect(normalized.resources.falowenRadio).toBeNull();
    expect(normalized.resources.videos).toEqual([]);
  });
});
