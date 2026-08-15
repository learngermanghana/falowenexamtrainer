import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "web/src/components/SelfLearningLessonRegistry.js");
let s = fs.readFileSync(file, "utf8");

const add = (before, after, already) => {
  if (s.includes(already)) return;
  if (!s.includes(before)) throw new Error(`C2 Days 22-28 patch anchor missing: ${already}`);
  s = s.replace(before, after);
};

add(
  'import { C2_DAY_15_TO_21_LESSONS } from "../data/c2Day15To21Mastery";',
  'import { C2_DAY_15_TO_21_LESSONS } from "../data/c2Day15To21Mastery";\nimport { C2_DAY_22_TO_28_LESSONS } from "../data/c2Day22To28Mastery";',
  'import { C2_DAY_22_TO_28_LESSONS } from "../data/c2Day22To28Mastery";'
);

add(
  '  C2: [...C2_DAY_1_TO_7_LESSONS,...C2_DAY_8_TO_14_LESSONS,...C2_DAY_15_TO_21_LESSONS],',
  '  C2: [...C2_DAY_1_TO_7_LESSONS,...C2_DAY_8_TO_14_LESSONS,...C2_DAY_15_TO_21_LESSONS,...C2_DAY_22_TO_28_LESSONS],',
  '...C2_DAY_22_TO_28_LESSONS'
);

add(
  'normalizedLevel === "C2" && day >= 8 && day <= 21',
  'normalizedLevel === "C2" && day >= 8 && day <= 28',
  'normalizedLevel === "C2" && day >= 8 && day <= 28'
);

fs.writeFileSync(file, s, "utf8");
console.log("Registered C2 Days 22-28 mastery lessons.");
await import("./patchC2CourseBookVisibility.mjs");
