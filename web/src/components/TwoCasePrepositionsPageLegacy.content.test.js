import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.resolve(__dirname, "TwoCasePrepositionsPageLegacy.js"), "utf8");

describe("A1 12.1 bilingual grammar notes", () => {
  test("adds English meanings to helpful verb pairs", () => {
    expect(source).toContain("to lay / put something down");
    expect(source).toContain("to lie / be lying");
    expect(source).toContain("to place / stand something upright");
    expect(source).toContain("to sit / be seated");
  });

  test("adds English translations to all example pairs", () => {
    [
      "I go into the school.",
      "The book is lying on the table.",
      "The picture is hanging on the wall.",
      "The dog is lying under the table.",
      "The chair is standing between the tables.",
    ].forEach((translation) => expect(source).toContain(translation));
  });

  test("keeps visual-game clues aligned with their expected answers", () => {
    expect(source).toContain('label: "Car behind the house"');
    expect(source).toContain('answer: "hinter"');
    expect(source).toContain('label: "Dog next to the sofa"');
    expect(source).toContain('answer: "neben"');
    expect(source).toContain('label: "Box in the room"');
    expect(source).toContain('answer: "in"');
    expect(source).toContain("Answered: {answeredVisual} of {visualGame.length}");
    [
      'emojiLine2: "onto the table / auf den Tisch"',
      'emojiLine2: "vor dem Baum"',
      'emojiLine2: "⬇️ behind / dahinter: 🚗"',
      'emojiLine2: "attached to the door / an der Tür"',
      'emojiLine2: "next to / neben"',
      'emojiLine2: "inside / in"',
    ].forEach((answerReveal) => expect(source).not.toContain(answerReveal));
    [
      'emojiLine2: "onto the table"',
      'emojiLine2: "in front of the tree"',
      'emojiLine2: "⬇️ behind the house: 🚗"',
      'emojiLine2: "attached to the door"',
      'emojiLine2: "next to the sofa"',
      'emojiLine2: "inside the room"',
    ].forEach((englishClue) => expect(source).toContain(englishClue));
  });
});
