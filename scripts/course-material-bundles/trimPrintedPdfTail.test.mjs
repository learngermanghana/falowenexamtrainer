import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { isVisuallyEmptyPgm, trimPrintedPdfTail } from "./trimPrintedPdfTail.mjs";

const withFixture = async (create, verify) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "falowen-a1-print-fixture-"));
  const filename = path.join(dir, "lesson.pdf");
  try {
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    await create(pdf, font);
    fs.writeFileSync(filename, await pdf.save());
    await verify(filename);
  } finally {
    fs.rmSync(dir, { force: true, recursive: true });
  }
};

test("recognizes actual white PGM pixels, not dark graphics", () => {
  const head = Buffer.from("P5\n2 2\n255\n", "ascii");
  assert.equal(isVisuallyEmptyPgm(Buffer.concat([head, Buffer.from([250, 250, 244, 255])])), true);
  assert.equal(isVisuallyEmptyPgm(Buffer.concat([head, Buffer.from([255, 255, 30, 255])])), false);
  assert.throws(() => isVisuallyEmptyPgm(Buffer.from("not a grayscale image")), /Expected/);
});

test("removes a trailing blank printed page while keeping the written lesson", async () => {
  await withFixture(async (pdf, font) => {
    const page = pdf.addPage([595.28, 841.89]);
    page.drawText("Lesson: Guten Morgen und Guten Tag", { x: 60, y: 700, font, size: 17 });
    pdf.addPage([595.28, 841.89]);
  }, async (filename) => {
    const result = await trimPrintedPdfTail(filename, { description: "fixture" });
    assert.deepEqual(result, { before: 2, after: 1, removed: 1 });
    const output = await PDFDocument.load(fs.readFileSync(filename));
    assert.equal(output.getPageCount(), 1);
  });
});

test("never removes a meaningful image-free vector exercise page", async () => {
  await withFixture(async (pdf, font) => {
    const first = pdf.addPage([595.28, 841.89]);
    first.drawText("Read the instructions", { x: 60, y: 700, font });
    const graphic = pdf.addPage([595.28, 841.89]);
    graphic.drawRectangle({ x: 90, y: 100, width: 300, height: 400, color: rgb(0, 0, 0) });
  }, async (filename) => {
    const result = await trimPrintedPdfTail(filename, { description: "vector exercise" });
    assert.equal(result.removed, 0);
    assert.equal((await PDFDocument.load(fs.readFileSync(filename))).getPageCount(), 2);
  });
});

test("never silently discards blank interior pages or all pages", async () => {
  await withFixture(async (pdf, font) => {
    pdf.addPage().drawText("Day 1: Greetings and well-being", { x: 50, y: 700, font });
    pdf.addPage();
    pdf.addPage().drawText("Day 2: Read the exercise", { x: 50, y: 700, font });
  }, async (filename) => {
    const result = await trimPrintedPdfTail(filename, { description: "interior blank" });
    assert.equal(result.removed, 0);
    assert.equal(result.after, 3);
  });
});


test("Day 14 removes only its first white chrome-only page, preserving exercises", async () => {
  await withFixture(async (pdf, font) => {
    const chrome = pdf.addPage([595.28, 841.89]);
    chrome.drawText("Falowen FA", { x: 38, y: 780, font });
    chrome.drawRectangle({
      x: 50, y: 80, width: 495, height: 590,
      color: rgb(1, 1, 1), borderColor: rgb(0.93, 0.94, 0.96), borderWidth: 1,
    });
    const lesson = pdf.addPage([595.28, 841.89]);
    lesson.drawText("A1 Day 14 Modalverben workbook: Write five sentences", { x: 60, y: 690, font });
  }, async (filename) => {
    const trimmed = await trimPrintedPdfTail(filename, { description: "Day 14 workbook" });
    assert.equal(trimmed.removed, 1);
    assert.equal(trimmed.after, 1);
    const output = await PDFDocument.load(fs.readFileSync(filename));
    assert.equal(output.getPageCount(), 1);
  });
});

test("Day 14 preserves graphical-only worksheet pages with real central artwork", async () => {
  await withFixture(async (pdf, font) => {
    const card = pdf.addPage([595.28, 841.89]);
    card.drawText("Falowen FA", { x: 38, y: 780, font });
    card.drawRectangle({ x: 120, y: 200, width: 170, height: 290, color: rgb(0.02, 0.1, 0.2) });
    pdf.addPage().drawText("Complete the exercise", { x: 50, y: 700, font });
  }, async (filename) => {
    const result = await trimPrintedPdfTail(filename, { description: "Day 14 workbook" });
    assert.equal(result.removed, 0);
    assert.equal(result.after, 2);
  });
});

test("A2 trims only a trailing read-only notice page after substantive exercise content", async () => {
  await withFixture(async (pdf, font) => {
    const exercise = pdf.addPage([595.28, 841.89]);
    exercise.drawText("Hörverstehen. Lesen Sie die fünf Fragen. Wählen Sie A, B oder C.",
      { x: 50, y: 710, font, size: 12 });
    exercise.drawText("Begründen Sie Ihre Wahl. Schreiben Sie die Antworten und besprechen Sie diese im Unterricht.",
      { x: 50, y: 680, font, size: 12 });
    pdf.addPage([595.28, 841.89]).drawText(
      "Read-only printed practice. Submit graded coursework in Falowen.",
      { x: 38, y: 810, font, size: 9 },
    );
  }, async (filename) => {
    const trimmed = await trimPrintedPdfTail(filename, { description: "A2 Day 10 teil-4 companion" });
    assert.deepEqual(trimmed, { before: 2, after: 1, removed: 1 });
    const output = await PDFDocument.load(fs.readFileSync(filename));
    assert.equal(output.getPageCount(), 1);
  });
});

test("A2 print tail cleanup keeps generic notice pages outside a read-only Teil companion", async () => {
  await withFixture(async (pdf, font) => {
    pdf.addPage([595.28, 841.89]).drawText(
      "Complete questions 1 through 5. Exercise reading and listening with your study partner.",
      { x: 50, y: 710, font, size: 12 },
    );
    pdf.addPage([595.28, 841.89]).drawText(
      "Read-only printed practice. Submit graded coursework in Falowen.",
      { x: 38, y: 810, font, size: 9 },
    );
  }, async (filename) => {
    const result = await trimPrintedPdfTail(filename, { description: "Day 10 workbook" });
    assert.equal(result.removed, 0);
    assert.equal((await PDFDocument.load(fs.readFileSync(filename))).getPageCount(), 2);
  });
});
