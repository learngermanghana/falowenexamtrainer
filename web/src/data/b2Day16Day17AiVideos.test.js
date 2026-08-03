import {
  B2_C1_LESSON_VIDEO_OVERRIDES,
  applyB2C1LessonVideoOverrides,
} from "./b2C1LessonMediaOverrides";
import { normalizeB2C1Lesson } from "./lessonModel";

describe("B2 Day 16 and Day 17 AI videos", () => {
  test("maps Day 16 Chapter 4.1 to the approved Digitalisierung video", () => {
    expect(B2_C1_LESSON_VIDEO_OVERRIDES.B2[16].videoResources[0]).toEqual(
      expect.objectContaining({
        key: "b2-day16-digitalisierung-alltag-ai-video",
        chapter: "4.1",
        url: "https://youtu.be/ioHsbvDoLag",
      }),
    );

    const lesson = normalizeB2C1Lesson(
      { level: "B2", day: 16, chapter: "4.1", title: "Digitalisierung im Alltag" },
      "B2",
    );

    expect(lesson.resources.aiVideo).toEqual(
      expect.objectContaining({
        chapter: "4.1",
        url: "https://youtu.be/ioHsbvDoLag",
      }),
    );
  });

  test("maps Day 17 Chapter 4.2 to the approved Mobilität video", () => {
    const dictionary = { B2: {}, C1: {} };
    applyB2C1LessonVideoOverrides(dictionary);

    expect(dictionary.B2[17].videoResources[0]).toEqual(
      expect.objectContaining({
        key: "b2-day17-mobilitaet-stadtleben-ai-video",
        chapter: "4.2",
        url: "https://youtu.be/i167ok5kIFg",
      }),
    );

    const lesson = normalizeB2C1Lesson(
      { level: "B2", day: 17, chapter: "4.2", title: "Mobilität und Stadtleben" },
      "B2",
    );

    expect(lesson.resources.aiVideo).toEqual(
      expect.objectContaining({
        chapter: "4.2",
        url: "https://youtu.be/i167ok5kIFg",
      }),
    );
  });
});
