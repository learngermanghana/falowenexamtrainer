import fs from "fs";
import path from "path";
import { hasA2B1GrammarNotes } from "./a2B1GrammarAvailability";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

const day22Workbook = read("A2Day22DieWochePlanungWorkbookPage.js");
const standardWorkbook = read("A2StandardTabbedWorkbookPage.js");
const grammarRegistry = read("A2B1WorkbookGrammarNotesContent.js");
const day22Grammar = read("A2Day22DieWochePlanungGrammarPage.js");
const day25Grammar = read("A2Day25TagesablaufGrammarPage.js");
const day26Grammar = read("A2Day26GefuehleGrammarPage.js");
const day27Grammar = read("A2Day27DigitaleKommunikationGrammarPage.js");
const speakingMaps = read("../data/speakingMindMaps/a2/index.js");

describe("A2 Days 21-28 workbook consistency", () => {
  it("has dedicated grammar notes for every late A2 day", () => {
    for (let day = 21; day <= 28; day += 1) {
      expect(hasA2B1GrammarNotes("A2", day)).toBe(true);
    }
    expect(grammarRegistry).toContain("25: A2Day25TagesablaufGrammarPage");
    expect(grammarRegistry).toContain("26: A2Day26GefuehleGrammarPage");
    expect(grammarRegistry).toContain("27: A2Day27DigitaleKommunikationGrammarPage");
  });

  it("keeps Day 22 Teil 1 focused on the speaking mind map", () => {
    expect(day22Workbook).toContain("mindMapOnlySpeaking");
    expect(standardWorkbook).toContain("mindMapOnlySpeaking ? null : <A2SecondStageSpeakingUpgrade day={day} />");
    expect(standardWorkbook).toContain("!mindMapOnlySpeaking && showSpeakingTaskCard");
  });

  it("gives Day 22 a real weekly-planning mind map instead of generated placeholders", () => {
    expect(speakingMaps).toContain("const wochePlanenBranches");
    expect(speakingMaps).toContain("Da kann ich leider nicht. Wie wäre es mit ...?");
    expect(speakingMaps).toContain("wochePlanenBranches");
  });

  it("teaches the requested late-A2 grammar explicitly", () => {
    expect(day22Grammar).toContain("Time first → verb in position 2");
    expect(day22Grammar).toContain("Modal verbs for duties and availability");
    expect(day25Grammar).toContain("Separable verbs split in the main clause");
    expect(day26Grammar).toContain("sich fühlen + adjective");
    expect(day27Grammar).toContain("Word order: the verb goes to the end");
  });
});
