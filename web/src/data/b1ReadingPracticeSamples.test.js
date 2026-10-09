import {
  B1_READING_PART_KEYS,
  B1_READING_PRACTICE_SAMPLES,
  getB1ReadingQuestions,
} from "./b1ReadingPracticeSamples";
import { B1_READING, B1_LISTENING } from "./b1FinalMockData";

const expectedCounts = { teil1: 6, teil2: 6, teil3: 7, teil4: 7, teil5: 4 };

describe("B1 Exams Room native Lesen and Hören materials", () => {
  it("publishes three independent B1 reading samples with the same five-part structure", () => {
    expect(B1_READING_PRACTICE_SAMPLES).toHaveLength(3);
    expect(B1_READING_PART_KEYS).toEqual(Object.keys(expectedCounts));
    expect(new Set(B1_READING_PRACTICE_SAMPLES.map((set) => set.id)).size).toBe(3);

    B1_READING_PRACTICE_SAMPLES.forEach((sample) => {
      const parts = getB1ReadingQuestions(sample);
      const questions = Object.values(parts).flat();
      expect(questions).toHaveLength(30);
      expect(questions.map((q) => q.number).sort((a, b) => a - b))
        .toEqual(Array.from({ length: 30 }, (_, index) => index + 1));
      Object.entries(expectedCounts).forEach(([key, count]) => {
        expect(parts[key]).toHaveLength(count);
      });
      expect(sample.teil2.text2.questions).toHaveLength(3);
      expect(sample.teil3.ads).toHaveLength(10);
      expect(sample.teil5.sections).toHaveLength(4);
    });
  });

  it("ensures every marked answer is a choice the student can actually select", () => {
    B1_READING_PRACTICE_SAMPLES.forEach((sample) => {
      const parts = getB1ReadingQuestions(sample);
      parts.teil1.forEach((q) => expect(["richtig", "falsch"]).toContain(q.answer));
      parts.teil2.concat(parts.teil5).forEach((q) => {
        expect(q.options).toHaveLength(3);
        expect(q.options.some(({ id }) => id === q.answer)).toBe(true);
      });
      parts.teil3.forEach((q) => {
        expect(["0", ..."ABCDEFGHIJ".toLowerCase().split("").filter((letter) => letter !== "c")])
          .toContain(q.answer);
      });
      parts.teil4.forEach((q) => expect(["ja", "nein"]).toContain(q.answer));
    });
  });

  it("has distinct reading texts and questions instead of reusing the mock or each other", () => {
    const textFingerprints = B1_READING_PRACTICE_SAMPLES.map((s) =>
      [s.teil1.paragraphs.join(" "), s.teil2.paragraphs.join(" "),
        s.teil2.text2.paragraphs.join(" "), s.teil4.context, s.teil5.heading].join(" "));
    expect(new Set(textFingerprints).size).toBe(3);
    expect(textFingerprints.every((text) =>
      !text.includes(B1_READING.teil1.paragraphs[0]) &&
      !text.includes(B1_READING.teil2.paragraphs[0]))).toBe(true);
  });

  it("keeps the listening mock's four verified banks available without copying them", () => {
    expect(B1_LISTENING.map((part) => part.questions.length)).toEqual([10, 5, 7, 8]);
    expect(B1_LISTENING.flatMap((part) => part.questions)).toHaveLength(30);
    B1_LISTENING.forEach((part) => {
      expect(part.audioObjectKey).toMatch(/^b1\/mock-hoeren-1\/teil-[1-4]\.mp3$/);
      part.questions.forEach((q) => {
        expect(q.options.some(([id]) => id === q.answer)).toBe(true);
      });
    });
  });
});
