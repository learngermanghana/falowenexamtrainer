import assert from "node:assert/strict";
import test from "node:test";
import { buildA2ReadOnlyPrintHtml } from "./a2PrintableCompanions.mjs";

test("Day 21 locked Schreiben is populated from canonical A2 writing prompts", async () => {
  const html = await buildA2ReadOnlyPrintHtml({ day: 21, part: "teil-2" });
  assert.match(html, /Wochenende/);
  assert.match(html, /Schreiben/);
  assert.match(html, /Datum/);
  assert.doesNotMatch(html, /type="password"|startCourseSpeakingMock|localStorage|fetch\(/);
});

test("A2 reading and listening printouts use source-controlled questions, not answers", async () => {
  const reading = await buildA2ReadOnlyPrintHtml({ day: 21, part: "teil-3" });
  assert.match(reading, /Unser Wochenende in Köln/);
  assert.match(reading, /Fragen/);
  const listening = await buildA2ReadOnlyPrintHtml({ day: 26, part: "teil-4" });
  assert.match(listening, /Hörverstehen/);
  assert.doesNotMatch(listening, /a2\/day-26\/day-26.mp3/);
  assert.match(listening, /Falowen Course Book/);
  assert.doesNotMatch(listening, /<audio/);
});

test("Day 22 has a complete print-only three-part speaking companion and support section", async () => {
  const grammar = await buildA2ReadOnlyPrintHtml({ day: 22, part: "grammar" });
  const workbook = await buildA2ReadOnlyPrintHtml({ day: 22, part: "workbook" });
  assert.match(grammar, /Satzbau und Redemittel/);
  assert.match(workbook, /Teil 1/);
  assert.match(workbook, /Teil 2/);
  assert.match(workbook, /Teil 3/);
  assert.match(workbook, /aus dem Falowen A2/);
  assert.doesNotMatch(grammar + workbook, /<script|idToken|sessionId|% scores|onClick|startCourseSpeakingMock/);
});

test("Missing canonical sections or unsupported days fail closed", async () => {
  await assert.rejects(() => buildA2ReadOnlyPrintHtml({ day: 0, part: "teil-2" }));
  await assert.rejects(() => buildA2ReadOnlyPrintHtml({ day: 22, part: "teil-2" }));
  await assert.rejects(() => buildA2ReadOnlyPrintHtml({ day: 24, part: "submit" }));
  await assert.rejects(() => buildA2ReadOnlyPrintHtml({ day: 23, part: "teil-4" }));
});

test("source-only A2 Hören prints A1-style QR for a stable authenticated lesson, not R2 keys", async () => {
  const lessonUrl = "https://www.falowen.app/campus/course/lesson/A2/26";
  const html = await buildA2ReadOnlyPrintHtml({
    day: 26, part: "teil-4", lessonUrl, audioQrDataUrl: "data:image/png;base64,ZG9udC1sZWFr",
  });
  assert.match(html, /data-a2-pdf-audio-companion/);
  assert.match(html, /<img src="data:image\/png;base64,/);
  assert.match(html, /Scan the QR code/);
  assert.match(html, /campus\/course\/lesson\/A2\/26/);
  assert.doesNotMatch(html, /a2\/day-26\/day-26\.mp3|r2\.cloudflare|token=|signature=/i);
});
