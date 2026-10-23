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
