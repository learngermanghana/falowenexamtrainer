import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { PDFDocument } from "pdf-lib";
import { findA2PrintSafetyFaults, assertA2PrintSafety } from "./a2PdfSafety.mjs";

const [originalPath, correctedPath, reportPath] = process.argv.slice(2);
if (!originalPath || !correctedPath || !reportPath)
  throw new Error("Usage: compareA2PdfEditions.mjs original.pdf corrected.pdf report.json");

const inspect = async file => {
  const pdf = await PDFDocument.load(fs.readFileSync(file));
  const text = execFileSync("pdftotext", ["-layout",file,"-"], {
    encoding:"utf8",maxBuffer:64*1024*1024,timeout:30000,
  });
  return {pages:pdf.getPageCount(),text,bytes:fs.statSync(file).size};
};
const corrected = await inspect(correctedPath);
assertA2PrintSafety(corrected.text);
const original = fs.existsSync(originalPath) ? await inspect(originalPath) : null;
// Never include the original extracted text, names, answers or images in a
// public log/artifact. Report only aggregate findings and edition identity.
const report = {
  originalRun:"https://github.com/learngermanghana/falowenexamtrainer/actions/runs/40704827225",
  original:original ? {
    pages:original.pages,bytes:original.bytes,matchesReported356Pages:original.pages === 356,
    safetyFindings:findA2PrintSafetyFaults(original.text),
    joinedDay13Text:/wanted\s*todo\b/i.test(original.text),
  } : {available:false,comparisonPending:true},
  corrected:{pages:corrected.pages,bytes:corrected.bytes,safetyFindings:[],
    joinedDay13Text:/wanted\s*todo\b/i.test(corrected.text)},
  reviewOnly:true,
  remainingReview:["Manual comparison of all 28 lessons", "Live listening/audio semantic verification", "Editorial approval before merge or distribution"],
};
fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
  `### A2 PR #3223 review PDF\n\nCorrected PDF: **${corrected.pages} pages**. ` +
  (original ? `Original: **${original.pages} pages**; reported-edition match: **${original.pages === 356}**.` :
    "Original PDF download unavailable; edition comparison remains pending.") +
  "\n\nReview artifact only. No merge, website deployment or payment changes.\n");
