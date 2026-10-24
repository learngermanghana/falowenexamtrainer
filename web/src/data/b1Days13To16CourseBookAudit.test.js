import fs from "fs";
import path from "path";
import {
  alignB1CurriculumEntries,
  FIRST_B1_CLEANUP_DAYS,
} from "./b1CurriculumAlignment";
import { getB1LessonResourceOverride } from "./b1LessonResourceOverrides";

const componentSource = (file) =>
  fs.readFileSync(path.join(process.cwd(), "src", "components", file), "utf8");

const expectedAssignments = new Map([
  [13, "B1-4.13"],
  [14, "B1-5.14"],
  [15, "B1-5.15"],
  [16, "B1-5.16"],
]);

const workbookFiles = new Map([
  [13, "B1Day13EigeneFilmkritikWorkbookPage.js"],
  [14, "B1Day14TraditionellesDigitalesLernenWorkbookPage.js"],
  [15, "B1Day15MedienHomeofficeWorkbookPage.js"],
  [16, "B1Day16PruefungsangstStressbewaeltigungWorkbookPage.js"],
]);

const grammarFiles = new Map([
  [13, "B1Day13EigeneFilmkritikGrammarNotesPage.js"],
  [14, "B1Day14TraditionellesDigitalesLernenGrammarNotesPage.js"],
  [15, "B1Day15MedienHomeofficeGrammarNotesPage.js"],
  [16, "B1Day16PruefungsangstStressbewaeltigungGrammarNotesPage.js"],
]);

describe("B1 Course Book cleanup · Days 13-16", () => {
  test("Days 13-16 are now owned by the centralized B1 cleanup", () => {
    [13, 14, 15, 16].forEach((day) => expect(FIRST_B1_CLEANUP_DAYS.has(day)).toBe(true));
    expect(FIRST_B1_CLEANUP_DAYS.size).toBe(28);
  });

  test("Days 13-16 resolve native grammar and workbook routes inside Falowen", () => {
    for (let day = 13; day <= 16; day += 1) {
      const override = getB1LessonResourceOverride(day);
      expect(override).toBeTruthy();
      expect(override.grammarBook).toBe(`/campus/course/lesson/B1/${day}?view=grammar`);
      expect(override.workbook).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(JSON.stringify(override)).not.toContain("drive.google.com");
    }
  });

  test("curriculum alignment replaces stale Drive routes for Days 13-16", () => {
    const raw = Array.from({ length: 4 }, (_, index) => ({
      id: `B1-test-${index + 13}`,
      level: "B1",
      displayDay: index + 13,
      grammarNotesPage: "https://drive.google.com/old-grammar",
      workbookPage: "https://drive.google.com/old-workbook",
      resources: [{
        level: "B1",
        displayDay: index + 13,
        grammarbook_link: "https://drive.google.com/nested-grammar",
        workbook_link: "https://drive.google.com/nested-workbook",
      }],
    }));

    const aligned = alignB1CurriculumEntries(raw);
    aligned.forEach((entry, index) => {
      const day = index + 13;
      expect(entry.grammarNotesPage).toBe(`/campus/course/lesson/B1/${day}?view=grammar`);
      expect(entry.grammarPage).toBe(`/campus/course/lesson/B1/${day}?view=grammar`);
      expect(entry.workbookPage).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(entry.workbookRoute).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(entry.resources[0].grammarbook_link).toBe(`/campus/course/lesson/B1/${day}?view=grammar`);
      expect(entry.resources[0].workbook_link).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(JSON.stringify(entry)).not.toContain("drive.google.com");
    });
  });

  test("Days 13-16 keep their canonical submission identities", () => {
    expectedAssignments.forEach((assignmentKey, day) => {
      const source = componentSource(workbookFiles.get(day));
      expect(source).toContain(`day: ${day}`);
      expect(source).toContain(`assignmentKey: "${assignmentKey}"`);
      expect(source).toContain('import B1StandardWorkbookPage from "./B1StandardWorkbookPage"');
    });
  });

  test("Days 13-16 keep day-specific grammar notes rather than generic placeholders", () => {
    const expectedGrammar = new Map([
      [13, "Passiv"],
      [14, "während"],
      [15, "Passiv mit Modalverben"],
      [16, "Infinitiv mit zu"],
    ]);

    expectedGrammar.forEach((needle, day) => {
      const source = componentSource(grammarFiles.get(day));
      expect(source).toContain(needle);
      expect(source).not.toContain("Grammar notes have not been added");
    });
  });

  test("CourseLessonPage mounts native grammar and workbook components for all four days", () => {
    const courseLessonPage = componentSource("CourseLessonPage.js");
    [
      "B1Day13EigeneFilmkritikWorkbookPage",
      "B1Day14TraditionellesDigitalesLernenWorkbookPage",
      "B1Day15MedienHomeofficeWorkbookPage",
      "B1Day16PruefungsangstStressbewaeltigungWorkbookPage",
      "B1Day13EigeneFilmkritikGrammarNotesPage",
      "B1Day14TraditionellesDigitalesLernenGrammarNotesPage",
      "B1Day15MedienHomeofficeGrammarNotesPage",
      "B1Day16PruefungsangstStressbewaeltigungGrammarNotesPage",
    ].forEach((name) => expect(courseLessonPage).toContain(name));
  });
});
