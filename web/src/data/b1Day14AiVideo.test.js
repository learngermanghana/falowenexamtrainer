import { getAdditionalLessonVideoResources } from "./additionalLessonVideoResources";
import { normalizeLesson } from "./lessonModel";

describe("B1 Day 14 AI lesson video", () => {
  test("uses the requested video for Chapter 5.14", () => {
    expect(getAdditionalLessonVideoResources("B1", 14)).toEqual([
      expect.objectContaining({
        chapter: "5.14",
        title: "B1 Day 14 · Traditionelles vs. digitales Lernen · AI video",
        url: "https://youtu.be/lktKK510Nxk",
      }),
    ]);
  });

  test("exposes the video through the shared lesson model", () => {
    const lesson = normalizeLesson({
      level: "B1",
      day: 14,
      chapter: "5.14",
      topic: "Traditionelles vs. digitales Lernen",
    });

    expect(lesson.resources.aiVideo).toEqual(
      expect.objectContaining({
        chapter: "5.14",
        url: "https://youtu.be/lktKK510Nxk",
      }),
    );
  });
});
