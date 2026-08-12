import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("B1 Days 6-11 thinking and quiz-first grammar upgrade", () => {
  test("central grammar tab renders the upgrade before deep grammar notes", () => {
    const source = read("A2B1WorkbookGrammarNotes.js");
    expect(source).toContain('import B1Days6To11LearningUpgrade from "./B1Days6To11LearningUpgrade"');
    expect(source).toContain('normalizedLevel === "B1" && numericDay >= 6 && numericDay <= 11');
    expect(source.indexOf("<B1Days6To11LearningUpgrade day={numericDay} />")).toBeLessThan(
      source.indexOf("<GrammarNotes />"),
    );
    expect(source.indexOf("<A2B1GrammarVideoCard level={level} day={day} />")).toBeLessThan(
      source.indexOf("<B1Days6To11LearningUpgrade day={numericDay} />"),
    );
  });

  test("all six days include thinking support, clickable questions and output practice", () => {
    const source = read("B1Days6To11LearningUpgrade.jsx");
    [6, 7, 8, 9, 10, 11].forEach((day) => expect(source).toContain(`${day}: {`));
    expect(source).toContain("Think first · Erst verstehen, dann anwenden");
    expect(source).toContain("<A2MiniLearningBlock {...lesson} />");
    expect(source).toContain("questions:");
    expect(source).toContain("outputPrompt:");
  });

  test("existing deep grammar pages remain available for Days 6-11", () => {
    [
      "B1Day6StadtOderLandGrammarNotesPage.js",
      "B1Day7FastFoodHausmannskostGrammarNotesPage.js",
      "B1Day8AllesFuerDieGesundheitGrammarNotesPage.js",
      "B1Day9WorkLifeBalanceGrammarNotesPage.js",
      "B1Day10DigitaleAuszeitGrammarNotesPage.js",
      "B1Day11TeamspieleGrammarNotesPage.js",
    ].forEach((name) => expect(read(name)).toContain("Grammar Notes"));
  });
});
