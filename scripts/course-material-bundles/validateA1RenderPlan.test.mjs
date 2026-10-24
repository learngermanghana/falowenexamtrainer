import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validateA1RenderPlan } from "./validateA1RenderPlan.mjs";

const dir = path.dirname(fileURLToPath(import.meta.url));
const plan = JSON.parse(fs.readFileSync(path.join(dir, "a1RenderPlan.json"), "utf8"));
const makeManifest = () => ({
  schemaVersion: 3,
  level: "A1",
  lessons: [
    { day: 0, title: "Tutorial", printKind: "excluded" },
    ...plan.lessons.map((lesson) => ({ day: lesson.day, title: lesson.title, printKind: "combined" })),
    { day: 23, title: "A1 Final Mock Exam", printKind: "excluded" },
  ],
});
const clone = (value) => JSON.parse(JSON.stringify(value));

test("current A1 print plan covers teaching Days 1–22 without final mock", () => {
  const result = validateA1RenderPlan(plan, makeManifest());
  assert.equal(result.lessons, 22);
  assert.ok(result.targets >= 22);
  assert.equal(result.externalPdfs, 0);
});

test("rejects a final mock being treated as a printable Course Book lesson", () => {
  const manifest = makeManifest();
  manifest.lessons.at(-1).printKind = "combined";
  assert.throws(() => validateA1RenderPlan(plan, manifest), /final mock must be excluded/);
});

test("rejects extra and missing teaching days", () => {
  const missing = clone(plan);
  missing.lessons.pop();
  assert.throws(() => validateA1RenderPlan(missing, makeManifest()), /differ from canonical/);
  const extra = clone(plan);
  extra.lessons.push({ day: 23, targets: [{ kind: "grammar", url: "/campus/course/a1-final-mock-exam" }] });
  assert.throws(() => validateA1RenderPlan(extra, makeManifest()), /differ from canonical/);
});

test("rejects redirects and non-course routes in the render selection", () => {
  const unsafe = clone(plan);
  unsafe.lessons[0].targets[0].url = "/exams/writing";
  assert.throws(() => validateA1RenderPlan(unsafe, makeManifest()), /not a Falowen course page/);
});

test("allows only declared external PDF downloads from approved source pattern", () => {
  const unsafe = clone(plan);
  unsafe.lessons[0].targets[0] = {
    kind: "workbook",
    sourceType: "external-pdf",
    url: "https://example.org/unverified.pdf",
  };
  assert.throws(() => validateA1RenderPlan(unsafe, makeManifest()), /unapproved external PDF/);
});

test("Day 18 exports live canonical Chapter 12.1 teaching and workbook", () => {
  const lesson = plan.lessons.find((value) => value.day === 18);
  assert.deepEqual(lesson.targets.map((target) => target.kind), ["grammar", "workbook"]);
  assert.ok(lesson.targets.every((target) => target.url.includes("two-case-prepositions-wechselpraepositionen-day-18")));
  assert.ok(lesson.targets.find((target) => target.kind === "workbook")?.url.includes("view=workbook"));
  assert.ok(plan.lessons.every((item) => item.targets.every((target) => !/a1-12-2-dative-articles-mit-bei-zu/.test(target.url))));
});
