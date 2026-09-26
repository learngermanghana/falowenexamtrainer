import { getB2GrammarLesson } from "./b2GrammarLessons";
import { getB2LessonContentAlignment } from "./b2LessonContentAlignment";

describe("B2 grammar content coverage", () => {
  test("every B2 Course Book grammar title has substantial matching content", () => {
    Array.from({ length: 28 }, (_, index) => index + 1).forEach((day) => {
      const alignment = getB2LessonContentAlignment(day);
      const grammar = getB2GrammarLesson(day);

      expect(grammar).toBeTruthy();
      expect(grammar.title).toBe(alignment.grammar_topic);
      expect(grammar.context).toBe(alignment.lessonTopic);
      expect(grammar.goal).toBe(alignment.goal);
      expect(grammar.whyThisGrammar.length).toBeGreaterThan(90);
      expect(grammar.focuses.length).toBeGreaterThanOrEqual(2);
      expect(grammar.modelSentence.length).toBeGreaterThan(45);
      expect(grammar.miniExercise.length).toBeGreaterThan(70);

      grammar.focuses.forEach((item) => {
        expect(item.title.length).toBeGreaterThan(3);
        expect(item.english.length).toBeGreaterThan(3);
        expect(item.explanation.length).toBeGreaterThan(70);
        expect(item.pattern.length).toBeGreaterThan(10);
        expect(item.rules.length).toBeGreaterThanOrEqual(2);
        expect(item.examples.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  test("representative days teach the structures named by the curriculum", () => {
    expect(getB2GrammarLesson(2).focuses.map((item) => item.title)).toEqual(
      expect.arrayContaining(["Passiv", "Modalpassiv", "Nominalisierung"]),
    );
    expect(getB2GrammarLesson(7).focuses.map((item) => item.title)).toEqual(
      expect.arrayContaining(["Relativsätze mit Präpositionen", "Konjunktiv II"]),
    );
    expect(getB2GrammarLesson(14).focuses.map((item) => item.title)).toEqual(
      expect.arrayContaining(["indirekte Rede und Quellenangaben", "obwohl / trotz", "zwar ... jedoch"]),
    );
    expect(getB2GrammarLesson(26).focuses.map((item) => item.title)).toEqual(
      expect.arrayContaining(["obwohl / trotz", "obgleich", "während / wohingegen", "Relativsätze mit Präpositionen"]),
    );
    expect(getB2GrammarLesson(28).focuses.map((item) => item.title)).toEqual(
      expect.arrayContaining(["Ursache, Folge, Gegensatz, Einräumung, Ziel und Methode", "Passiv", "Relativsätze", "Nominalisierung", "Konjunktiv II"]),
    );
  });
});
