import {
  B2_C1_LESSON_RADIO_OVERRIDES,
  B2_C1_LESSON_VIDEO_OVERRIDES,
  applyB2C1LessonVideoOverrides,
} from "./b2C1LessonMediaOverrides";
import { normalizeB2C1Lesson } from "./lessonModel";

describe("B2 Day 12 to 15 media reset", () => {
  test.each([13, 14, 15])("keeps Day %i AI-video metadata but clears the old URL", (day) => {
    const resource = B2_C1_LESSON_VIDEO_OVERRIDES.B2[day].videoResources[0];
    expect(resource.key).toContain(`b2-day${day}`);
    expect(resource.url).toBe("");

    const dictionary = { B2: {}, C1: {} };
    applyB2C1LessonVideoOverrides(dictionary);
    expect(dictionary.B2[day].videoResources[0].url).toBe("");

    const lesson = normalizeB2C1Lesson(
      { level: "B2", day, chapter: resource.chapter, title: `B2 Day ${day}` },
      "B2",
    );
    expect(lesson.resources.aiVideo).toBeNull();
  });

  test.each([12, 13, 14])("keeps Day %i Falowen Radio metadata but clears the old YouTube ID", (day) => {
    const resource = B2_C1_LESSON_RADIO_OVERRIDES.B2[day];
    expect(resource.key).toContain(`b2-day${day}`);
    expect(resource.youtubeId).toBe("");

    const lesson = normalizeB2C1Lesson(
      { level: "B2", day, chapter: String(resource.title || ""), title: `B2 Day ${day}` },
      "B2",
    );
    expect(lesson.resources.falowenRadio).toEqual(
      expect.objectContaining({ key: resource.key, youtubeId: "" }),
    );
  });
});
