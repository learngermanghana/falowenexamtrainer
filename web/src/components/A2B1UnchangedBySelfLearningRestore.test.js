import { getSelfLearningLessonComponent } from "./SelfLearningLessonRegistry";
import { normalizeLesson } from "../data/lessonModel";

describe("A2 and B1 remain unchanged", () => {
  test("A2 remains a four-part workbook outside the self-learning registry", () => {
    const lesson = normalizeLesson({ day: 1 }, "A2");
    expect(lesson.lessonType).toBe("fourPartWorkbook");
    expect(lesson.capabilities.fourPartWorkbook).toBe(true);
    expect(getSelfLearningLessonComponent("A2", 1)).toBeNull();
  });

  test("B1 keeps its tutor-marked Radio entrance", () => {
    const lesson = normalizeLesson({ day: 1 }, "B1");
    expect(lesson.lessonType).toBe("fourPartWorkbook");
    expect(lesson.capabilities.fourPartWorkbook).toBe(true);
    expect(typeof getSelfLearningLessonComponent("B1", 1)).toBe("function");
  });
});
