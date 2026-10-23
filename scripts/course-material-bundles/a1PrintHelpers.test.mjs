import assert from "node:assert/strict";
import test from "node:test";
import { a1PrintCss, isA1PdfReadyText, printableA1TabLabels } from "./a1PrintHelpers.mjs";
import { extractPdfPages, scanPdfPageContent } from "./pdfPageAudit.mjs";

test("print CSS shows native Teil panels without deleting choice buttons", () => {
  const css = a1PrintCss();
  assert.match(css, /data-workbook-panel\^="teil-"/);
  assert.match(css, /visibility: visible !important/);
  assert.match(css, /button:not\(\[type="submit"\]\):not\(\[role="tab"\]\)/);
  assert.doesNotMatch(css, /,\s*button,\s*input\[type="checkbox"\]/);
  assert.match(css, /data-workbook-panel="overview"/);
  const grammarCss = a1PrintCss("grammar");
  assert.match(grammarCss, /data-workbook-panel="grammar"\] \{ display: block !important/);
  assert.match(grammarCss, /data-workbook-panel\^="teil-"\]/);
});

test("printed exercise selection excludes overview and final submit", () => {
  assert.deepEqual(printableA1TabLabels(["Overview", "Teil 1 · Lesen", "Teil 2", "Submit", "Teil 2", "Review & Submit"]), ["Teil 1 · Lesen", "Teil 2"]);
});

test("course PDF readiness rejects loading shells", () => {
  assert.equal(isA1PdfReadyText("Loading the app…"), false);
  assert.equal(isA1PdfReadyText("Please wait…"), false);
  assert.equal(isA1PdfReadyText("A1 workbook: " + "Read and answer these ten German practice questions. ".repeat(5)), true);
});

test("PDF preflight rejects pages containing only a footer or loading screen", () => {
  const pdf = [
    "FALOWEN A1 Grammar Notes and Workbook",
    "Loading the app… Falowen Learning Hub 2 / 4",
    "Falowen Learning Hub 3 / 4",
    "Guten Tag. Lesen Sie bitte den Text und beantworten Sie die Fragen.",
  ].join("\f") + "\f";
  const result = scanPdfPageContent(pdf, 4);
  assert.deepEqual(extractPdfPages(pdf).length, 4);
  assert.match(result.faults.join("; "), /Page 2 contains a React loading screen/);
  assert.match(result.faults.join("; "), /Page 3 has no meaningful printable content/);
  assert.equal(result.faults.some((fault) => /Page 4/.test(fault)), false);
});

test("PDF preflight detects page-count mismatches", () => {
  assert.match(scanPdfPageContent("One page\f", 2).faults[0], /Expected 2 PDF pages/);
});
