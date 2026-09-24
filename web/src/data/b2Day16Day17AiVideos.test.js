import {
  B2_C1_LESSON_VIDEO_OVERRIDES,
  applyB2C1LessonVideoOverrides,
} from "./b2C1LessonMediaOverrides";
import { normalizeB2C1Lesson } from "./lessonModel";

describe("B2 Days 16-17 retired lesson videos", () => {
  test.each([16, 17])("Day %i has no old-topic AI-video override", (day) => {
    expect(B2_C1_LESSON_VIDEO_OVERRIDES.B2[day]).toBeUndefined();

    const dictionary = { B2: {}, C1: {} };
    applyB2C1LessonVideoOverrides(dictionary);
    expect(dictionary.B2[day]).toBeUndefined();

    const lesson = normalizeB2C1Lesson(
      { level: "B2", day, chapter: String(day), title: `B2 Day ${day}` },
      "B2",
    );
    expect(lesson.resources.aiVideo).toBeNull();
  });
});
