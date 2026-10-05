import { buildPracticeMockConfig, getMockExam, getMockExamsForLevel } from "../data/mockExamCatalog";

describe("mock exam catalog", () => {
  test("keeps the A2 course mock as a reusable configured exam", () => {
    const exam = getMockExam("a2-course-preview-01");
    expect(exam.level).toBe("A2");
    expect(exam.questionSetId).toBe("a2-course-preview-01");
    expect(exam.sectionCards.map((section) => section.key)).toEqual([
      "lesen",
      "hoeren",
      "schreiben",
      "sprechen",
    ]);
  });

  test("filters Exams Room mocks by level without reusing course questions", () => {
    expect(getMockExamsForLevel("A1").map((exam) => exam.id)).toContain("a1-final-01");
    expect(getMockExamsForLevel("A2").map((exam) => exam.id)).not.toContain("a2-course-preview-01");
    expect(getMockExamsForLevel("A2", { includeCourse: true }).map((exam) => exam.id)).toContain(
      "a2-course-preview-01",
    );
  });

  test("creates a new practice question set without duplicating page code", () => {
    const exam = buildPracticeMockConfig({
      id: "a2-practice-02",
      level: "A2",
      title: "A2 Mock 2",
      route: "/exams/mocks/a2-practice-02",
    });
    expect(exam.mode).toBe("full");
    expect(exam.questionSetId).toBe("a2-practice-02");
    expect(exam.sections).toHaveLength(4);
  });
});
