import { LEVEL_CAPABILITIES, normalizeA1Lesson, normalizeA2B1Lesson, normalizeB2C1Lesson } from "./lessonModel";

describe("canonical lesson model", () => {
  test("preserves A1 teacher video behavior and legacy links", () => {
    const lesson = normalizeA1Lesson({ day: 7, youtube_link: "teacher", grammarbook_link: "grammar", workbook_link: "workbook", assignmentId: "keep-me" });
    expect(lesson.resources.teacherVideo.url).toBe("teacher");
    expect(lesson.resources.grammarBook.url).toBe("grammar");
    expect(lesson.resources.workbook.url).toBe("workbook");
    expect(lesson.submission.assignmentId).toBe("keep-me");
  });
  test("keeps A2/B1 workbook capabilities", () => expect(normalizeA2B1Lesson({ day: 9 }, "B1").lessonType).toBe("fourPartWorkbook"));
  test.each(["B2", "C1"])("keeps %s self-learning compatibility", (level) => {
    const lesson = normalizeB2C1Lesson({ day: 1, assignment: true }, level);
    expect(lesson.lessonType).toBe("selfLearning");
    expect(lesson.submission.enabled).toBe(false);
    expect(lesson.capabilities.selfAssessment).toBe(true);
  });
  test("does not enable radio for A1", () => expect(LEVEL_CAPABILITIES.A1.radio).toBe(false));
});
