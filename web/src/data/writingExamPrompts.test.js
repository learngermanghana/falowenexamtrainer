import { WRITING_PROMPTS } from "./writingExamPrompts";

describe("A1 Exam Room writing prompt bank", () => {
  test("uses the ten Goethe-style A1 Schreiben samples", () => {
    expect(WRITING_PROMPTS.A1).toHaveLength(10);
    WRITING_PROMPTS.A1.forEach((task) => {
      expect(task.Thema).toBeTruthy();
      expect(task.Punkte).toHaveLength(3);
    });
  });

  test("starts with the Berlin hotel task and ends with the heating problem", () => {
    expect(WRITING_PROMPTS.A1[0].Thema).toContain("Hotel „Berliner Hof“");
    expect(WRITING_PROMPTS.A1[9].Thema).toContain("Heizung");
    expect(WRITING_PROMPTS.A1[9].Thema).toContain("Herrn Schneider");
  });

  test("does not expose the retired A1 prompt bank", () => {
    const serialized = JSON.stringify(WRITING_PROMPTS.A1);
    expect(serialized).not.toContain("Patrick nach Köln");
    expect(serialized).not.toContain("Moritz");
    expect(serialized).not.toContain("Hotel AMANO");
  });
});
