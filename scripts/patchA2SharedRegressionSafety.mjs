import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/A2SharedWorkbookRegression.test.js");
const source = fs.readFileSync(targetPath, "utf8");

const requiredMarkers = [
  'uses the standard workbook shell throughout cleaned Days 20–28',
  'keeps Day 21 weekend-focused while preserving its historical Teil 2 prompt',
  'keeps Day 25 aligned with canonical Lesen & Hören',
  'keeps Day 28 future-focused with standard Grammar and Submit ownership',
];

for (const marker of requiredMarkers) {
  if (!source.includes(marker)) {
    throw new Error(`Cleaned A2 shared regression marker missing: ${marker}`);
  }
}

const retiredExpectations = [
  "Der TV-Koch Stefan Berger",
  "There is no Hören assignment in this workbook",
  'expect(day20).not.toContain("A2StandardTabbedWorkbookPage")',
  'expect(day28).toContain("STANDARD_WORKBOOK_TABS")',
];

for (const marker of retiredExpectations) {
  if (source.includes(marker)) {
    throw new Error(`Retired A2 regression expectation returned: ${marker}`);
  }
}

console.log("A2 shared regression already targets the cleaned Day 20-28 architecture.");
