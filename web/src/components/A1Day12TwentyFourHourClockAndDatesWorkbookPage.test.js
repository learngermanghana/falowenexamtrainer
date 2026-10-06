import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const workbookSource = fs.readFileSync(path.join(process.cwd(), "src/components/A1Day12TwentyFourHourClockAndDatesWorkbookPage.js"), "utf8");
const draftSource = fs.readFileSync(path.join(process.cwd(), "src/utils/a1WorkbookDraft.js"), "utf8");
const registrySource = fs.readFileSync(path.join(process.cwd(), "src/data/a1AssignmentRegistry.js"), "utf8");
const profileSource = fs.readFileSync(path.join(process.cwd(), "src/data/a1TutorDraftProfiles.js"), "utf8");

test("A1 Day 12 uses the new five-question reading and listening sets", () => {
  assert.match(workbookSource, /Nachricht von Thomas/);
  assert.match(workbookSource, /Um wie viel Uhr beginnt die Schiffsfahrt am 10\. Oktober\?/);
  assert.match(workbookSource, /Der Zug kommt um neunzehn Uhr zwanzig in Berlin an\./);
  assert.match(workbookSource, /Script optional anzeigen/);
  assert.match(workbookSource, /a1\/day-12\/day-12\.mp3/);
  assert.match(workbookSource, /Hören starten/);
  assert.match(workbookSource, /Viertel vor drei \(nachmittags\)/);
  assert.doesNotMatch(workbookSource, /Wie viele Tage hat der Februar in einem Schaltjahr/);
  assert.doesNotMatch(workbookSource, /vm22NeVPFNA/);
});

test("A1 Day 12 invalidates old drafts for both replaced sections", () => {
  assert.match(
    draftSource,
    /"A1-8": \{ revision: "hamburg-message-and-berlin-train-5-each-v2", sections: \{ "teil-1": 5, "teil-2": 5 \} \}/,
  );
});


test("A1 Day 12 canonical metadata matches the two rendered sections", () => {
  assert.match(registrySource, /A1-8[\s\S]*Teil 1: Lesen · Nachricht von Thomas[\s\S]*Teil 2: Hören · Zug nach Berlin/);
  assert.doesNotMatch(registrySource.match(/\["A1-8"[\s\S]*?\],\n/)?.[0] || "", /Teil 3/);
  assert.match(profileSource, /"A1-8"[\s\S]*choices: \["A", "B"\][\s\S]*choices: \["A", "B", "C"\]/);
});
