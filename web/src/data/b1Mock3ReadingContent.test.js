import { B1_MOCK3_LESEN } from "./b1Mock3ReadingContent";
import { B1_READING_PRACTICE_SAMPLES, getB1ReadingQuestions } from "./b1ReadingPracticeSamples";

describe("B1 Mock 3 native Lesen source", () => {
  const paper = B1_MOCK3_LESEN;
  const parts = getB1ReadingQuestions(paper);
  const all = ["teil1", "teil2", "teil3", "teil4", "teil5"].flatMap((key) => parts[key]);

  test("follows the standardized five-part B1 / 30-question / 65-minute reading contract", () => {
    expect(paper.id).toBe("b1-mock-03-lesen");
    expect(Object.fromEntries(Object.entries(parts).map(([key, value]) => [key, value.length]))).toEqual({
      teil1: 6, teil2: 6, teil3: 7, teil4: 7, teil5: 4,
    });
    expect(all.map((question) => question.number)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    expect(["teil1", "teil2", "teil3", "teil4", "teil5"].reduce(
      (sum, key) => sum + Number(paper[key].time.split(" ")[0]), 0,
    )).toBe(65);
  });

  test("transcribes complete readable source content, not embedded PDF pages or placeholder questions", () => {
    expect(paper.pdfText).toBeUndefined();
    expect(paper.teil1.paragraphs.join(" ")).toContain("Bankomatkarte");
    expect(paper.teil2.paragraphs.join(" ")).toContain("Universität Göttingen");
    expect(paper.teil2.text2.paragraphs.join(" ")).toContain("Murtensee");
    expect(paper.teil3.ads).toHaveLength(10);
    expect(paper.teil4.comments[6].person).toContain("Marinette");
    expect(paper.teil5.sections).toHaveLength(8);
    expect(all.every((q) => q.answer !== undefined)).toBe(true);
  });

  test("retains source examples and answer key, including no-matching-ad option", () => {
    expect(paper.teil3.exampleAd).toBe("I");
    expect(paper.teil3.situations.some((q) => q.answer === "0")).toBe(true);
    expect(paper.teil3.situations.every((q) => q.answer === "0" || q.answer !== "i")).toBe(true);
    expect(all.map((q) => q.answer)).toEqual([
      "richtig", "richtig", "falsch", "falsch", "richtig", "falsch",
      "b", "a", "b", "b", "b", "c",
      "d", "0", "f", "b", "a", "c", "h",
      "nein", "nein", "ja", "nein", "ja", "nein", "ja",
      "c", "a", "c", "a",
    ]);
  });

  test("is registered as a separate practice identity, without replacing existing B1 reading samples", () => {
    expect(B1_READING_PRACTICE_SAMPLES).toHaveLength(11);
    expect(B1_READING_PRACTICE_SAMPLES.some((item) => item.id === paper.id)).toBe(false);
    expect(getB1ReadingQuestions(paper).teil1).toHaveLength(6);
  });
});
