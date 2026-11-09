import assert from "node:assert/strict";
import test from "node:test";
import { findB1PublicationFaults, assertB1PublicationReady } from "./b1PrintReadiness.mjs";

const validBook = [
  "Nennen Sie einen Vorteil persönlicher Kontakte im Traumberuf.",
  "Entschuldigen Sie sich bei Frau Wolmer",
  "Tanja sagt, dass das Leben in der Stadt für sie besser ist",
  "Eine gute Ausbildung hilft, einen guten Job zu finden.",
  "Goethe B1 Schreiben Aufgabe 2",
  "Goethe B1 Schreiben Aufgabe 3",
  "Klimafreundlich leben",
  "Busfahren und Energiesparen",
].join(" ");

test("B1 prepublication audit accepts complete student-facing writing material", () => {
  assert.deepEqual(findB1PublicationFaults(validBook), []);
  assert.doesNotThrow(() => assertB1PublicationReady(validBook));
});

test("B1 publication gate rejects website actions and overlays", () => {
  for (const leak of [
    "Answer directly in the workbook. Your required choices and writing are saved to Review & Submit automatically.",
    "Click an answer option. Your choice is saved automatically to Submit.",
    "Lösungen anzeigen",
    "Opinion Assignment / Students are to write an essay",
  ]) {
    assert.throws(() => assertB1PublicationReady(validBook + " " + leak), /B1 prepublication text audit failed/);
  }
});

test("B1 publication gate rejects obsolete Goethe labels and missing writing sources", () => {
  assert.ok(findB1PublicationFaults(validBook.replace("Tanja sagt, dass das Leben in der Stadt für sie besser ist", ""))
    .some(x => x.includes("Day 6")));
  assert.ok(findB1PublicationFaults(validBook + " Goethe B1 Schreiben Teil 1 · Forum")
    .some(x => x.includes("incorrect Goethe")));
  assert.ok(findB1PublicationFaults(validBook + " Goethe B1 Schreiben Teil 2 · E-Mail")
    .some(x => x.includes("incorrect Goethe")));
});
