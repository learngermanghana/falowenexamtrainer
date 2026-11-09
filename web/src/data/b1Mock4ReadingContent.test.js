import { B1_MOCK4_LESEN as paper } from "./b1Mock4ReadingContent";

const all = [
  ...paper.teil1.questions,
  ...paper.teil2.questions,
  ...paper.teil2.text2.questions,
  ...paper.teil3.situations,
  ...paper.teil4.comments,
  ...paper.teil5.questions,
];

describe("B1 Mock 04 learner Lesen paper", () => {
  test("contains exactly 30 items across the 5 Goethe-style parts", () => {
    expect(all.map(q=>q.number)).toEqual(Array.from({length:30},(_,i)=>i+1));
    expect([paper.teil1.questions.length,
      paper.teil2.questions.length+paper.teil2.text2.questions.length,
      paper.teil3.situations.length,paper.teil4.comments.length,
      paper.teil5.questions.length]).toEqual([6,6,7,7,4]);
  });
  test("uses Mock 04's revised Feldheim article and different question 9", () => {
    expect(paper.teil2.paragraphs.join(" ")).toContain("doppelt so viel Strom");
    expect(paper.teil2.questions[2].question).toContain("anderen Dörfern");
    expect(paper.teil2.questions[2].options[2].label).toBe("muss die Bevölkerung dafür sein.");
  });
  test("hides every marking answer from the learner-side bundle", () => {
    for(const q of all)expect(q).not.toHaveProperty("answer");
  });
  test("shows all A–J advertisements but reserves example I", () => {
    expect(paper.teil3.ads.map(a=>a[0])).toEqual("ABCDEFGHIJ".split(""));
    expect(paper.teil3.exampleAd).toBe("I");
    expect(paper.teil1.questions[1].question).toContain("beim Bezahlen");
  });
});
