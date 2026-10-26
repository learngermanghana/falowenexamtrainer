import test from "node:test";
import assert from "node:assert/strict";
import { auditA2PdfPages } from "./auditA2PdfPages.mjs";

test("A2 final PDF audit rejects actual blank pages after stripping only page footers", () => {
  const pages = [
    "A2 Day 1 GRAMMAR real lesson text with conjugation examples",
    "Falowen Learning Hub 2 / 3",
    "A2 Day 1 WORKBOOK meaningful printed content",
  ].join("\f") + "\f";
  const audit = auditA2PdfPages(pages, 3, "/private.pdf", {
    countInk: (file, page) => page === 2 ? 0 : 1000,
  });
  assert.equal(audit.count, 3);
  assert.deepEqual(audit.faults, ["Page 2 has no meaningful printable content"]);
  assert.deepEqual(audit.retainedGraphics, []);
});

test("A2 final PDF audit accepts a genuinely drawn worksheet but not loading UI", () => {
  const pages = [
    "Falowen Learning Hub 1 / 2",
    "Loading the app\nFalowen Learning Hub 2 / 2",
  ].join("\f") + "\f";
  const audit = auditA2PdfPages(pages, 2, "/private.pdf", {
    countInk: () => 950,
  });
  assert.deepEqual(audit.retainedGraphics, [1]);
  assert.ok(audit.faults.some(f => /React loading screen/.test(f)));
});
