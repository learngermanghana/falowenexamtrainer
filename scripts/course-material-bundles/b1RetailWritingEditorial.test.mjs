import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getB1RetailWritingTask } from "./b1RetailWritingEditorial.mjs";
import { buildB1ReadOnlyPrintHtml } from "./b1PrintableCompanions.mjs";

const dataRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../web/src");
const js = name => fs.readFileSync(path.join(dataRoot, name), "utf8");

test("B1 printable Day 1 and Day 3 writing tasks contain their required three points", async () => {
  for (const day of [1, 3]) {
    const html = await buildB1ReadOnlyPrintHtml({ day, part: "teil-2" });
    assert.match(html, /Bearbeiten Sie alle Punkte/);
    assert.equal((html.match(/<li>/g) || []).length, 3);
  }
});

test("B1 PDF restores quoted source material already in the live Day 6 and 20 lessons", async () => {
  for (const [day, component, uniquePhrase] of [
    [6, "components/B1Day6StadtOderLandWorkbookPageV2.js", "Tanja sagt, dass das Leben in der Stadt für sie besser ist"],
    [20, "components/B1Day20BerufKennenWorkbookPage.js", "Eine gute Ausbildung hilft, einen guten Job zu finden"],
  ]) {
    const publishedSource = getB1RetailWritingTask(day, {}).sourceText;
    assert.ok(publishedSource?.includes(uniquePhrase));
    assert.ok(js(component).includes(publishedSource), "Printed quote must match the live lesson, Day " + day);
    const html = await buildB1ReadOnlyPrintHtml({ day, part: "teil-2" });
    assert.ok(html.includes(uniquePhrase));
    assert.match(html, /Bearbeiten Sie alle Punkte/);
  }
});

test("B1 printed Day 13 removes teacher metadata and keeps the writing prompt", async () => {
  const html = await buildB1ReadOnlyPrintHtml({ day: 13, part: "teil-2" });
  assert.doesNotMatch(html, /Students are to write an essay|Opinion Assignment/i);
  assert.match(html, /Sind spannende Filme besser als ruhige Filme/);
});

test("B1 Goethe printed task numbering and Day 28 distinct climate topic", async () => {
  for (const day of [24, 27, 28]) {
    const html = await buildB1ReadOnlyPrintHtml({ day, part: "teil-2" });
    assert.match(html, /Goethe B1 Schreiben Aufgabe 2/);
    assert.doesNotMatch(html, /Goethe B1 Schreiben Teil 1/);
  }
  for (const day of [25, 26]) {
    const html = await buildB1ReadOnlyPrintHtml({ day, part: "teil-2" });
    assert.match(html, /Goethe B1 Schreiben Aufgabe 3/);
  }
  const day27 = await buildB1ReadOnlyPrintHtml({ day: 27, part: "teil-2" });
  const day28 = await buildB1ReadOnlyPrintHtml({ day: 28, part: "teil-2" });
  assert.match(day28, /Klimafreundlich leben/);
  assert.match(day28, /Busfahren und Energiesparen/);
  assert.notEqual(day27, day28);
});

test("B1 print adjustments do not alter missing or unlisted canonical tasks", () => {
  const task = { title: "Bestehende Aufgabe", instructions: "Aufgabe bleibt erhalten" };
  assert.deepEqual(getB1RetailWritingTask(2, task), task);
  assert.deepEqual(task, { title: "Bestehende Aufgabe", instructions: "Aufgabe bleibt erhalten" });
});
