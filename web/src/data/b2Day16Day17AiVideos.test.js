import {
  B2_C1_LESSON_VIDEO_OVERRIDES,
  applyB2C1LessonVideoOverrides,
} from "./b2C1LessonMediaOverrides";
import { normalizeB2C1Lesson } from "./lessonModel";

describe("B2 Day 16 and Day 17 lesson-video reset", () => {
  test.each([
    [16, "4.1", "b2-day16-digitalisierung-alltag-ai-video"],
    [17, "4.2", "b2-day17-mobilitaet-stadtleben-ai-video"],
  ])("keeps Day %i video metadata but clears its old URL", (day, chapter, key) => {
    expect(B2_C1_LESSON_VIDEO_OVERRIDES.B2[day].videoResources[0]).toEqual(
      expect.objectContaining({ key, chapter, url: "" }),
    );

    const dictionary = { B2: {}, C1: {} };
    applyB2C1LessonVideoOverrides(dictionary);
    expect(dictionary.B2[day].videoResources[0].url).toBe("");

    const lesson = normalizeB2C1Lesson(
      { level: "B2", day, chapter, title: `B2 Day ${day}` },
      "B2",
    );
    expect(lesson.resources.aiVideo).toBeNull();
  });
});
