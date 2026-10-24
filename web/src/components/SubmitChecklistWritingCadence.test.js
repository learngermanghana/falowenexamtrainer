import { getRequiredChecklist } from "./SubmitPageLevelGuidanceInjector";

describe("A2/B1 submission completion checklist cadence", () => {
  test("A2 Day 2 checklist does not require Schreiben", () => {
    const checklist = getRequiredChecklist("A2", "A2-1.2");
    expect(checklist.map((item) => item.id)).toEqual(["teil-3", "teil-4"]);
  });

  test("A2 Day 3 checklist still requires Schreiben", () => {
    const checklist = getRequiredChecklist("A2", "A2-1.3");
    expect(checklist.map((item) => item.id)).toContain("teil-2");
  });

  test("B1 Day 2 checklist does not require Schreiben", () => {
    const checklist = getRequiredChecklist("B1", "B1-1.2");
    expect(checklist.map((item) => item.id)).not.toContain("teil-2");
  });
});
