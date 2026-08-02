import fs from "node:fs";
import path from "node:path";

const read = (name) =>
  fs.readFileSync(path.resolve(process.cwd(), "src/components", name), "utf8");

describe("A2 Day 25 standard workbook navigation", () => {
  test("matches the Day 26 shared navigation and submission flow", () => {
    const day25 = read("A2Day25TagesablaufWorkbookPage.js");
    const day26 = read("A2Day26GefuehleInVerschiedenenSituationenWorkbookPage.js");
    const guidance = read("A2B1WorkbookGuidance.js");

    expect(day26).toContain("<A2B1WorkbookGuidance />");
    expect(day25).toContain(
      'import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";',
    );
    expect(day25).toContain("<A2B1WorkbookGuidance />");
    expect(day25).not.toContain('{ key: "submit", label: "Submit" }');
    expect(day25).not.toContain('activeTab === "submit"');
    expect(day25).not.toContain("Open submission area");

    expect(guidance).toContain("STANDARD_WORKBOOK_TABS");
    expect(guidance).toContain("<AssignmentSubmissionPage />");
    expect(guidance).toContain('if (tab.key === "submit")');
  });
});
