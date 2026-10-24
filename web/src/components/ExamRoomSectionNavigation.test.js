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

  test("Lesen uses one shared sample library and opens protected A1/A2/B1 level URLs", () => {
    expect(lesenSource).toContain('ReadingPracticeSampleList');
    expect(lesenSource).toContain('slug:`sample-${index+1}`');
    expect(lesenSource).toContain('/exams/lesen/${normalizedLevel.toLowerCase()}/${item.slug}');
    expect(lesenSource).toContain('A1_READING_PRACTICE_SAMPLES');
    expect(lesenSource).toContain('A2_READING_PRACTICE_SAMPLES');
    expect(lesenSource).toContain('B1_READING_PRACTICE_SAMPLES');
    expect(lesenSource).toContain('availableLevels.includes(next)');
    expect(appSource).toContain('/exams/:section/:practiceLevel');
    expect(a1ReadingSource).toContain('initialSampleId = ""');
    expect(a1ReadingSource).toContain('standalone = false');
    expect(a1ReadingSource).toContain('<ReadingPracticeSampleList level="A1"');
    expect(a2ReadingSource).toContain('initialSampleId = ""');
    expect(a2ReadingSource).toContain('standalone = false');
    expect(a2ReadingSource).toContain('<ReadingPracticeSampleList level="A2"');
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

  test("Overview preserves scored progress with one mock entry and direct skill navigation", () => {
    expect(overviewSource).toContain("Your {currentLevel} exam room");
    expect(overviewSource).toContain("buildExamRoomCoach");
    expect(overviewSource).toContain("Exam skill practice coverage");
    expect(overviewSource).toContain("getMockExamsForLevel");
    expect(overviewSource).toContain('onClick={() => openPractice("/exams/mocks", "Mock Exams opened successfully.")}');
    expect(overviewSource).toContain('aria-label={"Practise " + skill.title}');
    expect(overviewSource).toContain('onClick={() => openPractice("/exams/question", "Daily exam practice opened successfully.")}');
    expect(overviewSource).toContain('onClick={() => openPractice("/exams/file", "My Exam File opened successfully.")}');
    expect(overviewSource).not.toContain("PRACTICE_SECTIONS");
    expect(appSource).toContain('role="group" aria-label="Choose exam practice level"');
    expect(appSource).toContain('accessibleLevels.map((option)');
    expect(appSource).toContain('aria-pressed={level === option}');
    expect(appSource).toContain('onClick={() => openExamSection(tab)}');
    expect(overviewSource).toContain('announceExamSuccess(message)');
  });
});
