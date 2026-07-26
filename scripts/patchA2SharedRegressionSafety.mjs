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

if (!source.includes(safeDay27Expectation)) {
  throw new Error("Could not align the Day 27 audit with native self-check guidance.");
}

fs.writeFileSync(targetPath, source, "utf8");
console.log("Aligned the restored A2 audit with native React self-check guidance.");
