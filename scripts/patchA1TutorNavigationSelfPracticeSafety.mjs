import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/A1UnifiedTutorWorkbookNavigation.js");
const testPath = path.join(root, "web/src/components/A1UnifiedTutorWorkbookNavigation.test.js");

let source = fs.readFileSync(targetPath, "utf8");
let testSource = fs.readFileSync(testPath, "utf8");

const oldImport = 'import { findWorkbookPageRoot } from "./WorkbookInlineEnhancements";';
const newImport = 'import { A1_TUTOR_MARKED_ASSIGNMENT_KEYS, findWorkbookPageRoot } from "./WorkbookInlineEnhancements";';
if (!source.includes(newImport)) {
  if (!source.includes(oldImport)) throw new Error("Could not find A1 tutor navigation import anchor.");
  source = source.replace(oldImport, newImport);
}

const setAnchor = 'const SHARED_VIEW_PARAM = "workbookTab";';
const setReplacement = `${setAnchor}\nconst A1_TUTOR_MARKED_ASSIGNMENT_KEY_SET = new Set(A1_TUTOR_MARKED_ASSIGNMENT_KEYS);`;
if (!source.includes("A1_TUTOR_MARKED_ASSIGNMENT_KEY_SET")) {
  if (!source.includes(setAnchor)) throw new Error("Could not find A1 tutor navigation key-set anchor.");
  source = source.replace(setAnchor, setReplacement);
}

const matchAnchor = `  const assignmentKey = normalizeCourseAssignmentKey(selectedAssignment.assignmentKey);\n  return {`;
const matchReplacement = `  const assignmentKey = normalizeCourseAssignmentKey(selectedAssignment.assignmentKey);\n  if (!A1_TUTOR_MARKED_ASSIGNMENT_KEY_SET.has(assignmentKey)) return null;\n\n  return {`;
if (!source.includes("if (!A1_TUTOR_MARKED_ASSIGNMENT_KEY_SET.has(assignmentKey)) return null;")) {
  if (!source.includes(matchAnchor)) throw new Error("Could not find A1 tutor navigation assignment-key anchor.");
  source = source.replace(matchAnchor, matchReplacement);
}

const testMarker = 'it("keeps A1 Day 19 self-practice outside the injected tutor navigation"';
if (!testSource.includes(testMarker)) {
  const testAnchors = [
    '  it("builds Overview with the combined Teil 1 and separate Teil 3 for Day 0.2", () => {',
    '  it("builds Overview and separated Teil navigation for Day 0.2", () => {',
  ];
  const testAnchor = testAnchors.find((candidate) => testSource.includes(candidate));
  if (!testAnchor) throw new Error("Could not find A1 tutor navigation test anchor.");
  const regression = `  it("keeps A1 Day 19 self-practice outside the injected tutor navigation", () => {\n    expect(\n      resolveA1UnifiedTutorWorkbookMatch({\n        pathname: "/campus/course/verboten-erlaubt-5-9",\n        search: "?radio=done&materials=done&workbookTab=section-1",\n      }),\n    ).toBeNull();\n\n    expect(\n      resolveA1UnifiedTutorWorkbookMatch({\n        pathname: "/campus/course/lesson/A1/19",\n        search: "?chapter=5.9&view=workbook",\n      }),\n    ).toBeNull();\n  });\n\n${testAnchor}`;
  testSource = testSource.replace(testAnchor, regression);
}

fs.writeFileSync(targetPath, source);
fs.writeFileSync(testPath, testSource);

await import("./patchA1WorkbookVideoInsertBeforeSafety.mjs");
await import("./patchStudyBuddyGlobalOverlay.mjs");
await import("./patchA1Day13RevisionClarity.mjs");

console.log("Applied A1 self-practice tutor-navigation safety patch.");