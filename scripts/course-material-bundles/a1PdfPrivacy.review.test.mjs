import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeA1PrintDocument, findA1PrintPrivacyLeaks } from "./a1PdfPrivacy.mjs";
import { inspectA1PrintDocument, isA1PrintContentReady } from "./a1PdfContentReadiness.mjs";

class Element {
  constructor(tag = "DIV", content = "") {
    this.tagName = tag.toUpperCase();
    this.textContent = content;
    this.children = [];
    this.attributes = {};
    this.style = { setProperty(key, val) { this[key] = val; } };
    this.mapping = {};
    this.removed = false;
    this.replacement = null;
    this.value = "";
  }
  setAttribute(key, value) { this.attributes[key] = String(value); }
  getAttribute(key) { return this.attributes[key] ?? null; }
  removeAttribute(key) { delete this.attributes[key]; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = [...nodes]; this.textContent = ""; }
  replaceWith(node) { this.replacement = node; this.removed = true; }
  remove() { this.removed = true; }
  matches(query) { return query === "[data-speaking-mock]" && Boolean(this.getAttribute("data-speaking-mock")); }
  querySelector(query) { return this.querySelectorAll(query)[0] || null; }
  querySelectorAll(query) { return this.mapping[query] || []; }
  closest() { return null; }
}

const withDocument = (root, run, nestedMain = root) => {
  const oldDocument = globalThis.document;
  globalThis.document = {
    body: root,
    querySelector: (selector) => selector === "[data-a1-speaking-confidence-lab]"
      ? (root.getAttribute("data-a1-speaking-confidence-lab") ? root : null)
      : selector === "main" ? nestedMain : null,
    createElement: (tag) => new Element(tag),
  };
  try { run(); }
  finally {
    if (oldDocument === undefined) delete globalThis.document;
    else globalThis.document = oldDocument;
  }
};

test("Day 19 speaking-mock root removes recovered feedback, session IDs and scores", () => {
  const mock = new Element("MAIN");
  mock.setAttribute("data-speaking-mock", "A1");
  const recovered = new Element("SECTION", "Teil 1: 100% · Session: private-id · private transcript");
  mock.children = [recovered];
  withDocument(mock, () => sanitizeA1PrintDocument());
  assert.equal(mock.getAttribute("data-a1-pdf-speaking-prompt"), "true");
  assert.equal(mock.children.length, 5); // heading + introduction + three static Teils
  const printed = mock.children.flatMap((node) => [node.textContent, ...node.children.map((child) => child.textContent)]).join(" ");
  assert.match(printed, /Teil 1 · Sich vorstellen/);
  assert.match(printed, /Teil 2 · Fragen und Antworten/);
  assert.match(printed, /Teil 3 · Bitten und Reagieren/);
  assert.doesNotMatch(printed, /private-id|private transcript|100%/);
  assert.ok(findA1PrintPrivacyLeaks("Your Teil scores").includes("saved speaking session"));
  assert.ok(findA1PrintPrivacyLeaks("Session: abc123").includes("saved speaking session"));
});

test("nested speaking-mock component also gets a safe static replacement", () => {
  const root = new Element("MAIN");
  const mock = new Element("MAIN");
  mock.setAttribute("data-speaking-mock", "A1");
  mock.children = [new Element("SECTION", "Private feedback")];
  root.mapping["[data-speaking-mock]"] = [mock];
  withDocument(root, () => sanitizeA1PrintDocument());
  assert.equal(mock.getAttribute("data-a1-pdf-speaking-prompt"), "true");
  assert.equal(mock.children.length, 5);
});

test("A1-0.2 Teil 2 keeps five numbered listening answer blanks and no saved values", () => {
  const root = new Element("MAIN");
  const capture = new Element("SECTION");
  capture.setAttribute("data-a1-tutor-draft-capture", "teil-2");
  const inputs = Array.from({ length: 5 }, (_, n) => {
    const input = new Element("INPUT");
    input.value = "PRIVATE ANSWER " + (n + 1);
    return input;
  });
  capture.mapping['input[type="text"],input:not([type])'] = inputs;
  root.mapping['[data-a1-tutor-draft-capture]'] = [capture];
  root.mapping['textarea, input:not([type=checkbox]):not([type=radio]), [contenteditable=true]'] = inputs;
  withDocument(root, () => sanitizeA1PrintDocument());
  assert.ok(capture.removed);
  const blank = capture.replacement;
  assert.equal(blank.getAttribute("data-a1-pdf-draft-answer-space"), "teil-2");
  assert.equal(blank.children.length, 6); // section heading + 5 question rows
  assert.match(blank.style.cssText, /break-inside:avoid-page/);
  assert.match(blank.style.cssText, /page-break-inside:avoid/);
  assert.match(blank.style.cssText, /gap:6px/);
  assert.deepEqual(blank.children.slice(1).map((row) => row.children[0].textContent), [
    "Question 1", "Question 2", "Question 3", "Question 4", "Question 5",
  ]);
  assert.ok(blank.children.slice(1).every((row) => row.children[1].getAttribute("data-a1-pdf-answer-rule") === ""));
  assert.ok(blank.children.slice(1).every((row) => /height:19px/.test(row.children[1].style.cssText)));
  assert.ok(inputs.every((input) => input.value === ""));
});

