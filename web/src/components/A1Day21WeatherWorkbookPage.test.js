import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.resolve(__dirname, "A1Day21WeatherWorkbookPage.js"), "utf8");

describe("A1 Day 21 Weather workbook", () => {
  it("keeps the tutor-marked shell locked to the canonical A1-13 assignment", () => {
    expect(source).toContain('import A1TutorMarkedWorkbookShell, { WorkbookSection } from "./A1TutorMarkedWorkbookShell"');
    expect(source).toContain('const DAY21_ASSIGNMENT_KEY = "A1-13"');
    expect(source).toContain('day={21}');
    expect(source).toContain('chapter="13"');
    expect(source).toContain('fallbackAssignmentKey={DAY21_ASSIGNMENT_KEY}');
    expect(source).toContain('submitTitle="Submit A1 · Day 21 · Kapitel 13"');
  });

  it("delegates navigation to the shared layout instead of rendering a second tab bar", () => {
    expect(source).toContain('<WorkbookSection sectionKey="teil-1"><Teil1Content /></WorkbookSection>');
    expect(source).toContain('<WorkbookSection sectionKey="teil-2"><Teil2Content /></WorkbookSection>');
    expect(source).toContain('<WorkbookSection sectionKey="teil-3"><Teil3Content /></WorkbookSection>');
    expect(source).not.toContain('useNavigate');
    expect(source).not.toContain('Day21SectionNavigation');
    expect(source).not.toContain('nextSearch.set("workbookTab"');
  });

  it("preserves all three existing assignment sections", () => {
    expect(source).toContain("Teil 1 · Anzeigen");
    expect(source).toContain("Teil 2 · Nachricht");
    expect(source).toContain("Teil 3 · Schreiben");
    expect(source).toContain("Sommerurlaub in Spanien");
    expect(source).toContain("Schreiben Sie eine E-Mail an Bina");
  });
});
