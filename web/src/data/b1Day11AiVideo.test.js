import { getAdditionalLessonVideoResources } from "./additionalLessonVideoResources";
import { normalizeLesson } from "./lessonModel";

describe("B1 Day 11 AI lesson video", () => {
  test("uses the requested Teamspiele video for Chapter 4.11", () => {
    expect(getAdditionalLessonVideoResources("B1", 11)).toEqual([
      expect.objectContaining({
        chapter: "4.11",
        title: "B1 Day 11 · Teamspiele und kooperative Aktivitäten · AI video",
        url: "https://youtu.be/XCNpkLMx6gk",
      }),
    ]);
  });

  test("exposes the video through the shared lesson model", () => {
    const lesson = normalizeLesson({
      level: "B1",
      day: 11,
      chapter: "4.11",
      topic: "Teamspiele und Kooperative Aktivitäten",
    });

    expect(lesson.resources.aiVideo).toEqual(
      expect.objectContaining({
        chapter: "4.11",
        url: "https://youtu.be/XCNpkLMx6gk",
      }),
    );
  });
});
