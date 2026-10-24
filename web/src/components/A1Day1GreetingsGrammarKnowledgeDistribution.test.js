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

  test("numbers questions in the order students actually see them", () => {
    expect(source).toContain('const knowledgeQuestionDisplayOrder = Object.freeze([');
    [
      '"q1"',
      '"q5"',
      '"q6"',
      '"q4"',
      '"q10"',
      '"q2"',
      '"q7"',
      '"q3"',
      '"q8"',
      '"q9"',
    ].forEach((id) => expect(source).toContain(id));
    expect(source).toContain("getKnowledgeQuestionNumber(question.id)");
    expect(source).not.toContain(
      "knowledgeQuestions.findIndex((item) => item.id === question.id) + 1",
    );
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
