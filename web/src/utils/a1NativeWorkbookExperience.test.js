import { shouldUseNativeA1WorkbookExperience } from "./a1NativeWorkbookExperience";

describe("native stable A1 workbook experience", () => {
  test("keeps Day 0.2 on its native Assignment and Submit tabs", () => {
    expect(
      shouldUseNativeA1WorkbookExperience(
        "/campus/course/a1-day-2-german-alphabet-reviewing-workbook",
      ),
    ).toBe(true);
  });

  test("normalizes a trailing slash", () => {
    expect(
      shouldUseNativeA1WorkbookExperience(
        "/campus/course/a1-day-2-german-alphabet-reviewing-workbook/",
      ),
    ).toBe(true);
  });

  test("does not disable the shared experience for other A1 workbooks", () => {
    expect(
      shouldUseNativeA1WorkbookExperience(
        "/campus/course/a1-day-2-kapitel-1-1-workbook",
      ),
    ).toBe(false);
  });
});
