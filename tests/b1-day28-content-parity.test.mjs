import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const manifest = JSON.parse(read("functions/data/answerKeyManifest.json"));
const frontendWriting = read("web/src/data/b1WritingTasks.js");
const frontendReading = read("web/src/data/b1ReadingTasks.js");
const frontendListening = read("web/src/data/b1ListeningTasks.js");
const backendWriting = JSON.parse(read("functions/data/b1WritingTasks.json"));

const matching = Object.values(manifest).filter((row) => row.assignment_id === "B1-10.28");
assert.equal(matching.length, 1, "Day 28 must have one authoritative answer key");
const answerKey = matching[0].answers;

function day28Block(source, type) {
  const start = source.indexOf(`  28: ${type}`);
  assert.ok(start >= 0, "Missing Day 28 canonical task");
  const end = type === "task({" ? source.indexOf("\n});", start) : source.indexOf("  1: Object.freeze(", start);
  assert.ok(end > start, "Missing end of Day 28 canonical task");
  return source.slice(start, end);
}

function checkAnswers(optionArrays, expected, letters) {
  assert.equal(optionArrays.length, letters.length, "Number of displayed questions");
  assert.equal(Object.keys(expected).length, letters.length, "Number of marking answers");
  optionArrays.forEach((choices, i) => {
    assert.deepEqual(choices, ["A) Richtig", "B) Falsch"]);
    assert.equal(expected[`Answer${i + 1}`], `${letters[i]}) ${letters[i] === "A" ? "Richtig" : "Falsch"}`);
  });
}

test("Day 28 Lesen preserves all six sustainability-blog questions and the answer key", () => {
  const lesson = day28Block(frontendReading, "Object.freeze({");
  for (const excerpt of [
    "Mein Weg zu mehr Nachhaltigkeit im Alltag",
    "Wochenmärkten und in Unverpackt-Läden",
    "Carsharing-Auto",
    "Repair-Café",
    "nach einem langen Arbeitstag",
    "Der Autor hat beschlossen, seinen Müll zu reduzieren",
    "Das Einkaufen ohne Plastikverpackungen fiel dem Autor",
    "Der Autor nutzt in der Stadt für fast alle Wege",
    "Für schwere Transporte nutzt der Autor",
    "Wenn ein Elektrogerät defekt ist",
    "Der Autor gibt zu, dass er nach der Arbeit",
  ]) assert.ok(lesson.includes(excerpt), `Missing reading text or question: ${excerpt}`);
  const options = [...lesson.matchAll(/options:\s*(\[[^\n]*\])/g)].map((match) => JSON.parse(match[1]));
  checkAnswers(options, answerKey.teil3, ["A", "B", "B", "A", "B", "A"]);
});

test("Day 28 Hören matches uploaded questions, answer key, and protected R2 signing", () => {
  const lesson = day28Block(frontendListening, "task({");
  assert.match(lesson, /audioKey: "b1\/day-28\/day-28\.mp3"/);
  assert.match(lesson, /submitRequired: true/);
  assert.doesNotMatch(lesson, /videoId|youtube/);
  const stems = [...lesson.matchAll(/\bq\("([^"]+)",\s*\[([^\n]+)\]\)/g)].map((m) => m[1]);
  assert.deepEqual(stems, [
    "Lisa möchte in ihrem Alltag klimafreundlicher leben.",
    "Lisa kauft ausschließlich Lebensmittel in Plastikverpackungen.",
    "Lisa fährt täglich mit dem Fahrrad zur Arbeit.",
    "Lisa hat ihren Flug nach Spanien nicht abgesagt.",
    "Lisa möchte im Sommer mit dem Zug in den Urlaub fahren.",
  ]);
  const options = [...lesson.matchAll(/\bq\("[^"]+",\s*(\[[^\n]*\])\)/g)].map((m) => JSON.parse(m[1]));
  checkAnswers(options, answerKey.teil4, ["A", "B", "A", "B", "A"]);
  const signer = read("functions/functionz/r2CourseAudio.js");
  assert.match(signer, /B1: new Set\(\[[^\]]*\b28\b[^\]]*\]\)/);
});

test("Day 28 Schreiben uses Laura's opinion and all four specified points in both task registries", () => {
  const lesson = day28Block(frontendWriting, "Object.freeze({");
  assert.match(lesson, /Laura \(24 Jahre\)/);
  assert.match(lesson, /Wie viel kann der Einzelne tun/);
  assert.match(lesson, /Blogbeitrag \/ Forenbeitrag/);
  const server = backendWriting["B1-10.28"];
  assert.equal(server.points.length, 4);
  assert.match(server.situation, /Laura \(24 Jahre\)/);
  assert.match(server.situation, /ca\. 80 Wörter/);
  for (const point of ["Meinung:", "Gründe:", "Möglichkeiten:", "Vor- und Nachteile:"]) {
    assert.ok(lesson.includes(point), `Day 28 missing writing point ${point}`);
  }
});
