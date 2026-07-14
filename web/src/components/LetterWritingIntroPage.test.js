import { resolveLetterWritingPageMode } from "./LetterWritingIntroPage";

describe("LetterWritingIntroPage routing", () => {
  it("uses the short 12.3 route for grammar notes", () => {
    expect(resolveLetterWritingPageMode("/campus/course/letter-writing-intro-12-3")).toBe("grammar");
  });

  it("uses the existing long route for the workbook", () => {
    expect(
      resolveLetterWritingPageMode(
        "/campus/course/letter-writing-intro-german-a1-day-12-3",
      ),
    ).toBe("workbook");
  });
});
