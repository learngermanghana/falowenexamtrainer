import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.resolve(__dirname, "A1Day21WeatherWorkbookPage.js"), "utf8");

describe("A1 Day 21 Weather workbook", () => {
  it("uses the native tutor-marked shell with the canonical A1-13 assignment", () => {
    expect(source).toContain('import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell"');
    expect(source).toContain('day={21}');
    expect(source).toContain('chapter="13"');
    expect(source).toContain('fallbackAssignmentKey="A1-13"');
    expect(source).toContain('submitTitle="Submit A1 · Day 21 · Kapitel 13"');
  });

  it("preserves all three existing assignment sections", () => {
    expect(source).toContain("Teil 1 · Anzeigen");
    expect(source).toContain("Teil 2 · Nachricht");
    expect(source).toContain("Teil 3 · Schreiben");
    expect(source).toContain("Sommerurlaub in Spanien");
    expect(source).toContain("Schreiben Sie eine E-Mail an Bina");
  });
});
