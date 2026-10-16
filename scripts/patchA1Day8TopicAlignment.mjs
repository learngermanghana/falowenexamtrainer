// Previously a one-time patch which reintroduced unrelated grammar topics into
// A1 Day 8 during normal builds. Preserve this entry point for calling scripts,
// but verify the focused lesson instead of mutating source files.
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFileSync(path.join(root, relative), "utf8");

const page = read("web/src/components/FormingBasicStatementsPage.js");
assert.ok(page.includes("Welche Sprachen sprichst du?"), "A1 Day 8 must focus on sprechen");
assert.ok(page.includes("One useful expression: man spricht"), "A1 Day 8 must introduce man spricht");
assert.ok(page.includes("3. Woher? Wo? Wohin?"), "A1 Day 8 must teach origin, place and destination");
assert.ok(page.includes("4. nach or in?"), "A1 Day 8 must contrast nach and in");
assert.ok(page.includes("in die Schweiz"), "A1 Day 8 must explain country-article destinations");
for (const oldTopic of ["Präteritum", "liegen = to be located", "Four tenses"]) {
  assert.ok(!page.includes(oldTopic), "Old A1 Day 8 grammar topic returned: " + oldTopic);
}

const grammar = 'grammar_topic: "sprechen; man spricht; woher / wo / wohin; aus / in / nach"';
for (const file of ["web/src/data/courseSchedule.js", "functions/data/courseSchedule.js"]) {
  const schedule = read(file);
  assert.ok(schedule.includes(grammar), "A1 Day 8 metadata out of sync in " + file);
  assert.ok(!schedule.includes("Learn about schon mal, noch nie, irregular verbs, and man vs Mann"),
    "Old A1 Day 8 goal returned in " + file);
}
assert.ok(
  read("web/src/components/A1Day8CountriesAndLanguagesWorkbookPage.js")
    .includes('fallbackAssignmentKey="A1-4"'),
  "A1 Day 8 tutor-marked workbook must remain linked",
);

console.log("A1 Day 8 verified: sprechen, man spricht, woher/wo/wohin, aus/in/nach; workbook unchanged.");
