#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COMPONENT_ROOT = path.join(ROOT, "web", "src", "components");
const COURSE_LESSON_PATH = path.join(COMPONENT_ROOT, "CourseLessonPage.js");
const MANIFEST_PATH = path.join(ROOT, "functions", "data", "answerKeyManifest.json");
const GRAMMAR_CONTENT_PATH = path.join(COMPONENT_ROOT, "A2B1WorkbookGrammarNotesContent.js");

const read = (file) => fs.readFileSync(file, "utf8");
const failures = [];
const warnings = [];
const notes = [];

const fail = (scope, message) => failures.push(`${scope}: ${message}`);
const warn = (scope, message) => warnings.push(`${scope}: ${message}`);
const note = (message) => notes.push(message);

const courseSource = read(COURSE_LESSON_PATH);
const manifest = JSON.parse(read(MANIFEST_PATH));
const grammarSource = read(GRAMMAR_CONTENT_PATH);

const importMap = new Map(
  [...courseSource.matchAll(/import\s+(B1Day\w+WorkbookPage)\s+from\s+"\.\/(B1Day[^"]+WorkbookPage)";/g)]
    .map((match) => [match[1], path.join(COMPONENT_ROOT, `${match[2]}.js`)]),
);

const mapMatch = courseSource.match(/const B1_WORKBOOK_PAGES = \{([\s\S]*?)\n\};/);
if (!mapMatch) {
  console.error("Could not locate B1_WORKBOOK_PAGES in CourseLessonPage.js");
  process.exit(1);
}

const routeEntries = [...mapMatch[1].matchAll(/\b(\d+):\s*(B1Day\w+WorkbookPage)/g)]
  .map((match) => ({ day: Number(match[1]), component: match[2] }))
  .sort((a, b) => a.day - b.day);

const expectedDays = Array.from({ length: 28 }, (_, index) => index + 1);
const routedDays = routeEntries.map((entry) => entry.day);
if (JSON.stringify(routedDays) !== JSON.stringify(expectedDays)) {
  fail("Routing", `B1_WORKBOOK_PAGES must expose Days 1–28 exactly; found ${routedDays.join(",")}`);
}

const b1Manifest = Object.values(manifest)
  .filter((entry) => String(entry?.assignment_id || "").toUpperCase().startsWith("B1-"))
  .map((entry) => ({
    ...entry,
    assignmentId: String(entry.assignment_id).toUpperCase(),
    day: Number(String(entry.assignment_id).split(".").at(-1)),
  }))
  .sort((a, b) => a.day - b.day);

if (b1Manifest.length !== 28) {
  fail("Answer manifest", `expected 28 B1 assignments, found ${b1Manifest.length}`);
}

const manifestByDay = new Map();
for (const entry of b1Manifest) {
  if (!Number.isInteger(entry.day) || entry.day < 1 || entry.day > 28) {
    fail("Answer manifest", `invalid B1 assignment day in ${entry.assignmentId}`);
    continue;
  }
  if (manifestByDay.has(entry.day)) {
    fail("Answer manifest", `duplicate assignment for Day ${entry.day}: ${entry.assignmentId}`);
  }
  manifestByDay.set(entry.day, entry);
}

const resolveSourceChain = (filePath) => {
  const chain = [];
  const seen = new Set();
  let current = filePath;

  for (let depth = 0; depth < 4 && current && !seen.has(current); depth += 1) {
    seen.add(current);
    if (!fs.existsSync(current)) break;
    const source = read(current);
    chain.push({ file: current, source });

    const directExport = source.match(/export\s+\{\s*default\s*\}\s+from\s+"\.\/([^"]+)";/);
    const wrapperImport = source.match(/import\s+\w+\s+from\s+"\.\/([^"]*(?:Legacy|V2)[^"]*)";/);
    const nextName = directExport?.[1] || wrapperImport?.[1] || "";
    if (!nextName) break;
    current = path.join(path.dirname(current), nextName.endsWith(".js") ? nextName : `${nextName}.js`);
  }

  return chain;
};

