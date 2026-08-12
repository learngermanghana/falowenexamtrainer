import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.join(__dirname, name), "utf8");

describe("A2 Days 1-5 learning upgrade", () => {
  test("Day 1 teaches connector meaning and word order with English support", () => {
    const source = read("A2StarterConjunctionsPage.js");
    expect(source).toContain("Am I giving a reason, or am I showing a result?");
    expect(source).toContain("weil = because: the conjugated verb moves to the end");
    expect(source).toContain("Idea → meaning → connector → word order → sentence");
    expect(source).toContain("A2MiniLearningBlock");
  });

  test("Day 1 Small Talk uses one integrated self-introduction brain map", () => {
    const source = read("A2Day2SmallTalkWorkbookEnhancedPage.js");
    expect(source).toContain("SpeakingMindMap");
    expect(source).toContain("Kannst du dich vorstellen? Erzähl uns etwas über dich!");
    expect(source).toContain("Keyword → simple sentence → extra detail → reason/example");
    expect(source).toContain("Familie");
    expect(source).toContain("Sprachen");
    expect(source).toContain("Beruf / Studium");
    expect(source).toContain("Hobbys");
    expect(source).not.toContain("So kannst du deinen Beitrag strukturieren");
  });

  test("Day 2 teaches full person descriptions", () => {
    const source = read("A2Day2PersonenBeschreibenWorkbookPage.js");
    expect(source).toContain("sein für Eigenschaften");
    expect(source).toContain("Er hat kurze schwarze Haare");
    expect(source).toContain("Er trägt eine Brille");
  });

  test("Day 3 teaches als versus wie", () => {
    const source = read("A2Day3ComparisonsWorkbookPage.js");
    expect(source).toContain("Komparativ + als");
    expect(source).toContain("genauso groß wie");
    expect(source).toContain("gut → besser");
  });

  test("Day 4 keeps the Wo/Wohin case lesson", () => {
    const source = read("A2Day4WoWohinPrepositionLesson.jsx");
    expect(source).toContain("Wo?");
    expect(source).toContain("Wohin?");
    expect(source).toContain("in den Park");
  });

  test("Day 5 teaches a reusable Freizeit answer", () => {
    const source = read("A2Day5FreizeitWorkbookPage.js");
    expect(source).toContain("In meiner Freizeit spiele ich Fußball");
    expect(source).toContain("interessiere mich für Musik");
    expect(source).toContain("weil ich mich entspannen möchte");
  });
});
