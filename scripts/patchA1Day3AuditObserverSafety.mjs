import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/A1Day3SchreibenSprechenKapitel11WorkbookPage.js");

let source = fs.readFileSync(targetPath, "utf8");

const oldBlock = `  const summaryBox = section?.querySelector("div");\n  if (!summaryBox) return;\n\n  const items = [`;
const newBlock = `  const summaryBox = section?.querySelector("div");\n  if (!summaryBox || summaryBox.dataset.a1Day3AuditSummary === "true") return;\n  summaryBox.dataset.a1Day3AuditSummary = "true";\n\n  const items = [`;

if (!source.includes(newBlock)) {
  if (!source.includes(oldBlock)) throw new Error("Could not find Day 3 lesson-summary observer anchor.");
  source = source.replace(oldBlock, newBlock);
}

fs.writeFileSync(targetPath, source);
console.log("Applied A1 Day 3 audit observer safety guard.");
