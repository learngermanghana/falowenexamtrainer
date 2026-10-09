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

  it("changes Teil 1 true/false patterns between all practice banks and the final mock", () => {
    const patterns = B1_READING_PRACTICE_SAMPLES.map((sample) =>
      sample.teil1.questions.map((question) => question.answer).join(","));
    const mockPattern = B1_READING.teil1.questions.map((question) => question.answer).join(",");
    expect(new Set([...patterns, mockPattern]).size).toBe(4);
    expect(patterns.every((pattern) =>
      pattern !== "richtig,falsch,richtig,falsch,richtig,falsch")).toBe(true);
    patterns.forEach((pattern) => {
      expect(pattern.split(",").filter((answer) => answer === "richtig")).toHaveLength(3);
      expect(pattern.split(",").filter((answer) => answer === "falsch")).toHaveLength(3);
    });
  });

  it("gives each Teil 3 a different matching sequence with meaningful answer/ad alignment", () => {
    // The expected titles follow the learner's situation order, independent
    // of the changed letters, so swapping keys without matching the right ad fails.
    const expectedMatchingTitles = [
      ["Sprachtreff im Park", "Sommerdeutsch und Kultur", null,
        "Privater B2-Unterricht", "Deutsch in der Praxis", "Deutsch im Büro",
        "Grammatik am Abend"],
      ["Fotografie für Einsteiger", "Vegetarisch kochen", "Fahrrad fit machen",
        "Tanzstudio Süd", null, "Familienwerkstatt Keramik", "Karriere-Coaching"],
      ["Bewerbungsberatung einzeln", null, "Englisch am Telefon",
        "Erfolgreich präsentieren", "Erste Hilfe für Betriebe",
        "Tabellen für den Beruf", "Berufstreff im Bürgerhaus"],
    ];
    const sequences = B1_READING_PRACTICE_SAMPLES.map((sample, index) => {
      const ads = new Map(sample.teil3.ads.map(([letter, title]) => [letter.toLowerCase(), title]));
      expect([...ads.keys()]).toEqual("abcdefghij".split(""));
      expect(sample.teil3.situations.map((situation) => situation.answer)
        .filter((answer) => answer === "0")).toHaveLength(1);
      sample.teil3.situations.forEach((situation, position) => {
        const expectedTitle = expectedMatchingTitles[index][position];
        expect(situation.number).toBe(13 + position);
        if (expectedTitle === null) {
          expect(situation.answer).toBe("0");
        } else {
          expect(situation.answer).not.toBe("c"); // C remains the example
          expect(ads.get(situation.answer)).toBe(expectedTitle);
        }
      });
      return sample.teil3.situations.map((situation) => situation.answer).join(",");
    });
    expect(new Set([...sequences,
      B1_READING.teil3.situations.map((situation) => situation.answer).join(",")]).size)
      .toBe(4);
    expect(new Set(B1_READING_PRACTICE_SAMPLES.map((sample) =>
      sample.teil3.situations.findIndex((situation) => situation.answer === "0"))).size)
      .toBe(3);
    expect(new Set(B1_READING_PRACTICE_SAMPLES.map((sample) =>
      sample.teil3.ads.find(([letter]) => letter === "A")[1])).size).toBe(3);
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
