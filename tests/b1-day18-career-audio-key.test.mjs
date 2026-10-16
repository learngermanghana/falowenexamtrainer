import test from "node:test";
import assert from "node:assert/strict";
import manifest from "../functions/data/answerKeyManifest.json" with { type: "json" };

test("B1-6.18 protected listening key follows the new career dialogue", () => {
  const entry = Object.values(manifest).find((item) => item.assignment_id === "B1-6.18");
  assert.ok(entry);
  assert.equal(entry.answers.teil3.Answer1, "c) Leidenschaft und Vernunft.", "reading key must not change");
  assert.deepEqual(entry.answers.teil4, {
    Answer1: "B) Astronaut",
    Answer2: "C) Biologie studieren",
    Answer3: "A) Grafikdesigner",
    Answer4: "D) Man kann ein Praktikum machen",
    Answer5: "B) Berufspläne können sich ändern",
  });
});
