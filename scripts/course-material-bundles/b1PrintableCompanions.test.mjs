import assert from "node:assert/strict";
import test from "node:test";
import {
  buildB1ReadOnlyPrintHtml,
  getB1PdfLessonCompanionUrl,
  getB1ReadOnlyParts,
} from "./b1PrintableCompanions.mjs";

const lesson = "/campus/course/lesson/B1/18?view=workbook&radio=done";
const url = getB1PdfLessonCompanionUrl(lesson);

test("B1 Day 18 canonical graded sections are printable without logging in or unlocking tabs", async () => {
  assert.deepEqual(await getB1ReadOnlyParts(18), ["teil-2", "teil-3", "teil-4"]);
  const writing = await buildB1ReadOnlyPrintHtml({ day: 18, part: "teil-2" });
  assert.match(writing, /Gibt es verschiedene Wege zum Wunschberuf/);
  assert.match(writing, /Lenas Meinung/);
  assert.match(writing, /Praktikum oder Weiterbildung/);
  assert.match(writing, /Ihre Antwort/);
  assert.doesNotMatch(writing, /Ich finde Lenas Meinung sehr richtig/); // model answer

  const reading = await buildB1ReadOnlyPrintHtml({ day: 18, part: "teil-3" });
  assert.match(reading, /Berufswahl/);
  assert.match(reading, /Was wird im Text als wichtiger Aspekt/);
  assert.match(reading, /Flexibilität und Weiterbildung/);

  const listening = await buildB1ReadOnlyPrintHtml({
    day: 18, part: "teil-4", lessonUrl: url,
    audioQrDataUrl: "data:image/png;base64,AA",
  });
  assert.match(listening, /Was wollte der erste Sprecher als Kind/);
  assert.match(listening, /B1 lesson audio QR/);
  assert.match(listening, /Falowen-Lektion/);
  assert.doesNotMatch(listening, /b1\/day-18\/day-18\.mp3/); // internal audio key
});

test("B1 offline companion URLs never include auth-state tokens or print-only bypass", () => {
  assert.equal(url, "https://www.falowen.app/campus/course/lesson/B1/18");
  assert.throws(() => getB1PdfLessonCompanionUrl("https://other.example/campus/course/lesson/B1/18"));
  assert.throws(() => getB1PdfLessonCompanionUrl("http://www.falowen.app/campus/course/lesson/B1/18"));
  assert.throws(() => getB1PdfLessonCompanionUrl("/campus/course/lesson/A2/18"));
  assert.throws(() => getB1PdfLessonCompanionUrl("/campus/course/lesson/B1/29"));
});

test("B1 print companions reject missing or unsupported sources rather than invent content", async () => {
  await assert.rejects(() => buildB1ReadOnlyPrintHtml({ day: 29, part: "teil-2" }));
  await assert.rejects(() => buildB1ReadOnlyPrintHtml({ day: 18, part: "teil-1" }));
  await assert.rejects(() => buildB1ReadOnlyPrintHtml({ day: 18, part: "teil-4", lessonUrl: url }));
  await assert.rejects(() => getB1ReadOnlyParts(0));
});

test("B1 Day 23 speaking mock prints only source-owned preparation without starting graded attempts", async () => {
  const lessonUrl = getB1PdfLessonCompanionUrl("/campus/course/lesson/B1/23");
  const qr = "data:image/png;base64,AA";
  const guide = await buildB1ReadOnlyPrintHtml({ day: 23, part: "grammar", lessonUrl, audioQrDataUrl:qr });
  const practice = await buildB1ReadOnlyPrintHtml({ day: 23, part: "workbook", lessonUrl, audioQrDataUrl:qr });
  assert.match(guide, /Goethe B1 Speaking Mock/);
  assert.match(guide, /Gemeinsam etwas planen/);
  assert.match(practice, /Ein Thema präsentieren/);
  assert.match(practice, /Fragen beantworten/);
  assert.match(practice, /Authenticated B1 speaking mock QR/);
  assert.doesNotMatch(practice, /studentUid|attemptId|sessionId|Start speaking mock/);
  await assert.rejects(() => buildB1ReadOnlyPrintHtml({day:23,part:"workbook",lessonUrl}));
});

