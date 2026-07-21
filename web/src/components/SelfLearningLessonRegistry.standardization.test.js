import { getSelfLearningLessonComponent, SELF_LEARNING_LESSONS } from "./SelfLearningLessonRegistry";
import { LESSON_RADIO_DICTIONARY } from "../data/lessonRadioDictionary";

test("uses the shared radio and materials journey for every B2 and C1 self-learning lesson", () => {
  SELF_LEARNING_LESSONS.B2.forEach((lesson) => {
    expect(typeof getSelfLearningLessonComponent("B2", lesson.day)).toBe("function");
  });
  SELF_LEARNING_LESSONS.C1.forEach((lesson) => {
    expect(typeof getSelfLearningLessonComponent("C1", lesson.day)).toBe("function");
  });
});

test("keeps B1 radio lessons on the original tutor-marked structure", () => {
  expect(typeof getSelfLearningLessonComponent("B1", 1)).toBe("function");
  expect(typeof getSelfLearningLessonComponent("B1", 28)).toBe("function");
});

test("uses the B1 radio entrance only when that B1 day has an episode", () => {
  const originalB1 = LESSON_RADIO_DICTIONARY.B1;
  LESSON_RADIO_DICTIONARY.B1 = {
    99: {
      key: "b1-day99-test-radio",
      title: "Test radio",
      youtubeId: "test-radio",
    },
  };

  expect(typeof getSelfLearningLessonComponent("B1", 99)).toBe("function");
  expect(getSelfLearningLessonComponent("B1", 1)).toBeNull();

  LESSON_RADIO_DICTIONARY.B1 = originalB1;
});

test("does not replace B1 Day 0 orientation", () => {
  expect(getSelfLearningLessonComponent("B1", 0)).toBeNull();
});

test("C1 Day 3 keeps five rich C1 speaking branches", () => {
  const lesson = SELF_LEARNING_LESSONS.C1.find((entry) => entry.day === 3);
  expect(lesson.speakingBuilder.branches).toHaveLength(5);
  lesson.speakingBuilder.branches.forEach((branch) => {
    expect(branch.keywords.length).toBeGreaterThanOrEqual(5);
    expect(branch.prompt).toBeTruthy();
    expect(branch.example).toBeTruthy();
    expect(branch.starter).toBeTruthy();
  });
  expect(lesson.speakingBuilder.branches.map((branch) => branch.title)).not.toEqual(expect.arrayContaining(["Einleitung", "Hauptteil 1", "Hauptteil 2", "Schluss"]));
});

test.each([4, 10, 19, 20, 28])("C1 Day %i uses the rich C1 speaking standard", (day) => {
  const lesson = SELF_LEARNING_LESSONS.C1.find((entry) => entry.day === day);
  expect(lesson.speakingBuilder.branches).toHaveLength(5);
  lesson.speakingBuilder.branches.forEach((branch) => {
    expect(branch.keywords).toHaveLength(5);
    expect(branch.prompt).toBeTruthy();
    expect(branch.example).toBeTruthy();
    expect(branch.starter).toBeTruthy();
  });
});
