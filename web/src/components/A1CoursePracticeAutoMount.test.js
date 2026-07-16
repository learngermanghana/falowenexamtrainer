import {
  isA1LetterWritingCourseBookPath,
  isA1LetterWritingGrammarPath,
  shouldAutoMountA1WritingPractice,
} from "./A1CoursePracticeAutoMount";

describe("A1CoursePracticeAutoMount route ownership", () => {
  test("does not globally inject Mark My Letter into either letter-writing route", () => {
    const workbookPath = "/campus/course/letter-writing-intro-german-a1-day-12-3";
    const grammarPath = "/campus/course/letter-writing-intro-12-3";

    expect(isA1LetterWritingCourseBookPath(workbookPath)).toBe(true);
    expect(isA1LetterWritingGrammarPath(grammarPath)).toBe(true);
    expect(shouldAutoMountA1WritingPractice(workbookPath)).toBe(false);
    expect(shouldAutoMountA1WritingPractice(grammarPath)).toBe(false);
  });

  test("keeps existing auto-mounted practice on the weather and health workbooks", () => {
    expect(
      shouldAutoMountA1WritingPractice(
        "/campus/course/a1-day-21-weather-workbook",
      ),
    ).toBe(true);
    expect(
      shouldAutoMountA1WritingPractice(
        "/campus/course/a1-day-22-health-and-body-parts-workbook",
      ),
    ).toBe(true);
  });
});