test("B1 publication includes complete former online-only questions with no model answers", async () => {
  const titles = new Map([
    [19, ["E-Mail von Felix an seine Freundin Sarah", "Warum war Felix vor dem Gespräch sehr nervös?"]],
    [20, ["Berufsbild · Wie wird man eigentlich Reiseleiter/in?", "Warum ist der Beruf des Reiseleiters für viele attraktiv?"]],
    [22, ["Beziehungen im Wandel: Online-Dating", "Wie lernen sich viele junge Erwachsene heute kennen?"]],
  ]);
  for (const [day, excerpts] of titles) {
    const html = await buildB1ReadOnlyPrintHtml({day, part:"teil-3"});
    for (const excerpt of excerpts) assert.ok(html.includes(excerpt), "Day " + day + ": missing " + excerpt);
    assert.doesNotMatch(html, /data-b1-pdf-online-only|Diese Aufgabe ist nur online verfügbar/);
  }
  const expertReading = await buildB1ReadOnlyPrintHtml({day:22,part:"teil-4"});
  for (const excerpt of ["Person A:", "Person B:", "Person C:",
      "Die Überhöhung des Partners", "Der Staat sollte Paaren"]) {
    assert.ok(expertReading.includes(excerpt), "Missing Day 22 Teil 4 " + excerpt);
  }
  assert.doesNotMatch(expertReading, /data-b1-pdf-online-only|<h2>Fragen/);
  assert.doesNotMatch(expertReading, /Antwortschlüssel|Lösungsschlüssel/);
});

test("B1 later-course canonical reading and listening material remains accessible for printing", async () => {
  for (const day of [19, 20, 21, 22, 23, 24, 25, 26, 27, 28]) {
    const parts = await getB1ReadOnlyParts(day);
    assert.ok(parts.includes("teil-3"), "Day " + day + " is missing reading source");
    const read = await buildB1ReadOnlyPrintHtml({ day, part: "teil-3",
      lessonUrl: getB1PdfLessonCompanionUrl("/campus/course/lesson/B1/" + day),
      audioQrDataUrl: "data:image/png;base64,AA" });
    assert.ok(read.includes("Teil 3 · Lesen"));
    assert.doesNotMatch(read, /data-b1-pdf-online-only|nur online verfügbar/);
    assert.match(read, /<ol class="questions">/);
    if (parts.includes("teil-4")) {
      const listen = await buildB1ReadOnlyPrintHtml({
        day, part: "teil-4",
        lessonUrl: getB1PdfLessonCompanionUrl("/campus/course/lesson/B1/" + day),
        audioQrDataUrl: "data:image/png;base64,AA",
      });
      assert.ok(listen.includes("Teil 4"), "Day " + day + " listening section absent");
    }
    if (parts.includes("teil-2")) {
      const write = await buildB1ReadOnlyPrintHtml({ day, part: "teil-2" });
      assert.ok(write.includes("Teil 2 · Schreiben"));
    }
  }
});


test("B1 Day 1 Hören is printable from canonical questions without a live audio player", async () => {
  const lessonUrl = getB1PdfLessonCompanionUrl("/campus/course/lesson/B1/1");
  const parts = await getB1ReadOnlyParts(1);
  assert.ok(parts.includes("teil-4"));
  const html = await buildB1ReadOnlyPrintHtml({
    day: 1, part: "teil-4", lessonUrl,
    audioQrDataUrl: "data:image/png;base64,AA",
  });
  assert.match(html, /Audio in der Falowen-Lektion/);
  assert.match(html, /Fragen/);
  assert.match(html, /B1 Day 1/);
  assert.doesNotMatch(html, /Audio wird geladen|X-Amz-Signature|studentUid/);
});
