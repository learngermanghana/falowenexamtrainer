import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const day25Path = path.join(root, "web/src/components/A2Day25TagesablaufWorkbookPage.js");
const regressionPath = path.join(root, "web/src/components/A2SharedWorkbookRegression.test.js");

let day25 = fs.readFileSync(day25Path, "utf8");

const reminderOnlyImport =
  'import { WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";';
const sharedNavigationImport =
  'import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";';

if (day25.includes(reminderOnlyImport)) {
  day25 = day25.replace(reminderOnlyImport, sharedNavigationImport);
} else if (!day25.includes(sharedNavigationImport)) {
  throw new Error("Could not add the shared A2 workbook navigation import to Day 25.");
}

const legacySubmitTab = '  { key: "submit", label: "Submit" },\n';
if (day25.includes(legacySubmitTab)) {
  day25 = day25.replace(legacySubmitTab, "");
}

const visibleNativeTabRow = '        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>';
const hiddenNativeTabRow =
  '        <div data-a2-day25-native-tabs="true" style={{ display: "none", flexWrap: "wrap", gap: 8 }}>';
if (day25.includes(visibleNativeTabRow)) {
  day25 = day25.replace(visibleNativeTabRow, hiddenNativeTabRow);
} else if (!day25.includes(hiddenNativeTabRow)) {
  throw new Error("Could not hide the native Day 25 workbook tab row.");
}

const visibleNativeCounter =
  '        <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>';
const hiddenNativeCounter =
  '        <p data-a2-day25-native-tab-counter="true" style={{ display: "none", margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>';
if (day25.includes(visibleNativeCounter)) {
  day25 = day25.replace(visibleNativeCounter, hiddenNativeCounter);
} else if (!day25.includes(hiddenNativeCounter)) {
  throw new Error("Could not hide the native Day 25 workbook tab counter.");
}

const guidanceAnchor = `      </div>\n\n      {activeTab === "sprechen" && (`;
const guidanceReplacement = `      </div>\n\n      <A2B1WorkbookGuidance />\n\n      {activeTab === "sprechen" && (`;
if (!day25.includes("<A2B1WorkbookGuidance />")) {
  if (!day25.includes(guidanceAnchor)) {
    throw new Error("Could not mount the shared A2 workbook navigation on Day 25.");
  }
  day25 = day25.replace(guidanceAnchor, guidanceReplacement);
}

const legacySubmitPanel = `\n      {activeTab === "submit" && (\n        <div style={card}>\n          <h2 style={sectionTitle}>Submit Workbook</h2>\n          <p style={{ margin: 0, lineHeight: 1.7 }}>\n            After Falowen Radio and Teil 1–4, submit your required writing and reading answers in the assignment submission area.\n          </p>\n          <p style={{ margin: 0, color: "#475569" }}>\n            This workbook has no Hören assignment.\n          </p>\n          <WorkbookSubmissionReminder />\n          <a href="/campus/course?submitWork=1" style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>\n            Open submission area\n          </a>\n        </div>\n      )}\n`;
if (day25.includes(legacySubmitPanel)) {
  day25 = day25.replace(legacySubmitPanel, "");
}

const sharedNavigationCount = day25.split("<A2B1WorkbookGuidance />").length - 1;
if (sharedNavigationCount !== 1) {
  throw new Error(`Expected one shared Day 25 workbook navigation, found ${sharedNavigationCount}.`);
}
if (day25.includes('{ key: "submit", label: "Submit" }')) {
  throw new Error("Day 25 still owns a legacy Submit tab.");
}
if (day25.includes('activeTab === "submit"') || day25.includes("/campus/course?submitWork=1")) {
  throw new Error("Day 25 still owns the obsolete submission redirect panel.");
}
if (!day25.includes(hiddenNativeTabRow) || !day25.includes(hiddenNativeCounter)) {
  throw new Error("Day 25 still exposes its native tab navigation beside the shared navigation.");
}

fs.writeFileSync(day25Path, day25, "utf8");

let regression = fs.readFileSync(regressionPath, "utf8");
const regressionMarker = '  it("routes Day 25 through the same shared navigation and submission flow as Day 26", () => {';
if (!regression.includes(regressionMarker)) {
  const anchor = `  it("keeps Ref and Submit in the shared A2 shell", () => {\n    expect(standardShell).toContain("A2_B1_WORKBOOK_TABS_WITH_GRAMMAR");\n    expect(standardShell).toContain('activeTab === "grammar"');\n    expect(standardShell).toContain('activeTab === "references"');\n    expect(standardShell).toContain('activeTab === "submit"');\n    expect(standardShell).toContain("WorkbookReferenceAnswers");\n    expect(standardShell).toContain("ContextualAssignmentSubmissionPage");\n  });\n`;
  const addition = `${anchor}\n  it("routes Day 25 through the same shared navigation and submission flow as Day 26", () => {\n    expect(day25).toContain("A2B1WorkbookGuidance");\n    expect(day25).toContain("<A2B1WorkbookGuidance />");\n    expect(day26).toContain("<A2B1WorkbookGuidance />");\n    expect(day25).toContain('data-a2-day25-native-tabs="true"');\n    expect(day25).toContain('data-a2-day25-native-tab-counter="true"');\n    expect(day25).toContain('style={{ display: "none", flexWrap: "wrap", gap: 8 }}');\n    expect(day25).not.toContain('{ key: "submit", label: "Submit" }');\n    expect(day25).not.toContain('activeTab === "submit"');\n    expect(day25).not.toContain("/campus/course?submitWork=1");\n  });\n`;
  if (!regression.includes(anchor)) {
    throw new Error("Could not add the Day 25 standard-navigation regression.");
  }
  regression = regression.replace(anchor, addition);
} else {
  const existingAssertion = '    expect(day25).toContain("<A2B1WorkbookGuidance />");\n';
  const hiddenAssertions =
    '    expect(day25).toContain("<A2B1WorkbookGuidance />");\n' +
    '    expect(day25).toContain(\'data-a2-day25-native-tabs="true"\');\n' +
    '    expect(day25).toContain(\'data-a2-day25-native-tab-counter="true"\');\n' +
    '    expect(day25).toContain(\'style={{ display: "none", flexWrap: "wrap", gap: 8 }}\');\n';
  if (!regression.includes('data-a2-day25-native-tabs="true"')) {
    if (!regression.includes(existingAssertion)) {
      throw new Error("Could not extend the Day 25 standard-navigation regression.");
    }
    regression = regression.replace(existingAssertion, hiddenAssertions);
  }
}

fs.writeFileSync(regressionPath, regression, "utf8");
console.log("Updated A2 Day 25 to use only the shared Day 26-style navigation and submission flow.");
