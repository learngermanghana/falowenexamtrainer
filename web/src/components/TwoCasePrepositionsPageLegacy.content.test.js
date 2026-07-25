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
  });
});
