import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { B1_PRESERVED_READING_PRINT_DATA, B1_DAY22_SECOND_READING_PRINT_DATA } from "./b1PreservedReadingPrintData.mjs";
import { B1_PRINT_CSS, findB1PrintFaults } from "./b1PdfPrintExtras.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../web/src/components");
const sourceFor = day => fs.readFileSync(path.join(root, ({
  19:"B1Day19VorstellungsgespraechWorkbookPage.js",
  20:"B1Day20BerufKennenWorkbookPage.js",
  22:"B1Day22BeziehungWichtigWorkbookPage.js",
})[day]), "utf8");

test("B1 print-only transcriptions preserve 7 / 7 / 3 questions from the actual lesson source", () => {
  for (const [day, questionCount] of [[19,7],[20,7],[22,3]]) {
    const data = B1_PRESERVED_READING_PRINT_DATA[day];
    const js = sourceFor(day);
    assert.ok(data.paragraphs.length >= 3);
    assert.equal(data.questions.length,questionCount,"Day " + day + " complete questions");
    for (const paragraph of data.paragraphs) {
      assert.ok(paragraph.length > 10);
      assert.ok(js.includes(paragraph.replace(/\n/g,"<br />")) || js.includes(paragraph),
        "Day " + day + " has text missing from its original lesson: " + paragraph.slice(0,50));
    }
    for (const question of data.questions) {
      assert.ok(js.includes(question.stem),"Day " + day + " stem drift: " + question.stem);
      assert.ok(question.options.length >= 3,"Day " + day + " missing choices");
      for (const choice of question.options) assert.ok(js.includes(choice), "Source mismatch: " + choice);
      assert.equal(question.answer,undefined);
    }
  }
});

test("B1 Day 22 original second reading includes three expert texts and seven statements",()=>{
  const source = sourceFor(22),part = B1_DAY22_SECOND_READING_PRINT_DATA;
  assert.equal(part.experts.length,3);
  assert.equal(part.statements.length,7);
  for (const expert of part.experts) {
    assert.ok(source.includes(expert.name));
    assert.ok(source.includes(expert.text));
  }
  for (const claim of part.statements) assert.ok(source.includes(claim));
});

test("B1 retail PDF flags forbidden QR-only and live website messages",()=>{
  assert.ok(findB1PrintFaults("Diese Aufgabe ist nur online verfügbar").length);
  assert.ok(findB1PrintFaults("I prepared this part.").length);
  assert.ok(findB1PrintFaults("Continue learning Ready for the next lesson?").length);
  assert.ok(findB1PrintFaults("Day 8 · B1 workbook · how to complete this workbook").length);
  assert.ok(findB1PrintFaults("Draft saved").length);
  assert.deepEqual(findB1PrintFaults("Teil 3 · Lesen – Lies den Text und beantworte die Fragen"),[]);
  assert.match(B1_PRINT_CSS,/overflow: visible !important/);
  assert.match(B1_PRINT_CSS,/header\.app-header--compact/);
});
