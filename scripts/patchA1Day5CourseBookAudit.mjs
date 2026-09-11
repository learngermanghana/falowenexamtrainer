import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/A1Day5IntroducingYourselfArticlesWorkbookPage.js");

let source = fs.readFileSync(targetPath, "utf8");

const replacements = [
  [
    "<h1 style={{ ...styles.title, margin: 0, lineHeight: 1.25 }}>Personal Information, Articles, Adjectives and W-Questions</h1>",
    "<h1 style={{ ...styles.title, margin: 0, lineHeight: 1.25 }}>Self-Introduction Practice with Articles</h1>",
    "Day 5 canonical workbook title",
  ],
  [
    "<p style={{ margin: 0, color: \"#4b5563\" }}>Articles · Adjectives · Personal information · Dialogues · W-questions · Sentence building</p>",
    "<p style={{ margin: 0, color: \"#4b5563\" }}>Core focus: self-introduction and articles · Review: adjectives, W-questions, dialogues and sentence building</p>",
    "Day 5 focus description",
  ],
  [
    '  "heisse, ich, Anna (Statement)",',
    '  "heiße, ich, Anna (Statement)",',
    "Day 5 heißen spelling",
  ],
];

for (const [before, after, label] of replacements) {
  if (source.includes(after)) continue;
  if (!source.includes(before)) {
    throw new Error(`Could not find ${label} anchor.`);
  }
  source = source.replace(before, after);
}

fs.writeFileSync(targetPath, source);
console.log("Applied A1 Day 5 Course Book audit fixes.");
