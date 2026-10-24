import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("B1 Days 18-23 thinking and quiz-first grammar upgrade", () => {
  test("central grammar tab shows the upgrade before deep grammar notes", () => {
    const source = read("A2B1WorkbookGrammarNotes.js");
    expect(source).toContain('import B1Days18To23LearningUpgrade from "./B1Days18To23LearningUpgrade"');
    expect(source).toContain('normalizedLevel === "B1" && numericDay >= 18 && numericDay <= 23');
    expect(source.indexOf("<B1Days18To23LearningUpgrade day={numericDay} />")).toBeLessThan(source.indexOf("<GrammarNotes />"));
  });

  test("all six days have thinking support and clickable questions", () => {
    const source = read("B1Days18To23LearningUpgrade.jsx");
    [18, 19, 20, 21, 22, 23].forEach((day) => expect(source).toContain(`${day}: {`));
    expect(source).toContain("Think first · Erst verstehen, dann anwenden");
    expect(source).toContain("<A2MiniLearningBlock {...lesson} />");
    expect(source).toContain("questions:");
    expect(source).toContain("outputPrompt:");
  });

  test("missing deep grammar gaps are filled for Days 20, 22 and 23", () => {
    const grammar = read("A2B1WorkbookGrammarNotes.js");
    expect(grammar).toContain("20: B1Day20BerufKennenGrammarNotesPage");
    expect(grammar).toContain("22: B1Day22BeziehungWichtigGrammarNotesPage");
    expect(grammar).toContain("23: B1Day23ErstesDateGrammarNotesPage");
    const availability = read("a2B1GrammarAvailability.js");
    expect(availability).toContain("20, 21, 22, 23");
  });
});
