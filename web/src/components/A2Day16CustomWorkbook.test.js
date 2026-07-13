import fs from "fs";
import path from "path";

const workbookSource = fs.readFileSync(
  path.resolve(__dirname, "./A2Day16WohlbefindenUndEntspannungWorkbookPage.js"),
  "utf8",
);
const standardShellSource = fs.readFileSync(
  path.resolve(__dirname, "./A2StandardTabbedWorkbookPage.js"),
  "utf8",
);
const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");

describe("A2 Day 16 workbook", () => {
  it("keeps the named route wired to the Day 16 workbook component", () => {
    expect(appSource).toContain(
      'path="/campus/course/a2-day-16-wohlbefinden-und-entspannung-workbook"',
    );
    expect(appSource).toContain("A2Day16WohlbefindenUndEntspannungWorkbookPage");
    expect(appSource).toContain('withRadioWorkbookGate("A2", 16');
  });

  it("uses the known-good shared workbook layout with lesson-specific content", () => {
    expect(workbookSource).toContain("A2StandardTabbedWorkbookPage");
    expect(workbookSource).toContain("day={16}");
    expect(workbookSource).toContain('title="Wohlbefinden und Entspannung"');
    expect(workbookSource).toContain('chapter="6.16"');
    expect(workbookSource).toContain('workbookId="A2Day16WohlbefindenUndEntspannung"');
    expect(workbookSource).toContain("Was machen Sie für Ihr Wohlbefinden");
    expect(workbookSource).toContain("Schreiben Sie eine E-Mail an einen Arzt");
    expect((workbookSource.match(/\bstem\s*:/g) || [])).toHaveLength(6);
  });

  it("inherits Teil 1–4, Ref and Submit from the shared shell", () => {
    expect(standardShellSource).toContain("STANDARD_WORKBOOK_TABS");
    expect(standardShellSource).toContain('activeTab === "references"');
    expect(standardShellSource).toContain('activeTab === "submit"');
    expect(standardShellSource).toContain("ContextualAssignmentSubmissionPage");
  });
});
