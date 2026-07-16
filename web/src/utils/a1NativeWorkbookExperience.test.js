import {
  shouldUseCanonicalA1WorkbookExperience,
  shouldUseNativeA1WorkbookExperience,
} from "./a1NativeWorkbookExperience";

describe("canonical A1 workbook experience", () => {
  test("keeps migrated React-owned workbooks on the native shared layout", () => {
    expect(
      shouldUseNativeA1WorkbookExperience(
        "/campus/course/a1-day-2-german-alphabet-reviewing-workbook",
      ),
    ).toBe(true);
    expect(
      shouldUseNativeA1WorkbookExperience(
        "/campus/course/a1-day-2-kapitel-1-1-workbook",
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

  test("uses the canonical bridge rather than pretending legacy pages are native", () => {
    const path = "/campus/course/a1-day-4-numbers-for-beginners-workbook";
    expect(shouldUseNativeA1WorkbookExperience(path)).toBe(false);
    expect(shouldUseCanonicalA1WorkbookExperience(path)).toBe(true);
  });

  test("requires the workbook view for shared Day 18 routes", () => {
    const path = "/campus/course/two-case-prepositions-wechselpraepositionen-day-18";
    expect(shouldUseCanonicalA1WorkbookExperience(path)).toBe(false);
    expect(shouldUseCanonicalA1WorkbookExperience(path, "?view=workbook")).toBe(true);
  });

  test("does not affect an unrelated A1 grammar page", () => {
    const path = "/campus/course/a1-day-9-nominative-and-accusative-cases";
    expect(shouldUseNativeA1WorkbookExperience(path)).toBe(false);
    expect(shouldUseCanonicalA1WorkbookExperience(path)).toBe(false);
  });
});
