import { B1_READING_TASKS, getB1ReadingTask } from "./b1ReadingTasks";

describe("B1 canonical reading registry", () => {
  test("covers all 28 B1 workbook days exactly once", () => {
    expect(Object.keys(B1_READING_TASKS).map(Number).sort((a, b) => a - b)).toEqual(Array.from({ length: 28 }, (_, i) => i + 1));
  });

  test.each(Array.from({ length: 28 }, (_, i) => i + 1))("Day %i keeps assignment identity and real reading content", (day) => {
    const task = getB1ReadingTask(day);
    expect(task).toBeTruthy();
    expect(task.assignmentKey).toMatch(new RegExp(`^B1-(?:\\d+)\\.${day}$`));
    expect(task.title).toBeTruthy();
    expect(task.instructions).toBeTruthy();
  });
});
