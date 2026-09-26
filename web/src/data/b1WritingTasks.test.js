import { B1_WRITING_TASKS, getB1WritingTask } from "./b1WritingTasks";

describe("B1 canonical writing registry", () => {
  test("covers all 28 B1 workbook days exactly once", () => {
    expect(Object.keys(B1_WRITING_TASKS).map(Number).sort((a, b) => a - b)).toEqual(Array.from({ length: 28 }, (_, i) => i + 1));
  });

  test.each(Array.from({ length: 28 }, (_, i) => i + 1))("Day %i keeps assignment identity and real writing content", (day) => {
    const task = getB1WritingTask(day);
    expect(task).toBeTruthy();
    expect(task.assignmentKey).toMatch(new RegExp(`^B1-(?:\\d+)\\.${day}$`));
    expect(task.title).toBeTruthy();
    expect(task.instructions).toBeTruthy();
  });
});