test("A1-1.1 Teil 2 keeps blank writing lines instead of a saved draft", () => {
  const root = new Element("MAIN");
  const capture = new Element("SECTION");
  capture.setAttribute("data-a1-tutor-draft-capture", "teil-2");
  const textarea = new Element("TEXTAREA", "PRIVATE DRAFT");
  textarea.value = "PRIVATE DRAFT";
  capture.mapping["textarea"] = [textarea];
  root.mapping['[data-a1-tutor-draft-capture]'] = [capture];
  root.mapping['textarea, input:not([type=checkbox]):not([type=radio]), [contenteditable=true]'] = [textarea];
  withDocument(root, () => sanitizeA1PrintDocument());
  const section = capture.replacement;
  assert.equal(section.getAttribute("data-a1-pdf-draft-answer-space"), "teil-2");
  const ruled = section.children[1];
  assert.equal(ruled.getAttribute("data-a1-pdf-writing-space"), "true");
  assert.equal(ruled.children.filter((child) => child.getAttribute("data-a1-pdf-answer-rule") === "").length, 8);
  assert.equal(textarea.value, "");
  assert.equal(textarea.textContent, "");
});

test("Chapter 3 native selects clear selectedIndex, value and option selections", () => {
  const root = new Element("MAIN");
  const select = new Element("SELECT");
  select.value = "gern"; select.selectedIndex = 1;
  const a = new Element("OPTION"), b = new Element("OPTION");
  a.selected = false; a.defaultSelected = false;
  b.selected = true; b.defaultSelected = true;
  b.setAttribute("selected", "");
  select.options = [a, b];
  root.mapping["select"] = [select];
  withDocument(root, () => sanitizeA1PrintDocument());
  assert.equal(select.value, "");
  assert.equal(select.selectedIndex, -1);
  assert.equal(b.selected, false);
  assert.equal(b.defaultSelected, false);
  assert.equal(b.getAttribute("selected"), null);
});


test("Ten short answers retain pagination flexibility without losing individual blanks", () => {
  const root = new Element("MAIN");
  const capture = new Element("SECTION");
  capture.setAttribute("data-a1-tutor-draft-capture", "teil-1");
  const fields = Array.from({ length: 10 }, () => new Element("INPUT"));
  capture.mapping['input[type="text"],input:not([type])'] = fields;
  root.mapping['[data-a1-tutor-draft-capture]'] = [capture];
  withDocument(root, () => sanitizeA1PrintDocument());
  const blank = capture.replacement;
  assert.equal(blank.children.length, 11);
  assert.doesNotMatch(blank.style.cssText, /page-break-inside:avoid/);
});


test("Day 19 sanitizer keeps the whole Confidence Lab when a nested main contains the private mock", () => {
  const lab = new Element("DIV");
  lab.setAttribute("data-a1-speaking-confidence-lab", "true");
  const staticLesson = new Element("SECTION", "Teil 1 Sich vorstellen; Teil 2 Fragekarten; Teil 3 höfliche Bitten");
  const mock = new Element("MAIN");
  mock.setAttribute("data-speaking-mock", "A1");
  mock.children = [new Element("SECTION", "Private assessment Session: uid-123 100%")];
  lab.children = [staticLesson, mock];
  lab.mapping["[data-speaking-mock]"] = [mock];

  withDocument(lab, () => sanitizeA1PrintDocument(), mock);
  assert.equal(lab.children[0], staticLesson);
  assert.equal(staticLesson.textContent, "Teil 1 Sich vorstellen; Teil 2 Fragekarten; Teil 3 höfliche Bitten");
  assert.equal(mock.getAttribute("data-a1-pdf-speaking-prompt"), "true");
  assert.equal(mock.children.length, 5);
});

