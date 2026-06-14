import { getSelfLearningLessonComponent } from "./SelfLearningLessonRegistry";
import { LESSON_RADIO_DICTIONARY } from "../data/lessonRadioDictionary";

test("uses the shared four-stage journey for B2 and C1 lessons", () => {
  expect(typeof getSelfLearningLessonComponent("B2", 1)).toBe("function");
  expect(typeof getSelfLearningLessonComponent("B2", 28)).toBe("function");
  expect(typeof getSelfLearningLessonComponent("C1", 2)).toBe("function");
  expect(typeof getSelfLearningLessonComponent("C1", 28)).toBe("function");
});

test("keeps normal B1 lessons on the original tutor-marked structure", () => {
  expect(getSelfLearningLessonComponent("B1", 1)).toBeNull();
  expect(getSelfLearningLessonComponent("B1", 28)).toBeNull();
});

test("uses the B1 radio entrance only when that B1 day has an episode", () => {
  LESSON_RADIO_DICTIONARY.B1 = {
    99: {
      key: "b1-day99-test-radio",
      title: "Test radio",
      youtubeId: "test-radio",
    },
  };

  expect(typeof getSelfLearningLessonComponent("B1", 99)).toBe("function");

  delete LESSON_RADIO_DICTIONARY.B1;
});

test("does not replace B1 Day 0 orientation", () => {
  expect(getSelfLearningLessonComponent("B1", 0)).toBeNull();
});
