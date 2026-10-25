import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { countA2BodyInk, pruneA2TrulyBlankSectionPages } from "./pruneA2BlankSectionPages.mjs";

test("A2 raster audit measures content in body, not margin/footer", () => {
  const width = 100, height = 100;
  const pixels = Buffer.alloc(width * height, 255);
  for (let i = 0; i < 20; i++) pixels[40 * width + 30 + i] = 0;
  // The footer alone never makes an empty page contentful.
  for (let i = 0; i < 50; i++) pixels[98 * width + i] = 0;
  const pgm = Buffer.concat([
    Buffer.from(`P5\n${width} ${height}\n255\n`),
    pixels,
  ]);
  assert.equal(countA2BodyInk(pgm), 20);
  assert.throws(() => countA2BodyInk(Buffer.from("garbled")), /P5 grayscale/);
});

test("A2 private section printer removes only empty pages, preserving text and writing lines", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "falowen-a2-blank-section-"));
  try {
    const file = path.join(dir, "section.pdf");
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    pdf.addPage([595.28, 841.89]); // Truly empty, must remove.
    const textPage = pdf.addPage([595.28, 841.89]);
    textPage.drawText("Falowen A2 textbook content and exercise question", {
      x: 65, y: 650, font, size: 13,
    });
    const writePage = pdf.addPage([595.28, 841.89]);
    for (let i = 0; i < 6; i++) {
      const y = 660 - i * 42;
      writePage.drawLine({
        start: { x: 65, y }, end: { x: 530, y },
        color: rgb(0.55, 0.60, 0.65), thickness: 1,
      });
    }
    pdf.addPage([595.28, 841.89]); // Truly empty, must remove.
    fs.writeFileSync(file, await pdf.save());

    const notices = [];
    const report = await pruneA2TrulyBlankSectionPages(file, {
      log: message => notices.push(message),
    });
    assert.equal(report.removed, 2);
    assert.equal(report.retainedGraphicsOnly, 1);
    assert.equal(report.pages, 2);
    const printed = await PDFDocument.load(fs.readFileSync(file));
    assert.equal(printed.getPageCount(), 2);
    assert.ok(notices.some(s => /verified empty/.test(s)));
    assert.ok(notices.some(s => /answer-line/.test(s)));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("A2 section printer fails closed rather than deleting a fully empty section", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "falowen-a2-no-missing-content-"));
  try {
    const file = path.join(dir, "empty.pdf");
    const pdf = await PDFDocument.create();
    pdf.addPage([595.28, 841.89]);
    fs.writeFileSync(file, await pdf.save());
    await assert.rejects(
      pruneA2TrulyBlankSectionPages(file),
      /entirely blank/,
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
