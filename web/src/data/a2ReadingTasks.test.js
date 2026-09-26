import fs from "fs";
import path from "path";
import { A2_READING_DAYS, A2_READING_TASKS } from "./a2ReadingTasks";

const componentRoot = path.resolve(__dirname, "../components");
const readComponent = (fileName) => fs.readFileSync(path.join(componentRoot, fileName), "utf8");

describe("A2 canonical Lesen tasks", () => {
  test("covers every teaching day from 1 through 28", () => {
    expect(A2_READING_DAYS).toEqual(Array.from({ length: 28 }, (_, index) => index + 1));
    expect(Object.keys(A2_READING_TASKS)).toHaveLength(28);
  });

  test("keeps daily Lesen compact and exam-oriented", () => {
    const formats = new Set();

    A2_READING_DAYS.forEach((day) => {
      const task = A2_READING_TASKS[day];
      formats.add(task.format);

      expect(task.chapter).toBeTruthy();
      expect(task.title).toBeTruthy();
      expect(task.strategy).toBeTruthy();
      expect(task.text.length).toBeGreaterThan(100);
      expect(task.questions).toHaveLength(5);

      task.questions.forEach((question) => {
        expect(question.stem).toBeTruthy();
        expect(question.options.length).toBeGreaterThanOrEqual(3);
        expect(new Set(question.options).size).toBe(question.options.length);
        question.options.forEach((option) => expect(option).toMatch(/^[A-D]\)/));
      });
    });

    expect(formats.size).toBeGreaterThanOrEqual(12);
  });

  test("does not ship correct-answer metadata in the learner reading source", () => {
    const serialized = JSON.stringify(A2_READING_TASKS);
    expect(serialized).not.toMatch(/correctAnswer|answerKey|solution/i);
  });

  test("replaces the known weak or mismatched Lesen content", () => {
    expect(A2_READING_TASKS[12].text).not.toMatch(/beglaubigen|Anerkennung ausländischer Abschlüsse/i);
    expect(A2_READING_TASKS[13].title).toMatch(/Vorstellungsgespräch/i);
    expect(A2_READING_TASKS[13].text).not.toMatch(/Kinderbetreuung|Kinderkrippe/i);
    expect(A2_READING_TASKS[19].text).not.toMatch(/soziale Gerechtigkeit|Umweltverschmutzung/i);
    expect(A2_READING_TASKS[23].text).toMatch(/Regionalzug/);
    expect(A2_READING_TASKS[23].text).toMatch(/Bus 16/);
    expect(A2_READING_TASKS[23].text).toMatch(/U-Bahn/);
  });

  test("routes Days 12, 13, 14 and 17 through the shared canonical workbook shell", () => {
    const shared = readComponent("A2StandardTabbedWorkbookPage.js");
    expect(shared).toContain("A2ReadingTaskPanel");

    [
      "A2Day12MeinTraumberufWorkbookPage.js",
      "A2Day13VorstellungsgespraechWorkbookPage.js",
      "A2Day14BerufUndKarriereWorkbookPage.js",
      "A2Day17InDieApothekeGehenWorkbookPage.js",
    ].forEach((fileName) => {
      const source = readComponent(fileName);
      expect(source).toContain('import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage"');
      expect(source).toContain("<A2StandardTabbedWorkbookPage");
      expect(source).not.toMatch(/WorkbookPageLegacy|useLayoutEffect|MutationObserver/);
    });
  });
});
