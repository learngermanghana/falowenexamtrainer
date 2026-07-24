import {
  B2_C1_LESSON_VIDEO_OVERRIDES,
  applyB2C1LessonVideoOverrides,
} from "./b2C1LessonMediaOverrides";
import c1Day12FreizeitUndKultur from "./selfLearningLessons/c1/day12FreizeitUndKultur";
import { getWritingVideoResource } from "./writingVideoResources";

describe("requested Schreiben and C1 Day 12 media", () => {
  test("maps the requested Schreiben videos to B1 Day 7, B2 Day 6 and C1 Day 12", () => {
    expect(getWritingVideoResource("B1", 7)).toEqual(
      expect.objectContaining({
        key: "b1-day7-fast-food-hausmannskost-writing-video",
        url: "https://youtu.be/oGOn3zKpNjo",
      }),
    );

    expect(getWritingVideoResource("B2", 6)).toEqual(
      expect.objectContaining({
        key: "b2-day6-migration-integration-writing-video",
        chapter: "2.1",
        url: "https://youtu.be/0hMcnhgRj8Q",
      }),
    );

    expect(getWritingVideoResource("C1", 12)).toEqual(
      expect.objectContaining({
        key: "c1-day12-freizeit-kultur-writing-video",
        chapter: "3.2",
        url: "https://youtu.be/0lWMEqPU6x4",
      }),
    );
  });

  test("uses the requested C1 Day 12 AI video in both lesson sources", () => {
    expect(c1Day12FreizeitUndKultur.videoResource).toEqual(
      expect.objectContaining({
        key: "c1-day12-freizeit-kultur-ai-video",
        chapter: "3.2",
        url: "https://youtu.be/LpsmADd4U30",
      }),
    );

    expect(B2_C1_LESSON_VIDEO_OVERRIDES.C1[12].videoResources[0]).toEqual(
      expect.objectContaining({
        key: "c1-day12-freizeit-kultur-ai-video",
        chapter: "3.2",
        url: "https://youtu.be/LpsmADd4U30",
      }),
    );

    const dictionary = { B2: {}, C1: {} };
    applyB2C1LessonVideoOverrides(dictionary);
    expect(dictionary.C1[12].videoResources[0].url).toBe("https://youtu.be/LpsmADd4U30");
  });
});
