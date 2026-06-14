import B2Day1IdentityPilotLessonPage from "./B2Day1IdentityPilotLessonPage";
import b2Day1QuestionWritingBuilder from "../data/writingQuestionBuilders/b2Day1PersoenlicheIdentitaet";

test("B2 Day 1 pilot page and guided writing builder are available", () => {
  expect(typeof B2Day1IdentityPilotLessonPage).toBe("function");
  expect(b2Day1QuestionWritingBuilder.level).toBe("B2");
  expect(b2Day1QuestionWritingBuilder.day).toBe(1);
  expect(b2Day1QuestionWritingBuilder.questions).toHaveLength(6);
  expect(
    b2Day1QuestionWritingBuilder.questions.reduce(
      (total, question) => total + question.minimumWords,
      0,
    ),
  ).toBe(b2Day1QuestionWritingBuilder.targetWords);
});
