import { A2_GOETHE_LISTENING_TEIL3 } from "./A2GoetheListeningMockTeil3Preview";

describe("A2 Hören Teil 3 mock preview", () => {
  test("uses five one-play image questions", () => {
    expect(A2_GOETHE_LISTENING_TEIL3.plays).toBe(1);
    expect(A2_GOETHE_LISTENING_TEIL3.questions).toHaveLength(5);
    expect(A2_GOETHE_LISTENING_TEIL3.audioObjectKey).toBe(
      "a2/mock-hoeren/mock-01/teil-3.mp3",
    );
  });

  test("keeps the intended answer distribution", () => {
    expect(
      A2_GOETHE_LISTENING_TEIL3.questions.map((question) => question.answer),
    ).toEqual(["A", "C", "B", "A", "C"]);
  });

  test("shows three picture choices for every question", () => {
    A2_GOETHE_LISTENING_TEIL3.questions.forEach((question) => {
      expect(question.options).toHaveLength(3);
      expect(question.options.map((option) => option.id)).toEqual(["A", "B", "C"]);
    });
  });
});
