import fs from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const source = fs.readFileSync(new URL("../src/components/A1Day12TwentyFourHourClockAndDatesWorkbookPage.js", import.meta.url), "utf8");
const draft = fs.readFileSync(new URL("../src/utils/a1WorkbookDraft.js", import.meta.url), "utf8");

test("A1 Day 12 keeps Lesen and replaces existing Teil 2 with Sprechen", () => {
  assert.match(source, /Nachricht von Thomas/);
  assert.match(source, /Um wie viel Uhr beginnt die Schiffsfahrt am 10\\. Oktober\\?/);
  assert.match(source, /Teil 2 · Sprechen: Fragen und Antworten/);
  assert.match(source, /assignmentKey="A1-8"/);
  assert.doesNotMatch(source, /A1ProtectedAudioPlayer/);
  assert.doesNotMatch(source, /Teil 3 ·/);
});

test("A1 Day 12 invalidates outdated Teil 2 answers without dropping unrelated reading", () => {
  assert.match(draft, /"A1-8": \\{ revision: "a1-8-sprechen-teil2-v3", sections: \\{ "teil-2": null \\} \\}/);
});
