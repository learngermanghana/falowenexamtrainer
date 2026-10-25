import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { a2SpeakingMockCards, renderA2Day22SpeakingMockPrint } from "./renderA2Day22SpeakingMockPrint.mjs";

const sourceLesson = Object.freeze({
  day: 22,
  title: "Goethe A2 Speaking Mock",
  route: "/campus/course/a2-day-22-die-woche-planung-workbook",
});

test("A2 Day 22 paper cards are deterministic and sourced from live A2 dictionary", () => {
  const a = a2SpeakingMockCards();
  assert.deepEqual(a, a2SpeakingMockCards());
  assert.deepEqual(a.map(x => x.part), ["teil-1", "teil-2", "teil-3"]);
  for (const section of a) {
    assert.equal(section.cards.length, 3);
    assert.ok(section.cards.every(card => card.id.startsWith("a2-") && card.topic));
  }
});

test("A2 Day 22 printable is offline, complete, and has exactly Grammar + Workbook outputs", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "falowen-a2-speaking-pdf-"));
  try {
    const files = await renderA2Day22SpeakingMockPrint({ lesson: sourceLesson, renderDir: dir });
    assert.deepEqual(files.map(f => f.tab), ["grammar", "workbook"]);
    const first = await PDFDocument.load(fs.readFileSync(files[0].file));
    const second = await PDFDocument.load(fs.readFileSync(files[1].file));
    assert.equal(first.getPageCount(), 1);
    assert.equal(second.getPageCount(), 3);
    assert.ok(files.every(file => fs.statSync(file.file).size > 1000));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("A2 Day 22 never silently substitutes an unrelated lesson", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "falowen-a2-speaking-route-"));
  try {
    await assert.rejects(
      renderA2Day22SpeakingMockPrint({ lesson: { ...sourceLesson, route: "/campus/course/not-the-mock" }, renderDir: dir }),
      /Unexpected A2 Day 22 curriculum route/,
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
