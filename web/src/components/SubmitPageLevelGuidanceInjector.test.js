import { getAssignmentKey, getRequiredChecklist } from "./SubmitPageLevelGuidanceInjector";

describe("SubmitPageLevelGuidanceInjector completion checklist", () => {
  test("detects the canonical assignment from a workbook submit link", () => {
    expect(getAssignmentKey("Day 1 · Greetings", "?assignmentKey=A1-0.1")).toBe("A1-0.1");
  });

  test("treats the reading-only part of A1-0.1 differently from its questions", () => {
    expect(getRequiredChecklist("A1", "A1-0.1")).toEqual([
      expect.objectContaining({ id: "teil-1", kind: "read", label: expect.stringMatching(/I read Teil 1/i) }),
      expect.objectContaining({ id: "teil-2", kind: "answer", label: expect.stringMatching(/I answered every question/i) }),
    ]);
  });

  test.each(["A2", "B1"])("requires Teil 2, Teil 3 and Teil 4 for %s assignments", (level) => {
    expect(getRequiredChecklist(level, `${level}-1`)).toEqual([
      expect.objectContaining({ id: "teil-2" }),
      expect.objectContaining({ id: "teil-3" }),
      expect.objectContaining({ id: "teil-4" }),
    ]);
  });
});
