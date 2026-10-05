import fs from "fs";
import path from "path";
import { A1_READING_PRACTICE_SET_01 } from "./LesenPage";
import { A2_READING_PRACTICE_SET_01 } from "./A2ReadingPracticeSet";
import { A1_GOETHE_READING_MOCK_TEIL1 } from "./A1GoetheReadingMockTeil1Preview";
import { A2_GOETHE_READING_MOCK } from "./A2GoetheReadingMockPreview";

describe("Exams Room Lesen practice banks", () => {
  const lesenPageSource = fs.readFileSync(
    path.resolve(__dirname, "LesenPage.js"),
    "utf8",
  );

  test("opens Lesen 1 directly with selectable parts and future-set placeholders", () => {
    expect(lesenPageSource).toContain("Lesen 1");
    expect(lesenPageSource).toContain("Lesen 2 · Demnächst");
    expect(lesenPageSource).toContain("Lesen 3 · Demnächst");
    expect(lesenPageSource).toContain('aria-label="A1 Lesen part selector"');
    expect(lesenPageSource).toContain("Previous part");
    expect(lesenPageSource).toContain("Next part");
  });

  test("persists unfinished A1 answers and restores the active Teil", () => {
    expect(lesenPageSource).toContain("window.localStorage.getItem(a1StorageKey)");
    expect(lesenPageSource).toContain("window.localStorage.setItem");
    expect(lesenPageSource).toContain("activeSectionId: activeA1SectionId");
    expect(lesenPageSource).toContain("skipNextA1PersistRef");
  });

  test("keeps A1 Exams Room reading questions separate from the A1 final mock", () => {
    const practiceText = A1_READING_PRACTICE_SET_01.sections[0].tasks[0].text.join(" ");
    const courseMockText = A1_GOETHE_READING_MOCK_TEIL1.text1.body.join(" ");

    expect(practiceText).not.toBe(courseMockText);
    expect(practiceText).toContain("Erik");
    expect(courseMockText).toContain("Samira");
  });

  test("provides a complete 20-question A2 reading practice set", () => {
    const total =
      A2_READING_PRACTICE_SET_01.teil1.questions.length +
      A2_READING_PRACTICE_SET_01.teil2.questions.length +
      A2_READING_PRACTICE_SET_01.teil3.questions.length +
      A2_READING_PRACTICE_SET_01.teil4.people.length;

    expect(total).toBe(20);
  });

  test("keeps A2 Exams Room questions separate from the Course Book mock", () => {
    expect(A2_READING_PRACTICE_SET_01.teil1.article.title).not.toBe(
      A2_GOETHE_READING_MOCK.teil1.article.title,
    );
    expect(A2_READING_PRACTICE_SET_01.teil3.email.subject).not.toBe(
      A2_GOETHE_READING_MOCK.teil3.email.subject,
    );
    expect(A2_READING_PRACTICE_SET_01.teil4.ads.map((ad) => ad.title)).not.toEqual(
      A2_GOETHE_READING_MOCK.teil4.ads.map((ad) => ad.title),
    );
  });
});
