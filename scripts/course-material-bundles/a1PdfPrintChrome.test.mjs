import assert from "node:assert/strict";
import test from "node:test";
import { cleanA1PrintChrome, findA1PrintChromeLeaks } from "./a1PdfPrintChrome.mjs";
import { scanPdfPageContent } from "./pdfPageAudit.mjs";

class Node {
  constructor(tag = "DIV", content = "") {
    this.tagName = tag.toUpperCase();
    this.textContent = content;
    this.children = [];
    this.mapping = new Map();
    this.removed = false;
    this.style = { setProperty: (key, value) => { this[key] = value; } };
  }
  querySelectorAll(selector) { return this.mapping.get(selector) || []; }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  matches() { return false; }
  remove() { this.removed = true; }
}
const runWithDoc = (root, action) => {
  const original = globalThis.document;
  globalThis.document = { body: root, querySelector: (query) => query === "main" ? root : null };
  try { action(); }
  finally {
    if (original === undefined) delete globalThis.document;
    else globalThis.document = original;
  }
};

test("print cleanup removes only marked live widgets, not multiple-choice answer buttons", () => {
  const root = new Node("MAIN");
  const notice = new Node("P", "Saved to your assignment draft · 05:51 PM. Not submitted");
  const summary = new Node("DIV", "Finish workbook before submitting");
  const testActions = new Node("DIV", "Check knowledge test Reset test");
  const choice = new Node("BUTTON", "B) Guten Tag");
  const showModel = new Node("BUTTON", "Show model");
  const reset = new Node("BUTTON", "Reset test");
  const priceQuestion = new Node("SECTION", "Wie viel kostet das Buch?");
  root.mapping.set('[data-a1-pdf-hide-ui], [data-a1-chapter3-draft-guidance]', [notice, summary, testActions]);
  root.mapping.set("button,a", [choice, showModel, reset]);
  root.mapping.set("p,span,small,strong,[role=status]", []);
  root.mapping.set("div,section,aside", [priceQuestion]);
  runWithDoc(root, cleanA1PrintChrome);
  assert.ok(notice.removed);
  assert.ok(summary.removed);
  assert.ok(testActions.removed);
  assert.ok(showModel.removed);
  assert.ok(reset.removed);
  assert.equal(choice.removed, false, "real multiple-choice answer must remain visible");
  assert.equal(priceQuestion.removed, false, "the actual exercise must remain printable");
});

test("score panel removal does not delete surrounding grammar knowledge questions", () => {
  const root = new Node("MAIN");
  const score = new Node("DIV", "Your score 0 / 3 Answer all questions to see your full score.");
  score.querySelector = () => null;
  const exercise = new Node("DIV", "Choose the correct formal title. A) Herr B) Frau");
  exercise.querySelector = () => null;
  root.mapping.set("div,section,aside", [score, exercise]);
  runWithDoc(root, cleanA1PrintChrome);
  assert.equal(score.removed, true);
  assert.equal(exercise.removed, false);
});

test("Day 19 static speaking cards keep prompts but lose model toggle buttons", () => {
  const root = new Node("MAIN");
  root.matches = (s) => s === "[data-a1-speaking-confidence-lab]";
  const paragraph = new Node("P", "Look at the keyword, speak first, then reveal the model.");
  const heading = new Node("H2", "Make a request and react");
  const modelToggle = new Node("BUTTON", "Show model");
  root.mapping.set("p", [paragraph]);
  root.mapping.set("button,a", [modelToggle]);
  runWithDoc(root, cleanA1PrintChrome);
  assert.ok(modelToggle.removed);
  assert.match(paragraph.textContent, /online lesson/);
  assert.equal(heading.textContent, "Make a request and react");
});

test("PDF quality gate detects exact leftover controls from 278-page master", () => {
  const examples = [
    "Saved to your assignment draft · 05:51 PM. Not submitted for marking yet.",
    "0 of 6 blanks completed",
    "Show model",
    "Check knowledge test",
    "Reset test",
    "Record family answer",
  ];
  examples.forEach((line) => {
    assert.ok(findA1PrintChromeLeaks(line).length, "Expected PDF chrome flag for " + line);
  });
  assert.deepEqual(findA1PrintChromeLeaks("1. Was kostet die Lampe? A) 15 Euro B) 20 Euro"), []);
  const page = "Check knowledge test\nReset test\nFalowen Learning Hub 186 / 278";
  assert.match(scanPdfPageContent(page + "\f", 1).faults.join("; "), /only online knowledge-test buttons/);
});

test("print cleanup does not discard the last short educational speaking prompt", () => {
  const root = new Node("MAIN");
  const finalPrompt = new Node("P", "Use one fresh prompt that you have not practised before.");
  root.mapping.set("p,span,small,strong,[role=status]", [finalPrompt]);
  runWithDoc(root, cleanA1PrintChrome);
  assert.equal(finalPrompt.removed, false);
});
