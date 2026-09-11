import fs from "fs";
import path from "path";
import { alignB1CurriculumEntries } from "./b1CurriculumAlignment";
import { getB1LessonResourceOverride } from "./b1LessonResourceOverrides";

const componentSource = (file) =>
  fs.readFileSync(path.join(process.cwd(), "src", "components", file), "utf8");

const expectedAssignments = new Map([
  [17, "B1-5.17"],
  [18, "B1-6.18"],
  [19, "B1-6.19"],
  [20, "B1-6.20"],
  [21, "B1-7.21"],
  [22, "B1-7.22"],
]);

const workbookFiles = new Map([
  [17, "B1Day17WieLerntManAmBestenWorkbookPage.js"],
  [18, "B1Day18WegeZumWunschberufWorkbookPage.js"],
  [19, "B1Day19VorstellungsgespraechWorkbookPage.js"],
  [20, "B1Day20BerufKennenWorkbookPage.js"],
  [21, "B1Day21LebensformenHeuteWorkbookPage.js"],
  [22, "B1Day22BeziehungWichtigWorkbookPageV2.js"],
]);

const grammarDays = new Set([18, 19, 21]);
const workbookOnlyDays = new Set([17, 20, 22]);

describe("B1 Course Book cleanup · Days 17-22", () => {
  test("Days 17-22 resolve workbook routes inside Falowen and only expose verified grammar routes", () => {
    for (let day = 17; day <= 22; day += 1) {
      const override = getB1LessonResourceOverride(day);
      expect(override).toBeTruthy();
      expect(override.workbook).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(override.workbook).not.toContain("drive.google.com");

      if (grammarDays.has(day)) {
        expect(override.grammarBook).toBe(`/campus/course/lesson/B1/${day}?view=grammar`);
      } else {
        expect(override.grammarBook).toBe("");
      }
    }
  });

  test("curriculum alignment replaces stale Drive routes and clears grammar on workbook-only days", () => {
    const raw = Array.from({ length: 6 }, (_, index) => ({
      id: `B1-test-${index + 17}`,
      level: "B1",
      displayDay: index + 17,
      grammarNotesPage: "https://drive.google.com/old-grammar",
      workbookPage: "https://drive.google.com/old-workbook",
      resources: [{
        level: "B1",
        displayDay: index + 17,
        grammarbook_link: "https://drive.google.com/nested-grammar",
        workbook_link: "https://drive.google.com/nested-workbook",
      }],
    }));

    const aligned = alignB1CurriculumEntries(raw);
    aligned.forEach((entry, index) => {
      const day = index + 17;
      expect(entry.workbookPage).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(entry.workbookRoute).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(JSON.stringify(entry)).not.toContain("drive.google.com");

      if (grammarDays.has(day)) {
        expect(entry.grammarNotesPage).toBe(`/campus/course/lesson/B1/${day}?view=grammar`);
        expect(entry.grammarPage).toBe(`/campus/course/lesson/B1/${day}?view=grammar`);
      } else {
        expect(entry.grammarNotesPage).toBeNull();
        expect(entry.grammarPage).toBeNull();
        expect(entry.resources[0].grammarbook_link).toBeNull();
      }
    });
  });

  test("the third cleanup batch does not take ownership of Days 13-16 or Day 23", () => {
    const raw = [
      {
        id: "B1-5.16",
        level: "B1",
        displayDay: 16,
        grammarNotesPage: "https://drive.google.com/day16-grammar",
        workbookPage: "https://drive.google.com/day16-workbook",
      },
      {
        id: "B1-7.23",
        level: "B1",
        displayDay: 23,
        grammarNotesPage: "https://drive.google.com/day23-grammar",
        workbookPage: "https://drive.google.com/day23-workbook",
      },
    ];
    expect(alignB1CurriculumEntries(raw)).toEqual(raw);
  });

  test("Days 17-22 keep their canonical submission identities", () => {
    expectedAssignments.forEach((assignmentKey, day) => {
      const source = componentSource(workbookFiles.get(day));
      expect(source).toContain(assignmentKey);
      expect(source).toContain(`day: ${day}`);
    });
  });

  test("Day 22 has centralized workbook metadata without a fake grammar route", () => {
    const override = getB1LessonResourceOverride(22);
    expect(override.chapter).toBe("7.22");
    expect(override.title).toBe("Was ist dir in einer Beziehung wichtig?");
    expect(override.grammarBook).toBe("");
    expect(override.goal).toContain("Beziehungen");
    expect(override.workbook).toBe("/campus/course/lesson/B1/22?view=workbook");

    const workbook = componentSource("B1Day22BeziehungWichtigWorkbookPageV2.js");
    expect(workbook).toContain("Was ist dir in einer Beziehung wichtig?");
    expect(workbook).toContain("B1-7.22");
    expect(workbook).toContain("STANDARD_WORKBOOK_TABS");
  });

  test("CourseLessonPage mounts native workbook pages for all six days and grammar only where it exists", () => {
    const courseLessonPage = componentSource("CourseLessonPage.js");
    const workbookComponents = [
      "B1Day17WieLerntManAmBestenWorkbookPage",
      "B1Day18WegeZumWunschberufWorkbookPage",
      "B1Day19VorstellungsgespraechWorkbookPage",
      "B1Day20BerufKennenWorkbookPage",
      "B1Day21LebensformenHeuteWorkbookPage",
      "B1Day22BeziehungWichtigWorkbookPage",
    ];
    workbookComponents.forEach((name) => expect(courseLessonPage).toContain(name));

    [
      "B1Day18WegeZumWunschberufGrammarNotesPage",
      "B1Day19VorstellungsgespraechGrammarNotesPage",
      "B1Day21LebensformenHeuteGrammarNotesPage",
    ].forEach((name) => expect(courseLessonPage).toContain(name));

    workbookOnlyDays.forEach((day) => {
      expect(courseLessonPage).not.toMatch(new RegExp(`B1Day${day}.*GrammarNotesPage`));
    });
  });
});
