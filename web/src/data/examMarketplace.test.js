import { EXAMS_LEVELS, EXAMS_PACKAGES, EXAMS_READY_FULL_MOCKS, canOpenExamOnlyPath } from "./examMarketplace";

describe("Falowen Exams marketplace", () => {
  test("advertises A1 through C2 but only offers full mocks that are published", () => {
    expect(EXAMS_LEVELS).toEqual(["A1", "A2", "B1", "B2", "C1", "C2"]);
    expect(Object.keys(EXAMS_READY_FULL_MOCKS)).toEqual(["A1", "A2", "B1", "B2"]);
    expect(EXAMS_PACKAGES.find(({id}) => id === "single").price).toBe(49);
    expect(EXAMS_PACKAGES.find(({id}) => id === "teil").comingSoon).toBe(true);
    expect(EXAMS_PACKAGES.find(({id}) => id === "ready").comingSoon).toBe(true);
  });
  test("exam-only routes never grant course navigation", () => {
    expect(canOpenExamOnlyPath("/exams/overview", "A2")).toBe(true);
    expect(canOpenExamOnlyPath("/exams/lesen/A2/sample-1", "A2")).toBe(true);
    expect(canOpenExamOnlyPath("/exams/lesen/B2/sample-1", "A2")).toBe(false);
    expect(canOpenExamOnlyPath("/campus/course/a2-final-mock-exam", "A2")).toBe(true);
    expect(canOpenExamOnlyPath("/campus/course/b1-final-mock-exam", "A2")).toBe(false);
    expect(canOpenExamOnlyPath("/campus/course/lesson/A2/1", "A2")).toBe(false);
    expect(canOpenExamOnlyPath("/campus/account", "A2")).toBe(false);
  });
});
