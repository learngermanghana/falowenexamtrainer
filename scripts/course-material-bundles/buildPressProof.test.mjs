import assert from "node:assert/strict";
import test from "node:test";
import { PDFDocument } from "pdf-lib";
import { createPressProof } from "./buildPressProof.mjs";

test("press proof adds an editorial cover without destroying source pages", async () => {
  const source = await PDFDocument.create();
  source.addPage([595.28, 841.89]);
  const sourceBytes = await source.save();
  const outputBytes = await createPressProof(sourceBytes, "A1");
  const output = await PDFDocument.load(outputBytes);
  assert.equal(output.getPageCount(), 2);
  assert.match(output.getTitle(), /Falowen Press A1/);
  assert.match(output.getSubject(), /not for sale/i);
});

test("press proof refuses unsupported levels", async () => {
  const source = await PDFDocument.create();
  source.addPage([595.28, 841.89]);
  await assert.rejects(() => createPressProof(source.save(), "C2"), /Unsupported/);
});
