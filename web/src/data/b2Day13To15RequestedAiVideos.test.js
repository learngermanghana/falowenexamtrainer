import {
  B2_C1_LESSON_RADIO_OVERRIDES,
  B2_C1_LESSON_VIDEO_OVERRIDES,
  applyB2C1LessonVideoOverrides,
} from "./b2C1LessonMediaOverrides";
import { normalizeB2C1Lesson } from "./lessonModel";

describe("B2 Days 12-15 retired media after topic redesign", () => {
  test("removes old B2 AI-video override metadata", () => {
    expect(B2_C1_LESSON_VIDEO_OVERRIDES.B2).toEqual({});

    const dictionary = { B2: {}, C1: {} };
    applyB2C1LessonVideoOverrides(dictionary);
    expect(dictionary.B2).toEqual({});
  });

  test.each([12, 13, 14, 15])("Day %i does not inherit retired Radio or AI video", (day) => {
    expect(B2_C1_LESSON_RADIO_OVERRIDES.B2[day]).toBeUndefined();

    const lesson = normalizeB2C1Lesson(
      { level: "B2", day, chapter: String(day), title: `B2 Day ${day}` },
      "B2",
    );
    expect(lesson.resources.falowenRadio).toBeNull();
    expect(lesson.resources.aiVideo).toBeNull();
  });
});
