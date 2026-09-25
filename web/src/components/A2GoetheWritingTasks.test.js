import fs from "fs";
import path from "path";
import { getA2GoetheWritingTask, getA2GoetheWritingTasks } from "../data/a2GoetheWritingTasks";

describe("A2 Goethe-style Teil 2 writing tasks", () => {
  test("defines one canonical task for every A2 day", () => {
    const tasks = getA2GoetheWritingTasks();
    expect(tasks).toHaveLength(28);
    expect(tasks.map((task) => task.day)).toEqual(Array.from({ length: 28 }, (_, index) => index + 1));
    expect(new Set(tasks.map((task) => task.assignmentKey)).size).toBe(28);
  });

  test.each(Array.from({ length: 28 }, (_, index) => index + 1))("Day %i has exactly three visible writing bullets", (day) => {
    const task = getA2GoetheWritingTask(day);
    expect(task).toBeTruthy();
    expect(task.situation.length).toBeGreaterThan(20);
    expect(task.points).toHaveLength(3);
    task.points.forEach((point) => expect(point.length).toBeGreaterThan(10));
  });

  test("Day 23 uses the actual school/work route task, not the stale car-dealer task", () => {
    const task = getA2GoetheWritingTask(23);
    expect(task.situation).toMatch(/Schule oder zur Arbeit/i);
    expect(task.points.join(" ")).toMatch(/Verkehrsmittel/i);
    expect(task.points.join(" ")).not.toMatch(/Autohaus|Autohändler/i);
  });
});


test("all A2 workbook surfaces route Teil 2 through the canonical Goethe card", () => {
  const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");
  const shared = read("A2StandardTabbedWorkbookPage.js");
  expect(shared).toContain("<A2GoetheWritingTaskCard day={day} />");

  [
    ["A2Day12MeinTraumberufWorkbookPageLegacy.js", 12],
    ["A2Day13VorstellungsgespraechWorkbookPageLegacy.js", 13],
    ["A2Day14BerufUndKarriereWorkbookPage.js", 14],
    ["A2Day17InDieApothekeGehenWorkbookPage.js", 17],
  ].forEach(([file, day]) => {
    expect(read(file)).toContain(`<A2GoetheWritingTaskCard day={${day}} />`);
  });
});
