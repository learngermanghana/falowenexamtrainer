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
  assert.match(css, /\[data-a1-pdf-hide-ui\]/);
  assert.match(css, /\[data-a1-chapter3-draft-guidance\]/);
  assert.match(css, /display: none !important/);
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


test("printed A1 lesson removes app chrome and shrinks only decorative cover photos", () => {
  const css = a1PrintCss("workbook");
  assert.match(css, /\.app-header, \.app-header-meta \{ display: none !important/);
  assert.match(css, /data-a1-day13-revision-hero\] > img/);
  assert.match(css, /img\[alt='Train journey through Germany'\]/);
  assert.match(css, /height: 140px !important/);
  assert.doesNotMatch(css, /img \{ max-width: 100% !important; height: auto !important/);
  assert.match(css, /img \{ max-width: 100% !important/);
});

test("printed A1 Day 22 preserves whole listening question cards and Day 19 prompt lines", () => {
  const css = a1PrintCss("workbook");
  assert.match(css, /data-a1-day22-health-teil='3'/);
  assert.match(css, /div:has\(> strong\)/);
  assert.match(css, /break-inside: avoid-page !important/);
  assert.match(css, /data-a1-pdf-speaking-prompt/);
  assert.match(css, /data-a1-pdf-answer-rule/);
});


test("A1 Day 22 printed Hören options are compact and cannot split from their stem", () => {
  const css = a1PrintCss("workbook");
  assert.match(css, /data-a1-day22-health-teil='3'\] > div:has\(> strong\) > span/);
  assert.match(css, /padding: 2px 8px !important/);
  assert.match(css, /min-height: 0 !important/);
  assert.match(css, /font-size: 13px !important; line-height: 1\.25 !important/);
  assert.match(css, /break-inside: avoid-page !important/);
  assert.doesNotMatch(css, /\[data-a1-day22-health-teil='3'\][^{]*\{[^}]*display: none/);
});


test("A1 Day 22 PDF begins the complete Hören section on one page with a smaller QR", () => {
  const css = a1PrintCss("workbook");
  assert.match(css, /data-a1-day22-health-teil='3'\] \{/);
  assert.match(css, /break-before: page !important; page-break-before: always !important/);
  assert.match(css, /data-a1-pdf-audio-companion/);
  assert.match(css, /width: 76px !important; height: 76px !important/);
  assert.match(css, /break-inside: avoid-page !important/);
  assert.doesNotMatch(css, /data-a1-day22-health-teil='3'\][^{]*\{[^}]*display: none/);
});


test("A1 print compresses only Day 5 checklist, Day 6 hobbies quiz and Day 7 grammar quiz", () => {
  const css = a1PrintCss("workbook");
  assert.match(css, /\[data-a1-pdf-day5-selfcheck\] > div/);
  assert.match(css, /line-height: 1\.25 !important; font-size: 12px !important/);
  assert.match(css, /\[data-a1-pdf-day6-hobby-quiz\] button/);
  assert.match(css, /break-inside: avoid-page !important; page-break-inside: avoid !important/);
  assert.match(css, /\[data-a1-pdf-day7-grammar-quiz\] select/);
  assert.match(css, /min-height: 26px !important; height: 26px !important/);
  assert.doesNotMatch(css, /button\s*\{\s*display:\s*none/);
  assert.match(css, /\[data-a1-day22-health-teil='3'\]/);
});
