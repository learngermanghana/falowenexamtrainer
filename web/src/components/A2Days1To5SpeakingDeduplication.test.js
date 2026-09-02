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
];

describe("A2 Days 1-5 Teil 1 speaking content", () => {
  test.each(workbookFiles)("%s shows one speaking mind map without a duplicate task card", (file) => {
    const source = read(file);
    expect((source.match(/<SpeakingMindMap/g) || [])).toHaveLength(1);
    expect(source).not.toContain('eyebrow="Now speak · Jetzt sprechen"');
    expect(source).not.toContain("<strong>Thinking route:</strong>");
  });

  test("Day 1 does not register a teacher lecture video", () => {
    const source = read("../data/teacherLectureVideoResources.js");
    expect(source).not.toContain("https://youtu.be/70AgN5VKeqc");
  });
});
