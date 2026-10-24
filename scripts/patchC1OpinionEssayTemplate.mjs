import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePath = path.join(root, "web/src/components/GuidedWritingWorkspace.js");
const source = fs.readFileSync(filePath, "utf8");

const requiredCoreMarkers = [
  "export const C1_OPINION_ESSAY_TEMPLATE =",
  "const PLANNING_NOTES_PLACEHOLDER =",
];

for (const marker of requiredCoreMarkers) {
  if (!source.includes(marker)) {
    throw new Error(`C1 guided-writing marker missing: ${marker}`);
  }
}

const hasMigrationHelper =
  source.includes("migrateC1OpinionTemplateDraft") &&
  source.includes("const storedFinalEssay = migrateC1OpinionTemplateDraft");

if (!hasMigrationHelper) {
  throw new Error(
    "The C1 template migration helper is missing from GuidedWritingWorkspace.js.",
  );
}

// This compatibility hook deliberately does not replace the active template.
// The following patchC1GoetheEssayTemplate.mjs step owns the current
// Goethe-aligned wording. Keeping this script read-only prevents an older
// advantages/disadvantages template from overwriting or rejecting it.
console.log(
  "C1 opinion-template compatibility and legacy-draft migration checks passed.",
);