const extractAssignmentKey = (combinedSource) =>
  combinedSource.match(/\bassignmentKey\s*:\s*"([^"]+)"/)?.[1]
  || combinedSource.match(/\bcanonicalAssignmentKey\s*:\s*"([^"]+)"/)?.[1]
  || "";

const extractConfigDay = (combinedSource) =>
  Number(
    combinedSource.match(/\bday\s*:\s*(\d+)/)?.[1]
    || combinedSource.match(/\bday=\{(\d+)\}/)?.[1]
    || 0,
  );

const extractConfigChapter = (combinedSource) =>
  combinedSource.match(/\bchapter\s*:\s*"([^"]+)"/)?.[1]
  || combinedSource.match(/\bchapter="([^"]+)"/)?.[1]
  || "";

const CUSTOM_BASELINE_DAYS = new Set();
const LEGACY_PROXY_BASELINE_DAYS = new Set();
const DOM_PATCH_BASELINE_DAYS = new Set([21]);
const PLANNED_BASELINE_COUNTS = new Map([[23, 1]]);

const liveRows = [];

for (const route of routeEntries) {
  const filePath = importMap.get(route.component);
  if (!filePath) {
    fail(`Day ${route.day}`, `missing import for ${route.component}`);
    continue;
  }

  const chain = resolveSourceChain(filePath);
  if (!chain.length) {
    fail(`Day ${route.day}`, `cannot read live workbook source ${path.relative(ROOT, filePath)}`);
    continue;
  }

  const combinedSource = chain.map((entry) => entry.source).join("\n");
  const usesSharedShell = combinedSource.includes("B1StandardWorkbookPage");
  const usesLegacyProxy = chain.length > 1 || /WorkbookPageLegacy|WorkbookPageV2/.test(chain[0].source);
  const usesDomPatch = /MutationObserver|useLayoutEffect|document\.querySelector|querySelectorAll/.test(combinedSource);
  const plannedCount = (combinedSource.match(/status\s*:\s*"planned"/g) || []).length;
  const assignmentKey = extractAssignmentKey(combinedSource);
  const configDay = extractConfigDay(combinedSource);
  const chapter = extractConfigChapter(combinedSource);
  const manifestEntry = manifestByDay.get(route.day);

  if (!manifestEntry) {
    fail(`Day ${route.day}`, "missing B1 answer-manifest entry");
  }

  if (assignmentKey && manifestEntry && assignmentKey.toUpperCase() !== manifestEntry.assignmentId) {
    fail(`Day ${route.day}`, `workbook assignmentKey ${assignmentKey} != manifest ${manifestEntry.assignmentId}`);
  }

  if (!assignmentKey && !LEGACY_PROXY_BASELINE_DAYS.has(route.day)) {
    fail(`Day ${route.day}`, "live workbook does not expose a parseable assignmentKey");
  }

  if (configDay && configDay !== route.day) {
    fail(`Day ${route.day}`, `workbook config says Day ${configDay}`);
  }

  if (chapter && manifestEntry) {
    const expectedChapter = manifestEntry.assignmentId.replace("B1-", "");
    if (chapter !== expectedChapter) {
      fail(`Day ${route.day}`, `workbook chapter ${chapter} != manifest chapter ${expectedChapter}`);
    }
  }

  if (!usesSharedShell && !CUSTOM_BASELINE_DAYS.has(route.day)) {
    fail(`Day ${route.day}`, "new non-standard B1 workbook architecture detected");
  }
  if (!usesSharedShell) {
    warn(`Day ${route.day}`, "still uses a custom workbook instead of B1StandardWorkbookPage");
  }

  if (usesLegacyProxy && !LEGACY_PROXY_BASELINE_DAYS.has(route.day)) {
    fail(`Day ${route.day}`, "new legacy/V2 workbook proxy detected");
  }
  if (usesLegacyProxy) {
    warn(`Day ${route.day}`, `legacy/V2 proxy chain: ${chain.map((entry) => path.basename(entry.file)).join(" -> ")}`);
  }

  if (usesDomPatch && !DOM_PATCH_BASELINE_DAYS.has(route.day)) {
    fail(`Day ${route.day}`, "new DOM-patching workbook behavior detected");
  }
  if (usesDomPatch) {
    warn(`Day ${route.day}`, "uses DOM observer/layout patching instead of declarative shared-shell configuration");
  }

  const allowedPlannedCount = PLANNED_BASELINE_COUNTS.get(route.day) || 0;
  if (plannedCount > allowedPlannedCount) {
    fail(
      `Day ${route.day}`,
      `planned placeholder count increased from baseline ${allowedPlannedCount} to ${plannedCount}`,
    );
  }
  if (plannedCount) {
    warn(
      `Day ${route.day}`,
      `${plannedCount} planned placeholder section remains (baseline cap: ${allowedPlannedCount})`,
    );
  }

  const readingAnswers = Object.keys(manifestEntry?.answers?.teil3 || {}).length;
  const listeningAnswers = Object.keys(manifestEntry?.answers?.teil4 || {}).length;
  if (!readingAnswers) fail(`Day ${route.day}`, "manifest has no Teil 3 Lesen answers");
  if (readingAnswers < 5 || readingAnswers > 7) {
    warn(`Day ${route.day}`, `unusual Lesen answer count: ${readingAnswers}`);
  }
  if (listeningAnswers > 5) {
    warn(`Day ${route.day}`, `unusually large Hören answer set: ${listeningAnswers}`);
  }

  liveRows.push({
    day: route.day,
    component: path.basename(filePath),
    shared: usesSharedShell,
    legacy: usesLegacyProxy,
    domPatch: usesDomPatch,
    planned: plannedCount,
    assignmentId: manifestEntry?.assignmentId || "",
    readingAnswers,
    listeningAnswers,
  });
}

