import fs from "fs";
import path from "path";
import { A2_READING_DAYS, A2_READING_TASKS } from "../data/a2ReadingTasks";
import {
  A2_GRADED_LISTENING_DAYS,
  A2_LISTENING_DAYS,
  A2_LISTENING_MODES,
  A2_LISTENING_TASKS,
  A2_NO_LISTENING_DAYS,
  A2_SELF_CHECK_LISTENING_DAYS,
} from "../data/a2ListeningTasks";

const read = (file) => fs.readFileSync(path.resolve(__dirname, file), "utf8");

describe("A2 canonical assessment content guard", () => {
  test("covers all 28 teaching days in both Lesen and Hören sources", () => {
    const days = Array.from({ length: 28 }, (_, index) => index + 1);
    expect(A2_READING_DAYS).toEqual(days);
    expect(A2_LISTENING_DAYS).toEqual(days);
  });

  test("keeps exactly five canonical Lesen questions per day", () => {
    A2_READING_DAYS.forEach((day) => {
      expect(A2_READING_TASKS[day].questions).toHaveLength(5);
    });
  });

  test("keeps the approved A2 Hören mode split", () => {
    expect(A2_GRADED_LISTENING_DAYS).toHaveLength(21);
    expect(A2_SELF_CHECK_LISTENING_DAYS).toEqual([21, 22, 23, 24, 26]);
    expect(A2_NO_LISTENING_DAYS).toEqual([14, 25]);
  });

  test("graded Hören always has audio and questions", () => {
    A2_GRADED_LISTENING_DAYS.forEach((day) => {
      const task = A2_LISTENING_TASKS[day];
      expect(task.mode).toBe(A2_LISTENING_MODES.GRADED);
      expect(task.audioUrl).toBeTruthy();
      expect(task.questions.length).toBeGreaterThan(0);
    });
  });

  test("self-check and no-Hören days never carry submitted question sets", () => {
    A2_SELF_CHECK_LISTENING_DAYS.forEach((day) => {
      const task = A2_LISTENING_TASKS[day];
      expect(task.mode).toBe(A2_LISTENING_MODES.SELF_CHECK);
      expect(task.audioUrl).toBeTruthy();
      expect(task.questions).toHaveLength(0);
    });
    A2_NO_LISTENING_DAYS.forEach((day) => {
      const task = A2_LISTENING_TASKS[day];
      expect(task.mode).toBe(A2_LISTENING_MODES.NONE);
      expect(task.audioUrl).toBe("");
      expect(task.questions).toHaveLength(0);
    });
  });

  test("individual A2 wrappers do not own Lesen or Hören assessment data", () => {
    const componentRoot = path.resolve(__dirname);
    fs.readdirSync(componentRoot)
      .filter((file) => /^A2.*Workbook.*Page\.js$/.test(file) && !file.includes("Legacy"))
      .forEach((file) => {
        const source = read(file);
        if (!source.includes("<A2StandardTabbedWorkbookPage")) return;
        expect(source).not.toMatch(/\b(?:lesenText|lesenQuestions|hoerenTask|hoerenAudioUrl|hoerenQuestions|hoerenSelfCheck|showHoeren)\b/);
        expect(source).not.toMatch(/\b(?:const|let)\s+(?:readingQuestions|listeningQuestions|lesenQuestions|hoerenQuestions)\b/);
      });
  });

  test("the shared A2 workbook derives Hören from canonical data", () => {
    const source = read("A2StandardTabbedWorkbookPage.js");
    expect(source).toContain("getA2ListeningTask(day)");
    expect(source).toContain("A2_LISTENING_MODES.SELF_CHECK");
    expect(source).not.toContain("hoerenContent = null");
  });
});
