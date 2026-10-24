import B2Day1IdentityPilotLessonPage, { speakingTopics } from "./B2Day1IdentityPilotLessonPage";
import builder from "../data/writingQuestionBuilders/b2Day1PersoenlicheIdentitaet";

test("B2 Day 1 provides five practical speaking topic groups with questions and complete answers", () => {
  expect(typeof B2Day1IdentityPilotLessonPage).toBe("function");
  expect(speakingTopics.map((topic) => topic.title)).toEqual(["Kultur", "Essen", "Sprache", "Familie und Werte", "Interessen und persönliche Entwicklung"]);
  speakingTopics.forEach((topic) => {
    expect(topic.keywords.length).toBeGreaterThanOrEqual(5);
    expect(topic.examples).toHaveLength(2);
    topic.examples.forEach(([question, answer]) => { expect(question.endsWith("?")).toBe(true); expect(answer.endsWith(".")).toBe(true); });
  });
});
test("B2 Day 1 topic groups are ideas rather than presentation stages", () => expect(speakingTopics.map((topic) => topic.title)).not.toEqual(expect.arrayContaining(["Einleitung", "Hauptteil", "Schluss"])));
test("B2 Day 1 uses five guided writing questions", () => expect(builder.questions).toHaveLength(5));
