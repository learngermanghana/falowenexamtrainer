import fs from "fs";
import path from "path";

const source = fs.readFileSync(
  path.resolve(__dirname, "A1Day1GreetingsGrammarPage.js"),
  "utf8",
);

describe("A1 Day 1 grammar knowledge checks", () => {
  test("keeps all ten questions but distributes them under the grammar they test", () => {
    expect(source).toContain('greetings: ["q1", "q5"]');
    expect(source).toContain('titles: ["q6"]');
    expect(source).toContain('goodbyes: ["q4", "q10"]');
    expect(source).toContain('howAreYou: ["q2", "q7"]');
    expect(source).toContain('responses: ["q3", "q8"]');
    expect(source).toContain('andYou: ["q9"]');

    for (let number = 1; number <= 10; number += 1) {
      expect(source).toContain(`id: "q${number}"`);
    }
  });

  test("renders an inline check in each relevant grammar section", () => {
    [
      "greetings",
      "titles",
      "goodbyes",
      "howAreYou",
      "responses",
      "andYou",
    ].forEach((sectionKey) => {
      expect(source).toContain(`sectionKey="${sectionKey}"`);
    });

    expect(source).toContain("Score: {knowledgeScore}/10");
    expect(source).not.toContain("7. Knowledge test (instant feedback)");
  });
});
