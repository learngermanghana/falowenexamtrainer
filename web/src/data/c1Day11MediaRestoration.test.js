import {
  B2_C1_LESSON_VIDEO_OVERRIDES,
  getB2C1RadioResource,
} from "./b2C1LessonMediaOverrides";
import c1Day11EngagementUndEhrenamt from "./selfLearningLessons/c1/day11EngagementUndEhrenamt";

describe("C1 Day 11 media", () => {
  test("uses the approved AI lesson and Falowen Radio resources", () => {
    expect(B2_C1_LESSON_VIDEO_OVERRIDES.C1[11].videoResources[0]).toEqual(
      expect.objectContaining({
        chapter: "3.1",
        url: "https://youtu.be/F67RRmGNK1c",
      }),
    );
    expect(getB2C1RadioResource("C1", 11)).toEqual(
      expect.objectContaining({ youtubeId: "orR1ptbJtnc" }),
    );
    expect(c1Day11EngagementUndEhrenamt.videoResource).toEqual(
      expect.objectContaining({ url: "https://youtu.be/F67RRmGNK1c" }),
    );
  });
});
