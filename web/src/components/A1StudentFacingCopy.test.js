import fs from "fs";
import path from "path";

const STUDENT_FACING_A1_FILES = [
  "A1Day16FoodAndNegationGrammarPage.js",
  "TwoCasePrepositionsPageLegacy.js",
  "DativeArticlesMitBeiZuPage.js",
  "WeatherPerfektLetterPage.js",
  "A1Day21WeatherWorkbookPage.js",
  "SpeakingExamIntroPage.js",
  "DativeAdjectiveDeclensionPage.js",
];

const FORBIDDEN_IMPLEMENTATION_COPY = [
  /answer mapping/i,
  /saved answer mapping/i,
  /submission behaviour/i,
  /connected to Falowen Admin/i,
  /grading setup/i,
  /assignment (?:itself )?has not been changed/i,
  /assignment .* is unchanged/i,
  /submission is locked/i,
  /fixed tutor-marked workbook/i,
  /existing tutor-marked workbook/i,
];

describe("A1 student-facing lesson copy", () => {
  test.each(STUDENT_FACING_A1_FILES)("%s contains learning guidance, not implementation notes", (fileName) => {
    const source = fs.readFileSync(path.resolve(__dirname, fileName), "utf8");

    FORBIDDEN_IMPLEMENTATION_COPY.forEach((pattern) => {
      expect(source).not.toMatch(pattern);
    });
  });

  it("keeps the Day 16 workbook preview focused on the learner", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "A1Day16FoodAndNegationGrammarPage.js"),
      "utf8",
    );

    expect(source).toContain('eyebrow="Workbook preparation"');
    expect(source).toContain("Reading tip:");
    expect(source).not.toContain("Tutor-marked assignments A1-9 and A1-10 are unchanged");
  });
});
