import assert from "node:assert/strict";
import test from "node:test";

import { shouldRetryB1SparseTail, isB1OrphanWorkbookHeaderPage, isB1RedundantNoticeOnlyTail } from "./b1PrintRetry.mjs";
import { B1_PRINT_CSS } from "./b1PdfPrintExtras.mjs";

test("B1 book drops only a provable first-page repeated heading", () => {
  const first = "B1 · Day 1 · Kapitel 1.1\nB1 Workbook · Traumwelt\n";
  const next = "Teil 1 · Sprechen (Group Practice)\n" +
    "Was ist dein Traumberuf und warum? ".repeat(22);
  assert.equal(isB1OrphanWorkbookHeaderPage(first, next, "B1 Day 1 workbook-teil-1"), true);
  assert.equal(isB1OrphanWorkbookHeaderPage(first, next, "B1 Day 1 grammar"), false);
  assert.equal(isB1OrphanWorkbookHeaderPage(first + "Eine wichtige Aufgabe", next, "B1 Day 1 workbook-teil-1"), false);
  assert.equal(isB1OrphanWorkbookHeaderPage(first, "Teil 1 · Sprechen", "B1 Day 1 workbook-teil-1"), false);
  assert.equal(isB1OrphanWorkbookHeaderPage(first, next, "B1 Day 29 workbook-teil-1"), false);
});

test("B1 print retries only an unusually sparse *trailing* exercise page", () => {
  const long = "Hier stehen vollständige Lesefragen und Antworten. ".repeat(14);
  const short = "7. Würde der Erzähler den Film empfehlen? a) Ja. b) Nein. c) Nur unter bestimmten Umständen. d) Er hat es nicht gesagt.";
  assert.equal(shouldRetryB1SparseTail([long, short], 0), true);
  assert.equal(shouldRetryB1SparseTail([long, short], 1), true);
  assert.equal(shouldRetryB1SparseTail([long, short], 2), false);
  assert.equal(shouldRetryB1SparseTail([short], 0), false);
  assert.equal(shouldRetryB1SparseTail([short, long], 0), false);
  assert.equal(shouldRetryB1SparseTail([long, ""], 0), false);
  assert.equal(shouldRetryB1SparseTail([long, short], -1), false);
});

test("B1 print keeps all choices legible while compacting screen touch-target spacing", () => {
  assert.ok(B1_PRINT_CSS.includes('label:has(> input[type="radio"])'));
  assert.ok(B1_PRINT_CSS.includes("line-height: 1.3 !important"));
  assert.ok(B1_PRINT_CSS.includes("[role=\"radiogroup\"]"));
  assert.doesNotMatch(B1_PRINT_CSS, /input\[type="radio"\]\s*\{\s*display:\s*none/i);
});

test("B1 trailing cleanup removes only the standard duplicate note, never reading or listening questions", () => {
  const note = "Schriftliche Übungen können Sie auf Papier bearbeiten. Audio und benotete Abgabe bleiben in der Falowen-Lektion.";
  const content = "Lesen Sie die Fragen, hören Sie zu und beantworten Sie alle fünf Aufgaben. ".repeat(12);
  assert.equal(isB1RedundantNoticeOnlyTail(note, content, "B1 Day 2 teil-4 companion"), true);
  assert.equal(isB1RedundantNoticeOnlyTail(note, content, "B1 Day 2 workbook-teil-4"), false);
  assert.equal(isB1RedundantNoticeOnlyTail(note, note, "B1 Day 2 teil-4 companion"), false);
  assert.equal(isB1RedundantNoticeOnlyTail("1. Was haben die Freunde gemacht? " + note, content, "B1 Day 2 teil-4 companion"), false);
  assert.equal(isB1RedundantNoticeOnlyTail(note, content, "B1 Day 29 teil-4 companion"), false);
});
