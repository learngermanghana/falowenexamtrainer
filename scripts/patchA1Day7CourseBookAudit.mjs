import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workbookPath = path.join(root, "web/src/components/A1Chapter3AskingAboutPricesWorkbookPage.js");
const grammarPath = path.join(root, "web/src/components/A1Day7PricesPreferencesGrammarPage.js");

let workbook = fs.readFileSync(workbookPath, "utf8");
let grammar = fs.readFileSync(grammarPath, "utf8");

const workbookReplacements = [
  [
    "In-app workbook for Chapter 3. Complete the exercises in your notebook\n          first, then submit your final work in the assignment submission tab.",
    "Chapter 3 focuses on asking about prices. Teil 2 and Teil 3 deliberately review family and hobbies from earlier lessons. Complete all three required Teile, then submit the assignment once.",
    "Day 7 assignment focus explanation",
  ],
  ["Playing football – Fußballspielen", "Playing football – Fußball spielen", "Day 7 hobby phrase"],
  ["I like to... – Ich mag...", "I like doing... – Ich ... gern.", "Day 7 gern model"],
  ["I enjoy... – Ich genieße...", "I enjoy reading. – Ich lese gern.", "Day 7 enjoy model"],
  ["I like to read books. – Ich mag Bücher lesen.", "I like to read books. – Ich lese gern Bücher.", "Day 7 reading example"],
  ["She enjoys painting. – Sie genießt Malen.", "She enjoys painting. – Sie malt gern.", "Day 7 painting example"],
];

for (const [before, after, label] of workbookReplacements) {
  if (workbook.includes(after)) continue;
  if (!workbook.includes(before)) throw new Error(`Could not find ${label} anchor.`);
  workbook = workbook.replace(before, after);
}

const oldPluralShortAnswer = '<div><strong>Plural short answer:</strong> Die kosten 10 Euro. (They cost 10 euros.)</div>';
const newPluralShortAnswer = '<div><strong>Plural short answer:</strong> Sie kosten 10 Euro. (They cost 10 euros.)</div>';
if (!grammar.includes(newPluralShortAnswer)) {
  if (!grammar.includes(oldPluralShortAnswer)) throw new Error("Could not find Day 7 plural-pronoun model anchor.");
  grammar = grammar.replace(oldPluralShortAnswer, newPluralShortAnswer);
}

fs.writeFileSync(workbookPath, workbook);
fs.writeFileSync(grammarPath, grammar);
console.log("Applied A1 Day 7 Course Book audit fixes.");
