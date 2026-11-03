import { B1_MOCK3_WRITING_TASKS, B1_MOCK3_SCHREIBEN_MINUTES, B1_MOCK3_SCHREIBEN_RUBRIC } from "./b1Mock3WritingTasks";
import { MOCK_EXAM_CATALOG } from "./mockExamCatalog";

describe("B1 Mock 3 Schreiben source + standardized practice contract", () => {
  test("three teacher tasks use the 20/25/15 minute and 80/80/40 word layout", () => {
    expect(B1_MOCK3_WRITING_TASKS.map((task) => task.id)).toEqual(["teil1", "teil2", "teil3"]);
    expect(B1_MOCK3_WRITING_TASKS.map((task) => task.minutes)).toEqual([20, 25, 15]);
    expect(B1_MOCK3_WRITING_TASKS.map((task) => task.target)).toEqual([80, 80, 40]);
    expect(B1_MOCK3_SCHREIBEN_MINUTES).toBe(60);
    expect(B1_MOCK3_WRITING_TASKS.reduce((sum, task) => sum + task.minutes, 0)).toBe(60);
  });

  test("uses the exact source scenarios rather than Mock 1/2 topics", () => {
    expect(B1_MOCK3_WRITING_TASKS[0].prompt).toContain("Ausflug in eine andere Stadt");
    expect(B1_MOCK3_WRITING_TASKS[0].points.join(" ")).toContain("Fotos");
    expect(B1_MOCK3_WRITING_TASKS[1].prompt).toContain("gedruckte Bücher oder reichen E-Books");
    expect(B1_MOCK3_WRITING_TASKS[1].quoteBy).toBe("Laura (12.10., 18:30 Uhr)");
    expect(B1_MOCK3_WRITING_TASKS[1].quote).toContain("E-Reader");
    expect(B1_MOCK3_WRITING_TASKS[2].prompt).toContain("Herr Schneider");
    expect(B1_MOCK3_WRITING_TASKS[2].prompt).toContain("Arzttermin");
    expect(B1_MOCK3_WRITING_TASKS[2].points.join(" ")).toContain("neuen Termin");
  });

  test("retains 40/40/20 practice grading rubric without publishing sample solutions", () => {
    expect(B1_MOCK3_WRITING_TASKS.map((task) => task.maxPoints)).toEqual([40, 40, 20]);
    expect(B1_MOCK3_SCHREIBEN_RUBRIC.totalPoints).toBe(100);
    expect(B1_MOCK3_SCHREIBEN_RUBRIC.passPoints).toBe(60);
    expect(B1_MOCK3_SCHREIBEN_RUBRIC.criteria).toEqual([
      "Aufgabenerfüllung", "Kohärenz", "Wortschatz", "Strukturen",
    ]);
    const studentText = JSON.stringify(B1_MOCK3_WRITING_TASKS);
    expect(studentText).not.toContain("Musterlösung");
    expect(studentText).not.toContain("Lieber Jonas");
    expect(studentText).not.toContain("Marco Rossi");
  });

  test("lists both practice modules but keeps the full mock gated", () => {
    const mock = MOCK_EXAM_CATALOG["b1-mock-03-pending"];
    expect(mock.status).toBe("preview");
    expect(mock.mode).toBe("section-preview");
    expect(mock.sections).toContain("Schreiben · 3 tasks");
    expect(mock.sections).toContain("Lesen · 30 questions");
    expect(mock.sections).toContain("Hören pending");
    expect(mock.sections).toContain("Sprechen pending");
  });
});
