import { B1_WRITING_TASKS, getB1WritingTask } from "./b1WritingTasks";

const CANONICAL_CONFIG_DAYS = [9, 10, 12, 13, 14, 15, 16, 17, 18, 21, 23, 24, 25, 26, 27, 28];

describe("B1 canonical writing registry", () => {
  test("covers every config-driven B1 workbook exactly once", () => {
    expect(Object.keys(B1_WRITING_TASKS).map(Number).sort((a, b) => a - b)).toEqual(CANONICAL_CONFIG_DAYS);
  });

  test.each(CANONICAL_CONFIG_DAYS)("Day %i keeps assignment identity and real writing content", (day) => {
    const task = getB1WritingTask(day);
    expect(task).toBeTruthy();
    expect(task.assignmentKey).toMatch(new RegExp(`^B1-\\d+\\.${day}$`));
    expect(task.title).toBeTruthy();
    expect(task.instructions).toBeTruthy();
  });
});
