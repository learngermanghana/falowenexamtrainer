import fs from "fs";
import path from "path";

const readSource = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, "..", relativePath), "utf8");

describe("Exams Room section navigation", () => {
  const appSource = readSource("App.js");
  const lesenSource = readSource("components/LesenPage.js");
  const horenSource = readSource("components/HorenPage.js");
  const listeningSampleSource = readSource("components/ListeningPracticeSamplePage.jsx");
  const overviewSource = readSource("components/ExamsOverviewPage.js");
  const a1ReadingSource = readSource("components/A1ReadingPracticeSamples.jsx");
  const a2ReadingSource = readSource("components/A2ReadingPracticeSamples.jsx");

  test("adds dedicated sample URLs and exposes Hören in the Exams Room nav", () => {
    expect(appSource).toContain('/exams/:section/:practiceLevel/:sampleId');
    expect(appSource).toContain('{ key: "horen", label: t("appNav.examTabs.horen") }');
    expect(appSource).toContain('<HorenPage practiceLevel={practiceLevel} sampleId={sampleId} />');
    expect(appSource).toContain('<LesenPage practiceLevel={practiceLevel} sampleId={sampleId} />');
  });

  test("Lesen uses a vertical sample list and opens A1/A2 samples on their own URLs", () => {
    expect(lesenSource).toContain('display: "grid"');
    expect(lesenSource).toContain('slug: `sample-${index + 1}`');
    expect(lesenSource).toContain('/exams/lesen/${normalizedLevel.toLowerCase()}/${sample.slug}');
    expect(lesenSource).toContain('A1_READING_PRACTICE_SAMPLES');
    expect(lesenSource).toContain('A2_READING_PRACTICE_SAMPLES');
    expect(a1ReadingSource).toContain('initialSampleId = ""');
    expect(a1ReadingSource).toContain('standalone = false');
    expect(a1ReadingSource).toContain('{!standalone ? (');
    expect(a2ReadingSource).toContain('initialSampleId = ""');
    expect(a2ReadingSource).toContain('standalone = false');
    expect(a2ReadingSource).toContain('{!standalone ? (');
  });

  test("Hören Sample 1 reuses the final mock question banks and protected audio", () => {
    expect(horenSource).toContain('Hören Sample 1');
    expect(horenSource).toContain('/exams/horen/${normalizedLevel.toLowerCase()}/sample-1');
    expect(listeningSampleSource).toContain('A1_GOETHE_LISTENING_MOCK');
    expect(listeningSampleSource).toContain('A2_GOETHE_LISTENING_TEIL1');
    expect(listeningSampleSource).toContain('A2_GOETHE_LISTENING_TEIL2');
    expect(listeningSampleSource).toContain('A2_GOETHE_LISTENING_TEIL3');
    expect(listeningSampleSource).toContain('A2_GOETHE_LISTENING_TEIL4');
    expect(listeningSampleSource).toContain('fetchA1MockAudioPlaybackUrl');
    expect(listeningSampleSource).toContain('fetchA2MockAudioPlaybackUrl');
    expect(listeningSampleSource).toContain('Check answers');
  });

  test("Overview is intentionally minimal", () => {
    expect(overviewSource).toContain('Prepare for your {level} exam');
    expect(overviewSource).toContain('Explore the navigation above');
    expect(overviewSource).not.toContain('PRACTICE_SECTIONS');
    expect(overviewSource).not.toContain('getMockExamsForLevel');
    expect(appSource).toContain('examSection !== "overview" && !sampleId');
  });
});
