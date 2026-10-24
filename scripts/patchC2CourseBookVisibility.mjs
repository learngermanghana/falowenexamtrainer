import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "web/src/components/CourseTab.js");
let source = fs.readFileSync(file, "utf8");

const replaceOnce = (before, after, label) => {
  if (source.includes(after)) return;
  if (!source.includes(before)) throw new Error(`C2 Course Book patch anchor missing: ${label}`);
  source = source.replace(before, after);
};

replaceOnce(
  'const SELF_LEARNING_ONLY_LEVELS = new Set(["B2", "C1"]);',
  'const SELF_LEARNING_ONLY_LEVELS = new Set(["B2", "C1", "C2"]);',
  "C2 self-learning mode",
);

replaceOnce(
  '  if (normalizedLevel === "A1") {\n    return getCurriculumEntriesForLevel("A1");\n  }',
  '  if (normalizedLevel === "A1" || normalizedLevel === "C2") {\n    return getCurriculumEntriesForLevel(normalizedLevel);\n  }',
  "C2 canonical Course Book schedule",
);

if (!source.includes('SELF_LEARNING_ONLY_LEVELS = new Set(["B2", "C1", "C2"])')) {
  throw new Error("C2 self-learning mode missing.");
}
if (!source.includes('normalizedLevel === "A1" || normalizedLevel === "C2"')) {
  throw new Error("C2 canonical Course Book schedule missing.");
}

fs.writeFileSync(file, source, "utf8");
console.log("Exposed all 28 aligned C2 lessons in the Course Book from the canonical runtime manifest.");
await import("./patchB1Day2WritingCheatSheet.mjs");
