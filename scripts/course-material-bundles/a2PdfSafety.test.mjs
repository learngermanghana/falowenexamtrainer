import test from "node:test";
import assert from "node:assert/strict";
import { assertA2PrintSafety, assertA2PrintedContent } from "./a2PdfSafety.mjs";
import { getA2PdfLessonCompanionUrl } from "./a2PdfPrintExtras.mjs";
import { buildA2ReadOnlyPrintHtml, getA2ReadOnlyParts } from "./a2PrintableCompanions.mjs";

test("A2 release preflight rejects private work, keys, media tokens and incomplete output", () => {
  for (const leak of ["What Your Classmates Shared", "Draft saved", "Your score: 90",
    "Recognised speech", "Reference Answers", "Musterlösung", "https://host/audio?token=private",
    "https://host?X-Amz-Signature=private", "Loading grammar notes…"])
    assert.throws(() => assertA2PrintSafety(leak), /safety preflight/);
  assert.doesNotThrow(() => assertA2PrintSafety("Beispiel: Ich konnte gut schwimmen. Schreiben Sie Ihre Antwort."));
});

test("A2 content comparison tolerates line wrapping but rejects missing end-of-question text", () => {
  assert.doesNotThrow(() => assertA2PrintedContent("Ein großer Text.\nAlle Optionen.", "Ein großer\nText. Alle Optionen."));
  assert.throws(() => assertA2PrintedContent("Was kauft sie? A. Brot B. Milch", "Was kauft sie? A. Brot"), /truncating/);
});

test("A2 QR links reject credentials, nonstandard ports, other levels and invalid days", () => {
  for (const route of ["https://user:secret@www.falowen.app/campus/course/lesson/A2/1",
    "https://www.falowen.app:444/campus/course/lesson/A2/1", "/campus/course/lesson/B1/1",
    "/campus/course/lesson/A2/29", "/campus/course/lesson/A2/1/unrelated"])
    assert.throws(() => getA2PdfLessonCompanionUrl(route), /authenticated Falowen course lesson/);
});

test("all 28 A2 days have complete source-only print sections and no serialized answer keys", async () => {
  let days = 0;
  for (let day = 1; day <= 28; day++) {
    const parts = day === 22 ? ["grammar", "workbook"] : await getA2ReadOnlyParts(day);
    for (const part of parts) {
      const html = await buildA2ReadOnlyPrintHtml({day, part, lesson:{title:`Tag ${day}`}});
      assertA2PrintSafety(html);
      assert.ok(html.includes("<main>"));
      assert.doesNotMatch(html, /\[object Object\]|undefined|correctAnswer|answerKey|<script/i);
      if (["teil-3", "teil-4"].includes(part)) {
        assert.doesNotMatch(html, /<ol><li>[A-Da-d][.)]/);
      }
    }
    days++;
  }
  assert.equal(days, 28);
});
