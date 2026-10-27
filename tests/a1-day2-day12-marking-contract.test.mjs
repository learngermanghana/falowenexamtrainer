import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync(new URL("../functions/data/answerKeyManifest.json", import.meta.url), "utf8"));
const day2Workbook = readFileSync(new URL("../web/src/components/A1Day2Kapitel11WorkbookPage.js", import.meta.url), "utf8");
const day12Workbook = readFileSync(new URL("../web/src/components/A1Day12TwentyFourHourClockAndDatesWorkbookPage.js", import.meta.url), "utf8");

test("A1-1.1 grades Hören and a short A1 introduction instead of ignoring writing", () => {
  const row = manifest["A1 Pronouns and Verb Conjugation 1.1"];
  assert.deepEqual(row.expectedParts, ["teil1", "teil2"]);
  assert.deepEqual(row.referenceAnswerParts, ["teil1"]);
  assert.deepEqual(row.writingParts, ["teil2"]);
  assert.deepEqual(row.aiGradedParts, ["teil2"]);
  assert.equal(row.partGrading.teil2.gradingMode, "ai_written_response");
  assert.deepEqual(Object.values(row.answers["Teil 1"]).map(value => value[0]), ["C", "C", "A", "B"]);
  assert.match(row.answers["Teil 1"].Answer3, /Caf[eé]/);
  for (const point of ["greeting", "name", "country", "residence", "farewell"]) {
    assert.match(row.partGrading.teil2.instruction, new RegExp(point, "i"));
  }
  assert.match(day2Workbook, /Teil 1 · Hören/);
  assert.match(day2Workbook, /Teil 2 · Schreiben/);
});

test("A1-8 grades exactly eight reading answers with no speaking gate", () => {
  const row = manifest["A1 The 24 Hour Clock and Dates 8"];
  assert.deepEqual(row.expectedParts, ["teil1", "teil2"]);
  assert.deepEqual(row.referenceAnswerParts, ["teil1", "teil2"]);
  assert.deepEqual(row.speakingParts, []);
  assert.deepEqual(row.writingParts, []);
  assert.deepEqual(row.aiGradedParts, []);
  assert.deepEqual(Object.values(row.answers["Teil 1"]), ["Richtig", "Richtig", "Falsch", "Richtig", "Richtig"]);
  assert.deepEqual(Object.values(row.answers["Teil 2"]).map(value => value[0]), ["B", "C", "B"]);
  assert.equal(Object.values(row.answers["Teil 1"]).length + Object.values(row.answers["Teil 2"]).length, 8);
  for (const grading of Object.values(row.partGrading)) {
    assert.equal(grading.gradingMode, "answer_key");
    assert.match(grading.label, /Lesen/);
  }
  assert.doesNotMatch(JSON.stringify(row), /tutor_verified_speaking|GOETHE_A1_TUTOR_SPEAKING_V1/);
  assert.match(day12Workbook, /two Lesen parts/);
  assert.match(day12Workbook, /Teil 1: E-Mails und SMS/);
  assert.match(day12Workbook, /Teil 2: Schilder/);
});

test("A1-11 keeps the separate verified speaking, Hören, and Lesen sections", () => {
  const row = manifest["A1 Instructions and Directions 11"];
  assert.deepEqual(row.expectedParts, ["teil1", "teil2", "teil3"]);
  assert.deepEqual(row.referenceAnswerParts, ["teil2", "teil3"]);
  assert.deepEqual(row.speakingParts, ["teil1"]);
  assert.equal(row.partGrading.teil1.gradingMode, "tutor_verified_speaking");
  assert.deepEqual(Object.values(row.answers.teil2).map(value => value[0]), ["A", "B", "A", "B", "A"]);
  assert.equal(Object.keys(row.answers.teil3).length, 5);
});
