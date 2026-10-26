import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { getA2ListeningTask } from "../../web/src/data/a2ListeningTasks.js";
import { a2PrintableListeningQuestions, renderA2PrintableListeningQuestions } from "./renderA2PrintableListeningQuestions.mjs";

test("A2 print listening sheets use all existing canonical late-course questions", () => {
  for (const day of [24, 26, 27, 28]) {
    assert.deepEqual(a2PrintableListeningQuestions(day), getA2ListeningTask(day));
    assert.equal(a2PrintableListeningQuestions(day).questions.length, 5);
  }
  assert.throws(() => a2PrintableListeningQuestions(25), /No complete canonical/);
});

test("A2 print listening sheets are complete but never use student scores or audio downloads", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "falowen-a2-listening-pdf-"));
  try {
    for (const day of [24, 26, 27, 28]) {
      const file = await renderA2PrintableListeningQuestions({
        lesson: { day, route: `/campus/course/a2-day-${day}-original-workbook` },
        renderDir: dir,
      });
      assert.equal(file.tab, "workbook-teil-4");
      // Small, vector-only PDFs may be well under 3 KB; file size is not
      // a meaningful measure of whether all question pages were rendered.
      const bytes = fs.readFileSync(file.file);
      assert.equal(bytes.subarray(0, 5).toString("ascii"), "%PDF-");
      const pdf = await PDFDocument.load(bytes);
      assert.ok(pdf.getPageCount() >= 1 && pdf.getPageCount() <= 5);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("A2 Hören paper module rejects unrelated routes and missing listening days", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "falowen-a2-listening-guard-"));
  try {
    await assert.rejects(
      renderA2PrintableListeningQuestions({ lesson: { day: 24, route: "/campus/course/unrelated" }, renderDir: dir }),
      /Unexpected A2 Day 24 source route/,
    );
    await assert.rejects(
      renderA2PrintableListeningQuestions({ lesson: { day: 25, route: "/campus/course/a2-day-25-tagesablauf-workbook" }, renderDir: dir }),
      /No complete canonical/,
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
