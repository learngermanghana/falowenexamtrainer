import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { PNG } from "pngjs";
import { PDFDocument } from "pdf-lib";
import { A2_PRINT_CSS, prepareA2SafePrintView, restoreA2SafePrintView, assertA2PrintSafety, assertA2PrintedContent } from "./a2PdfSafety.mjs";
import { buildA2ReadOnlyPrintHtml, getA2ReadOnlyParts } from "./a2PrintableCompanions.mjs";
import { getA2PdfLessonCompanionUrl } from "./a2PdfPrintExtras.mjs";

let browser, dir;
before(async () => {
  browser = await chromium.launch({executablePath:process.env.FALOWEN_PDF_CHROMIUM || undefined,
    args:["--no-sandbox", "--disable-dev-shm-usage"]});
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "falowen-a2-print-test-"));
});
after(async () => { await browser?.close(); if (dir) fs.rmSync(dir, {recursive:true, force:true}); });

test("print redaction removes complete private widgets, preserves examples and restores original DOM", async () => {
  const page = await browser.newPage();
  try {
    await page.setContent(`<main><h1>Grammatik</h1><p>Beispiel: Ich konnte schwimmen.</p>
      <p>In job interviews, you often describe what you <em>wanted to</em>do in the past.</p>
      <p>What could, had to, or wanted to happen in the past?</p>
      <aside data-teacher-only>PRIVATE_TEACHER_NOTES</aside>
      <div data-course-inline-practice="writing"><textarea>PRIVATE_DRAFT</textarea><p>PRIVATE_MARKING</p></div>
      <section><strong>Write and share with your class</strong><textarea>PRIVATE_OWN_ANSWER</textarea>
        <strong>What Your Classmates Shared</strong><p>PRIVATE_CLASSMATE</p></section>
      <details open><summary>Lösungen</summary>EXPOSED_KEY</details>
      <details><summary>Grammatikbeispiele</summary><p>Worked example: Ich musste arbeiten.</p></details>
      <textarea>PRIVATE_NOTES</textarea><input value="PRIVATE_NAME">
      <label><input type="radio" checked> A. Brot</label><label><input type="radio"> B. Milch</label>
      <div style="max-height:10px;overflow:hidden"><article style="height:180px"><p>FIRST_INSTRUCTION</p><p>LAST_INSTRUCTION</p></article></div>
      </main>`);
    const original = await page.content();
    await page.emulateMedia({media:"print"});
    await page.addStyleTag({content:A2_PRINT_CSS});
    await page.evaluate(prepareA2SafePrintView);
    const visible = await page.locator("body").innerText();
    assert.doesNotMatch(visible, /PRIVATE_|EXPOSED_KEY/);
    assert.match(visible, /Beispiel: Ich konnte schwimmen/);
    assert.match(visible, /Worked example: Ich musste arbeiten/);
    assert.match(visible, /wanted to do in the past/);
    assert.match(visible, /What were you able to do/);
    assert.match(visible, /A\. Brot[\s\S]*B\. Milch/);
    assert.equal(await page.locator("input:checked").count(), 0);
    await page.pdf({path:path.join(dir,"redacted.pdf"),format:"A4"});
    const text = execFileSync("pdftotext", [path.join(dir,"redacted.pdf"),"-"], {encoding:"utf8"});
    assert.doesNotMatch(text, /PRIVATE_|EXPOSED_KEY/);
    assert.match(text, /LAST_INSTRUCTION/);
    await page.evaluate(restoreA2SafePrintView);
    const restored = await page.content();
    // The test's injected style is external to the reversible sanitizer.
    assert.equal(restored.replace(/<style\b[^>]*>[\s\S]*?<\/style>/, ""), original);
  } finally { await page.close(); }
});

test("all 28 days render complete canonical A2 companions and every printed Hören QR decodes to its lesson", async () => {
  const page = await browser.newPage();
  const merged = await PDFDocument.create();
  let sections = 0, qrCount = 0;
  try {
    for (let day = 1; day <= 28; day++) {
      const parts = day === 22 ? ["grammar", "workbook"] : await getA2ReadOnlyParts(day);
      for (const part of parts) {
        const lessonUrl = getA2PdfLessonCompanionUrl(`/campus/course/lesson/A2/${day}`);
        const audioQrDataUrl = part === "teil-4" ? await QRCode.toDataURL(lessonUrl, {width:160, margin:1, errorCorrectionLevel:"M"}) : "";
        await page.setContent(await buildA2ReadOnlyPrintHtml({day,part,lesson:{title:`Tag ${day}`},lessonUrl,audioQrDataUrl}));
        const expected = await page.locator("body").innerText();
        const file = path.join(dir, `${day}-${part}.pdf`);
        await page.pdf({path:file,format:"A4",printBackground:true,preferCSSPageSize:true});
        const text = execFileSync("pdftotext", ["-layout",file,"-"], {encoding:"utf8"});
        assertA2PrintSafety(text);
        try { assertA2PrintedContent(expected, text); }
        catch (error) { throw new Error(`Day ${day} ${part}: ${error.message}`); }
        if (part === "teil-4") {
          // Decode the QR from the PDF raster, not just the source data URL.
          execFileSync("pdftoppm", ["-f","1","-l","1","-r","120","-png","-singlefile",file,path.join(dir,"qr")]);
          const png = PNG.sync.read(fs.readFileSync(path.join(dir,"qr.png")));
          assert.equal(jsQR(new Uint8ClampedArray(png.data),png.width,png.height)?.data, lessonUrl);
          qrCount++;
        }
        const pdf = await PDFDocument.load(fs.readFileSync(file));
        for (const printed of await merged.copyPages(pdf,pdf.getPageIndices())) merged.addPage(printed);
        sections++;
      }
    }
    assert.ok(qrCount > 0);
    console.log(JSON.stringify({days:28,sections,verifiedPrintedQrCodes:qrCount,companionProofPages:merged.getPageCount()}));
    // This is an offline companion proof, NOT the complete authenticated book.
    if (process.env.FALOWEN_A2_COMPANION_PROOF) fs.writeFileSync(process.env.FALOWEN_A2_COMPANION_PROOF, await merged.save());
  } finally { await page.close(); }
});
