import fs from "fs";
import path from "path";

const read = (file) => fs.readFileSync(path.resolve(__dirname, file), "utf8");
const answerManifest = JSON.parse(read("../../../functions/data/answerKeyManifest.json"));

const chapters = [
  [1, "A2-1.1", "A2Day2SmallTalkWorkbookEnhancedPage.js", "readingQuestions", "listeningQuestions"],
  [2, "A2-1.2", "A2Day2PersonenBeschreibenWorkbookPage.js", "readingQuestions", "listeningQuestions"],
  [3, "A2-1.3", "A2Day3ComparisonsWorkbookPage.js", "readingQuestions", "listeningQuestions"],
  [4, "A2-2.4", "A2Day4WoMoechtenWirUnsTreffenWorkbookPage.js", "readingQuestions", "listeningQuestions"],
  [5, "A2-2.5", "A2Day5FreizeitWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [6, "A2-3.6", "A2Day6MoebelRaeumeWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [7, "A2-3.7", "A2Day7WohnungSuchenWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [8, "A2-3.8", "A2Day8RezepteUndEssenWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [9, "A2-4.9", "A2Day9UrlaubWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [10, "A2-4.10", "A2Day10TourismusTraditionelleFesteWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [11, "A2-4.11", "A2Day11UnterwegsVerkehrsmittelWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [12, "A2-5.12", "A2Day12MeinTraumberufWorkbookPageLegacy.js", "lesenQuestions", "hoerenQuestions"],
  [13, "A2-5.13", "A2Day13VorstellungsgespraechWorkbookPageLegacy.js", "lesenQuestions", "hoerenQuestions"],
  [14, "A2-5.14", "A2Day14BerufUndKarriereWorkbookPage.js", "lesenQuestions", "teil4Questions"],
  [15, "A2-6.15", "A2Day15MeinLieblingssportWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [16, "A2-6.16", "A2Day16WohlbefindenUndEntspannungWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [17, "A2-6.17", "A2Day17InDieApothekeGehenWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [18, "A2-7.18", "A2Day18DieBankAnrufenWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [19, "A2-7.19", "A2Day19EinkaufenWoUndWieWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [20, "A2-7.20", "A2Day20TypischeReklamationssituationenWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [21, "A2-8.21", "A2Day21EinWochenendePlanenWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [22, "A2-8.22", "A2Day22DieWochePlanungWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [23, "A2-9.23", "A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [24, "A2-9.24", "A2Day24EinenUrlaubPlanenWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [25, "A2-9.25", "A2Day25TagesablaufWorkbookPage.js", "lesenQuestions", "teil4Questions"],
  [26, "A2-10.26", "A2Day26GefuehleInVerschiedenenSituationenWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
  [27, "A2-10.27", "A2Day27DigitaleKommunikationWorkbookPage.js", "readingQuestions", "listeningQuestions"],
  [28, "A2-10.28", "A2Day28UeberDieZukunftSprechenWorkbookPage.js", "lesenQuestions", "hoerenQuestions"],
];

const manifestEntryFor = (assignmentId) => {
  const match = Object.values(answerManifest).find((entry) => entry.assignment_id === assignmentId);
  if (!match) throw new Error(`Missing answer-key manifest entry for ${assignmentId}`);
  return match;
};

const expectedCount = (entry, section) =>
  Object.keys(entry.answers?.[section] || entry.answers?.[section === "teil3" ? "Teil 3" : "Teil 4"] || {}).length;

const questionCount = (source, key) => {
  if (source.includes(`const ${key} = [];`) || source.includes(`${key}={[]}`)) return 0;

  const constantStart = source.indexOf(`const ${key} = [`);
  if (constantStart >= 0) {
    const end = source.indexOf("\n];", constantStart);
    if (end < 0) throw new Error(`Unclosed ${key} constant`);
    return (source.slice(constantStart, end).match(/\b(stem|prompt)\s*:/g) || []).length;
  }

  const inlineStart = source.indexOf(`${key}={[`);
  if (inlineStart >= 0) {
    const end = source.indexOf("]}", inlineStart);
    if (end < 0) throw new Error(`Unclosed inline ${key}`);
    return (source.slice(inlineStart, end).match(/\b(stem|prompt)\s*:/g) || []).length;
  }

  throw new Error(`Could not find ${key}`);
};

describe("A2 Days 1-28 assessment integrity", () => {
  test.each(chapters)(
    "Day %i keeps %s workbook questions aligned with the answer-key manifest",
    (day, assignmentId, file, teil3Key, teil4Key) => {
      const source = read(file);
      const answerKey = manifestEntryFor(assignmentId);

      expect(questionCount(source, teil3Key)).toBe(expectedCount(answerKey, "teil3"));
      expect(questionCount(source, teil4Key)).toBe(expectedCount(answerKey, "teil4"));
    },
  );

  test("Day 13 does not overwrite its canonical seven-question reading at runtime", () => {
    const wrapper = read("A2Day13VorstellungsgespraechWorkbookPage.js");
    expect(wrapper).not.toContain("patchReadingContent(root);");
  });

  test("Day 18 keeps stable A-F advert codes and the original 5+5 split", () => {
    const source = read("A2Day18DieBankAnrufenWorkbookPage.js");
    const answerKey = manifestEntryFor("A2-7.18");

    expect(questionCount(source, "lesenQuestions")).toBe(5);
    expect(questionCount(source, "hoerenQuestions")).toBe(5);
    expect((source.match(/options: bankChoices/g) || []).length).toBe(5);

    [
      "A) Deutsche Bank",
      "B) Sparkasse",
      "C) Commerzbank",
      "D) Volksbank",
      "E) Postbank",
      "F) ING-DiBa",
    ].forEach((choice) => expect(source).toContain(choice));

    expect(answerKey.answers.teil3).toEqual({
      Answer1: "B) Sparkasse",
      Answer2: "F) ING-DiBa",
      Answer3: "B) Sparkasse",
      Answer4: "D) Volksbank",
      Answer5: "C) Commerzbank",
    });
    expect(answerKey.answers.teil4).toEqual({
      Answer1: "B) Reisepass, Meldebescheinigung, Einkommensnachweis",
      Answer2: "B) Eine Stunde",
      Answer3: "B) Drei",
      Answer4: "A) Basiskonto",
      Answer5: "D) Die Formulare vor dem Termin online ausfüllen",
    });

    expect(
      source.match(/D\) Die Formulare vor dem Termin online ausfüllen/g) || [],
    ).toHaveLength(1);
  });

  test("special A2 structures remain explicit", () => {
    expect(read("A2Day14BerufUndKarriereWorkbookPage.js")).toContain("Teil 4 · Lesen");
    expect(read("A2Day20TypischeReklamationssituationenWorkbookPage.js")).toContain("hoerenGroups");
    expect(read("A2Day25TagesablaufWorkbookPage.js")).toContain('teil4Description="Lesen"');
    expect(read("A2Day27DigitaleKommunikationWorkbookPage.js")).toContain("const listeningQuestions = [];");
    expect(read("A2Day28UeberDieZukunftSprechenWorkbookPage.js")).toContain("const hoerenQuestions = [];");
  });
});