test("Day 19 readiness inspects the lesson wrapper, not the short nested speaking main", () => {
  const lab = new Element("DIV");
  lab.setAttribute("data-a1-speaking-confidence-lab", "true");
  lab.innerText = "Goethe A1 Speaking Confidence Lab. ".repeat(16);
  const mock = new Element("MAIN");
  mock.innerText = "Checking your speaking progress.";
  const headings = Array.from({ length: 4 }, () => ({
    getClientRects: () => [1],
  }));
  lab.mapping["h1,h2,h3"] = headings;
  const oldWindow = globalThis.window;
  const oldNodeFilter = globalThis.NodeFilter;
  withDocument(lab, () => {
    globalThis.window = { getComputedStyle: () => ({ display: "block", visibility: "visible" }) };
    globalThis.NodeFilter = { SHOW_TEXT: 4 };
    const oldWalker = globalThis.document.createTreeWalker;
    globalThis.document.createTreeWalker = () => ({ nextNode: () => null });
    try {
      const state = inspectA1PrintDocument();
      assert.equal(state.sectionHeadings, 4);
      assert.ok(state.textLength > 160);
      assert.equal(isA1PrintContentReady(state), true);
      assert.equal(mock.innerText.length < 160, true);
    } finally {
      globalThis.document.createTreeWalker = oldWalker;
      if (oldWindow === undefined) delete globalThis.window;
      else globalThis.window = oldWindow;
      if (oldNodeFilter === undefined) delete globalThis.NodeFilter;
      else globalThis.NodeFilter = oldNodeFilter;
    }
  }, mock);
});


test("Classmate biographies on Days 3 and 5 are excluded, but blank writing space remains", () => {
  const root = new Element("MAIN");
  const editor = new Element("FORM");
  editor.setAttribute("data-a1-print-private", "biography-editor");
  editor.textContent = "Private saved introduction";
  const classmates = new Element("SECTION");
  classmates.setAttribute("data-a1-print-private", "class-introductions");
  classmates.textContent = "Class introductions · Student A · their real biography";
  const instruction = new Element("SPAN", "Your work saves to Class Members");
  instruction.setAttribute("data-a1-print-private", "biography-online-explanation");
  const live = new Element("DIV", "Class response · real classmates");
  live.setAttribute("data-a1-print-private", "live-class-response");
  root.mapping["[data-a1-print-private]"] = [editor, classmates, instruction, live];
  withDocument(root, () => sanitizeA1PrintDocument());
  assert.equal(classmates.removed, true);
  assert.equal(live.removed, true);
  assert.equal(editor.replacement.getAttribute("data-a1-pdf-writing-space"), "true");
  assert.equal(editor.replacement.children.length, 8); // heading, instructions, 6 blank ruled lines
  assert.equal(instruction.getAttribute("data-a1-print-private"), null);
  assert.equal(instruction.textContent, "Schreiben Sie Ihre Vorstellung auf die Linien unten.");
});

test("Days 5 and 6 class-shared writing is replaced with printable ruled answers", () => {
  const root = new Element("MAIN");
  const scrambled = new Element("DIV", "Private class sentences and member names");
  scrambled.setAttribute("data-a1-print-private", "scrambled-class-contribution");
  const family = new Element("SECTION", "Private family answers");
  family.setAttribute("data-a1-print-private", "family-group-discussion");
  root.mapping["[data-a1-print-private]"] = [scrambled, family];
  withDocument(root, () => sanitizeA1PrintDocument());
  assert.ok(scrambled.removed && family.removed);
  assert.equal(scrambled.replacement.children.filter(x => x.getAttribute("data-a1-pdf-answer-rule") === "").length, 11);
  assert.equal(family.replacement.children.filter(x => x.getAttribute("data-a1-pdf-answer-rule") === "").length, 9);
});

test("final PDF privacy guard blocks exact leakage types seen on pages 46–47, 74–75, 78, 84–85", () => {
  const samples = [
    ["A1 Berlin Klasse introductions   1", "classmate biographies"],
    ["What Your Classmates Shared", "class-shared writing"],
    ["No classmates have shared an answer yet.", "class-shared writing"],
    ["This updates the same biography shown on the Class Members page", "classmate biographies"],
    ["Class response · not graded", "live class results"],
    ["Saved to Group Discussion", "live class results"],
  ];
  for (const [source, category] of samples) {
    assert.ok(findA1PrintPrivacyLeaks(source).includes(category), source);
  }
  assert.deepEqual(findA1PrintPrivacyLeaks("Teil 2 · Hören: Schreiben Sie fünf Antworten auf die Linien."), []);
});
