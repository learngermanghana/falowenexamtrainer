import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.join(__dirname, name), "utf8");

describe("A2 Days 1-5 learning upgrade", () => {
  test("Day 1 teaches connector word order with interactive choices", () => {
    const source = read("A2StarterConjunctionsPage.js");
    expect(source).toContain("weil schickt das konjugierte Verb ans Ende");
    expect(source).toContain("Deshalb bleibe ich zu Hause");
    expect(source).toContain("A2MiniLearningBlock");
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
