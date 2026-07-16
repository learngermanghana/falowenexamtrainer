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

  test("disables legacy injection for every registered shared workbook", () => {
    expect(
      shouldUseNativeA1WorkbookExperience(
        "/campus/course/a1-day-2-kapitel-1-1-workbook",
      ),
    ).toBe(true);
  });

  test("does not affect an unrelated A1 grammar page", () => {
    expect(shouldUseNativeA1WorkbookExperience("/campus/course/a1-day-9-nominative-and-accusative-cases")).toBe(false);
  });
});
