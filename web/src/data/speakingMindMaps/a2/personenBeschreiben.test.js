import { getA2SpeakingMindMap, validateSpeakingMindMapConfig } from "./index";

test("A2 Day 2 uses topic-specific Personen beschreiben prompts", () => {
  const config = getA2SpeakingMindMap(2);
  const aussehen = config.branches.find((branch) => branch.id === "aussehen");

  expect(validateSpeakingMindMapConfig(config)).toBe(true);
  expect(aussehen).toEqual(
    expect.objectContaining({
      guidingQuestion: "Wie sieht die Person aus?",
      sentenceStarter: "Die Person ist ... und hat ...",
      modelSentence:
        "Die Person ist groß und schlank. Sie hat kurze schwarze Haare und braune Augen.",
    }),
  );
  expect(aussehen.guidingQuestion).not.toContain("Was sagst du über");
  expect(aussehen.sentenceStarter).not.toContain("Bei aussehen sage ich");
});