const grammarMapMatch = grammarSource.match(/B1:\s*\{([\s\S]*?)\n\s*\},\n\};/);
const extractB1DayFromComponentName = (value = "") =>
  Number(String(value).match(/^B1Day(\d+)/)?.[1] || 0);

const importedGrammarByComponent = new Map(
  [...grammarSource.matchAll(
    /import\s+(B1Day(\d+)\w+GrammarNotesPage)\s+from\s+"\.\/([^"]+)";/g,
  )].map((match) => {
    const alias = match[1];
    const aliasDay = Number(match[2]);
    const target = match[3];
    const targetDay = extractB1DayFromComponentName(target);

    return [
      alias,
      {
        aliasDay,
        target,
        targetDay,
        file: path.join(COMPONENT_ROOT, `${target}.js`),
      },
    ];
  }),
);

const mappedGrammarByDay = new Map(
  grammarMapMatch
    ? [...grammarMapMatch[1].matchAll(/\b(\d+)\s*:\s*([A-Za-z_$][\w$]*)/g)]
        .map((match) => [Number(match[1]), match[2]])
    : [],
);

const deepGrammarDays = new Set();
for (const day of expectedDays) {
  const component = mappedGrammarByDay.get(day);
  if (!component) continue;

  const imported = importedGrammarByComponent.get(component);
  if (!imported || imported.aliasDay !== day) {
    fail(
      "Grammar",
      `Day ${day} must map to its own B1Day${day}...GrammarNotesPage alias; found ${component}`,
    );
    continue;
  }
  if (imported.targetDay !== day) {
    fail(
      "Grammar",
      `Day ${day} grammar import is miswired: ${component} imports ./${imported.target} (Day ${imported.targetDay || "unknown"})`,
    );
    continue;
  }
  if (!fs.existsSync(imported.file)) {
    fail("Grammar", `Day ${day} mapped grammar file is missing: ${path.relative(ROOT, imported.file)}`);
    continue;
  }
  deepGrammarDays.add(day);
}

