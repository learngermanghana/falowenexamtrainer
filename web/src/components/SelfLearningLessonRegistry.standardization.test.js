import { getSelfLearningLessonComponent } from "./SelfLearningLessonRegistry";

test("uses the shared journey for normal B1 B2 and C1 lessons", () => {
  expect(typeof getSelfLearningLessonComponent("B1", 1)).toBe("function");
  expect(typeof getSelfLearningLessonComponent("B2", 1)).toBe("function");
  expect(typeof getSelfLearningLessonComponent("B2", 28)).toBe("function");
  expect(typeof getSelfLearningLessonComponent("C1", 2)).toBe("function");
  expect(typeof getSelfLearningLessonComponent("C1", 28)).toBe("function");
});

test("does not replace B1 Day 0 orientation", () => {
  expect(getSelfLearningLessonComponent("B1", 0)).toBeNull();
});
