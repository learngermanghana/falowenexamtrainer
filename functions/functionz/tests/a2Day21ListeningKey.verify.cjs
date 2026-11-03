const test = require("node:test");
const assert = require("node:assert/strict");
const manifest = require("../../data/answerKeyManifest.json");
const { validateA2AudioKey } = require("../r2CourseAudio");

test("A2 Day 21 reviewed small-talk Hören has exactly five A/B/C answers", () => {
  const entry = manifest["A2 8.21 Ein Wochenende planen"];
  assert.equal(entry.assignment_id, "A2-8.21");
  assert.equal(Object.keys(entry.answers.teil3).length, 5);
  assert.deepEqual(Object.values(entry.answers.teil4), [
    "A) Sie hat frisches Obst gekauft.",
    "B) Sie war lange spazieren.",
    "C) Er hat ein Buch gelesen.",
    "A) Weil sie am Freitag das Meeting planen müssen.",
    "B) Um zehn Uhr.",
  ]);
});

test("private A2 Day 21 course audio accepts the assigned R2 key only", () => {
  const key = "a2/day-21/day-21.mp3";
  assert.deepEqual(validateA2AudioKey({ day: 21, key }), { day: 21, key });
  assert.equal(validateA2AudioKey({ day: 21, key: "a2/day-21/alternate.mp3" }), null);
  assert.equal(validateA2AudioKey({ day: 20, key }), null);
});