const missingDeepGrammar = expectedDays.filter((day) => !deepGrammarDays.has(day));
const expectedMissingDeepGrammar = [24, 25, 26, 27, 28];
const unexpectedMissingDeepGrammar = missingDeepGrammar.filter(
  (day) => !expectedMissingDeepGrammar.includes(day),
);
if (unexpectedMissingDeepGrammar.length) {
  fail(
    "Grammar",
    `additional days lost day-specific grammar notes: ${unexpectedMissingDeepGrammar.join(",")}`,
  );
}
if (missingDeepGrammar.length) {
  warn(
    "Grammar",
    `no day-specific deep grammar page for Days ${missingDeepGrammar.join(", ")}; these currently fall back to the B1 topic introduction`,
  );
}

const missingSheetLinks = b1Manifest
  .filter((entry) => !String(entry.answer_url || "").trim() || !String(entry.sheet_url || "").trim())
  .map((entry) => entry.assignmentId);

const allowedMissingSheetLinks = new Set(["B1-3.9"]);
for (const id of missingSheetLinks) {
  if (!allowedMissingSheetLinks.has(id)) fail("Answer sheets", `new missing answer-sheet link: ${id}`);
}
if (missingSheetLinks.length) {
  warn("Answer sheets", `missing answer_url/sheet_url for ${missingSheetLinks.join(", ")}`);
}

const grammarFiles = expectedDays
  .filter((day) => deepGrammarDays.has(day))
  .map((day) => {
    const component = mappedGrammarByDay.get(day);
    const imported = importedGrammarByComponent.get(component);
    return imported ? { day, file: imported.file } : null;
  })
  .filter(Boolean);

const noObviousEnglishSupport = [];
for (const item of grammarFiles) {
  const source = read(item.file);
  const stripped = source.replace(/import[^;]+;/g, " ");
  if (!/\b(English|meaning|means|use|used|because|when|example|sentence|subject|verb|translation|remember|tip|word order|clause)\b/i.test(stripped)) {
    noObviousEnglishSupport.push(item.day);
  }
}
if (noObviousEnglishSupport.length) {
  note(`Grammar English-support heuristic: review Days ${noObviousEnglishSupport.join(", ")} manually; no obvious English support marker was detected.`);
}

const customDays = liveRows.filter((row) => !row.shared).map((row) => row.day);
const legacyDays = liveRows.filter((row) => row.legacy).map((row) => row.day);
const domPatchDays = liveRows.filter((row) => row.domPatch).map((row) => row.day);
const plannedDays = liveRows.filter((row) => row.planned).map((row) => row.day);

console.log("B1 Days 1–28 structural/content audit");
console.log(`- routed workbooks: ${liveRows.length}/28`);
console.log(`- shared-shell workbooks: ${liveRows.filter((row) => row.shared).length}/28`);
console.log(`- custom workbook days: ${customDays.join(", ") || "none"}`);
console.log(`- legacy/V2 proxy days: ${legacyDays.join(", ") || "none"}`);
console.log(`- DOM-patched days: ${domPatchDays.join(", ") || "none"}`);
console.log(`- planned-placeholder days: ${plannedDays.join(", ") || "none"}`);
console.log(`- missing deep-grammar days: ${missingDeepGrammar.join(", ") || "none"}`);
console.log(`- missing answer-sheet-link assignments: ${missingSheetLinks.join(", ") || "none"}`);

for (const row of liveRows) {
  console.log(
    `  Day ${String(row.day).padStart(2, "0")} · ${row.assignmentId} · ${row.shared ? "shared" : "custom"}${row.legacy ? " · legacy-proxy" : ""}${row.domPatch ? " · DOM-patch" : ""} · Lesen ${row.readingAnswers} · Hören ${row.listeningAnswers}`,
  );
}

if (warnings.length) {
  console.log("\nKnown B1 migration debt:");
  for (const item of warnings) console.log(`- ${item}`);
}
if (notes.length) {
  console.log("\nAudit notes:");
  for (const item of notes) console.log(`- ${item}`);
}

if (failures.length) {
  console.error("\nB1 assignment consistency audit FAILED:");
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log("\nPASS B1 integrity is within the recorded migration baseline.");
