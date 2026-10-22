import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import manifest from "../functions/data/answerKeyManifest.json" with { type: "json" };

const require = createRequire(import.meta.url);
const { validateB1AudioKey } = require("../functions/functionz/r2CourseAudio.js");
const read = p => readFileSync(new URL(p, import.meta.url), "utf8");

const expected = [
  "B) Die vielen kulturellen Angebote und die kurzen Wege",
  "A) Sie ist persönlicher.",
  "B) Die Natur direkt vor der Haustür",
  "A) Sie müsste täglich eine Stunde mit dem Zug pendeln.",
  "C) Sie sind deutlich günstiger als in der Stadt.",
];

test("B1-2.6 Hören has exactly five dialogue-grounded questions and answers", () => {
  const entry = Object.values(manifest).find(value => value.assignment_id === "B1-2.6");
  assert.ok(entry, "B1 Day 6 manifest exists");
  assert.deepEqual(Object.values(entry.answers.teil4), expected);
  assert.equal(Object.keys(entry.answers.teil3).length, 5, "Reading key is preserved");
  const source = read("../web/src/data/b1Day6WorkbookData.js");
  assert.equal((source.match(/stem: "[1-5]\\. /g) || []).filter(() => true).length >= 5, true);
  for (const answer of expected) assert.ok(source.includes(answer), `Question option absent: ${answer}`);
  assert.doesNotMatch(source, /Passivhäuser|Mehrfamilienhäusern|Haushaltsgeräten/);
});

test("B1 Day 6 uses signed R2 media in the canonical workbook and removes YouTube", () => {
  const key = "b1/day-06/day-06.mp3";
  assert.deepEqual(validateB1AudioKey({day:6,key}), {day:6,key});
  const task = read("../web/src/data/b1ListeningTasks.js");
  const day6 = task.slice(task.indexOf("  6: task({"), task.indexOf("  7: task({"));
  assert.match(day6, /audioKey: "b1\\/day-06\\/day-06\\.mp3"/);
  assert.doesNotMatch(day6, /youtube|6zpR_jF26l0|embedUrl:/i);
  for(const file of ["B1Day6StadtOderLandWorkbookPage.js","B1Day6StadtOderLandWorkbookPageV2.js"]) {
    const source = read(`../web/src/components/${file}`);
    assert.doesNotMatch(source, /6zpR_jF26l0|<iframe/);
    assert.match(source, /B1ProtectedAudioPlayer/);
  }
});
