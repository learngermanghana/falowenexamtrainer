import fs from "fs";
import path from "path";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2Day12MeinTraumberufWorkbookPage from "./A2Day12MeinTraumberufWorkbookPage";
import A2Day13VorstellungsgespraechWorkbookPage from "./A2Day13VorstellungsgespraechWorkbookPage";
import A2Day14BerufUndKarriereWorkbookPage from "./A2Day14BerufUndKarriereWorkbookPage";
import A2Day17InDieApothekeGehenWorkbookPage from "./A2Day17InDieApothekeGehenWorkbookPage";
import { isA2WritingRequired } from "../data/a2WritingSchedule";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: null, studentProfile: null }) }));
// Day 14/17 mount the optional AI coach; it is unrelated to workbook writing visibility.
jest.mock("./GoetheFreeChatPage", () => () => null);
afterEach(cleanup);
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


test("the shared workbook shell owns the canonical Goethe writing card", () => {
  const source = fs.readFileSync(path.resolve(__dirname, "A2StandardTabbedWorkbookPage.js"), "utf8");
  expect(source).toContain("<A2GoetheWritingTaskCard day={day} />");
  expect(source).toContain('writingRequired && displayedActiveTab === "schreiben"');
});

test.each([
  [12, A2Day12MeinTraumberufWorkbookPage],
  [13, A2Day13VorstellungsgespraechWorkbookPage],
])("Day %i really renders the three-point Goethe card on the Schreiben route", (day, Workbook) => {
  expect(isA2WritingRequired(day)).toBe(true);
  render(
    <MemoryRouter initialEntries={[`/campus/course/a2-day-${day}-workbook?view=schreiben&radio=done`]}>
      <Workbook />
    </MemoryRouter>,
  );
  const task = getA2GoetheWritingTask(day);
  expect(screen.getByRole("heading", { name: /Teil 2 · Schreiben \(Assignment\)/i })).toBeInTheDocument();
  expect(screen.getByText(task.situation)).toBeInTheDocument();
  expect(screen.getByText("Schreiben Sie zu allen drei Punkten:")).toBeInTheDocument();
  for (const point of task.points) expect(screen.getByText(point)).toBeInTheDocument();
});

test.each([
  [14, A2Day14BerufUndKarriereWorkbookPage],
  [17, A2Day17InDieApothekeGehenWorkbookPage],
])("Day %i deliberately excludes graded Schreiben and cannot render a hidden Goethe card", (day, Workbook) => {
  expect(isA2WritingRequired(day)).toBe(false);
  render(
    <MemoryRouter initialEntries={[`/campus/course/a2-day-${day}-workbook?view=schreiben&radio=done`]}>
      <Workbook />
    </MemoryRouter>,
  );
  expect(screen.queryByRole("tab", { name: /^Teil 2/ })).not.toBeInTheDocument();
  expect(screen.queryByText("Schreiben Sie zu allen drei Punkten:")).not.toBeInTheDocument();
  expect(screen.queryByText(getA2GoetheWritingTask(day).situation)).not.toBeInTheDocument();
});
