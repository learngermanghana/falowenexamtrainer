import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PLAN_PATH = path.join(repoRoot, "scripts/course-material-bundles/a1RenderPlan.json");
const MANIFEST_PATH = path.join(repoRoot, "artifacts/course-material-bundles/A1/Falowen-A1-Course-Materials-manifest.json");
const BASE = "https://www.falowen.app";

const fail = (message) => { throw new Error("A1 PDF render plan: " + message); };

export function validateA1RenderPlan(plan, manifest) {
  if (plan?.level !== "A1" || !Array.isArray(plan.lessons)) fail("expected an A1 lessons array");
  if (manifest?.level !== "A1" || manifest.schemaVersion !== 3 || !Array.isArray(manifest.lessons)) {
    fail("expected the current A1 canonical curriculum manifest");
  }

  const finalMock = manifest.lessons.filter((lesson) => /final mock exam/i.test(lesson.title || ""));
  if (finalMock.length !== 1 || finalMock[0].printKind !== "excluded") {
    fail("canonical final mock must be excluded from the teaching Course Book");
  }
  const printable = manifest.lessons.filter((lesson) => lesson.printKind !== "excluded");
  const expectedDays = printable.map((lesson) => Number(lesson.day));
  const plannedDays = plan.lessons.map((lesson) => Number(lesson.day));
  if (JSON.stringify(plannedDays) !== JSON.stringify(expectedDays)) {
    fail("planned teaching days [" + plannedDays.join(", ") + "] differ from canonical printable days [" + expectedDays.join(", ") + "]");
  }

  let checkedTargets = 0;
  let externalPdfs = 0;
  for (const lesson of plan.lessons) {
    if (!Array.isArray(lesson.targets) || lesson.targets.length === 0) {
      fail("Day " + lesson.day + " has no PDF content targets");
    }
    for (const target of lesson.targets) {
      if (!["grammar", "workbook"].includes(target.kind) || typeof target.url !== "string" || !target.url.trim()) {
        fail("Day " + lesson.day + " has an invalid target");
      }
      let url;
      try { url = new URL(target.url, BASE); } catch { fail("Day " + lesson.day + " has a malformed URL"); }
      if (target.sourceType === "external-pdf") {
        if (url.hostname !== "drive.google.com" || !/^\/file\/d\/[^/]+/.test(url.pathname) || target.kind !== "workbook") {
          fail("Day " + lesson.day + " has an unapproved external PDF source");
        }
        externalPdfs++;
      } else {
        if (target.sourceType || url.origin !== BASE || !url.pathname.startsWith("/campus/course/")) {
          fail("Day " + lesson.day + " target is not a Falowen course page: " + url.toString());
        }
      }
      checkedTargets++;
    }
  }
  return { lessons: plan.lessons.length, targets: checkedTargets, externalPdfs };
}

const invokedAsScript = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedAsScript) {
  const plan = JSON.parse(fs.readFileSync(PLAN_PATH, "utf8"));
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const result = validateA1RenderPlan(plan, manifest);
  console.log("A1 PDF plan verified: " + result.lessons + " teaching lessons; " + result.targets + " targets; " +
    result.externalPdfs + " externally sourced PDF targets needing publication-rights review.");
}
