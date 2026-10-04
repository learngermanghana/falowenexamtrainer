import { A2_GOETHE_LISTENING_TEIL4 } from "./A2GoetheListeningMockTeil4Preview";

describe("A2 Hören Teil 4 mock preview", () => {
  test("uses one interview repeated twice", () => {
    expect(A2_GOETHE_LISTENING_TEIL4.plays).toBe(2);
    expect(A2_GOETHE_LISTENING_TEIL4.audioObjectKey).toBe(
      "a2/mock-hoeren/mock-01/teil-4.mp3",
    );
    expect(A2_GOETHE_LISTENING_TEIL4.questions).toHaveLength(5);
  });

  test("keeps the intended Ja/Nein answer key", () => {
    expect(
      A2_GOETHE_LISTENING_TEIL4.questions.map((question) => question.answer),
    ).toEqual(["ja", "nein", "ja", "nein", "ja"]);
  });
});
