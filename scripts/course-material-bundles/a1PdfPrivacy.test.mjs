import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeA1PrintDocument, findA1PrintPrivacyLeaks } from "./a1PdfPrivacy.mjs";

test("privacy preflight rejects real class discussions, drafts, and speaking sessions", () => {
  assert.deepEqual(findA1PrintPrivacyLeaks("Class contributions\nStudent A\nMy answer"), ["class contributions"]);
  assert.ok(findA1PrintPrivacyLeaks("Save to class discussion").includes("class discussion save"));
  assert.ok(findA1PrintPrivacyLeaks("Loading speaking practice").includes("saved speaking session"));
  assert.ok(findA1PrintPrivacyLeaks("Assignment draft · Not submitted").includes("student draft or submission"));
  assert.ok(findA1PrintPrivacyLeaks("Mark My Informal Letter").includes("interactive marking widget"));
  assert.deepEqual(findA1PrintPrivacyLeaks("Teil 1 · Lesen. Lesen Sie den Text und beantworten Sie die Fragen."), []);
});

test("print DOM sanitizer removes private contribution widgets and replaces loaded letters", () => {
  const originalDocument = globalThis.document;
  class Node {
    constructor(tag = "DIV", text = "") {
      this.tagName = tag; this.textContent = text; this.children = []; this.attributes = {};
      this.style = {}; this.parentElement = null; this.removed = false; this.replacement = null;
    }
    setAttribute(k,v) { this.attributes[k] = v; }
    getAttribute(k) { return this.attributes[k] || ""; }
    removeAttribute(k) { delete this.attributes[k]; }
    append(...children) { this.children.push(...children); for(const c of children) c.parentElement = this; }
    remove() { this.removed = true; }
    replaceWith(node) { this.replacement = node; this.removed = true; }
    matches(selector) { return selector === "[contenteditable=true]" ? Boolean(this.editable) : false; }
    querySelectorAll() { return []; }
  }
  const contribution = new Node("DIV", "Class contributions Student A: private answer");
  const controls = new Node("DIV", "Save to class discussion, Class A1");
  const letter = new Node("SECTION", "Private saved letter draft");
  letter.setAttribute("data-letter-type", "formal");
  const draft = new Node("SECTION", "Saved typed answers");
  const speaking = new Node("SECTION", "Saved speaking session and grade");
  const input = new Node("TEXTAREA", "Private written response"); input.value = "Private written response";
  const selected = {
    '[data-a1-course-book-letter-practice]': [letter],
    '[data-a1-tutor-draft-capture]': [draft],
    '[data-a1-tutor-speaking-checkpoint], [data-live-speak-entry], [data-a1-speaking-practice="embedded"]': [speaking],
    '[data-a1-live-contributions], [data-a1-live-discussion-controls]': [contribution, controls],
    'textarea, input:not([type=checkbox]):not([type=radio]), [contenteditable=true]': [input],
  };
  const root = new Node("MAIN");
  root.querySelectorAll = (selector) => selected[selector] || [];
  globalThis.document = { querySelector: (s) => s === "main" ? root : null, body: root, createElement: (tag) => new Node(tag.toUpperCase()) };
  try {
    sanitizeA1PrintDocument();
    assert.equal(contribution.removed, true);
    assert.equal(controls.removed, true);
    assert.equal(draft.removed, true);
    assert.equal(speaking.removed, true);
    assert.equal(letter.removed, true);
    assert.equal(letter.replacement.getAttribute("data-a1-pdf-writing-space"), "true");
    assert.equal(letter.replacement.children.length, 12); // heading, help, 10 blank lines
    assert.equal(input.value, "");
    assert.equal(input.textContent, "");
  } finally {
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  }
});
