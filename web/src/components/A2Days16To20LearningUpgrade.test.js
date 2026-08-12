import fs from "fs";
import path from "path";

const componentDir = path.join(__dirname);
const cases = [
  [16, "A2Day16WohlbefindenReflexiveVerbenGrammarPage.js", ["Ich entspanne mich", "Wir treffen uns", "questions={[", "outputPrompt="]],
  [17, "A2Day17InDieApothekeModalverbenFragenGrammarPage.js", ["Können Sie mir", "Soll ich", "questions={[", "outputPrompt="]],
  [18, "A2Day18DieBankAnrufenHoeflicheFragenBittenGrammarPage.js", ["Könnten Sie bitte", "Ich würde gern", "questions={[", "outputPrompt="]],
  [19, "A2Day19EinkaufenOderDennGrammarPage.js", ["oder und denn", "denn es ist bequem", "questions={[", "outputPrompt="]],
  [20, "A2Day20TypischeReklamationssituationenHoeflicheBittenUndBegruendungenGrammarPage.js", ["Problem + Grund", "weil der Reißverschluss", "questions={[", "outputPrompt="]],
];

describe("A2 Days 16-20 concise learning upgrade", () => {
  test.each(cases)("Day %s keeps the focused teaching flow", (_day, filename, expected) => {
    const source = fs.readFileSync(path.join(componentDir, filename), "utf8");
    expected.forEach((text) => expect(source).toContain(text));
    expect((source.match(/stem:/g) || []).length).toBeGreaterThanOrEqual(4);
    expect(source).toContain("A2MiniLearningBlock");
  });
});
