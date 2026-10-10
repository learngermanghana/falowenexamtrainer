import fs from "fs";
import path from "path";
import {
  A1_ASSIGNMENT_REGISTRY,
} from "../data/a1AssignmentRegistry";
import {
  getA1ReadingLayoutMode,
  isA1TutorReadingLabel,
} from "./A1TutorMarkedReadingLayout";

const read = (fileName) =>
  fs.readFileSync(path.resolve(__dirname, fileName), "utf8");

describe("A1 tutor-marked Lesen exam layout", () => {
  test("detects only tutor-marked sections whose canonical labels are reading tasks", () => {
    const readingSections = Object.values(A1_ASSIGNMENT_REGISTRY)
      .flatMap((assignment) =>
        assignment.sections
          .filter((section) => isA1TutorReadingLabel(section.label))
          .map((section) => `${assignment.assignmentKey}:${section.key}`),
      );

    expect(readingSections).toEqual(expect.arrayContaining([
      "A1-0.1:teil-1",
      "A1-0.2:teil-1",
      "A1-1.2:teil-1",
      "A1-2:teil-1",
      "A1-6:teil-1",
      "A1-7:teil-1",
      "A1-8:teil-1",
      "A1-8:teil-2",
      "A1-9:teil-1",
      "A1-10:teil-1",
      "A1-11:teil-1",
      "A1-12.1:teil-1",
      "A1-12.1:teil-2",
      "A1-12.2:teil-1",
      "A1-12.2:teil-2",
      "A1-13:teil-1",
      "A1-13:teil-2",
      "A1-14.1:teil-1",
      "A1-14.1:teil-2",
    ]));
    expect(readingSections).not.toContain("A1-11:teil-2"); // Chapter 11 Teil 2 is Hören.

    expect(isA1TutorReadingLabel("Teil 2 · Schreiben")).toBe(false);
    expect(isA1TutorReadingLabel("Teil 3 · Hören")).toBe(false);
    expect(isA1TutorReadingLabel("Teil 3 · Wortschatz")).toBe(false);
  });

  test("uses source layout for advertisement tasks and document layout for normal reading texts", () => {
    expect(getA1ReadingLayoutMode("Teil 1 · Anzeigen")).toBe("sources");
    expect(getA1ReadingLayoutMode("Teil 2 · Lesen Sie die Anzeigen")).toBe("sources");
    expect(getA1ReadingLayoutMode("Teil 1 · Reading Text")).toBe("document");
    expect(getA1ReadingLayoutMode("Teil 2 · Nachricht")).toBe("document");
  });

  test("the tutor-marked shell applies the reading frame by canonical section label", () => {
    const source = read("A1TutorMarkedWorkbookShell.js");
    expect(source).toContain('isA1TutorReadingLabel(label)');
    expect(source).toContain('<A1TutorMarkedReadingFrame label={label}>');
    expect(source).not.toContain('A1TutorMarkedReadingFrame label="');
  });

  test("multi-source tutor assignments use the shared source grid", () => {
    [
      "A1Day18Kapitel121WorkbookPage.js",
      "A1Day18Kapitel122WorkbookPage.js",
      "A1Day21WeatherWorkbookPage.js",
      "A1Day22HealthBodyPartsWorkbookPage.js",
    ].forEach((fileName) => {
      const source = read(fileName);
      expect(source).toContain("A1ReadingSourceGrid");
      expect(source).toContain("A1ReadingSourceCard");
    });
  });

  test("does not change answer keys or tutor submission ownership", () => {
    const shell = read("A1TutorMarkedWorkbookShell.js");
    expect(shell).toContain("A1CanonicalSubmissionPanel");
    expect(shell).toContain("A1TutorDraftSectionCapture");
    expect(shell).toContain("renderSubmission");
  });
});
