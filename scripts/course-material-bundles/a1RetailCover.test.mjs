import assert from "node:assert/strict";
import test from "node:test";
import { PDFDocument } from "pdf-lib";
import { addA1RetailCover } from "./a1RetailCover.mjs";

test("A1 retail cover is printable A4 and contains sale-edition metadata", async () => {
  const pdf = await PDFDocument.create();
  await addA1RetailCover(pdf);
  assert.equal(pdf.getPageCount(), 1);
  const { width, height } = pdf.getPage(0).getSize();
  assert.ok(Math.abs(width - 595.28) < 0.05);
  assert.ok(Math.abs(height - 841.89) < 0.05);
  assert.match(pdf.getTitle(), /Deutsch A1/);
  assert.match(pdf.getAuthor(), /Falowen/);
  assert.doesNotMatch(pdf.getSubject(), /not for sale|editorial review/i);
  const saved = await PDFDocument.load(await pdf.save());
  assert.equal(saved.getPageCount(), 1);
  assert.match(saved.getTitle(), /Course & Workbook/);
});
