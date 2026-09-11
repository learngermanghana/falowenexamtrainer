import fs from "fs";
import path from "path";
import { alignB1CurriculumEntries } from "./b1CurriculumAlignment";
import { getB1LessonResourceOverride } from "./b1LessonResourceOverrides";
import { getB1Days23To28LessonMetadata } from "./b1Days23To28LessonMetadata";

const componentSource = (file) =>
  fs.readFileSync(path.join(process.cwd(), "src", "components", file), "utf8");

const expectedAssignments = new Map([
  [23, "B1-7.23"],
  [24, "B1-8.24"],
  [25, "B1-8.25"],
  [26, "B1-9.26"],
  [27, "B1-10.27"],
  [28, "B1-10.28"],
]);

const workbookFiles = new Map([
  [23, "B1Day23ErstesDateWorkbookPage.js"],
  [24, "B1Day24KonsumNachhaltigkeitWorkbookPage.js"],
  [25, "B1Day25OnlineShoppingRightsRisksWorkbookPage.js"],
  [26, "B1Day26ReiseproblemeLoesungenWorkbookPage.js"],
  [27, "B1Day27UmweltfreundlichAlltagWorkbookPage.js"],
  [28, "B1Day28KlimafreundlichLebenWorkbookPage.js"],
]);

const expectedTitles = new Map([
  [23, "Erstes Date – Typische Situationen"],
  [24, "Konsum und Nachhaltigkeit"],
  [25, "Online einkaufen – Rechte und Risiken"],
  [26, "Reiseprobleme und Lösungen"],
  [27, "Umweltfreundlich im Alltag"],
  [28, "Klimafreundlich leben"],
]);

describe("B1 Course Book cleanup · Days 23-28", () => {
  test("Days 23-28 resolve native workbook routes without fake grammar routes", () => {
    for (let day = 23; day <= 28; day += 1) {
      const override = getB1LessonResourceOverride(day);
      expect(override).toBeTruthy();
      expect(override.workbook).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(override.workbook).not.toContain("drive.google.com");
      expect(override.grammarBook).toBeUndefined();

      const metadata = getB1Days23To28LessonMetadata(day);
      expect(metadata).toBeTruthy();
      expect(metadata.workbookOnly).toBe(true);
      expect(metadata.title).toBe(expectedTitles.get(day));
    }
  });

  test("curriculum alignment replaces stale workbook URLs and clears stale grammar URLs", () => {
    const raw = Array.from({ length: 6 }, (_, index) => ({
      id: `B1-test-${index + 23}`,
      level: "B1",
      displayDay: index + 23,
      grammarNotesPage: "https://drive.google.com/old-grammar",
      grammarPage: "https://drive.google.com/old-grammar-page",
      workbookPage: "https://drive.google.com/old-workbook",
      resources: [{
        level: "B1",
        displayDay: index + 23,
        grammarbook_link: "https://drive.google.com/nested-grammar",
        workbook_link: "https://drive.google.com/nested-workbook",
      }],
    }));

    const aligned = alignB1CurriculumEntries(raw);
    aligned.forEach((entry, index) => {
      const day = index + 23;
      expect(entry.workbookPage).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(entry.workbookRoute).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(entry.grammarNotesPage).toBeNull();
      expect(entry.grammarPage).toBeNull();
      expect(entry.grammarbook_link).toBeNull();
      expect(entry.resources[0].grammarbook_link).toBeNull();
      expect(entry.resources[0].workbook_link).toBe(`/campus/course/lesson/B1/${day}?view=workbook`);
      expect(JSON.stringify(entry)).not.toContain("drive.google.com");
    });
  });

  test("final-batch metadata matches the native workbook topics", () => {
    const raw = Array.from({ length: 6 }, (_, index) => ({
      id: `B1-meta-${index + 23}`,
      level: "B1",
      displayDay: index + 23,
    }));
    const aligned = alignB1CurriculumEntries(raw);

    aligned.forEach((entry, index) => {
      const day = index + 23;
      const metadata = getB1Days23To28LessonMetadata(day);
      expect(entry.topic).toBe(expectedTitles.get(day));
      expect(entry.goal).toBe(metadata.goal);
      expect(entry.instruction).toBe(metadata.instruction);
      expect(entry.chapter).toBe(metadata.chapter);
    });
  });

  test("Days 23-28 keep their canonical submission identities and standard workbook ownership", () => {
    expectedAssignments.forEach((assignmentKey, day) => {
      const source = componentSource(workbookFiles.get(day));
      expect(source).toContain(assignmentKey);
      expect(source).toContain(`day: ${day}`);
      expect(source).toContain("B1StandardWorkbookPage");
    });
  });

  test("CourseLessonPage mounts all six native workbooks and no non-existent grammar components", () => {
    const courseLessonPage = componentSource("CourseLessonPage.js");
    const workbookComponents = [
      "B1Day23ErstesDateWorkbookPage",
      "B1Day24KonsumNachhaltigkeitWorkbookPage",
      "B1Day25OnlineShoppingRightsRisksWorkbookPage",
      "B1Day26ReiseproblemeLoesungenWorkbookPage",
      "B1Day27UmweltfreundlichAlltagWorkbookPage",
      "B1Day28KlimafreundlichLebenWorkbookPage",
    ];
    workbookComponents.forEach((name) => expect(courseLessonPage).toContain(name));

    for (let day = 23; day <= 28; day += 1) {
      expect(courseLessonPage).not.toMatch(new RegExp(`B1Day${day}.*GrammarNotesPage`));
    }
  });
});
