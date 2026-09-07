import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/A2SharedWorkbookRegression.test.js");
let source = fs.readFileSync(targetPath, "utf8");

const oldDay27Expectation =
  '    expect(document.body.textContent).toContain("no separate workbook questions to submit");';
const safeDay27Expectation =
  '    expect(document.body.textContent).toContain("self-check practice in the video and is not submitted");';

if (source.includes(oldDay27Expectation)) {
  source = source.replace(oldDay27Expectation, safeDay27Expectation);
}

const oldNativeNavigationAudit = `  it("leaves Days 27 and 28 on their native working standard navigation", () => {
    [day27, day28].forEach((source) => {
      expect(source).toContain("STANDARD_WORKBOOK_TABS");
      expect(source).toContain("WorkbookTabNav");
      expect(source).toContain('activeTab === "submit"');
    });
  });`;
const overBroadSharedShellAudit = `  it("leaves Days 27 and 28 on the working standard workbook shell", () => {
    [day27, day28].forEach((source) => {
      expect(source).toContain("A2StandardTabbedWorkbookPage");
      expect(source).toContain("showWorkbookGuidance={false}");
    });
  });`;
const currentNavigationAudit = `  it("keeps Day 27 on the shared shell and Day 28 on native standard tabs", () => {
    expect(day27).toContain("A2StandardTabbedWorkbookPage");
    expect(day27).toContain("showWorkbookGuidance={false}");

    expect(day28).toContain("STANDARD_WORKBOOK_TABS");
    expect(day28).toContain("WorkbookTabNav");
    expect(day28).toContain('activeTab === "submit"');
  });`;

if (source.includes(oldNativeNavigationAudit)) {
  source = source.replace(oldNativeNavigationAudit, currentNavigationAudit);
} else if (source.includes(overBroadSharedShellAudit)) {
  source = source.replace(overBroadSharedShellAudit, currentNavigationAudit);
}

if (!source.includes(safeDay27Expectation)) {
  throw new Error("Could not align the Day 27 audit with native self-check guidance.");
}
if (!source.includes(currentNavigationAudit)) {
  throw new Error("Could not align the Days 27-28 audit with their current navigation owners.");
}

fs.writeFileSync(targetPath, source, "utf8");
console.log("Aligned the restored A2 audit with current self-check and navigation ownership.");
