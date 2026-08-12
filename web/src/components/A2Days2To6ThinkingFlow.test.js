import fs from "fs";
import path from "path";

// Production deployment marker: Days 2-6 thinking flow is ready for main/Vercel.
const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A2 Days 2-6 thinking flow", () => {
  test("grammar tab adds thinking-first support only for A2 Days 2-6", () => {
    const source = read("A2B1WorkbookGrammarNotes.js");
    expect(source).toContain("A2ThinkingFirstGrammarGuide");
    expect(source).toContain('normalizedLevel === "A2" && numericDay >= 2 && numericDay <= 6');
    expect(source.indexOf("A2B1GrammarVideoCard")).toBeLessThan(source.indexOf("A2ThinkingFirstGrammarGuide day={numericDay}"));
  });

  test("shared support teaches idea-first grammar and real speaking help", () => {
    const source = read("A2Days2To6ThinkingSupport.js");
    expect(source).toContain("Idea → decision → German sentence");
    expect(source).toContain("More speaking help: Eine Person beschreiben");
    expect(source).toContain("More speaking help: Zwei Dinge oder Personen vergleichen");
    expect(source).toContain("More speaking help: Ein Treffen planen");
    expect(source).toContain("More speaking help: Freizeit");
    expect(source).toContain("More speaking help: Meine Wohnung und mein Zimmer");
    expect(source).toContain("modelAnswer");
  });

  test.each([
    [2, "A2Day2PersonenBeschreibenWorkbookPage.js", "Person → Aussehen → Kleidung → Charakter → Meinung + Grund"],
    [3, "A2Day3ComparisonsWorkbookPage.js", "Auswahl → Gemeinsamkeit → Unterschiede → Preis/Qualität → Meinung + weil"],
    [4, "A2Day4WoMoechtenWirUnsTreffenWorkbookPage.js", "Was? → Wo? → Wann? → Wie komme ich hin? → Bestätigung / Alternative"],
    [5, "A2Day5FreizeitWorkbookPage.js", "Hobby → Wann/wie oft? → Wo? → Mit wem? → Warum/Gefühl"],
    [6, "A2Day6MoebelRaeumeWorkbookPage.js", "Raum → Möbel → Wo? → Veränderung/Wohin? → Lieblingsplatz + weil"],
  ])("Day %i uses the speaking mind map and a connected production route", (day, file, route) => {
    const source = read(file);
    expect(source).toContain(`getA2Days2To6SpeakingConfig(${day})`);
    expect(source).toContain("SpeakingMindMap");
    expect(source).toContain(route);
  });
});
