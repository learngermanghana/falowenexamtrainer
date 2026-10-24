import assert from "node:assert/strict";
import test from "node:test";
import { cleanA1PrintChrome, findA1PrintChromeLeaks, findA1PdfLayoutFaults } from "./a1PdfPrintChrome.mjs";
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


test("Day 7 nested strong draft notice is removed but real price questions remain", () => {
  const root = new Node("MAIN");
  const question = new Node("SECTION", "1. Wie viel kostet das Buch? ________");
  const savedNotice = new Node("P", "Saved to your assignment draft · 05:51 PM. Not submitted for marking yet.");
  savedNotice.children = [new Node("STRONG", "Not submitted for marking yet.")];
  savedNotice.querySelector = () => null;
  root.mapping.set("p[role='status'],p[aria-live]", [savedNotice]);
  root.mapping.set("div,section,aside", [question]);
  runWithDoc(root, cleanA1PrintChrome);
  assert.equal(savedNotice.removed, true);
  assert.equal(question.removed, false);
});

test("explicitly marked notices are hidden even outside the first main element", () => {
  const root = new Node("MAIN");
  const status = new Node("P", "Saved to your assignment draft · 05:51 PM. Not submitted for marking yet.");
  const original = globalThis.document;
  globalThis.document = {
    body: root,
    querySelector: selector => selector === "main" ? root : null,
    querySelectorAll: selector => selector === '[data-a1-pdf-hide-ui], [data-a1-chapter3-draft-guidance]'
      ? [status] : [],
  };
  try {
    cleanA1PrintChrome();
    assert.equal(status.removed, true);
  } finally {
    if (original === undefined) delete globalThis.document;
    else globalThis.document = original;
  }
});


test("paper PDF removes answer action controls, never answer choices", () => {
  const root = new Node("MAIN");
  const controls = ["Show answer", "Check answers", "Reset", "Show solution"].map(label => new Node("BUTTON", label));
  const answers = ["A. Die Praxis anrufen", "B. Einfach am Montag kommen", "C. Eine E-Mail schreiben"].map(label => new Node("BUTTON", label));
  root.mapping.set("button,a", [...controls, ...answers]);
  runWithDoc(root, cleanA1PrintChrome);
  assert.ok(controls.every(control => control.removed));
  assert.ok(answers.every(answer => !answer.removed));
  for (const action of ["Show answer", "Check answers", "Reset", "Show solution"]) {
    assert.ok(findA1PrintChromeLeaks(action).includes("knowledge-test action buttons"), action);
  }
});


test("A1 PDF removes branded bell/avatar strip even when .app-header is absent", () => {
  const root = new Node("MAIN");
  const brand = new Node("SPAN", "Falowen");
  const masthead = new Node("DIV", "Falowen 🔔 FA");
  const lesson = new Node("SECTION", "A1 Day 1 Grammar Notes");
  brand.parentElement = masthead;
  masthead.parentElement = root;
  masthead.getBoundingClientRect = () => ({ top: 24, bottom: 72, height: 48 });
  masthead.setAttribute = (name, value) => { masthead[name] = value; };
  const original = globalThis.document;
  globalThis.document = {
    body: root,
    querySelector: selector => selector === "main" ? root : null,
    querySelectorAll: selector => selector === "header,nav,aside,section,div" ? [masthead] : [],
  };
  try {
    cleanA1PrintChrome();
    assert.equal(masthead["data-a1-pdf-hide-ui"], "website-masthead");
    assert.equal(lesson.removed, false);
  } finally {
    if (original === undefined) delete globalThis.document;
    else globalThis.document = original;
  }
});

test("A1 PDF does not delete a genuine Falowen lesson title", () => {
  const root = new Node("MAIN");
  const brand = new Node("SPAN", "Falowen");
  const lesson = new Node("SECTION", "Falowen A1 Day 6 Workbook · family practice FA");
  brand.parentElement = lesson;
  lesson.parentElement = root;
  root.mapping.set("a,span,strong,b,div", [brand]);
  runWithDoc(root, cleanA1PrintChrome);
  assert.equal(lesson.removed, false);
});

test("A1 PDF removes only completed section controls and arrow back navigation", () => {
  const root = new Node("MAIN");
  const done = new Node("LABEL", "I practised this section.");
  const back = new Node("BUTTON", "←Back");
  const answer = new Node("BUTTON", "B. die Mutter");
  root.mapping.set("label,button", [done]);
  root.mapping.set("button,a", [back, answer]);
  runWithDoc(root, cleanA1PrintChrome);
  assert.equal(done.removed, true);
  assert.equal(back.removed, true);
  assert.equal(answer.removed, false);
});


test("A1 PDF hides anonymous top-of-page brand strip without relying on exact text nodes", () => {
  const root = new Node("MAIN");
  const brand = new Node("SPAN", "F Falowen");
  const bar = new Node("DIV", "F Falowen 🔔 FA");
  bar.parentElement = root;
  bar.innerText = "F Falowen 🔔 FA";
  bar.getBoundingClientRect = () => ({ top: 24, bottom: 72, height: 48 });
  bar.setAttribute = (name, value) => { bar[name] = value; };
  root.mapping.set("header,nav,aside,section,div", [bar]);
  runWithDoc(root, cleanA1PrintChrome);
  assert.equal(bar["data-a1-pdf-hide-ui"], "website-masthead");
  assert.equal(bar.display, "none");
});

test("A1 PDF retains lesson headings, answer choices and brand mentions below masthead", () => {
  const root = new Node("MAIN");
  const teaching = new Node("SECTION", "Falowen Day 2 Grammar Notes FA");
  teaching.innerText = teaching.textContent;
  teaching.getBoundingClientRect = () => ({ top: 22, bottom: 75, height: 53 });
  const footer = new Node("DIV", "Falowen FA");
  footer.getBoundingClientRect = () => ({ top: 400, bottom: 440, height: 40 });
  const answer = new Node("BUTTON", "A. Ich komme aus Ghana");
  root.mapping.set("header,nav,aside,section,div", [teaching, footer]);
  root.mapping.set("button,a", [answer]);
  runWithDoc(root, cleanA1PrintChrome);
  assert.equal(teaching["data-a1-pdf-hide-ui"], undefined);
  assert.equal(footer["data-a1-pdf-hide-ui"], undefined);
  assert.equal(answer.removed, false);
});


test("final PDF audit catches the remaining v7 masthead and Day 22 QR-page split", () => {
  const pdf = [
    "Falowen                  🔔  FA\nA1 Basic Greetings\nFalowen Learning Hub 5 / 255",
    "Teil 3 · Hören\nHören: Audio im Falowen Course Book\nFalowen Learning Hub 254 / 255",
    "1. Welche Beschwerden hat Herr Braun?\n6. Was soll Herr Braun tun, wenn er am Freitag nicht kommen kann?\nFalowen Learning Hub 255 / 255",
  ].join("\f") + "\f";
  const faults = findA1PdfLayoutFaults(pdf);
  assert.match(faults.join("; "), /website masthead/);
  assert.match(faults.join("; "), /QR instructions are separated/);
});

test("final PDF audit accepts masthead-free Day 22 Hören with QR and all six choices", () => {
  const content = "Teil 3 · Hören\nHören: Audio im Falowen Course Book\n" +
    "1. Welche Beschwerden hat Herr Braun?\n" +
    "6. Was soll Herr Braun tun, wenn er am Freitag nicht kommen kann?\n" +
    "Falowen Learning Hub 255 / 255";
  assert.deepEqual(findA1PdfLayoutFaults(content + "\f"), []);
});
