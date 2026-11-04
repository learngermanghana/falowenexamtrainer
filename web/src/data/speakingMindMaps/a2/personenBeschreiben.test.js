import { getA2SpeakingMindMap, validateSpeakingMindMapConfig } from "./index";

test("A2 Day 2 uses topic-specific Personen beschreiben prompts", () => {
  const config = getA2SpeakingMindMap(2);
  const aussehen = config.branches.find((branch) => branch.label === "Aussehen");

  expect(validateSpeakingMindMapConfig(config)).toBe(true);
  expect(aussehen).toEqual(
    expect.objectContaining({
      guidingQuestion: "Aussehen?",
      sentenceStarter: "Sie ist ... und hat ...",
      modelSentence:
        "Sie ist groß und hat kurze schwarze Haare.",
    }),
  );
  expect(aussehen.guidingQuestion).not.toContain("Was sagst du über");
  expect(aussehen.sentenceStarter).not.toContain("Bei aussehen sage ich");
});
