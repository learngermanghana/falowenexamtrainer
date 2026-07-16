import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.resolve(__dirname, "A1Day21WeatherWorkbookPage.js"), "utf8");

describe("A1 Day 21 Weather workbook", () => {
  it("keeps the native tutor-marked shell locked to the canonical A1-13 assignment", () => {
    expect(source).toContain('import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell"');
    expect(source).toContain('const DAY21_ASSIGNMENT_KEY = "A1-13"');
    expect(source).toContain('day={21}');
    expect(source).toContain('chapter="13"');
    expect(source).toContain('fallbackAssignmentKey={DAY21_ASSIGNMENT_KEY}');
    expect(source).toContain('submitTitle="Submit A1 · Day 21 · Kapitel 13"');
    expect(source).toContain('canonicalAssignmentKey: DAY21_ASSIGNMENT_KEY');
  });

  it("uses the same separated Overview, Teil and Submit navigation pattern", () => {
    expect(source).toContain('{ key: "overview", label: "Overview" }');
    expect(source).toContain('{ key: "teil-1", label: "Teil 1" }');
    expect(source).toContain('{ key: "teil-2", label: "Teil 2" }');
    expect(source).toContain('{ key: "teil-3", label: "Teil 3" }');
    expect(source).toContain('{ key: "submit", label: "Submit", submit: true }');
    expect(source).toContain('aria-label="A1 Day 21 Overview, Teil and Submit navigation"');
    expect(source).toContain('nextSearch.set("workbookTab", tabKey)');
  });

  it("preserves all three existing assignment sections", () => {
    expect(source).toContain("Teil 1 · Anzeigen");
    expect(source).toContain("Teil 2 · Nachricht");
    expect(source).toContain("Teil 3 · Schreiben");
    expect(source).toContain("Sommerurlaub in Spanien");
    expect(source).toContain("Schreiben Sie eine E-Mail an Bina");
  });
});
