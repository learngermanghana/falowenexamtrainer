import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A2 Days 7-11 thinking flow", () => {
  test("grammar tab adds the thinking-first guide for Days 7-11 after the grammar video", () => {
    const source = read("A2B1WorkbookGrammarNotes.js");
    expect(source).toContain("A2Days7To11ThinkingFirstGrammarGuide");
    expect(source).toContain('numericDay >= 7 && numericDay <= 11');
    expect(source.indexOf("A2B1GrammarVideoCard")).toBeLessThan(source.indexOf("A2Days7To11ThinkingFirstGrammarGuide day={numericDay}"));
  });

  test("support contains real idea-building help for every Day 7-11 topic", () => {
    const source = read("A2Days7To11ThinkingSupport.js");
    [
      "More speaking help: Eine Wohnung suchen",
      "More speaking help: Rezept und Essen",
      "More speaking help: Urlaub",
      "More speaking help: Tourismus und traditionelle Feste",
      "More speaking help: Verkehrsmittel vergleichen",
    ].forEach((marker) => expect(source).toContain(marker));
    expect(source).toContain("Idea → decision → German sentence");
    expect(source).toContain("modelAnswer");
  });

  test("shared SpeakingMindMap automatically enriches A2 Days 7-11", () => {
    const source = read("SpeakingMindMap.js");
    expect(source).toContain("getA2Days7To11SpeakingConfig");
    expect(source).toContain('day < 7 || day > 11');
    expect(source).toContain("extraHelp: enriched.extraHelp");
  });

  test.each([
    ["A2Day7WohnungSuchenWorkbookPage.js", "Fragen Sie nach einer verfügbaren Wohnung.", "Geben Sie an, welche Kriterien für Sie wichtig sind"],
    ["A2Day8RezepteUndEssenWorkbookPage.js", "Fragen Sie nach einem freien Tisch.", "Fragen Sie nach dem Menü und den Preisen."],
    ["A2Day9UrlaubWorkbookPage.js", "Fragen Sie nach einem freien Zimmer.", "Fragen Sie nach den Preisen und den zusätzlichen Leistungen"],
    ["A2Day10TourismusTraditionelleFesteWorkbookPage.js", "Erzählen Sie von dem Fest und warum es besonders ist.", "Laden Sie die Person ein"],
    ["A2Day11UnterwegsVerkehrsmittelWorkbookPage.js", "Fragen, ob noch Autos für das Wochenende verfügbar sind.", "Nach dem Preis für die Miete fragen"],
  ])("%s keeps one clear Teil 2 task with visible bullet points", (file, firstBullet, secondBullet) => {
    const source = read(file);
    expect(source).toContain(firstBullet);
    expect(source).toContain(secondBullet);
  });
});
