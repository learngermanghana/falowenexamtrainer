import { getExamPracticeLevels, resolveExamPracticeLevel } from "./examLevelAccess";

describe("Exams Room downward-only levels", () => {
  it.each([
    ["A1", ["A1"]],
    ["A2", ["A1", "A2"]],
    ["B1", ["A1", "A2", "B1"]],
    ["B2", ["A1", "A2", "B1", "B2"]],
    ["C1", ["A1", "A2", "B1", "B2", "C1"]],
    ["C2", ["A1", "A2", "B1", "B2", "C1", "C2"]],
  ])("%s can practise its own and earlier levels", (enrolled, expected) => {
    expect(getExamPracticeLevels(enrolled)).toEqual(expected);
  });

  it("keeps a remembered lower choice, never one above enrollment", () => {
    expect(resolveExamPracticeLevel("B1", "A1")).toBe("A1");
    expect(resolveExamPracticeLevel("B1", "A2")).toBe("A2");
    expect(resolveExamPracticeLevel("B1", "B1")).toBe("B1");
    expect(resolveExamPracticeLevel("A2", "B1")).toBe("A2");
    expect(resolveExamPracticeLevel("A1", "C2")).toBe("A1");
    expect(resolveExamPracticeLevel("B2", "not-a-level")).toBe("B2");
    expect(resolveExamPracticeLevel("B1 class", "A2")).toBe("A2");
  });
});
