import { SELF_LEARNING_LESSONS } from "./SelfLearningLessonRegistry";
import { getWritingVideoResource } from "../data/writingVideoResources";

const getLesson = (level, day) =>
  SELF_LEARNING_LESSONS[level].find((lesson) => Number(lesson.day) === Number(day));

describe("B2 and C1 lesson media roles", () => {
  test.each([
    ["B2", 1, "https://youtu.be/HhUUkc8zgEc"],
    ["C1", 1, "https://www.youtube.com/watch?v=u41XmMwb5PU"],
  ])("keeps the explicit %s Day %i AI lesson video", (level, day, url) => {
    expect(getLesson(level, day)?.videoResource).toEqual(
      expect.objectContaining({ url }),
    );
  });

  test.each([
    ["B2", 1, "https://youtu.be/w8TaNHk-a0U"],
    ["B2", 3, "https://youtu.be/qCO2p1Ahy7U"],
    ["B2", 4, "https://youtu.be/ltTxYa_T2xc"],
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
