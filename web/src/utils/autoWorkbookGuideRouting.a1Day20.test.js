import {
  A1_DAY20_CHAPTER123_WORKBOOK_PATH,
  SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS,
  shouldRenderWorkbookGuide,
  shouldSuppressGenericWorkbookGuide,
} from "./autoWorkbookGuideRouting";

describe("A1 Day 20 Kapitel 12.3 workbook routing", () => {
  it("is handled by its own standard tutor-marked Assignment and Submit shell", () => {
    expect(
      SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS.has(
        A1_DAY20_CHAPTER123_WORKBOOK_PATH,
      ),
    ).toBe(true);
  });

  it("does not mount the duplicate generic workbook guide", () => {
    expect(
      shouldSuppressGenericWorkbookGuide(A1_DAY20_CHAPTER123_WORKBOOK_PATH),
    ).toBe(true);
    expect(
      shouldRenderWorkbookGuide({
        pathname: A1_DAY20_CHAPTER123_WORKBOOK_PATH,
        search: "?assignmentKey=A1-12.3&assignmentId=A1-12.3&level=A1",
        match: { level: "A1", day: 20, resource: { chapter: "12.3" } },
      }),
    ).toBe(false);
  });
});
