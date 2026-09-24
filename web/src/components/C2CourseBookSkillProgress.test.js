import fs from "fs";
import path from "path";
import { buildC2DayProgress, summarizeC2SkillProgress } from "../hooks/useC2CourseProgress";
import { getC2SpeakingSupport } from "../data/c2SkillCycle";
import { getC2WritingFormat } from "../data/c2WritingFormats";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("C2 Course Book skill progress", () => {
  const courseTab = read("CourseTab.js");
  const workbook = read("C2UnifiedGuidedWorkbookPage.js");

  test("treats C2 as self-learning and removes the generic manual completion source", () => {
    expect(courseTab).toContain('const SELF_LEARNING_ONLY_LEVELS = new Set(["B2", "C1", "C2"])');
    expect(courseTab).toContain('source: "c2-cloud-progress"');
    expect(courseTab).toContain("isC2CourseBook ? (() =>");
    expect(courseTab).toContain("Progress syncs automatically across devices.");
  });

  test("shows daily C2 skill labels and aggregate counters", () => {
    expect(courseTab).toContain("Main: {getC2SkillLabel(entry.day)?.label}");
    expect(courseTab).toContain('["lesen", "Lesen"]');
    expect(courseTab).toContain('["hoeren", "Hören"]');
    expect(courseTab).toContain('["speak", "Sprechen"]');
    expect(courseTab).toContain('["write", "Schreiben"]');
    expect(courseTab).toContain("c2SkillSummary[key]?.completed");
  });

  test("keeps Hören source-pending separate from course completion", () => {
    const day2 = buildC2DayProgress(2, {
      progress: { learnDone: true, confidence: "medium", hoerenDone: false },
    });

    expect(day2.waitingForListeningSource).toBe(true);
    expect(day2.skillDone).toBe(false);
    expect(day2.dayComplete).toBe(true);

    const summary = summarizeC2SkillProgress({ 2: day2 });
    expect(summary.hoeren.completed).toBe(0);
    expect(summary.hoeren.waitingForSource).toBe(7);
  });

  test("keeps first-attempt reading score informational only", () => {
    const day1 = buildC2DayProgress(1, {
      progress: { learnDone: true, lesenDone: true, confidence: "high" },
      readingFirstAttempts: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
    });

    expect(day1.dayComplete).toBe(true);
    expect(day1.readingFirstAttemptScore).toEqual(
      expect.objectContaining({ answered: 5, total: 5 }),
    );
    expect(workbook).toContain("Erster Versuch:");
    expect(workbook).toContain("Er entscheidet nicht über den Kursabschluss.");
  });

  test("reduces speaking help and varies writing formats as the course advances", () => {
    expect([3, 7, 11, 15, 19, 23, 27].map(getC2SpeakingSupport)).toEqual([
      "full",
      "full",
      "keywords",
      "keywords",
      "keywords",
      "exam",
      "exam",
    ]);

    expect([4, 8, 12, 16, 20, 24, 28].map((day) => getC2WritingFormat(day, "X").label)).toEqual([
      "Leserbrief",
      "Formelle E-Mail",
      "Argumentativer Beitrag",
      "Zusammenfassung + Bewertung",
      "Stellungnahme",
      "Synthese mehrerer Positionen",
      "Prüfungssimulation",
    ]);
  });

  test("adds a four-day recap without adding another required assignment", () => {
    expect(workbook).toContain("4-day cycle recap");
    expect(workbook).toContain("This is a recap only. It does not add another assignment.");
  });
});
