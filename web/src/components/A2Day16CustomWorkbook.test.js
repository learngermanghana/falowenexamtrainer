import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

const standardShell = read("A2StandardTabbedWorkbookPage.js");
const day16 = read("A2Day16WohlbefindenUndEntspannungWorkbookPage.js");
const day19 = read("A2Day19EinkaufenWoUndWieWorkbookPage.js");

const countQuestions = (source) => (source.match(/\bstem\s*:/g) || []).length;

describe("A2 Day 16 and Day 19 complete workbooks", () => {
  it("uses the shared workbook shell with Grammar, Teil 1–4, Ref and Submit", () => {
    expect(day16).toContain("A2StandardTabbedWorkbookPage");
    expect(day19).toContain("A2StandardTabbedWorkbookPage");
    expect(standardShell).toContain("A2_B1_WORKBOOK_TABS_WITH_GRAMMAR");
    expect(standardShell).toContain('activeTab === "grammar"');
    expect(standardShell).toContain('activeTab === "references"');
    expect(standardShell).toContain('activeTab === "submit"');
    expect(standardShell).toContain("ContextualAssignmentSubmissionPage");
  });

  it("keeps the complete Day 16 health lesson", () => {
    expect(day16).toContain("Körperliches Wohlbefinden");
    expect(day16).toContain("Mentales Wohlbefinden");
    expect(day16).toContain("Krankheiten &amp; Symptome");
    expect(day16).toContain("Anzeige A: Yoga-Kurs für Anfänger");
    expect(day16).toContain("Anzeige F: Laufgruppe im Stadtpark");
    expect(day16).toContain("E-Mail an einen Arzt wegen Ihrer Gesundheit");
    expect(day16).toContain("1xexwu1sM-Prp_2iyhBbY7UP-91gJ1S5G");
    expect(countQuestions(day16)).toBe(10);
  });

  it("keeps the complete Day 19 Konsumverhalten lesson", () => {
    expect(day19).toContain("Konsumverhalten");
    expect(day19).toContain("Einkaufsmöglichkeiten");
    expect(day19).toContain("Nachhaltigkeit und Konsum");
    expect(day19).toContain("Einladung zum Einkaufen");
    expect(day19).toContain("Konsumverhalten in der modernen Gesellschaft");
    expect(day19).toContain("1OsT5j6Y7a-rMdB0HlRJJ98gTgSvxm_LB");
    expect(countQuestions(day19)).toBe(12);
  });
});
