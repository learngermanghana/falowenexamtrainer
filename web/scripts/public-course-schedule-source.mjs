import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { C2_COURSE_BOOK_ENTRIES } from "../src/data/c2CourseBookEntries.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

const canonicalPath = path.join(repoRoot, "shared", "curriculumCanonical.json");
const frenchPath = path.join(repoRoot, "web", "src", "data", "frenchCourseSchedule.js");

const canonicalLessons = JSON.parse(await fs.readFile(canonicalPath, "utf8"));

const germanLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const courseSchedules = Object.fromEntries(
  germanLevels.map((level) => {
    const sourceLessons =
      level === "C2"
        ? C2_COURSE_BOOK_ENTRIES
        : canonicalLessons.filter((lesson) => String(lesson?.level || "").toUpperCase() === level);

    return [
      level,
      sourceLessons
        .slice()
        .sort((left, right) => Number(left?.sequence || left?.day || 0) - Number(right?.sequence || right?.day || 0))
        .map((lesson) => ({
          day: lesson.day,
          chapter: lesson.chapter,
          topic: lesson.title || lesson.topic,
          grammar_topic: lesson.grammar_topic || lesson.grammarTopic || lesson.grammarFocus || "",
        })),
    ];
  }),
);

const frenchSource = await fs.readFile(frenchPath, "utf8");
const frenchMatch = frenchSource.match(/export\s+const\s+FRENCH_A1_SCHEDULE\s*=\s*(\[[\s\S]*\])\s*;?\s*$/);
if (!frenchMatch) {
  throw new Error("Could not parse FRENCH_A1_SCHEDULE for the public catalogue.");
}

// This evaluates only the repository-controlled array literal from
// frenchCourseSchedule.js. It does not import any frontend application module.
courseSchedules.FRENCH_A1 = Function(`"use strict"; return (${frenchMatch[1]});`)();

export { courseSchedules };
export default courseSchedules;
