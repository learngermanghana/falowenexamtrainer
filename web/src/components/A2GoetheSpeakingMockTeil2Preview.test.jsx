import { A2_GOETHE_SPEAKING_TEIL2 } from "./A2GoetheSpeakingMockTeil2Preview";

describe("A2 Sprechen Teil 2 preview", () => {
  test("uses one topic card with four keywords and one follow-up", () => {
    expect(A2_GOETHE_SPEAKING_TEIL2.topic).toBe("Wochenende");
    expect(A2_GOETHE_SPEAKING_TEIL2.keywords).toHaveLength(4);
    expect(A2_GOETHE_SPEAKING_TEIL2.followUp).toBe(
      "Was machst du am liebsten am Sonntag?",
    );
  });

  test("keeps the speaking audio split for a real app interaction", () => {
    expect(A2_GOETHE_SPEAKING_TEIL2.audio.prompt).toBe(
      "a2/mock-sprechen/mock-01/teil-2-prompt.mp3",
    );
    expect(A2_GOETHE_SPEAKING_TEIL2.audio.followUp).toBe(
      "a2/mock-sprechen/mock-01/teil-2-follow-up.mp3",
    );
    expect(A2_GOETHE_SPEAKING_TEIL2.audio.full).toBe(
      "a2/mock-sprechen/mock-01/teil-2-full.mp3",
    );
  });
});
