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

fs.writeFileSync(targetPath, source, "utf8");
console.log("Aligned A2 Day 23 native navigation imports and standard tab keys.");
