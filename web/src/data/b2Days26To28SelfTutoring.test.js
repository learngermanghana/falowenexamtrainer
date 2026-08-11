import tutoring from "./b2Days26To28SelfTutoring";

describe("B2 Days 26-28 self-tutoring content", () => {
  test.each([26, 27, 28])("Day %s has interactive grammar and guided speaking", (day) => {
    const item = tutoring[day];
    expect(item).toBeTruthy();
    expect(item.quiz.length).toBeGreaterThanOrEqual(4);
    expect(item.branches.length).toBeGreaterThanOrEqual(4);
    item.branches.forEach((branch) => {
      expect(branch.prompt).toBeTruthy();
      expect(branch.example).toBeTruthy();
      expect(branch.starter).toBeTruthy();
    });
  });
});
