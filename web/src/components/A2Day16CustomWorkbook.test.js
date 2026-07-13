import fs from "fs";
import path from "path";

const workbookSource = fs.readFileSync(
  path.resolve(__dirname, "./A2Day16WohlbefindenUndEntspannungWorkbookPage.js"),
  "utf8",
);
const completionTabsSource = fs.readFileSync(
  path.resolve(__dirname, "./A2LegacyWorkbookCompletionTabs.js"),
  "utf8",
);
const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");

describe("A2 Day 16 workbook", () => {
  it("keeps the named route wired through Falowen Radio", () => {
    expect(appSource).toContain(
      'path="/campus/course/a2-day-16-wohlbefinden-und-entspannung-workbook"',
    );
    expect(appSource).toContain("A2Day16WohlbefindenUndEntspannungWorkbookPage");
    expect(appSource).toContain('withRadioWorkbookGate("A2", 16');
  });

  it("keeps the complete four-part lesson instead of the reduced wrapper", () => {
    expect(workbookSource.length).toBeGreaterThan(22000);
    expect(workbookSource).not.toContain("A2StandardTabbedWorkbookPage");
    expect(workbookSource).toContain("Teil 1 · Sprechen");
    expect(workbookSource).toContain("Teil 2 · Schreiben");
    expect(workbookSource).toContain("Teil 3 · Lesen");
    expect(workbookSource).toContain("Teil 4 · Hören");
    expect(workbookSource).toContain("Sprechen wie bei einer Mini-Präsentation");
    expect(workbookSource).toContain("Anzeige F");
    expect(workbookSource).toContain("Schreiben Sie einen Brief oder eine E-Mail an den Arzt");
    expect((workbookSource.match(/\bstem\s*:/g) || [])).toHaveLength(10);
  });

  it("adds Ref and Submit with the real A2 assignment context", () => {
    expect(completionTabsSource).toContain(
      '"/campus/course/a2-day-16-wohlbefinden-und-entspannung-workbook"',
    );
    expect(completionTabsSource).toContain('label: "5. Ref"');
    expect(completionTabsSource).toContain('label: "Submit"');
    expect(completionTabsSource).toContain("WorkbookReferenceAnswers");
    expect(completionTabsSource).toContain("ContextualAssignmentSubmissionPage");
  });
});
