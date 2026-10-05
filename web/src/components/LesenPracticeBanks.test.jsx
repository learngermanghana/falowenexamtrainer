import fs from "fs";
import path from "path";
import { A1_READING_PRACTICE_SAMPLES } from "./A1ReadingPracticeSamples";
import { A2_READING_PRACTICE_SET_01 } from "./A2ReadingPracticeSet";
import { A2_READING_PRACTICE_SAMPLES } from "./A2ReadingPracticeSamples";
import { A1_GOETHE_READING_MOCK_TEIL1 } from "./A1GoetheReadingMockTeil1Preview";
import { A2_GOETHE_READING_MOCK } from "./A2GoetheReadingMockPreview";

describe("Exams Room Lesen practice banks", () => {
  const lesenPageSource = fs.readFileSync(
    path.resolve(__dirname, "LesenPage.js"),
    "utf8",
  );
  const a1PracticeSource = fs.readFileSync(
    path.resolve(__dirname, "A1ReadingPracticeSamples.jsx"),
    "utf8",
  );
  const a2PracticeSource = fs.readFileSync(
    path.resolve(__dirname, "A2ReadingPracticeSamples.jsx"),
    "utf8",
  );

  test("routes A1 directly into the dedicated three-sample reading experience", () => {
    expect(lesenPageSource).toContain("return <A1ReadingPracticeSamples />");
    expect(lesenPageSource).not.toContain("A1_READING_PRACTICE_SET_01");
    expect(a1PracticeSource).toContain("Lesen Sample 1");
    expect(a1PracticeSource).toContain("Lesen Sample 2");
    expect(a1PracticeSource).toContain("Lesen Sample 3");
    expect(a1PracticeSource).not.toContain("Demnächst");
  });

  test("provides exactly three A1 samples with exactly 15 questions each", () => {
    expect(A1_READING_PRACTICE_SAMPLES).toHaveLength(3);

    A1_READING_PRACTICE_SAMPLES.forEach((sample) => {
      const teil1 = sample.parts.teil1.questions;
      const teil2 = sample.parts.teil2.questions;
      const teil3 = sample.parts.teil3.questions;

      expect(teil1).toHaveLength(5);
      expect(teil2).toHaveLength(5);
      expect(teil3).toHaveLength(5);
      expect(teil1.length + teil2.length + teil3.length).toBe(15);
      expect(teil1.map((question) => question.number)).toEqual([1, 2, 3, 4, 5]);
      expect(teil2.map((question) => question.number)).toEqual([6, 7, 8, 9, 10]);
      expect(teil3.map((question) => question.number)).toEqual([11, 12, 13, 14, 15]);
    });
  });

  test("uses the Final Mock visual language and three-part controls", () => {
    expect(a1PracticeSource).toContain("a1-goethe-mock-shell");
    expect(a1PracticeSource).toContain("a1-goethe-mock-exam");
    expect(a1PracticeSource).toContain("a1-goethe-mock-paper");
    expect(a1PracticeSource).toContain("a1-goethe-mock-website-grid");
    expect(a1PracticeSource).toContain("a1-goethe-mock-notice-card");
    expect(a1PracticeSource).toContain('aria-label="A1 Lesen sample selector"');
    expect(a1PracticeSource).toContain('aria-label="A1 Lesen part selector"');
  });

  test("keeps all A1 Exams Room sample texts different from the Final Mock", () => {
    const mockTexts = [
      A1_GOETHE_READING_MOCK_TEIL1.text1.body.join(" "),
      A1_GOETHE_READING_MOCK_TEIL1.text2.body.join(" "),
    ];

    A1_READING_PRACTICE_SAMPLES.forEach((sample) => {
      sample.parts.teil1.texts.forEach((textItem) => {
        expect(mockTexts).not.toContain(textItem.body.join(" "));
      });
    });
  });

  test("provides three complete A2 Lesen samples with 20 questions each", () => {
    expect(A2_READING_PRACTICE_SAMPLES).toHaveLength(3);

    A2_READING_PRACTICE_SAMPLES.forEach((sample) => {
      expect(sample.teil1.questions).toHaveLength(5);
      expect(sample.teil2.questions).toHaveLength(5);
      expect(sample.teil3.questions).toHaveLength(5);
      expect(sample.teil4.people).toHaveLength(5);

      expect(
        sample.teil1.questions.length +
          sample.teil2.questions.length +
          sample.teil3.questions.length +
          sample.teil4.people.length,
      ).toBe(20);

      expect(sample.teil1.questions.map((item) => item.number)).toEqual([1, 2, 3, 4, 5]);
      expect(sample.teil2.questions.map((item) => item.number)).toEqual([6, 7, 8, 9, 10]);
      expect(sample.teil3.questions.map((item) => item.number)).toEqual([11, 12, 13, 14, 15]);
      expect(sample.teil4.people.map((item) => item.number)).toEqual([16, 17, 18, 19, 20]);
    });
  });

  test("routes A2 directly into the selectable four-part sample experience", () => {
    expect(lesenPageSource).toContain("<A2ReadingPracticeSamples />");
    const source = fs.readFileSync(
      path.resolve(__dirname, "A2ReadingPracticeSamples.jsx"),
      "utf8",
    );
    expect(source).toContain('aria-label="A2 Lesen sample selector"');
    expect(source).toContain('aria-label="A2 Lesen part selector"');
    expect(source).toContain("Lesen Sample 1");
    expect(source).toContain("Lesen Sample 2");
    expect(source).toContain("Lesen Sample 3");
    expect(source).not.toContain("Demnächst");
  });

  test("persists completed Lesen samples so refresh cannot duplicate attempts", () => {
    [a1PracticeSource, a2PracticeSource].forEach((source) => {
      expect(source).toContain("if (saved.submittedBySample) setSubmittedBySample(saved.submittedBySample)");
      expect(source).toContain("submittedBySample,");
      expect(source).toContain("if (submitted) return");
    });
  });

  test("restores the saved Teil and only resets to Teil 1 on an explicit sample change", () => {
    [a1PracticeSource, a2PracticeSource].forEach((source) => {
      expect(source).toContain("const selectSample = (nextSampleId) =>");
      expect(source).toContain('setPartKey("teil1")');
      expect(source).not.toContain('useEffect(() => {\n    setTimerRunning(false);\n    setPartKey("teil1");\n  }, [sampleId]);');
    });
  });

  test("does not overwrite restored progress before hydration finishes", () => {
    [a1PracticeSource, a2PracticeSource].forEach((source) => {
      expect(source).toContain("hydratedStorageKey !== storageKey");
      expect(source).toContain("setHydratedStorageKey(storageKey)");
    });
  });

  test("provides a complete 20-question A2 reading practice set", () => {
    const total =
      A2_READING_PRACTICE_SET_01.teil1.questions.length +
      A2_READING_PRACTICE_SET_01.teil2.questions.length +
      A2_READING_PRACTICE_SET_01.teil3.questions.length +
      A2_READING_PRACTICE_SET_01.teil4.people.length;

    expect(total).toBe(20);
  });

  test("keeps every A2 Exams Room sample separate from the Course Book mock", () => {
    A2_READING_PRACTICE_SAMPLES.forEach((sample) => {
      expect(sample.teil1.article.title).not.toBe(
        A2_GOETHE_READING_MOCK.teil1.article.title,
      );
      expect(sample.teil3.email.subject).not.toBe(
        A2_GOETHE_READING_MOCK.teil3.email.subject,
      );
      expect(sample.teil4.ads.map((ad) => ad.title)).not.toEqual(
        A2_GOETHE_READING_MOCK.teil4.ads.map((ad) => ad.title),
      );
    });
  });
});
