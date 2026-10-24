import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A2 topic-matched collocations", () => {
  test("defines collocation support for all 28 A2 days", () => {
    const source = read("A2TopicCollocationPractice.jsx");
    for (let day = 1; day <= 28; day += 1) {
      expect(source).toContain(`${day}:{topic:`);
    }
    expect(source).toContain("Verben mit Präpositionen");
    expect(source).toContain("Jetzt selbst bilden");
  });

  test("includes high-frequency A2 combinations", () => {
    const source = read("A2TopicCollocationPractice.jsx");
    expect(source).toContain('"warten auf + Akk"');
    expect(source).toContain('"sich interessieren für + Akk"');
    expect(source).toContain('"teilnehmen an + Dat"');
    expect(source).toContain('"sich bewerben um + Akk"');
    expect(source).toContain('"sich beschweren über + Akk"');
    expect(source).toContain('"antworten auf + Akk"');
  });

  test("mounts A2 collocations before thinking guides and preserves days without deep notes", () => {
    const page = read("A2B1WorkbookGrammarNotes.js");
    expect(page).toContain('import A2TopicCollocationPractice from "./A2TopicCollocationPractice"');
    expect(page).toContain("<A2TopicCollocationPractice day={numericDay} />");
    expect(page).toContain('const showA2Collocations = normalizedLevel === "A2" && numericDay >= 1 && numericDay <= 28');
    expect(page).toContain("if (!GrammarNotes && !showA2Collocations)");
    expect(page.indexOf("<A2TopicCollocationPractice day={numericDay} />")).toBeLessThan(page.indexOf("<A2ThinkingFirstGrammarGuide day={numericDay} />"));
  });
});
