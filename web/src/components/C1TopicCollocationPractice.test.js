import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("C1 topic-matched collocations", () => {
  test("defines collocation support for every C1 day", () => {
    const source = read("C1TopicCollocationPractice.jsx");
    for (let day = 1; day <= 28; day += 1) {
      expect(source).toContain(`${day}: { topic:`);
    }
    expect(source).toContain("Verben mit Präpositionen");
    expect(source).toContain("Jetzt produzieren");
  });

  test("matches high-value combinations to important C1 topics", () => {
    const source = read("C1TopicCollocationPractice.jsx");
    expect(source).toContain('"teilhaben an + Dat"');
    expect(source).toContain('"investieren in + Akk"');
    expect(source).toContain('"sich auswirken auf + Akk"');
    expect(source).toContain('"verfügen über + Akk"');
    expect(source).toContain('"warnen vor + Dat"');
    expect(source).toContain('"zurückführen auf + Akk"');
  });

  test("appears inside both generations of C1 Learn checks", () => {
    const knowledge = read("C1KnowledgeChoicePractice.js");
    const quickCheck = read("C1GrammarQuickCheck.js");
    expect(knowledge).toContain('import C1TopicCollocationPractice from "./C1TopicCollocationPractice"');
    expect(knowledge).toContain("<C1TopicCollocationPractice day={lesson?.day} />");
    expect(quickCheck).toContain('import C1TopicCollocationPractice from "./C1TopicCollocationPractice"');
    expect(quickCheck).toContain("<C1TopicCollocationPractice day={day} />");
  });
});
