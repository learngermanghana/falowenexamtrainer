import { B2_DAYS_21_TO_25_TUTORING } from "./b2Days21To25SelfTutoring";

describe("B2 Days 21-25 self-tutoring content", () => {
  test.each([21, 22, 23, 24, 25])("Day %s has interactive grammar and guided speaking", (day) => {
    const lesson = B2_DAYS_21_TO_25_TUTORING[day];
    expect(lesson).toBeTruthy();
    expect(lesson.quiz.length).toBeGreaterThanOrEqual(4);
    expect(lesson.branches.length).toBeGreaterThanOrEqual(4);
    lesson.branches.forEach((branch) => {
      expect(branch.prompt).toBeTruthy();
      expect(branch.example).toBeTruthy();
      expect(branch.starter).toBeTruthy();
    });
  });
});
