import { getAdditionalLessonVideoResources } from "./additionalLessonVideoResources";
import { normalizeLesson } from "./lessonModel";

describe("B1 Day 13 AI lesson video", () => {
  test("uses the requested video for Chapter 4.13", () => {
    expect(getAdditionalLessonVideoResources("B1", 13)).toEqual([
      expect.objectContaining({
        chapter: "4.13",
        title: "B1 Day 13 · Eigene Filmkritik schreiben · AI video",
        url: "https://youtu.be/61Afr0Z3vO4",
      }),
    ]);
  });

  test("exposes the video through the shared lesson model", () => {
    const lesson = normalizeLesson({
      level: "B1",
      day: 13,
      chapter: "4.13",
      topic: "Eigene Filmkritik schreiben",
    });

    expect(lesson.resources.aiVideo).toEqual(
      expect.objectContaining({
        chapter: "4.13",
        url: "https://youtu.be/61Afr0Z3vO4",
      }),
    );
  });
});
