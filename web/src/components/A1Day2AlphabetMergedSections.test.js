import { A1_ASSIGNMENT_REGISTRY, A1_ASSIGNMENT_ORDER } from "../data/a1AssignmentRegistry";

describe("A1 Day 2 archived chapter and merged assignment", () => {
  test("keeps legacy A1-0.2 questions available without assigning them again", () => {
    expect(A1_ASSIGNMENT_REGISTRY["A1-0.2"].sections.map(s => s.key)).toEqual(["teil-1", "teil-2"]);
    expect(A1_ASSIGNMENT_REGISTRY["A1-1.1"].sections).toHaveLength(2);
    expect(A1_ASSIGNMENT_ORDER).not.toContain("A1-0.2");
    expect(A1_ASSIGNMENT_ORDER).not.toContain("A1-1.1");
  });
  test("new Day 2 uses one five-section assignment", () => {
    expect(A1_ASSIGNMENT_ORDER).toContain("A1-0.2-1.1");
    expect(A1_ASSIGNMENT_REGISTRY["A1-0.2-1.1"].sections.map(s => s.key))
      .toEqual(["teil-1", "teil-2", "teil-3", "teil-4", "teil-5"]);
  });
});
