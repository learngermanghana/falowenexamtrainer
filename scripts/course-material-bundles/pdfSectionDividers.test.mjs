import assert from "node:assert/strict";
import test from "node:test";
import { hasPdfSectionDivider } from "./pdfSectionDividers.mjs";

const fixture = [
  "Contents: Day 1 · Traumwelten     Grammar     Workbook",
  "FALOWEN\nB1 · Day 1\nTraumwelten\nGRAMMAR\nFalowen Grammar Notes & Workbook",
  "FALOWEN\nB1 · Day 1\nTraumwelten\nWORKBOOK\nFalowen Grammar Notes & Workbook",
  "FALOWEN\nB1 · Day 10\nWohnen\nGRAMMAR\nFalowen Grammar Notes & Workbook",
].join("\f") + "\f";

test("B1 section dividers match their real printed page, day and uppercase section", () => {
  assert.equal(hasPdfSectionDivider(fixture, "B1", 1, "grammar"), true);
  assert.equal(hasPdfSectionDivider(fixture, "B1", 1, "workbook"), true);
  assert.equal(hasPdfSectionDivider(fixture, "B1", 10, "grammar"), true);
  assert.equal(hasPdfSectionDivider(fixture, "B1", 10, "workbook"), false);
  assert.equal(hasPdfSectionDivider(fixture, "B1", 2, "grammar"), false);
  assert.equal(hasPdfSectionDivider(fixture, "A2", 1, "grammar"), false);
});

test("B1 divider marker must appear on one page, not across a PDF page break", () => {
  const split = "B1 · Day 4\fWORKBOOK\f";
  assert.equal(hasPdfSectionDivider(split, "B1", 4, "workbook"), false);
  const real = "B1 · Day 4\nWohnung suchen\nWORKBOOK\f";
  assert.equal(hasPdfSectionDivider(real, "B1", 4, "workbook"), true);
});

test("A1 and A2 shared retail PDF chapter labels still validate", () => {
  for (const level of ["A1", "A2"]) {
    assert.equal(hasPdfSectionDivider(level + " · Day 3\nBeruf und Familie\nGRAMMAR", level, 3, "grammar"), true);
    assert.equal(hasPdfSectionDivider(level + " · Day 3\nBeruf und Familie\nWORKBOOK", level, 3, "workbook"), true);
  }
});
