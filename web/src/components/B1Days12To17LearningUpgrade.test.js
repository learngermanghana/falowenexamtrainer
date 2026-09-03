import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("B1 Days 12-17 thinking and quiz-first grammar upgrade", () => {
  test("central grammar tab does not stack the legacy upgrade on Days 12-16", () => {
    const source = read("A2B1WorkbookGrammarNotes.js");
    expect(source).toContain('import B1Days12To17LearningUpgrade from "./B1Days12To17LearningUpgrade"');
    expect(source).toContain('normalizedLevel === "B1" && numericDay === 17');
    expect(source).not.toContain('normalizedLevel === "B1" && numericDay >= 12 && numericDay <= 17');
    expect(source).toContain("showB1Day17Upgrade ? <B1Days12To17LearningUpgrade day={numericDay} /> : null");
    expect(source.indexOf("<A2B1GrammarVideoCard level={level} day={day} />")).toBeLessThan(
      source.indexOf("<GrammarNotes />"),
    );
  });

  test("all six days keep the legacy learning-upgrade content available for non-Grammar reuse", () => {
    const source = read("B1Days12To17LearningUpgrade.jsx");
    [12, 13, 14, 15, 16, 17].forEach((day) => expect(source).toContain(`${day}: {`));
    expect(source).toContain("Think first · Erst verstehen, dann anwenden");
    expect(source).toContain("<A2MiniLearningBlock {...lesson} />");
    expect(source).toContain("questions:");
    expect(source).toContain("outputPrompt:");
  });

  test("Days 12-16 grammar pages do not masquerade as the Teil 2 Schreiben section", () => {
    [
      "B1Day12AbenteuerInDerNaturGrammarNotesPage.js",
      "B1Day13EigeneFilmkritikGrammarNotesPage.js",
      "B1Day14TraditionellesDigitalesLernenGrammarNotesPage.js",
      "B1Day15MedienHomeofficeGrammarNotesPage.js",
      "B1Day16PruefungsangstStressbewaeltigungGrammarNotesPage.js",
    ].forEach((name) => expect(read(name)).not.toMatch(/Teil 2[^<\n]*Schreiben/i));
  });

  test("Day 17 now has registered deep grammar notes", () => {
    const availability = read("a2B1GrammarAvailability.js");
    const central = read("A2B1WorkbookGrammarNotes.js");
    const notes = read("B1Day17WieLerntManAmBestenGrammarNotesPage.js");
    expect(availability).toContain("16, 17, 18");
    expect(central).toContain("17: B1Day17WieLerntManAmBestenGrammarNotesPage");
    expect(notes).toContain("wenn");
    expect(notes).toContain("weil");
    expect(notes).toContain("dass");
    expect(notes).toContain("um ... zu");
  });

  test("existing deep grammar topics remain present for Days 12-16", () => {
    expect(read("B1Day12AbenteuerInDerNaturGrammarNotesPage.js")).toContain("Perfekt/Präteritum");
    expect(read("B1Day13EigeneFilmkritikGrammarNotesPage.js")).toContain("Passiv");
    expect(read("B1Day14TraditionellesDigitalesLernenGrammarNotesPage.js")).toContain("während");
    expect(read("B1Day15MedienHomeofficeGrammarNotesPage.js")).toContain("Passiv mit Modalverben");
    expect(read("B1Day16PruefungsangstStressbewaeltigungGrammarNotesPage.js")).toContain("Infinitiv mit zu");
  });
});
