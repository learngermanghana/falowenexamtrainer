import { getAdditionalLessonVideoResources } from "./additionalLessonVideoResources";
import { normalizeLesson } from "./lessonModel";

const cases = [
  {
    day: 11,
    chapter: "4.11",
    topic: "Teamspiele und Kooperative Aktivitäten",
    title: "B1 Day 11 · Teamspiele und kooperative Aktivitäten · AI video",
    url: "https://youtu.be/XCNpkLMx6gk",
  },
  {
    day: 12,
    chapter: "4.12",
    topic: "Abenteuer in der Natur",
    title: "B1 Day 12 · Abenteuer in der Natur · AI video",
    url: "https://youtu.be/9NNSVqw-Y5A",
  },
];

describe("B1 Day 11 and 12 AI lesson videos", () => {
  test.each(cases)(
    "uses the requested video for B1 Day $day · Chapter $chapter",
    ({ day, chapter, title, url }) => {
      expect(getAdditionalLessonVideoResources("B1", day)).toEqual([
        expect.objectContaining({ chapter, title, url }),
      ]);
    },
  );

  test.each(cases)(
    "exposes the B1 Day $day video through the shared lesson model",
    ({ day, chapter, topic, url }) => {
      const lesson = normalizeLesson({
        level: "B1",
        day,
        chapter,
        topic,
      });

      expect(lesson.resources.aiVideo).toEqual(
        expect.objectContaining({ chapter, url }),
      );
    },
  );
});
