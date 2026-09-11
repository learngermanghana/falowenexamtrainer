import fs from "fs";
import path from "path";
import { alignB1CurriculumEntries } from "./b1CurriculumAlignment";
import { getB1LessonResourceOverride } from "./b1LessonResourceOverrides";

const componentSource = (file) =>
  fs.readFileSync(path.join(process.cwd(), "src", "components", file), "utf8");

const expectedAssignments = new Map([
  [7, "B1-3.7"],
  [8, "B1-3.8"],
  [9, "B1-3.9"],
  [10, "B1-4.10"],
  [11, "B1-4.11"],
  [12, "B1-4.12"],
]);

const workbookFiles = new Map([
  [7, "B1Day7FastFoodHausmannskostWorkbookPage.js"],
  [8, "B1Day8AllesFuerDieGesundheitWorkbookPage.js"],
  [9, "B1Day9WorkLifeBalanceWorkbookPage.js"],
  [10, "B1Day10DigitaleAuszeitWorkbookPage.js"],
  [11, "B1Day11TeamspieleWorkbookPage.js"],
  [12, "B1Day12AbenteuerInDerNaturWorkbookPage.js"],
]);

describe("B1 Course Book cleanup · Days 7-12", () => {
  test("Days 7-12 resolve grammar and workbook resources inside Falowen", () => {
    for (let day = 7; day <= 12; day += 1) {
      const override = getB1LessonResourceOverride(day);
      expect(override).toBeTruthy();
      expect(override.grammarBook).toBe(`/campus/course/lesson/B1/${day}?view=grammar`);
      expect(override.workbook).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(override.grammarBook).not.toContain("drive.google.com");
      expect(override.workbook).not.toContain("drive.google.com");
    }
  });

  test("curriculum alignment replaces stale Drive workbook and grammar routes for Days 7-12", () => {
    const raw = Array.from({ length: 6 }, (_, index) => ({
      id: `B1-test-${index + 7}`,
      level: "B1",
      displayDay: index + 7,
      grammarNotesPage: "https://drive.google.com/old-grammar",
      workbookPage: "https://drive.google.com/old-workbook",
      resources: [{
        level: "B1",
        displayDay: index + 7,
        grammarbook_link: "https://drive.google.com/nested-grammar",
        workbook_link: "https://drive.google.com/nested-workbook",
      }],
    }));

    const aligned = alignB1CurriculumEntries(raw);
    aligned.forEach((entry, index) => {
      const day = index + 7;
      expect(entry.grammarNotesPage).toBe(`/campus/course/lesson/B1/${day}?view=grammar`);
      expect(entry.grammarPage).toBe(`/campus/course/lesson/B1/${day}?view=grammar`);
      expect(entry.workbookPage).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(entry.workbookRoute).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(JSON.stringify(entry)).not.toContain("drive.google.com");
    });
  });

  test("the second cleanup batch stops at Day 12", () => {
    const raw = [{
      id: "B1-4.13",
      level: "B1",
      displayDay: 13,
      grammarNotesPage: "https://drive.google.com/day13-grammar",
      workbookPage: "https://drive.google.com/day13-workbook",
    }];
    expect(alignB1CurriculumEntries(raw)).toEqual(raw);
  });

  test("Days 7-12 keep their canonical submission identities", () => {
    expectedAssignments.forEach((assignmentKey, day) => {
      const source = componentSource(workbookFiles.get(day));
      expect(source).toContain(assignmentKey);
      expect(source).toContain(`day: ${day}`);
    });
  });

  test("Day 11 is centralized with its native grammar topic and lesson metadata", () => {
    const override = getB1LessonResourceOverride(11);
    expect(override.chapter).toBe("4.11");
    expect(override.title).toBe("Teamspiele und kooperative Aktivitäten");
    expect(override.grammarTopic).toContain("einander");
    expect(override.grammarTopic).toContain("miteinander");
    expect(override.grammarTopic).toContain("aufeinander");

    const grammar = componentSource("B1Day11TeamspieleGrammarNotesPage.js");
    expect(grammar).toContain("Teamspiele und kooperative Aktivitäten");
    expect(grammar).toContain("einander");
    expect(grammar).toContain("miteinander");
  });

  test("CourseLessonPage owns native grammar and workbook views for Days 7-12", () => {
    const courseLessonPage = componentSource("CourseLessonPage.js");
    const componentNames = [
      ["B1Day7FastFoodHausmannskostGrammarNotesPage", "B1Day7FastFoodHausmannskostWorkbookPage"],
      ["B1Day8AllesFuerDieGesundheitGrammarNotesPage", "B1Day8AllesFuerDieGesundheitWorkbookPage"],
      ["B1Day9WorkLifeBalanceGrammarNotesPage", "B1Day9WorkLifeBalanceWorkbookPage"],
      ["B1Day10DigitaleAuszeitGrammarNotesPage", "B1Day10DigitaleAuszeitWorkbookPage"],
      ["B1Day11TeamspieleGrammarNotesPage", "B1Day11TeamspieleWorkbookPage"],
      ["B1Day12AbenteuerInDerNaturGrammarNotesPage", "B1Day12AbenteuerInDerNaturWorkbookPage"],
    ];

    componentNames.flat().forEach((name) => expect(courseLessonPage).toContain(name));
  });
});
