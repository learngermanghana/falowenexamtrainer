import fs from "fs";
import path from "path";

const read = (file) =>
  fs.readFileSync(path.resolve(__dirname, file), "utf8");

const workbookFiles = [
  "A2Day2SmallTalkWorkbookEnhancedPage.js",
  "A2Day2PersonenBeschreibenWorkbookPage.js",
  "A2Day3ComparisonsWorkbookPage.js",
  "A2Day4WoMoechtenWirUnsTreffenWorkbookPage.js",
  "A2Day5FreizeitWorkbookPage.js",
  "A2Day6MoebelRaeumeWorkbookPage.js",
  "A2Day10TourismusTraditionelleFesteWorkbookPage.js",
  "A2Day11UnterwegsVerkehrsmittelWorkbookPage.js",
  "A2Day12MeinTraumberufWorkbookPageLegacy.js",
];

describe("A2 Days 1-12 Teil 1 speaking content", () => {
  test.each(workbookFiles)("%s shows one speaking mind map without a duplicate task card", (file) => {
    const source = read(file);
    expect((source.match(/<SpeakingMindMap/g) || [])).toHaveLength(1);
    expect(source).not.toContain('eyebrow="Now speak · Jetzt sprechen"');
    expect(source).not.toContain("<strong>Thinking route:</strong>");
  });

  test.each([
    "A2Day7WohnungSuchenWorkbookPage.js",
    "A2Day8RezepteUndEssenWorkbookPage.js",
    "A2Day9UrlaubWorkbookPage.js",
  ])("%s suppresses the generic duplicate speaking card", (file) => {
    expect(read(file)).toContain("showSpeakingTaskCard={false}");
  });

  test("the standard Teil 1 layout does not inject the grammar learning guide", () => {
    expect(read("A2StandardTabbedWorkbookPage.js")).not.toContain("<A2Days6To9LearningGuide");
  });

  test("Day 1 does not register a teacher lecture video", () => {
    const source = read("../data/teacherLectureVideoResources.js");
    expect(source).not.toContain("https://youtu.be/70AgN5VKeqc");
  });
});
