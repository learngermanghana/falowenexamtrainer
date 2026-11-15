#!/usr/bin/env node
"use strict";

// Read the canonical learner-side A1 profile and timed-assignment definitions.
// Produce a conservative, reviewable CommonJS/Firestore-safe snapshot; unknown,
// timed, speaking and recording work must never be submitted by this pilot.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = name => readFileSync(resolve(root, name), "utf8");
const draftFile = "web/src/data/a1TutorDraftProfiles.js";
const timerFile = "web/src/data/timedAssignmentConfig.js";
const canonicalFile = "web/src/components/A1CanonicalSubmissionPanel.jsx";
const outputFile = "functions/data/chatgptA1SubmissionRules.generated.json";
const drafts = source(draftFile);
const timers = source(timerFile);
const canonical = source(canonicalFile);

// This module has no imports or browser effects. ESM is loaded in isolation
// from a data URL to avoid importing the rest of the client into the API.
if (/^\s*import\s/m.test(drafts)) throw Error("Draft profile gained imports; review generator before updating submission rules.");
const { A1_TUTOR_DRAFT_PROFILES: profiles } = await import(
  "data:text/javascript;base64," + Buffer.from(drafts).toString("base64")
);
if (!profiles || !Object.keys(profiles).length) throw Error("Canonical A1 draft profiles unavailable.");

// The two legacy special-case completeness branches must still be present
// and match the server snapshot. If their behavior changes, fail the build
// instead of silently allowing incomplete ChatGPT submissions.
const requiredGuards = [
  'normalizedAssignmentKey === "A1-0.2"',
  'missingRequiredNumbers(teil1Answers, 7)',
  'missingRequiredNumbers(teil2Answers, 5)',
  'normalizedAssignmentKey === "A1-3"',
  'missingRequiredNumbers(teil1Answers, 4)',
  'const familyText = (sections.get("teil-2") || []).join(" ").trim()',
  'missingRequiredNumbers(numberedAnswersForSection(sections, "teil-3"), 6)',
];
for (const part of requiredGuards) {
  if (!canonical.includes(part)) throw Error("Campus A1 completeness rule changed; review: " + part);
}
if (!canonical.includes("validateA1TutorDraftSubmissionSections(")) {
  throw Error("Campus no longer uses draft-profile completeness; review export.");
}

const phase = timers.match(/A1:\s*Object\.freeze\(\{\s*startDay:\s*(\d+)/);
if (!phase) throw Error("A1 timed phase is missing.");
const timedStartDay = Number(phase[1]);
if (!Number.isInteger(timedStartDay) || timedStartDay < 1) throw Error("Unsafe timed A1 start day.");
const timedAssignmentIds = [...new Set(
  [...timers.matchAll(/"(A1-[A-Za-z0-9._-]+)":\s*timed\(\{/g)].map(match => match[1])
)].sort();
if (!timedAssignmentIds.includes("A1-5.9") || !timedAssignmentIds.includes("A1-9")) {
  throw Error("Expected A1 timed checkpoint identifiers are missing.");
}

const supportedTextAssignments = {};
for (const assignmentId of Object.keys(profiles).sort()) {
  if (timedAssignmentIds.includes(assignmentId)) continue;
  const sections = profiles[assignmentId]?.sections || {};
  // Speech/recording or embedded essay submissions require Campus state.
  if (Object.values(sections).some(section => section.speaking || section.embeddedWriting)) continue;
  const required = {};
  for (const [key, section] of Object.entries(sections)) {
    if (section.required === false || section.readOnly) continue;
    if (section.writing) {
      required[key] = { kind: "text" };
    } else if (Array.isArray(section.items) && section.items.length) {
      const numbers = section.items.map(item => item.number);
      if (numbers.some(n => !Number.isInteger(n) || n < 1 || n > 99)) {
        throw Error("Invalid A1 question numbers: " + assignmentId + "/" + key);
      }
      required[key] = { kind: "numbered", numbers };
    } else {
      throw Error("Unsupported required A1 section type: " + assignmentId + "/" + key);
    }
  }
  if (Object.keys(required).length) supportedTextAssignments[assignmentId] = required;
}
// Chapter 3 uses a page-owned rubric, separate from draftProfiles, and its
// three required sections are guaranteed by the Campus guard assertions above.
supportedTextAssignments["A1-3"] = {
  "teil-1": { kind: "numbered", numbers: [1, 2, 3, 4] },
  "teil-2": { kind: "text" },
  "teil-3": { kind: "numbered", numbers: [1, 2, 3, 4, 5, 6] },
};
const sortedAssignments = Object.fromEntries(
  Object.entries(supportedTextAssignments).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
);
if (!sortedAssignments["A1-0.2"] || !sortedAssignments["A1-3"]) throw Error("A1 essential workbook guards missing.");

const snapshot = {
  schemaVersion: 1,
  generatedFrom: [draftFile, timerFile, canonicalFile],
  timedStartDay,
  timedAssignmentIds,
  supportedTextAssignments: sortedAssignments,
};
const rendered = JSON.stringify(snapshot, null, 2) + "\n";
const out = resolve(root, outputFile);
if (process.argv.includes("--check")) {
  if (source(outputFile) !== rendered) {
    console.error("ChatGPT A1 submission safety snapshot is stale. Run node scripts/generateChatgptA1SubmissionRules.mjs and review changes.");
    process.exitCode = 1;
  } else console.log("ChatGPT A1 completeness and timed-assignment snapshot matches canonical Campus sources.");
} else {
  writeFileSync(out, rendered);
  console.log("Generated answer-free ChatGPT A1 submission rules: " + outputFile);
}
