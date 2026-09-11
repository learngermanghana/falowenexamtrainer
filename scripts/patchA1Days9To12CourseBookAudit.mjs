import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const replaceOnce = (relativePath, before, after, label) => {
  const targetPath = path.join(root, relativePath);
  let source = fs.readFileSync(targetPath, "utf8");
  if (source.includes(after)) return;
  if (!source.includes(before)) throw new Error(`Could not find ${label} anchor in ${relativePath}.`);
  source = source.replace(before, after);
  fs.writeFileSync(targetPath, source, "utf8");
};

replaceOnce(
  "web/src/components/A1Chapter5GermanCasesWorkbookPage.js",
  "A1 · Chapter 5 Workbook · Nominative & Akkusative, Definite & Indefinite Articles",
  "A1 · Chapter 5 Workbook · German Cases: Nominative and Accusative",
  "Day 9 workbook title",
);
replaceOnce(
  "web/src/components/A1Chapter5GermanCasesWorkbookPage.js",
  "German Cases · Chapter 5. This workbook is now organized on one page,\n          so complete Teil 1, Teil 2, and Teil 3 from top to bottom.",
  "German Cases · Chapter 5. This assignment practises definite articles in the nominative and accusative. Complete Teil 1, Teil 2 and Teil 3 from top to bottom.",
  "Day 9 scope description",
);

replaceOnce(
  "web/src/components/A1Day10ObjectsColorsPossessiveArticlesWorkbookPage.js",
  'title="A1 · Day 10 Workbook · Objects, Colors and Possessive Articles"',
  'title="A1 · Day 10 Workbook · Objects and Colors"',
  "Day 10 canonical title",
);
replaceOnce(
  "web/src/components/A1Day10ObjectsColorsPossessiveArticlesWorkbookPage.js",
  "Instructions: Complete the following exercises about an apartment. This assignment will help you practice your vocabulary\n          and sentence structures in German, focusing on rooms and furniture in an apartment.",
  "Instructions: This fixed Chapter 6 assignment applies object vocabulary through rooms, furniture and apartment descriptions. Complete all three Teile, then submit the assignment once.",
  "Day 10 assignment context",
);

replaceOnce(
  "web/src/components/A1Day11UnderstandingTimeWorkbookPage.js",
  'submitDescription="This submission box is locked to A1-7, so students can send their final Chapter 7 answers from this workbook."',
  'submitDescription="Submit your completed Chapter 7 answers here when both Teile are finished."',
  "Day 11 learner-facing submit description",
);

replaceOnce(
  "web/src/components/A1Day12TwentyFourHourClockAndDatesWorkbookPage.js",
  "<h2 style={sectionTitle}>Teil 4: Vocabulary reminder</h2>",
  "<h2 style={sectionTitle}>Vocabulary reminder</h2>",
  "Day 12 unassessed vocabulary heading",
);
replaceOnce(
  "web/src/data/a1AssignmentRegistry.js",
  '["A1-8", 12, "8", "24 Hour Clock", "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook", "A1Day12TwentyFourHourClockAndDatesWorkbookPage", ["Teil 1: Lesen · Multiple Choice", "Teil 2: Lesen · Richtig oder Falsch", "Teil 3: Hörverstehen", "Teil 4: Vocabulary reminder"]],',
  '["A1-8", 12, "8", "24 Hour Clock", "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook", "A1Day12TwentyFourHourClockAndDatesWorkbookPage", ["Teil 1: Lesen · Multiple Choice", "Teil 2: Lesen · Richtig oder Falsch", "Teil 3: Hörverstehen"]],',
  "Day 12 assessed-section registry",
);

console.log("Applied A1 Days 9–12 Course Book audit fixes.");
