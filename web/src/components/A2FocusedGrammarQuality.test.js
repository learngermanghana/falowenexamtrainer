import fs from "fs";
import path from "path";

const read = (fileName) => fs.readFileSync(path.resolve(__dirname, fileName), "utf8");

const grammarDays = [
  [1, "A2StarterConjunctionsPage.js", "weil"],
  [2, "A2Day2Kapitel12GrammarNotesPage.js", "Adjective Declension"],
  [3, "ComparingThingsAndPeopleGrammarPage.js", "Komparativ"],
  [4, "WoTreffenUnsGrammarPage.js", "Wo? oder Wohin?"],
  [5, "A2Day5FreizeitSeparableVerbsGrammarPage.js", "Trennbare Verben"],
  [6, "A2Day6TwoCasePrepositionsGrammarPage.js", "Wechselpräpositionen"],
  [7, "A2Day7RelativeClausesWohnungGrammarPage.js", "Relativsätze"],
  [8, "A2Day8ImperativeGrammarPage.js", "Imperativ"],
  [9, "A2Day9PerfektGrammarPage.js", "Perfekt"],
  [10, "A2Day10PraeteritumGrammarPage.js", "Präteritum"],
  [11, "A2Day11ComparativeFormsGrammarPage.js", "Verkehrsmittel"],
  [12, "A2Day12MeinTraumberufGrammarPage.js", "Modalverben"],
  [13, "A2Day13VorstellungsgespraechModalverbenPraeteritumGrammarPage.js", "Modalverben"],
  [14, "A2Day14BerufUndKarriereUmZuGrammarPage.js", "um ... zu"],
  [15, "A2Day15MeinLieblingssportSeitDativGrammarPage.js", "seit"],
  [16, "A2Day16WohlbefindenReflexiveVerbenGrammarPage.js", "Reflexive Verben"],
  [17, "A2Day17InDieApothekeModalverbenFragenGrammarPage.js", "Apotheke"],
  [18, "A2Day18DieBankAnrufenHoeflicheFragenBittenGrammarPage.js", "Höflich"],
  [19, "A2Day19EinkaufenOderDennGrammarPage.js", "oder"],
  [20, "A2Day20TypischeReklamationssituationenHoeflicheBittenUndBegruendungenGrammarPage.js", "Reklamation"],
  [21, "A2Day21EinWochenendePlanenWennObFallsGrammarPage.js", "wenn"],
  [22, "A2Day22DieWochePlanungGrammarPage.js", "Präsens"],
  [23, "A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage.js", "Verkehrsmittel"],
  [24, "A2Day24EinenUrlaubPlanenGrammarPage.js", "wenn"],
  [25, "A2Day25TagesablaufGrammarPage.js", "Separable verbs"],
  [26, "A2Day26GefuehleGrammarPage.js", "sich fühlen"],
  [27, "A2Day27DigitaleKommunikationGrammarPage.js", "dass"],
  [28, "A2Day28UeberDieZukunftSprechenGrammarPage.js", "Zukunftspläne"],
];

describe("A2 focused grammar quality", () => {
  test("all 28 A2 days keep a day-specific grammar topic", () => {
    grammarDays.forEach(([day, fileName, marker]) => {
      const source = read(fileName);
      expect(source.length).toBeGreaterThan(1000);
      expect(source).toContain(marker);
      expect(source).not.toContain("Grammar notes have not been added");
      expect(day).toBeGreaterThanOrEqual(1);
      expect(day).toBeLessThanOrEqual(28);
    });
  });

  test("shared A2 grammar composition does not stack generic teaching blocks", () => {
    const wrapper = read("A2B1WorkbookGrammarNotes.js");
    const content = read("A2B1WorkbookGrammarNotesContent.js");

    [
      "A2SecondStageGrammarUpgrade",
      "A2TopicCollocationPractice",
      "A2SituationIntroduction",
      "A2ThinkingFirstGrammarGuide",
      "A2Days7To11ThinkingFirstGrammarGuide",
      "A2Days12To16ThinkingFirstGrammarGuide",
      "A2Days17To21ThinkingFirstGrammarGuide",
      "A2Days22To28ThinkingFirstGrammarGuide",
    ].forEach((genericLayer) => {
      expect(wrapper).not.toContain(genericLayer);
      expect(content).not.toContain(genericLayer);
    });

    expect(content).toContain("<GrammarNotes embedded />");
  });

  test("the audited grammar pages support embedding without requiring a mini lesson", () => {
    [
      "A2Day2Kapitel12GrammarNotesPage.js",
      "ComparingThingsAndPeopleGrammarPage.js",
      "A2Day7RelativeClausesWohnungGrammarPage.js",
      "A2Day8ImperativeGrammarPage.js",
      "A2Day9PerfektGrammarPage.js",
      "A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage.js",
      "A2Day24EinenUrlaubPlanenGrammarPage.js",
      "A2Day28UeberDieZukunftSprechenGrammarPage.js",
    ].forEach((fileName) => {
      const source = read(fileName);
      expect(source).toContain("embedded = false");
    });
  });

  test("Day 28 stays on future communication instead of becoming a general A2/B1 review", () => {
    const source = read("A2Day28UeberDieZukunftSprechenGrammarPage.js");
    expect(source).toContain("werden + infinitive");
    expect(source).toContain("möchte");
    expect(source).not.toContain("A2 → B1 progress plan");
    expect(source).not.toContain("Other high-value A2 conjunctions");
    expect(source).not.toContain("final A2 grammar note");
  });
});
