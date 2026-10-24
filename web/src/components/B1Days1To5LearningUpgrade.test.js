import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("B1 Days 1-5 thinking and quiz-first grammar upgrade", () => {
  test("central grammar tab shows the B1 upgrade before deep grammar notes", () => {
    const source = read("A2B1WorkbookGrammarNotes.js");
    expect(source).toContain('import B1Days1To5LearningUpgrade from "./B1Days1To5LearningUpgrade"');
    expect(source).toContain('normalizedLevel === "B1" && numericDay >= 1 && numericDay <= 5');
    expect(source.indexOf("<B1Days1To5LearningUpgrade day={numericDay} />")).toBeLessThan(
      source.indexOf("<GrammarNotes />"),
    );
    expect(source.indexOf("<A2B1GrammarVideoCard level={level} day={day} />")).toBeLessThan(
      source.indexOf("<B1Days1To5LearningUpgrade day={numericDay} />"),
    );
  });

  test("all five B1 days have thinking support and clickable questions", () => {
    const source = read("B1Days1To5LearningUpgrade.jsx");
    [1, 2, 3, 4, 5].forEach((day) => {
      expect(source).toContain(`${day}: {`);
    });
    expect(source).toContain("Think first · Erst verstehen, dann anwenden");
    expect(source).toContain("<A2MiniLearningBlock {...lesson} />");
    expect(source).toContain("questions:");
    expect(source).toContain("outputPrompt:");
  });

  test("existing deep grammar topics remain unchanged", () => {
    expect(read("B1Day1TraumweltGrammarNotesPage.js")).toContain("Präsens & Perfekt");
    expect(read("B1Day2FreundeFuersLebenGrammarNotesPage.js")).toContain("Adjektive und weil-Sätze");
    expect(read("B1Day3ErfolgsgeschichtenGrammarNotesPage.js")).toContain("Adjektivdeklination mit unbestimmten Artikeln");
    expect(read("B1Day4WohnungSuchenGrammarNotesPage.js")).toContain("Zweiteilige Konnektoren");
    expect(read("B1Day5BesichtigungsterminGrammarNotesPage.js")).toContain("Konjunktiv II und indirekte Fragen");
  });
});
