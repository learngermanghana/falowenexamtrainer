import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "web/src/components/B1Day2FreundeFuersLebenWorkbookPage.js");
let source = fs.readFileSync(file, "utf8");

const importAnchor = 'import CourseInlinePracticePanel from "./CourseInlinePracticePanel";';
const supportImport = 'import B1ContextWritingCheatSheet from "./B1ContextWritingCheatSheet";';
if (!source.includes(supportImport)) {
  if (!source.includes(importAnchor)) throw new Error("B1 Day 2 writing support import anchor missing.");
  source = source.replace(importAnchor, `${importAnchor}\n${supportImport}`);
}

const oldWorkspace = '          <CourseInlinePracticePanel type="writing" />';
const newWorkspace = `          <B1ContextWritingCheatSheet taskType="informal-letter">\n            <CourseInlinePracticePanel\n              type="writing"\n              writingContext={{\n                taskTitle: "E-Mail über einen Freund fürs Leben",\n                taskType: "informal-letter",\n              }}\n            />\n          </B1ContextWritingCheatSheet>`;
if (!source.includes(newWorkspace)) {
  if (!source.includes(oldWorkspace)) throw new Error("B1 Day 2 writing workspace anchor missing.");
  source = source.replace(oldWorkspace, newWorkspace);
}

if (!source.includes('taskType="informal-letter"')) throw new Error("B1 Day 2 informal-letter cheat sheet was not installed.");
fs.writeFileSync(file, source, "utf8");
console.log("B1 Day 2 now shows the task-matched informal-letter cheat sheet.");
