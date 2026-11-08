import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { B1_PRESERVED_READING_PRINT_DATA, B1_DAY22_SECOND_READING_PRINT_DATA } from "./b1PreservedReadingPrintData.mjs";
import { B1_PRINT_CSS, findB1PrintFaults, isB1WorkbookGuideLabel, prepareB1PrintView, assertB1PrintedContent, assertB1CanonicalPrintedContent } from "./b1PdfPrintExtras.mjs";

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

test("B1 print-only accordion guide identifier matches the real Day 1 label", () => {
  assert.equal(isB1WorkbookGuideLabel("Day 1 · B1 workbook · how to complete this workbook"), true);
  assert.equal(isB1WorkbookGuideLabel("Day 21 · B1 workbook · how to complete this workbook"), true);
  assert.equal(isB1WorkbookGuideLabel("Day 1 · B1 workbook · Lesen Teil 3"), false);
  assert.ok(prepareB1PrintView.toString().includes("const isB1WorkbookGuideLabel = value =>"));
});

test("B1 printed-text coverage audit excludes web shell but detects missing actual content", () => {
  const lesson = "Die Schülerinnen lernen heute gemeinsam einen interessanten Wortschatz über Beruf, Arbeitsvertrag, Kommunikation, Ausbildung, Bewerbung, Vorstellungsgespräch, Personalabteilung, Kollegen, Zeitplanung, Projektarbeit, Weiterbildung und Erfahrungen.";
  const printed = lesson + " Deutschunterricht mit Beispielen und praktischen Aufgaben für alle Teilnehmer.";
  assert.doesNotThrow(() => assertB1PrintedContent(lesson + " Website navigation Help Login Back", printed));
  assert.throws(() => assertB1PrintedContent(lesson, "Ein kleiner Abschnitt ohne Inhalt"));
});

test("short but substantive B1 grammar pages pass while missing content still fails",()=>{
  const short = "Träume Wörter Umwelt Menschen Freunde Kinder Gespräche Lernen Sprache Arbeiten Fragen Antworten.";
  assert.doesNotThrow(() => assertB1PrintedContent(short,short));
  assert.throws(() => assertB1PrintedContent(short,"Audio wird geladen"),/empty or insufficient/);
  const long = Array.from({length:70},(_,i)=>"Beispielwort"+i).join(" ");
  assert.throws(() => assertB1PrintedContent(long,"Ein leerer Absatz ohne Aufgaben"),/empty or insufficient/);
  assert.match(prepareB1PrintView.toString(),/Audio wird geladen/);
});

test("B1 retail PDF flags forbidden QR-only and live website messages",()=>{
  assert.ok(findB1PrintFaults("Diese Aufgabe ist nur online verfügbar").length);
  assert.ok(findB1PrintFaults("I prepared this part.").length);
  assert.ok(findB1PrintFaults("Continue learning Ready for the next lesson?").length);
  assert.ok(findB1PrintFaults("Day 8 · B1 workbook · how to complete this workbook").length);
  assert.ok(findB1PrintFaults("Draft saved").length);
  assert.ok(findB1PrintFaults("Back to Course Book").length);
  assert.deepEqual(findB1PrintFaults("Teil 3 · Lesen – Lies den Text und beantworte die Fragen"),[]);
  assert.deepEqual(findB1PrintFaults("Audio wird geladen…"), ["unresolved audio-loading placeholder"]);
  assert.match(B1_PRINT_CSS,/overflow: visible !important/);
  assert.match(B1_PRINT_CSS,/header\.app-header--compact/);
});

test("B1 canonical exercise printing tolerates list/text ordering changes", () => {
  const instructions = "Lesen Sie den Text und beantworten Sie die Fragen ausführlich.";
  const questions = "Antwort Alpha Antwort Beta Antwort Gamma Frage Eins Frage Zwei";
  assert.doesNotThrow(() => assertB1CanonicalPrintedContent(
    instructions + " " + questions,
    questions + " " + instructions,
  ));
});

test("B1 canonical exercise printing rejects significant missing text despite word overlap", () => {
  const words = Array.from({ length: 30 }, (_, i) => "Buchstabe" + i);
  const expected = words.join(" ");
  assert.throws(() => assertB1CanonicalPrintedContent(expected, words.slice(0, 26).join(" ")),
    /lost source-controlled exercise text/);
  assert.doesNotThrow(() => assertB1CanonicalPrintedContent(expected, words.slice().reverse().join(" ")));
});

test("B1 prepublication audit excludes website submission overlays and blank blue input fields", () => {
  assert.ok(findB1PrintFaults("Answer directly in the workbook. Your required choices and writing are saved to Review & Submit automatically. You can edit the final answer there before submitting.").length);
  assert.ok(findB1PrintFaults("Click an answer option. Your choice is saved automatically to Submit, and you can change it at any time.").length);
  assert.ok(findB1PrintFaults("Lösungen anzeigen").length);
  assert.match(B1_PRINT_CSS, /break-inside: avoid !important/);
  assert.match(B1_PRINT_CSS, /input:not\(\[type="radio"\]\)/);
  assert.match(prepareB1PrintView.toString(), /paperOnlyNotices/);
  assert.match(prepareB1PrintView.toString(), /:scope > summary/);
  assert.match(prepareB1PrintView.toString(), /Lösungen anzeigen/);
  assert.match(prepareB1PrintView.toString(), /B1 Grammar Notes/);
  assert.equal(findB1PrintFaults("Was macht eine Freundschaft wichtig? a) Ehrlichkeit b) Respekt").length, 0);
});
