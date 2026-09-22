import fs from "fs";
import path from "path";

const read = (file) => fs.readFileSync(path.resolve(__dirname, file), "utf8");

const assessmentShape = [
  ["A2Day2PersonenBeschreibenWorkbookPage.js", "readingQuestions", 4, "listeningQuestions", 3],
  ["A2Day3ComparisonsWorkbookPage.js", "readingQuestions", 4, "listeningQuestions", 5],
  ["A2Day4WoMoechtenWirUnsTreffenWorkbookPage.js", "readingQuestions", 5, "listeningQuestions", 5],
  ["A2Day5FreizeitWorkbookPage.js", "lesenQuestions", 5, "hoerenQuestions", 5],
  ["A2Day6MoebelRaeumeWorkbookPage.js", "lesenQuestions", 5, "hoerenQuestions", 5],
  ["A2Day15MeinLieblingssportWorkbookPage.js", "lesenQuestions", 5, "hoerenQuestions", 5],
  ["A2Day16WohlbefindenUndEntspannungWorkbookPage.js", "lesenQuestions", 5, "hoerenQuestions", 5],
  ["A2Day18DieBankAnrufenWorkbookPage.js", "lesenQuestions", 5, "hoerenQuestions", 5],
  ["A2Day20TypischeReklamationssituationenWorkbookPage.js", "lesenQuestions", 5, "hoerenQuestions", 5],
  ["A2Day25TagesablaufWorkbookPage.js", "lesenQuestions", 5, "hoerenQuestions", 0],
  ["A2Day26GefuehleInVerschiedenenSituationenWorkbookPage.js", "lesenQuestions", 5, "hoerenQuestions", 0],
  ["A2Day27DigitaleKommunikationWorkbookPage.js", "readingQuestions", 7, "listeningQuestions", 4],
  ["A2Day28UeberDieZukunftSprechenWorkbookPage.js", "lesenQuestions", 5, "hoerenQuestions", 3],
];

const questionCount = (source, key) => {
  if (source.includes(`const ${key} = [];`) || source.includes(`${key}={[]}`)) return 0;

  const constantStart = source.indexOf(`const ${key} = [`);
  if (constantStart >= 0) {
    const end = source.indexOf("\n];", constantStart);
    if (end < 0) throw new Error(`Unclosed ${key} constant`);
    return (source.slice(constantStart, end).match(/\b(stem|prompt)\s*:/g) || []).length;
  }

  const inlineStart = source.indexOf(`${key}={[`);
  if (inlineStart >= 0) {
    const end = source.indexOf("]}", inlineStart);
    if (end < 0) throw new Error(`Unclosed inline ${key}`);
    return (source.slice(inlineStart, end).match(/\b(stem|prompt)\s*:/g) || []).length;
  }

  throw new Error(`Could not find ${key}`);
};

describe("A2 original assessment content guard", () => {
  test.each(assessmentShape)(
    "%s keeps its pre-September-18 assessment shape",
    (file, teil3Key, teil3Count, teil4Key, teil4Count) => {
      const source = read(file);
      expect(questionCount(source, teil3Key)).toBe(teil3Count);
      expect(questionCount(source, teil4Key)).toBe(teil4Count);
    },
  );

  test("Day 13 keeps the original interview-reading runtime patch", () => {
    const source = read("A2Day13VorstellungsgespraechWorkbookPage.js");
    expect(source).toContain("patchReadingContent(root);");
  });

  test("Day 14 remains the original single 12-question reading assessment", () => {
    const source = read("A2Day14BerufUndKarriereWorkbookPage.js");
    expect(questionCount(source, "lesenQuestions")).toBe(12);
    expect(source).not.toContain("const teil4Questions = [");
    expect(source).not.toContain("Teil 4 · Lesen");
  });

  test("Day 18 keeps one stable A-F bank code system across all five reading questions", () => {
    const source = read("A2Day18DieBankAnrufenWorkbookPage.js");
    expect((source.match(/options: bankChoices/g) || [])).toHaveLength(5);
    ["A) Deutsche Bank", "B) Sparkasse", "C) Commerzbank", "D) Volksbank", "E) Postbank", "F) ING-DiBa"]
      .forEach((choice) => expect(source).toContain(choice));
  });

  test("the generic A2 workbook does not reinterpret Teil 4 content to satisfy an answer manifest", () => {
    const source = read("A2StandardTabbedWorkbookPage.js");
    expect(source).not.toContain("teil4Description");
    expect(source).not.toContain("hoerenContent = null");
  });
});
