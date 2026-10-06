import fs from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const workbookSource = fs.readFileSync(new URL("../src/components/A1Day12TwentyFourHourClockAndDatesWorkbookPage.js", import.meta.url), "utf8");
const draftSource = fs.readFileSync(new URL("../src/utils/a1WorkbookDraft.js", import.meta.url), "utf8");

test("A1 Day 12 uses the new five-question reading and listening sets", () => {
  assert.match(workbookSource, /Nachricht von Thomas/);
  assert.match(workbookSource, /Um wie viel Uhr beginnt die Schiffsfahrt am 10\. Oktober\?/);
  assert.match(workbookSource, /Der Zug kommt um neunzehn Uhr zwanzig in Berlin an\./);
  assert.match(workbookSource, /Script optional anzeigen/);
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
