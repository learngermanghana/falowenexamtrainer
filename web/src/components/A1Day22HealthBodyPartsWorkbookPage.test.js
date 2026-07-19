import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.resolve(__dirname, "A1Day22HealthBodyPartsWorkbookPage.js"), "utf8");

describe("A1 Day 22 Health and Body Parts workbook", () => {
  it("uses the shared tutor-marked shell locked to A1-14.1", () => {
    expect(source).toContain('import A1TutorMarkedWorkbookShell, { WorkbookSection } from "./A1TutorMarkedWorkbookShell"');
    expect(source).toContain('const DAY22_ASSIGNMENT_KEY = "A1-14.1"');
    expect(source).toContain('fallbackAssignmentKey={DAY22_ASSIGNMENT_KEY}');
    expect(source).toContain('submitTitle="Submit A1 · Day 22 · Kapitel 14.1"');
  });

  it("keeps all three assignment sections in shared layout sections", () => {
    expect(source).toContain('<WorkbookSection sectionKey="teil-1"><Teil1Content /></WorkbookSection>');
    expect(source).toContain('<WorkbookSection sectionKey="teil-2"><Teil2Content /></WorkbookSection>');
    expect(source).toContain('<WorkbookSection sectionKey="teil-3"><Teil3Content /></WorkbookSection>');
    expect(source).toContain('Teil 1 · Lesen: Anzeigen und Termine');
    expect(source).toContain('Teil 2 · Schreiben: E-Mail an Felix');
    expect(source).toContain('Teil 3 · Wortschatz: Translate into German');
  });

  it("adds Mark My Letter to the Schreiben task with A1-14.1 metadata", () => {
    expect(source).toContain('title="Mark My Health Letter"');
    expect(source).toContain('taskId="A1-14.1-teil-2-health-letter"');
    expect(source).toContain('assignmentKey={DAY22_ASSIGNMENT_KEY}');
    expect(source).toContain('workbookId="A1-14.1-health-body-parts-workbook"');
  });
});
