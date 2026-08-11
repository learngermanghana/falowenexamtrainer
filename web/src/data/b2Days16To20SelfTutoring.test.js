import { B2_DAYS_16_TO_20_SUPPORT } from "./b2Days16To20SelfTutoring";

describe("B2 Days 16-20 self-tutoring support", () => {
  test.each([16, 17, 18, 19, 20])("Day %s has interactive grammar and guided speaking", (day) => {
    const lesson = B2_DAYS_16_TO_20_SUPPORT[day];
    expect(lesson).toBeTruthy();
    expect(lesson.quiz).toHaveLength(4);
    expect(lesson.branches.length).toBeGreaterThanOrEqual(4);
    lesson.branches.forEach((branch) => {
      expect(branch.prompt).toBeTruthy();
      expect(branch.example).toBeTruthy();
      expect(branch.starter).toBeTruthy();
    });
  });
});
