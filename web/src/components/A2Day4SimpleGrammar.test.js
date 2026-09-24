import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A2 Day 4 simple Wo/Wohin grammar", () => {
  const grammar = read("WoTreffenUnsGrammarPage.js");
  const content = read("A2B1WorkbookGrammarNotesContent.js");
  const wrapper = read("A2B1WorkbookGrammarNotes.js");

  test("teaches the core Wo and Wohin rule directly", () => {
    expect(grammar).toContain("Wo? = Where?");
    expect(grammar).toContain("Location / position →");
    expect(grammar).toContain("Dativ");
    expect(grammar).toContain("Wohin? = Where to?");
    expect(grammar).toContain("Movement / destination →");
    expect(grammar).toContain("Akkusativ");
    expect(grammar).toContain("Wir treffen uns");
    expect(grammar).toContain("im Café");
    expect(grammar).toContain("Wir gehen");
    expect(grammar).toContain("ins Café");
  });

  test("includes all two-way prepositions without nine numbered reading sections", () => {
    ["an", "auf", "hinter", "in", "neben", "über", "unter", "vor", "zwischen"].forEach((prep) => {
      expect(grammar).toContain(`"${prep}"`);
    });

    for (let index = 1; index <= 9; index += 1) {
      expect(grammar).not.toContain(`title="${index})`);
    }
  });

  test("keeps Day 4 free from stacked generic A2 grammar extras", () => {
    expect(content).toContain("numericDay !== 4");
    expect(wrapper).toContain('normalizedLevel === "A2" && numericDay !== 4');
    expect(wrapper).toContain("showA2Collocations && numericDay !== 4");
  });
});
