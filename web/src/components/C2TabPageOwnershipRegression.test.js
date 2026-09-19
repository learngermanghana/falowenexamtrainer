import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("C2 tab page ownership", () => {
  test("does not append the aligned teaching summary outside the active workbook tab", () => {
    const early = read("C2Day1To7MasteryPage.js");
    const later = read("C2Day8To14MasteryPage.js");

    expect(early).not.toContain("C2AlignedTeachingSummary");
    expect(later).not.toContain("C2AlignedTeachingSummary");
  });

  test("keeps detailed aligned grammar teaching inside the Grammar panel", () => {
    const panels = read("C2StandardExamPanels.js");
    const grammarStart = panels.indexOf("export function C2StandardGrammarPanel");
    const speakStart = panels.indexOf("export function C2StandardSpeakPanel");
    const opinionStart = panels.indexOf("function OpinionWrite");
    const grammar = panels.slice(grammarStart, speakStart);
    const speak = panels.slice(speakStart, opinionStart);
    const write = panels.slice(opinionStart);

    expect(grammar).toContain("AlignedGrammarTeaching");
    expect(panels).toContain("getC2LessonContentAlignment");
    expect(speak).not.toContain("AlignedGrammarTeaching");
    expect(write).not.toContain("AlignedGrammarTeaching");
  });

  test("uses the dedicated C2 Grammar label", () => {
    const navigation = read("StandardWorkbookComponents.js");
    expect(navigation).toContain("export const C2_WORKBOOK_TABS");
    expect(navigation).toContain('label: "Grammar"');
    expect(navigation).toContain('normalizedLevel === "C2"');
  });
});
