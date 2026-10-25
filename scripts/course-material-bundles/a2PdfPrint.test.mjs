import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { a2PrintCss, a2SectionReady, findA2PdfLeaks } from "./a2PdfPrint.mjs";
import { findA2SampleRange } from "./prepareA2Sample.mjs";

const dir=path.dirname(fileURLToPath(import.meta.url));
const renderer=fs.readFileSync(path.join(dir,"renderLevelBundleV2.mjs"),"utf8");
const validator=fs.readFileSync(path.join(dir,"validateGeneratedBundle.mjs"),"utf8");

test("A2 multiple-choice answer buttons and checkbox labels survive print CSS",()=>{
 assert.match(a2PrintCss,/button:not\(\[type="submit"\]\)/);
 assert.match(a2PrintCss,/input\[type="checkbox"\]/);
 assert.match(a2PrintCss,/data-a2-pdf-choice-key/);
 assert.doesNotMatch(a2PrintCss,/(?:^|\n)\s*button\s*,/m);
 assert.match(a2PrintCss,/break-inside: auto/);
 assert.match(a2PrintCss,/data-course-inline-practice/);
 assert.match(a2PrintCss,/data-workbook-tab-navigation/);
 const sanitizer=fs.readFileSync(path.join(dir,"a2PdfPrint.mjs"),"utf8");
 assert.match(sanitizer,/section === "workbook-teil-2"/);
 assert.match(sanitizer,/Schreiben · Your answer/);
});

test("A2 print is triggered from Playwright only, other levels keep prior CSS",()=>{
 assert.match(renderer,/if \(level === "A2"\) return page\.addStyleTag\(\{ content: a2PrintCss \}\)/);
 assert.match(renderer,/await page\.evaluate\(sanitizeA2PrintDocument\)/);
 assert.match(renderer,/waitForA2PrintableSection\(page, lesson, suffix\)/);
 assert.match(renderer,/addA2RetailCover\(output\)/);
 assert.match(renderer,/level === "A2" && await page\.getByRole\("tab"/);
 assert.match(renderer,/return \[grammar, \{ tab: "workbook", file: workbookFile \}\]/);
});

test("A2 section readiness rejects loading shell and wrong panel",()=>{
 const words="The German task explains how to use connectors and gives learners a detailed example. ".repeat(4);
 assert.equal(a2SectionReady("teil-1",{headings:["Teil 1 · Sprechen"],text:words}),true);
 assert.equal(a2SectionReady("teil-3",{headings:["Teil 2 · Schreiben"],text:words}),false);
 assert.equal(a2SectionReady("grammar",{headings:["Grammar"],text:"Loading the app "+words}),false);
 assert.equal(a2SectionReady("grammar",{headings:["Adjective Declension"],text:words,grammarVisible:true}),true);
 assert.equal(a2SectionReady("grammar",{headings:["A2 workbook"],text:words,grammarVisible:false}),false);
 assert.equal(a2SectionReady("teil-4",{headings:["Hören · Aufgabe"],text:words}),true);
 assert.equal(a2SectionReady("teil-3",{headings:["Lesen"],text:"A2"}),false);
});

test("A2 text validation detects privacy and app status placeholders",()=>{
 assert.deepEqual(findA2PdfLeaks("Write and share with your class"),["shared class answers"]);
 assert.deepEqual(findA2PdfLeaks("Your saved answers and your final score"),["saved student draft","private learner assessment"]);
 assert.deepEqual(findA2PdfLeaks("Teil 2 Schreiben: Write an email to a friend."),[]);
 assert.match(validator,/if \(level === "A2"\)/);
 assert.match(validator,/scanPdfPageContent\(text, pdf\.getPageCount\(\)\)/);
 assert.match(validator,/findA2PdfLeaks\(text\)/);
});

test("free sample comes from the actual Day 1 Grammar and Workbook, not the full PDF",()=>{
 const pages=[
 "DEUTSCH A2","Contents Day 1","Contents continued",
 "A2 · Day 1 Grammar\nLong German grammar content",
 "A2 Day 1 Workbook\nTeil 1 Sprechen","Teil 2 Schreiben and Teil 3 Lesen",
 "A2 · Day 2 Grammar\nNext lesson",
 "A2 Day 2 Workbook",
 ].join("\f")+"\f";
 assert.deepEqual(findA2SampleRange(pages),{start:3,end:6,pages:3,sourcePages:8});
 assert.throws(()=>findA2SampleRange("A2 Day 1 GRAMMAR\fA2 Day 2 GRAMMAR\f"),/incomplete/);
 assert.throws(()=>findA2SampleRange("Contents\fNothing\f"),/divider missing/);
});
