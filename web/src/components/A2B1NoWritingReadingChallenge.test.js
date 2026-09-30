import fs from "fs";
import path from "path";
import { isNoWritingReadingChallengeDay } from "./A2B1NoWritingReadingChallenge";

describe("no-writing reading challenge", () => {
  test("targets every A2 no-writing day and skips A2 writing days", () => {
    [2, 5, 8, 11, 14, 17, 19, 23, 25, 27].forEach((day) => {
      expect(isNoWritingReadingChallengeDay("A2", day)).toBe(true);
    });
    [1, 3, 4, 6, 7, 9, 10, 12, 13, 15, 16, 18, 20, 21, 22, 24, 26, 28].forEach((day) => {
      expect(isNoWritingReadingChallengeDay("A2", day)).toBe(false);
    });
  });

  test("targets every B1 no-writing day and skips B1 writing days", () => {
    [2, 5, 7, 10, 11, 15, 17, 19, 22, 25].forEach((day) => {
      expect(isNoWritingReadingChallengeDay("B1", day)).toBe(true);
    });
    [1, 3, 4, 6, 8, 9, 12, 13, 14, 16, 18, 20, 21, 23, 24, 26, 27, 28].forEach((day) => {
      expect(isNoWritingReadingChallengeDay("B1", day)).toBe(false);
    });
  });

  test("the helper now derives no-writing days from the canonical lesson profile", () => {
    const source = fs.readFileSync(path.resolve(process.cwd(), "src/components/A2B1NoWritingReadingChallenge.js"), "utf8");
    expect(source).toContain("getA2B1LessonProfile");
    expect(source).toContain("profile.sections.writing.visible");
  });
});
