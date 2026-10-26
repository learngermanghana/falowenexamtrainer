import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { extractPdfPages } from "./pdfPageAudit.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const directory = path.join(root, "artifacts/course-material-bundles/A2");
const sourcePath = process.argv[2] || path.join(directory, "Falowen-A2-Course-Materials.pdf");
const samplePath = process.argv[3] || path.join(directory, "Falowen-A2-Free-Day1-Sample.pdf");

export const findA2SampleRange = extractedText => {
 const pages = extractPdfPages(extractedText);
 const normalize = text => String(text || "").replace(/\s+/g, " ");
 const start = pages.findIndex(text =>
  /A2\s*[·•]?\s*Day\s+1\b/i.test(normalize(text)) &&
  /\bGRAMMAR\b/i.test(text));
 const next = pages.findIndex((text, index) =>
  index > start && /A2\s*[·•]?\s*Day\s+2\b/i.test(normalize(text)) &&
  /\bGRAMMAR\b/i.test(text));
 if (start < 0 || next <= start) {
  throw new Error("A2 Day 1 or Day 2 Grammar divider missing; do not publish an unverified sample.");
 }
 const excerpt = pages.slice(start, next);
 if (excerpt.length < 3 || excerpt.length > 24 ||
   !excerpt.some(text => /\bWORKBOOK\b/i.test(text))) {
  throw new Error("A2 Day 1 sample is incomplete or too long: " + excerpt.length + " pages.");
 }
 return { start, end: next, pages: excerpt.length, sourcePages: pages.length };
};

export const prepareA2Sample = async (input = sourcePath, outputFile = samplePath) => {
 if (path.resolve(input) === path.resolve(outputFile)) throw new Error("Sample must not overwrite the full retail book.");
 if (/[/\\](?:public|dist|build)[/\\]/i.test(outputFile)) {
  throw new Error("Keep generated PDF samples outside the deployed web public directory.");
 }
 const original = await PDFDocument.load(fs.readFileSync(input));
 const text = execFileSync("pdftotext", ["-layout", input, "-"], {
  encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 30000,
 });
 const range = findA2SampleRange(text);
 if (range.sourcePages !== original.getPageCount()) {
  throw new Error("A2 PDF page count did not match extracted text pages.");
 }
 const sample = await PDFDocument.create();
 const bold = await sample.embedFont(StandardFonts.HelveticaBold);
 const regular = await sample.embedFont(StandardFonts.Helvetica);
 const navy = rgb(0.06, 0.14, 0.25), teal=rgb(0.12,0.72,0.68);
 const front=sample.addPage([595.28,841.89]);
 front.drawRectangle({x:0,y:0,width:595.28,height:841.89,color:navy});
 front.drawText("FALOWEN", {x:50,y:751,font:bold,size:27,color:rgb(1,1,1)});
 front.drawText("GERMAN A2", {x:49,y:583,font:bold,size:57,color:teal});
 front.drawText("Grammar Notes & Workbook", {x:49,y:520,font:bold,size:25,color:rgb(1,1,1)});
 front.drawRectangle({x:49,y:397,width:366,height:59,color:teal});
 front.drawText("FREE DAY 1 SAMPLE", {x:65,y:416,font:bold,size:19,color:navy});
 front.drawText("Read actual Grammar and Workbook pages.", {x:49,y:329,font:regular,size:15,color:rgb(0.87,0.93,0.96)});
 front.drawText("falowen.app/books", {x:49,y:89,font:bold,size:16,color:teal});
 const indices=Array.from({length:range.pages},(_,i)=>range.start+i);
 (await sample.copyPages(original,indices)).forEach(page=>{
  sample.addPage(page);
  const copy = sample.getPages().at(-1);
  copy.drawText("FREE FALOWEN A2 SAMPLE", {x:368,y:803,font:bold,size:9,color:navy});
 });
 const last=sample.addPage([595.28,841.89]);
 last.drawRectangle({x:0,y:0,width:595.28,height:841.89,color:navy});
 last.drawText("Continue learning with Falowen", {x:49,y:652,size:26,font:bold,color:rgb(1,1,1)});
 last.drawText("This is only a sample of the full A2 workbook.", {x:49,y:581,size:15,font:regular,color:rgb(1,1,1)});
 last.drawText("Visit falowen.app/books for available titles.", {x:49,y:516,size:17,font:bold,color:teal});
 last.drawText("Audio QR activities may require separate Course Book access.", {x:49,y:89,size:11,font:regular,color:rgb(1,1,1)});
 sample.setTitle("Falowen A2 - Free Day 1 Grammar and Workbook Sample");
 sample.setAuthor("Falowen | Learn Language Education Academy");
 fs.mkdirSync(path.dirname(outputFile), {recursive:true});
 fs.writeFileSync(outputFile, await sample.save());
 return { samplePath:outputFile, excerptPages:range.pages, totalSamplePages:sample.getPageCount() };
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
 prepareA2Sample().then(result => console.log(JSON.stringify(result))).catch(err => {
  console.error(err.message); process.exitCode=1;
 });
}
