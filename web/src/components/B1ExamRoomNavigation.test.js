import fs from "fs";
import path from "path";
import {
  B1_READING_PRACTICE_SAMPLES,
  getB1ReadingQuestions,
} from "../data/b1ReadingPracticeSamples";

const source = (file) => fs.readFileSync(path.resolve(__dirname, file), "utf8");

describe("B1 native Exams Room navigation and result sync", () => {
  const lesen = source("LesenPage.js");
  const horen = source("HorenPage.js");
  const listening = source("ListeningPracticeSamplePage.jsx");
  const reading = source("B1ReadingPracticeSamples.jsx");

  it("lists three B1 Lesen samples and routes to a separate interactive page", () => {
    expect(lesen).toContain("B1_READING_PRACTICE_SAMPLES");
    expect(lesen).toContain("<B1ReadingPracticeSamples initialSampleId={selected.id} standalone />");
    expect(lesen).toContain('/exams/lesen/${normalizedLevel.toLowerCase()}/${sample.slug}');
    expect(lesen).not.toContain("Lesen sample PDF.");
    expect(B1_READING_PRACTICE_SAMPLES).toHaveLength(3);
    expect(B1_READING_PRACTICE_SAMPLES.every((sample) =>
      Object.values(getB1ReadingQuestions(sample)).flat().length === 30)).toBe(true);
  });

  it("uses the B1 mock audio API for an independent, scored 30-question Hören sample", () => {
    expect(horen).toContain('["A1", "A2", "B1", "C1"]');
    expect(horen).toContain('return <ListeningPracticeSamplePage level={normalizedLevel} sampleId={sampleId} />;');
    expect(listening).toContain("B1_LISTENING");
    expect(listening).toContain("fetchB1MockAudioPlaybackUrl");
    expect(listening).toContain('mockId: "mock-01"');
    expect(listening).toContain('normalizedLevel === "B1"');
    expect(listening).toContain("saveExamRoomResult");
    expect(listening).toContain('section: "hoeren"');
  });

  it("records B1 Lesen answers with local attempt history and optional cloud sync", () => {
    expect(reading).toContain("saveReadingPracticeAttempt");
    expect(reading).toContain("getWeakestReadingSection");
    expect(reading).toContain("saveExamRoomResult");
    expect(reading).toContain('section: "lesen"');
    expect(reading).toContain('level: "B1"');
    expect(reading).toContain('data-b1-reading-practice-samples');
    expect(reading).toContain("Check answers");
  });
});
