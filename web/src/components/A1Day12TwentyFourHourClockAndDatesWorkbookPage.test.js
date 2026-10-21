import fs from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";
const source = fs.readFileSync(new URL("./A1Day12TwentyFourHourClockAndDatesWorkbookPage.js", import.meta.url), "utf8");
const profiles = fs.readFileSync(new URL("../data/a1TutorDraftProfiles.js", import.meta.url), "utf8");
const draft = fs.readFileSync(new URL("../utils/a1WorkbookDraft.js", import.meta.url), "utf8");
test("A1-8 uses two new reading parts and no speaking", () => {
  assert.match(source, /Teil 1: E-Mails und SMS/);
  assert.match(source, /Teil 2: Schilder/);
  assert.match(source, /20:15 Uhr/);
  assert.match(source, /19:45 Uhr/);
  assert.match(source, /14:30 Uhr/);
  assert.match(source, /15:00 Uhr/);
  assert.doesNotMatch(source, /A1TutorSpeakingCheckpoint|Nachricht von Thomas|Schiffsfahrt/);
  assert.match(profiles, /"teil-1": section\(choiceItems\(5, \["Richtig", "Falsch"\]\)/);
  assert.match(profiles, /"teil-2": section\(choiceItems\(3, \["A", "B", "C"\]\)/);
  assert.match(draft, /day12-two-reading-parts-v4/);
  assert.doesNotMatch(draft, /"A1-8": \{ from:/);
});
