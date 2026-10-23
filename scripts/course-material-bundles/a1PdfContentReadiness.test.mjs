import assert from "node:assert/strict";
import test from "node:test";
import {
  isUnresolvedA1LessonLabel, scanA1PrintText, isA1PrintContentReady,
} from "./a1PdfContentReadiness.mjs";
import { scanPdfPageContent } from "./pdfPageAudit.mjs";

test("detects the exact lazy-load placeholder in the supplied A1 grammar and workbook pages", () => {
  assert.equal(isUnresolvedA1LessonLabel("Loading…"), true);
  assert.equal(isUnresolvedA1LessonLabel("  Loading...  "), true);
  assert.equal(isUnresolvedA1LessonLabel("Lädt …"), true);
  assert.deepEqual(scanA1PrintText("A1 Day 1 Grammar\nLoading…\nFalowen Learning Hub"), ["Loading…"]);
  assert.equal(isUnresolvedA1LessonLabel("Loading and submitting assignments"), false);
});

test("rejects a page with a long authenticated header but an unresolved lesson", () => {
  assert.equal(isA1PrintContentReady({ unresolved: ["Loading…"], textLength: 650, sectionHeadings: 3 }), false);
  assert.equal(isA1PrintContentReady({ unresolved: [], textLength: 650, sectionHeadings: 2 }), true);
  assert.equal(isA1PrintContentReady({ unresolved: [], textLength: 80, sectionHeadings: 1 }), false);
});

test("PDF audit catches rendered lesson loaders and protected audio statuses", () => {
  const pages = [
    "A1 Day 1\nGrammar book · continue to workbook\nLoading…\nFalowen Learning Hub 5 / 3",
    "A1 Day 18 Lesen\nAudio wird geladen …\nWelche Farbe hat die Lampe?\nFalowen Learning Hub 2 / 3",
    "A1 Day 2 Schreiben\nWrite a paragraph about your name and home.\nFalowen Learning Hub 3 / 3",
  ].join("\f") + "\f";
  const audit = scanPdfPageContent(pages, 3);
  assert.match(audit.faults.join("\n"), /Page 1 contains an unresolved lesson Loading placeholder/);
  assert.match(audit.faults.join("\n"), /Page 2 contains an unresolved audio-loading placeholder/);
  assert.ok(!audit.faults.some((fault) => fault.startsWith("Page 3")));
});
