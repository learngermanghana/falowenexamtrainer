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
  'import { getAccessibleLevels, LEVEL_ORDER, normalizeCourseLevel } from "../utils/levelAccess";',
  'import { getAccessibleLevels, LEVEL_ORDER, normalizeCourseLevel } from "../utils/levelAccess";\nimport { C2_DAY_1_TO_7_LESSONS } from "../data/c2Day1To7Mastery";\nimport { C2_DAY_8_TO_14_LESSONS } from "../data/c2Day8To14Mastery";\nimport { C2_DAY_15_TO_21_LESSONS } from "../data/c2Day15To21Mastery";\nimport { C2_DAY_22_TO_28_LESSONS } from "../data/c2Day22To28Mastery";',
  "C2 lesson imports",
);

replaceOnce(
  'const SELF_LEARNING_ONLY_LEVELS = new Set(["B2", "C1"]);',
  'const SELF_LEARNING_ONLY_LEVELS = new Set(["B2", "C1", "C2"]);',
  "C2 self-learning mode",
);

replaceOnce(
  'const { schedules: mergedCourseSchedules, derivedLevels } = buildLevelSchedules();',
  'const { schedules: baseMergedCourseSchedules, derivedLevels } = buildLevelSchedules();\nconst C2_COURSE_BOOK_SCHEDULE = [\n  ...C2_DAY_1_TO_7_LESSONS,\n  ...C2_DAY_8_TO_14_LESSONS,\n  ...C2_DAY_15_TO_21_LESSONS,\n  ...C2_DAY_22_TO_28_LESSONS,\n].map((lesson) => ({\n  ...lesson,\n  topic: lesson.topic || lesson.title,\n  grammar_topic: lesson.grammarFocus || lesson.c2Mastery?.grammarFocus || null,\n  instruction: "C2 self-learning mastery lesson: vocabulary, collocations, style contrast, nuance, reformulation and production.",\n}));\nconst mergedCourseSchedules = { ...baseMergedCourseSchedules, C2: C2_COURSE_BOOK_SCHEDULE };',
  "C2 Course Book schedule",
);

if (!source.includes('SELF_LEARNING_ONLY_LEVELS = new Set(["B2", "C1", "C2"])')) throw new Error("C2 self-learning mode missing.");
if (!source.includes("C2_COURSE_BOOK_SCHEDULE")) throw new Error("C2 Course Book schedule missing.");

fs.writeFileSync(file, source, "utf8");
console.log("Exposed all 28 C2 mastery lessons in the Course Book for C2-level profiles.");
