import { readFileSync } from "node:fs";
import path from "node:path";

const source = readFileSync(
  path.join(process.cwd(), "src/components/QuestionOfDayPage.js"),
  "utf8",
);

describe("Question of the Day Submit letter templates", () => {
  test("mounts both insert buttons beside the Schreiben answer box", () => {
    expect(source).toContain('data-question-of-day-letter-templates="true"');
    expect(source).toContain("Insert formal template");
    expect(source).toContain("Insert informal template");
    expect(source).toContain('onClick={() => insertLetterTemplate("formal")}');
    expect(source).toContain('onClick={() => insertLetterTemplate("informal")}');
  });

  test("automatically selects the inserted letter type and saves the answer", () => {
    expect(source).toContain("setLetterType(type)");
    expect(source).toContain("setWarmupAnswer(nextAnswer)");
    expect(source).toContain("localStorage.setItem(ANSWER_STORAGE_KEY");
    expect(source).toContain('from "../data/questionOfDayLetterTemplates"');
  });
});
