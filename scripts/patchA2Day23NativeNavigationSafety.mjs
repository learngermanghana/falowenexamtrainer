import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(
  root,
  "web/src/components/A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage.js",
);

let source = fs.readFileSync(targetPath, "utf8");

const assignmentImport = 'import AssignmentSubmissionPage from "./AssignmentSubmissionPage";';
if (!source.includes(assignmentImport)) {
  const backButtonImport = 'import AppBackButton from "./navigation/AppBackButton";';
  if (!source.includes(backButtonImport)) {
    throw new Error("Could not find the Day 23 AppBackButton import anchor.");
  }
  source = source.replace(backButtonImport, `${backButtonImport}\n${assignmentImport}`);
}

const standardNavigationImport =
  'import { STANDARD_WORKBOOK_TABS, WorkbookTabNav } from "./StandardWorkbookComponents";';
if (!source.includes(standardNavigationImport)) {
  const reminderImport =
    'import { WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";';
  if (!source.includes(reminderImport)) {
    throw new Error("Could not find the Day 23 workbook guidance import anchor.");
  }
  source = source.replace(reminderImport, `${reminderImport}\n${standardNavigationImport}`);
}

if (!source.includes("const tabs = STANDARD_WORKBOOK_TABS;")) {
  const tabsPattern = /const tabs = \[[\s\S]*?\n\];/;
  if (!tabsPattern.test(source)) {
    throw new Error("Could not find the Day 23 native tabs definition.");
  }
  source = source.replace(tabsPattern, "const tabs = STANDARD_WORKBOOK_TABS;");
}

const nativeGuidanceMarker = 'data-a2-day23-native-guidance="true"';
if (!source.includes(nativeGuidanceMarker)) {
  const guidanceAnchor = `      </div>\n\n      {activeTab === "grammar" &&`;
  if (!source.includes(guidanceAnchor)) {
    throw new Error("Could not find the Day 23 native guidance insertion anchor.");
  }
  const nativeGuidance = `      </div>\n\n      <details\n        data-a2-day23-native-guidance="true"\n        style={{ ...cardStyle, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#1e3a8a" }}\n      >\n        <summary style={{ cursor: "pointer", fontWeight: 800 }}>How this workbook works · open guide</summary>\n        <div style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>\n          <p style={{ margin: 0 }}><strong>Grammar:</strong> review the lesson notes before the four workbook parts.</p>\n          <p style={{ margin: 0 }}><strong>Teil 1 · Sprechen:</strong> group practice only; do not submit it.</p>\n          <p style={{ margin: 0 }}><strong>Teil 2 · Schreiben and Teil 3 · Lesen:</strong> these are the school-marked parts. Submit only these final answers through Submit.</p>\n          <p style={{ margin: 0 }}><strong>Teil 4 · Hören: self-check only.</strong> Check your answers with the Goethe video and do not send Hören through Submit.</p>\n        </div>\n      </details>\n\n      {activeTab === "grammar" &&`;
  source = source.replace(guidanceAnchor, nativeGuidance);
}

if (!source.includes("<WorkbookTabNav")) {
  throw new Error("Day 23 no longer mounts WorkbookTabNav.");
}
if (!source.includes(assignmentImport)) {
  throw new Error("Day 23 submission panel is missing AssignmentSubmissionPage import.");
}
if (!source.includes(standardNavigationImport)) {
  throw new Error("Day 23 native navigation imports are incomplete.");
}
if (!source.includes("const tabs = STANDARD_WORKBOOK_TABS;")) {
  throw new Error("Day 23 is not using the standard workbook tab keys.");
}
if (!source.includes(nativeGuidanceMarker)) {
  throw new Error("Day 23 native workbook guidance is missing.");
}

fs.writeFileSync(targetPath, source, "utf8");
console.log("Aligned A2 Day 23 native navigation, tab keys and workbook guidance.");
