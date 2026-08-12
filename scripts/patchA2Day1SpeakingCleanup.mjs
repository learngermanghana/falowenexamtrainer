import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "web/src/components/A2Day2SmallTalkWorkbookEnhancedPage.js");
let source = fs.readFileSync(target, "utf8");

// The shared speaking shell owns the teacher lecture. Remove the older page-level injected copy.
source = source.replace(/\n\s*<div data-teacher-lecture="A2-1"[\s\S]*?<\/div>\n\s*<WorkbookTaskCard eyebrow="Sprachliche Hilfen"/, '\n    <WorkbookTaskCard eyebrow="Sprachliche Hilfen"');

// The brain map now owns the point-building language and self-introduction categories.
source = source.replace(/\n\s*<WorkbookTaskCard eyebrow="Sprachliche Hilfen"[\s\S]*?<\/WorkbookTaskCard>\n\n\s*<WorkbookTaskCard eyebrow="Deine Vorstellung"[\s\S]*?<\/WorkbookTaskCard>/, "");

if (source.includes('data-teacher-lecture="A2-1"')) throw new Error("Duplicate A2 Day 1 teacher lecture remains in custom speaking content.");
if (source.includes('eyebrow="Sprachliche Hilfen"') || source.includes('eyebrow="Deine Vorstellung"')) throw new Error("Duplicate A2 Day 1 speaking help remains outside the brain map.");

fs.writeFileSync(target, source, "utf8");
console.log("Removed duplicate A2 Day 1 teacher lecture and speaking scaffolds; the shared teacher card and brain map now own them.");
