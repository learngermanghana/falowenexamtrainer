import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A2 Day 4 simple Wo/Wohin grammar", () => {
  const grammar = read("WoTreffenUnsGrammarPage.js");
  const content = read("A2B1WorkbookGrammarNotesContent.js");
  const wrapper = read("A2B1WorkbookGrammarNotes.js");

  test("teaches the core Wo and Wohin rule directly", () => {
    expect(grammar).toContain("Wo? = Where?");
    expect(grammar).toContain("Something is located at a place →");
    expect(grammar).toContain("Dativ");
    expect(grammar).toContain("Wohin? = Where to?");
    expect(grammar).toContain("The destination changes:");
    expect(grammar).toContain("Akkusativ");
    expect(grammar).toContain("Wir treffen uns");
    expect(grammar).toContain("in dem Café");
    expect(grammar).toContain("im Café");
    expect(grammar).toContain("Wir gehen");
    expect(grammar).toContain("in das Café");
    expect(grammar).toContain("ins Café");
    expect(grammar).toContain("movement alone does not automatically mean Akkusativ");
  });

  test("includes all two-way prepositions without nine numbered reading sections", () => {
    ["an", "auf", "hinter", "in", "neben", "über", "unter", "vor", "zwischen"].forEach((prep) => {
      expect(grammar).toContain(`"${prep}"`);
    });

    for (let index = 1; index <= 9; index += 1) {
      expect(grammar).not.toContain(`title="${index})`);
    }
  });

  test("keeps all A2 grammar pages free from stacked generic grammar extras", () => {
    expect(content).not.toContain("A2SituationIntroduction");
    expect(content).not.toContain("A2ThinkingFirstGrammarGuide");
    expect(content).not.toContain("A2Days7To11ThinkingFirstGrammarGuide");
    expect(content).not.toContain("A2Days12To16ThinkingFirstGrammarGuide");
    expect(content).not.toContain("A2Days17To21ThinkingFirstGrammarGuide");
    expect(content).not.toContain("A2Days22To28ThinkingFirstGrammarGuide");
    expect(wrapper).not.toContain("A2SecondStageGrammarUpgrade");
    expect(wrapper).not.toContain("A2TopicCollocationPractice");
  });
});
