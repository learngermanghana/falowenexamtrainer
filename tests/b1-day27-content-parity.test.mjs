import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const manifest = JSON.parse(read("functions/data/answerKeyManifest.json"));
const b1Reading = read("web/src/data/b1ReadingTasks.js");
const b1Listening = read("web/src/data/b1ListeningTasks.js");
const b1Writing = read("web/src/data/b1WritingTasks.js");
const backendWriting = JSON.parse(read("functions/data/b1WritingTasks.json"));

const assignment = Object.values(manifest).filter((entry) => entry.assignment_id === "B1-10.27");
assert.equal(assignment.length, 1, "There must be exactly one authoritative Day 27 answer key");

function day27Block(source, declaration) {
  const opening = `  27: ${declaration}`;
  const closing = `  28: ${declaration}`;
  const start = source.indexOf(opening);
  const end = source.indexOf(closing, start + opening.length);
  assert.ok(start >= 0 && end > start, "Day 27 must have an independent canonical entry");
  return source.slice(start, end);
}

function assertAnswersMatchDisplayedOptions(options, answers, expectedLetters) {
  assert.equal(options.length, expectedLetters.length);
  assert.equal(Object.keys(answers).length, expectedLetters.length);
  expectedLetters.forEach((letter, index) => {
    const answer = answers[`Answer${index + 1}`];
    assert.ok(answer.startsWith(`${letter}) `), `Answer${index + 1} correct letter mismatch`);
    assert.ok(options[index].includes(answer), `Answer${index + 1} is not an actual displayed option`);
  });
}

test("Day 27 Lesen: exactly six Richtig/Falsch statements match bundled marking", () => {
  const section = day27Block(b1Reading, "Object.freeze({");
  assert.match(section, /Mein Weg zu mehr Nachhaltigkeit im Alltag/);
  assert.match(section, /Repair-Café/);
  const options = [...section.matchAll(/options:\s*(\[[^\n]*\])/g)].map((match) => JSON.parse(match[1]));
  for (const pair of options) assert.deepEqual(pair, ["A) Richtig", "B) Falsch"]);
  assertAnswersMatchDisplayedOptions(options, assignment[0].answers.teil3, ["A", "B", "B", "A", "B", "A"]);
});

test("Day 27 Hören: canonical five questions use protected R2 audio and aligned answers", () => {
  const section = day27Block(b1Listening, "task({");
  assert.match(section, /audioKey: "b1\/day-27\/day-27\.mp3"/);
  assert.match(section, /submitRequired: true/);
  assert.doesNotMatch(section, /videoId:|youtube/);
  const options = [...section.matchAll(/\bq\(".*?",\s*(\[[^\n]*\])\)/g)].map((match) => JSON.parse(match[1]));
  assertAnswersMatchDisplayedOptions(options, assignment[0].answers.teil4, ["A", "B", "C", "A", "B"]);
  const signer = read("functions/functionz/r2CourseAudio.js");
  assert.match(signer, /B1: new Set\(\[[^\]]*\b27\b[^\]]*\]\)/);
});

test("Day 27 Schreiben: four requested forum points and Felix source match backend assessment", () => {
  const section = day27Block(b1Writing, "Object.freeze({");
  assert.match(section, /Felix \(26 Jahre\)/);
  assert.match(section, /vier Punkten/);
  assert.match(section, /Blog- oder Forenbeitrag/);
  const server = backendWriting["B1-10.27"];
  assert.equal(server.points.length, 4);
  assert.match(server.situation, /Felix \(26 Jahre\)/);
  assert.match(server.situation, /ca\. 80 Wörter/);
});
