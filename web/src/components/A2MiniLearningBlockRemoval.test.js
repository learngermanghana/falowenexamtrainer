import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.join(__dirname, name), "utf8");

test("supplementary Kurz lernen blocks stay hidden, essential A2 grammar remains", () => {
  const source = read("A2MiniLearningBlock.jsx");
  expect(source).toContain("if (!essential) return null;");
  expect(source).not.toContain("Kurz lernen · dann anwenden");
  expect(source).not.toContain("data-a2-focused-learning-block");
  expect(read("A2Day17InDieApothekeModalverbenFragenGrammarPage.js")).toMatch(/<A2MiniLearningBlock\s+essential/);
  expect(read("A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage.js")).toContain("<A2MiniLearningBlock essential {...lesson} />");
  expect(read("A2Day28UeberDieZukunftSprechenGrammarPage.js")).toContain("<A2MiniLearningBlock essential {...lesson} />");
});
