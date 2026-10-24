import { SELF_LEARNING_LESSONS } from "./SelfLearningLessonRegistry";
import { getWritingVideoResource } from "../data/writingVideoResources";

const getLesson = (level, day) =>
  SELF_LEARNING_LESSONS[level].find((lesson) => Number(lesson.day) === Number(day));

describe("B2 and C1 lesson media roles", () => {
  test("retired B2 lesson videos are no longer attached to redesigned B2 days", () => {
    [1, 2, 3, 4, 5, 6, 7].forEach((day) => {
      expect(getLesson("B2", day)?.videoResource).toBeFalsy();
    });
  });

  test("C1 keeps its explicit Day 1 AI lesson video", () => {
    expect(getLesson("C1", 1)?.videoResource).toEqual(
      expect.objectContaining({ url: "https://www.youtube.com/watch?v=u41XmMwb5PU" }),
    );
  });

  test("retired B2 writing videos no longer map into the redesigned course", () => {
    [1, 2, 3, 4, 5, 6, 7, 12].forEach((day) => {
      expect(getWritingVideoResource("B2", day)).toBeNull();
    });
  });

  test.each([
    ["C1", 8, "https://youtu.be/VdczhJS9ClY"],
    ["C1", 9, "https://youtu.be/tpj8TV8DaH8"],
    ["C1", 10, "https://youtu.be/I5OU_ZXz4c0"],
    ["C1", 11, "https://youtu.be/Ww6gq3lmmpk"],
  ])("keeps the saved %s Day %i Schreiben video mapping", (level, day, url) => {
    expect(getWritingVideoResource(level, day)).toEqual(
      expect.objectContaining({ url }),
    );
  });
});
