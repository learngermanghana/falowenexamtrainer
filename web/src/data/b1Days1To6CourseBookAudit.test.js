import fs from "fs";
import path from "path";
import { alignB1CurriculumEntries } from "./b1CurriculumAlignment";
import { getB1LessonResourceOverride } from "./b1LessonResourceOverrides";

const componentSource = (file) =>
  fs.readFileSync(path.join(process.cwd(), "src", "components", file), "utf8");

describe("B1 Course Book cleanup · Days 1-6", () => {
  test("all first six B1 days resolve grammar and workbook resources inside Falowen", () => {
    for (let day = 1; day <= 6; day += 1) {
      const override = getB1LessonResourceOverride(day);
      expect(override).toBeTruthy();
      expect(override.grammarBook).toBe(`/campus/course/lesson/B1/${day}?view=grammar`);
      expect(override.workbook).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(override.grammarBook).not.toContain("drive.google.com");
      expect(override.workbook).not.toContain("drive.google.com");
    }
  });

  test("curriculum alignment replaces stale Drive resources for Days 1-6", () => {
    const raw = Array.from({ length: 6 }, (_, index) => ({
      id: `B1-test-${index + 1}`,
      level: "B1",
      displayDay: index + 1,
      grammarNotesPage: "https://drive.google.com/old-grammar",
      workbookPage: "https://drive.google.com/old-workbook",
    }));

    const aligned = alignB1CurriculumEntries(raw);
    aligned.forEach((entry, index) => {
      const day = index + 1;
      expect(entry.grammarNotesPage).toBe(`/campus/course/lesson/B1/${day}?view=grammar`);
      expect(entry.grammarPage).toBe(`/campus/course/lesson/B1/${day}?view=grammar`);
      expect(entry.workbookPage).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(entry.workbookRoute).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(JSON.stringify(entry)).not.toContain("drive.google.com");
    });
  });

  test("complete B1 cleanup does not rewrite an out-of-range Day 29 entry", () => {
    const raw = [{
      id: "B1-29",
      level: "B1",
      displayDay: 29,
      grammarNotesPage: "https://drive.google.com/day29-grammar",
      workbookPage: "https://drive.google.com/day29-workbook",
    }];
    expect(alignB1CurriculumEntries(raw)).toEqual(raw);
  });

  test("Days 4-6 keep their canonical native workbook identities and submissions", () => {
    const day4 = componentSource("B1Day4WohnungSuchenWorkbookPage.js");
    const day5 = componentSource("B1Day5BesichtigungsterminWorkbookPage.js");
    const day6 = componentSource("B1Day6StadtOderLandWorkbookPageV2.js");

    expect(day4).toContain("Wohnung suchen");
    expect(day4).toContain('B1-2.4');
    expect(day5).toContain("Besichtigungstermin");
    expect(day5).toContain('B1-2.5');
    expect(day6).toContain("Leben in der Stadt oder auf dem Land?");
    expect(day6).toContain('B1-2.6');

    [day4, day5, day6].forEach((source) => {
      expect(source).toContain("STANDARD_WORKBOOK_TABS");
      expect(source).toContain("WorkbookReferenceAnswers");
      expect(source).not.toContain("drive.google.com");
    });
  });

  test("CourseLessonPage owns the native Day 4-6 B1 grammar/workbook views", () => {
    const courseLessonPage = componentSource("CourseLessonPage.js");
    expect(courseLessonPage).toContain("B1Day4WohnungSuchenGrammarNotesPage");
    expect(courseLessonPage).toContain("B1Day4WohnungSuchenWorkbookPage");
    expect(courseLessonPage).toContain("B1Day5BesichtigungsterminGrammarNotesPage");
    expect(courseLessonPage).toContain("B1Day5BesichtigungsterminWorkbookPage");
    expect(courseLessonPage).toContain("B1Day6StadtOderLandGrammarNotesPage");
    expect(courseLessonPage).toContain("B1Day6StadtOderLandWorkbookPage");
  });
});
