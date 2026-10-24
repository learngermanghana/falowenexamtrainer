import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A2 Day 7 relative-clause grammar notes", () => {
  test("keeps full relative-clause notes instead of only a generic mini block", () => {
    const source = read("A2Day7RelativeClausesWohnungGrammarPage.js");

    expect(source).toContain('data-a2-day7-relative-clause-notes="true"');
    expect(source).toContain("Was ist ein Relativsatz?");
    expect(source).toContain("Zwei Entscheidungen: Genus + Kasus");
    expect(source).toContain("Relativpronomen · Nominativ und Akkusativ");
    expect(source).toContain("Wie erkenne ich Nominativ oder Akkusativ?");
    expect(source).toContain("Wortstellung: Das Verb steht am Ende");
    expect(source).toContain("Zwei Sätze verbinden");
    expect(source).toContain("Wohnung suchen · nützliche Beispiele");
    expect(source).toContain("Häufige Fehler");
    expect(source).toContain("Merksatz");
  });

  test("teaches the masculine nominative/accusative contrast and apartment examples", () => {
    const source = read("A2Day7RelativeClausesWohnungGrammarPage.js");

    expect(source).toContain("der Vermieter + subject");
    expect(source).toContain("der Vermieter + object");
    expect(source).toContain("Der Vermieter, den ich anrufe");
    expect(source).toContain("Der Makler, <strong>den ich gestern angerufen habe</strong>");
    expect(source).toContain("Nominative: der / die / das / die");
    expect(source).toContain("Accusative: den / die / das / die");
    expect(source).toContain("Dative relative pronouns come later");
  });

  test("still renders correctly inside the shared workbook grammar tab", () => {
    const notes = read("A2B1WorkbookGrammarNotesContent.js");
    const page = read("A2Day7RelativeClausesWohnungGrammarPage.js");

    expect(notes).toContain("7: A2Day7RelativeClausesWohnungGrammarPage");
    expect(notes).toContain("<GrammarNotes embedded />");
    expect(page).toContain("if (embedded) return <GrammarContent />");
  });
});
