import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(
  root,
  "web/src/components/A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage.js",
);
const source = fs.readFileSync(targetPath, "utf8");

const requiredMarkers = [
  'import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";',
  'day={23}',
  'chapter="9.23"',
  'title="Wie kommst du zur Schule / zur Arbeit?"',
  'Mein Arbeitsweg',
];

for (const marker of requiredMarkers) {
  if (!source.includes(marker)) {
    throw new Error(`A2 Day 23 cleaned workbook marker missing: ${marker}`);
  }
}

if (/key:\s*"teil[1-4]"/i.test(source)) {
  throw new Error("A2 Day 23 reverted to mismatched legacy teil1-teil4 tab keys.");
}
if (source.includes("Go to Submission Area")) {
  throw new Error("A2 Day 23 reverted to the legacy external submission flow.");
}

console.log("A2 Day 23 already owns the cleaned shared workbook shell; no legacy navigation patch required.");
