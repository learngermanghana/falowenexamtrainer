import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

const grammarWrapper = read("A2B1WorkbookGrammarNotesContent.js");
const day17 = read("B1Day17WieLerntManAmBestenGrammarNotesPage.js");

describe("B1 Day 17 grammar composition", () => {
  it("uses the native Day 17 grammar page without stacking the old range upgrade", () => {
    expect(grammarWrapper).not.toContain('import B1Days12To17LearningUpgrade');
    expect(grammarWrapper).not.toContain('showB1Day17Upgrade');
    expect(grammarWrapper).not.toContain('<B1Days12To17LearningUpgrade day={numericDay} />');
    expect(grammarWrapper).toContain('17: B1Day17WieLerntManAmBestenGrammarNotesPage');
  });

  it("keeps the complete Day 17 grammar lesson itself", () => {
    expect(day17).toContain('B1GrammarEnglishSupport day={17}');
    expect(day17).toContain('Bedingungen mit „wenn“');
    expect(day17).toContain('Ziele mit „um ... zu“ und „damit“');
    expect(day17).toContain('Infinitiv mit „zu“ für Lernstrategien');
  });
});
