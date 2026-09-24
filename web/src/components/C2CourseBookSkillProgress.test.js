import fs from "fs";
import path from "path";
import { buildC2DayProgress, summarizeC2SkillProgress } from "../hooks/useC2CourseProgress";
import { getC2SpeakingSupport } from "../data/c2SkillCycle";
import { getC2WritingFormat } from "../data/c2WritingFormats";
import { C2_COURSE_BOOK_ENTRIES } from "../data/c2CourseBookEntries";

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

  test("Course Book instructions follow each day’s rotating main skill", () => {
    expect(C2_COURSE_BOOK_ENTRIES).toHaveLength(28);

    const expected = {
      1: ["lesen", "Lesen"],
      2: ["hoeren", "Hören"],
      3: ["speak", "Speak"],
      4: ["write", "Write"],
    };

    Object.entries(expected).forEach(([day, [skillFocus, skillLabel]]) => {
      const entry = C2_COURSE_BOOK_ENTRIES.find((item) => Number(item.day) === Number(day));
      expect(entry).toEqual(expect.objectContaining({ skillFocus, skillLabel }));
      expect(entry.instruction).toContain(`today’s ${skillLabel} task`);
      expect(entry.instruction).toContain("Day completion is automatic");
      expect(entry.instruction).toContain("use Review to revise");
      expect(entry.instruction).not.toContain("complete the writing task and compare your work with the model");
    });
  });

  test("keeps the source-pending completion exemption only for Hören days without audio", () => {
    const day2 = buildC2DayProgress(2, {
      progress: { learnDone: true, hoerenDone: false },
    });
    const day6 = buildC2DayProgress(6, {
      progress: { learnDone: true, hoerenDone: false },
    });

    expect(day2.waitingForListeningSource).toBe(false);
    expect(day2.skillDone).toBe(false);
    expect(day2.dayComplete).toBe(false);

    expect(day6.waitingForListeningSource).toBe(true);
    expect(day6.skillDone).toBe(false);
    expect(day6.dayComplete).toBe(true);

    const summary = summarizeC2SkillProgress({ 2: day2, 6: day6 });
    expect(summary.hoeren.completed).toBe(0);
    expect(summary.hoeren.waitingForSource).toBe(6);
  });

  test("keeps first-attempt reading score informational only", () => {
    const day1 = buildC2DayProgress(1, {
      progress: { learnDone: true, lesenDone: true },
      readingFirstAttempts: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
    });

    expect(day1.dayComplete).toBe(true);
    expect(day1.readingFirstAttemptScore).toEqual(
      expect.objectContaining({ answered: 5, total: 5 }),
    );
    expect(workbook).toContain("Erster Versuch:");
    expect(workbook).toContain("Er entscheidet nicht über den Kursabschluss.");
  });

  test("does not require confidence or reflection to complete a C2 day", () => {
    const day1 = buildC2DayProgress(1, {
      progress: { learnDone: true, lesenDone: true },
    });
    expect(day1.dayComplete).toBe(true);
    expect(workbook).not.toContain("<strong>Confidence</strong>");
    expect(workbook).not.toContain("<strong>Reflection</strong>");
    expect(workbook).toContain("Review is revision only");
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
