import {
  QUESTION_OF_DAY_LETTER_TEMPLATES,
  insertQuestionOfDayLetterTemplate,
} from "./questionOfDayLetterTemplates";

describe("Question of the Day letter templates", () => {
  test("provides separate formal and informal structures", () => {
    expect(QUESTION_OF_DAY_LETTER_TEMPLATES.formal).toContain("Sehr geehrte Damen und Herren");
    expect(QUESTION_OF_DAY_LETTER_TEMPLATES.formal).toContain("Mit freundlichen Grüßen");
    expect(QUESTION_OF_DAY_LETTER_TEMPLATES.informal).toContain("Liebe/r [Name]");
    expect(QUESTION_OF_DAY_LETTER_TEMPLATES.informal).toContain("Liebe Grüße");
  });

  test("inserts into an empty answer box", () => {
    expect(
      insertQuestionOfDayLetterTemplate({ currentAnswer: "", type: "formal" }),
    ).toBe(QUESTION_OF_DAY_LETTER_TEMPLATES.formal);
  });

  test("preserves existing writing and appends the selected structure", () => {
    const result = insertQuestionOfDayLetterTemplate({
      currentAnswer: "My planning note",
      type: "informal",
    });

    expect(result).toStartWith("My planning note");
    expect(result).toContain("Liebe/r [Name]");
  });

  test("does not insert the same template twice", () => {
    const first = insertQuestionOfDayLetterTemplate({
      currentAnswer: "",
      type: "formal",
    });
    const second = insertQuestionOfDayLetterTemplate({
      currentAnswer: first,
      type: "formal",
    });

    expect(second).toBe(first);
  });
});
