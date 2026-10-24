import { A2_MOCK_2_LESEN, A2_MOCK_2_LESEN_QUESTIONS } from "./a2Mock2Lesen";

describe("A2 Mock 2 Lesen content", () => {
  test("contains 20 distinct, consecutively numbered questions in four equal parts", () => {
    expect(A2_MOCK_2_LESEN).toHaveLength(4);
    expect(A2_MOCK_2_LESEN.map(part => part.questions.length)).toEqual([5, 5, 5, 5]);
    expect(A2_MOCK_2_LESEN_QUESTIONS.map(q => q.number)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
  });
  test("all options, correct answers and explanations are consistent", () => {
    A2_MOCK_2_LESEN_QUESTIONS.forEach(q => {
      const choices = q.options.length ? q.options.map(option => option.id) : ["a", "b", "c", "d", "e", "f", "x"];
      expect(choices).toContain(q.answer);
      expect(q.question.trim()).not.toBe("");
      expect(q.explanation.trim()).not.toBe("");
    });
  });
  test("exact instructor answer key, including unmatched housing advert", () => {
    expect(A2_MOCK_2_LESEN_QUESTIONS.map(q => q.answer)).toEqual([
      "b", "a", "b", "c", "a",
      "b", "c", "b", "c", "a",
      "b", "a", "b", "b", "a",
      "d", "a", "c", "b", "x",
    ]);
  });
});
