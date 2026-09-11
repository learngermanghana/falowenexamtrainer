import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/A2Day22DieWochePlanungWorkbookPage.js");
const source = fs.readFileSync(targetPath, "utf8");

const requiredMarkers = [
  'import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";',
  'day={22}',
  'chapter="8.22"',
  'title="Die Woche planen"',
  'Eine volle Woche',
];

for (const marker of requiredMarkers) {
  if (!source.includes(marker)) {
    throw new Error(`A2 Day 22 cleaned workbook marker missing: ${marker}`);
  }
}

const retiredMarkers = [
  "Go to Submission Area",
  "function TabButton(",
  "Gülcan schreibt Sonja, dass",
  "Willkommensführung",
];

for (const marker of retiredMarkers) {
  if (source.includes(marker)) {
    throw new Error(`A2 Day 22 retired legacy marker returned: ${marker}`);
  }
}

console.log("A2 Day 22 already owns the cleaned shared workbook shell; no legacy DOM patch required.");
