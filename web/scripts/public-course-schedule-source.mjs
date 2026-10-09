import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

const canonicalPath = path.join(repoRoot, "shared", "curriculumCanonical.json");
const c2ExamPath = path.join(repoRoot, "web", "src", "data", "c2ExamStandardContent.js");
const c2TopicPath = path.join(repoRoot, "web", "src", "data", "c2TopicKnowledge.js");

const canonicalLessons = JSON.parse(await fs.readFile(canonicalPath, "utf8"));

const c2ExamSource = await fs.readFile(c2ExamPath, "utf8");
const c2TopicSource = await fs.readFile(c2TopicPath, "utf8");

const c2ExamRows = new Map(
  [...c2ExamSource.matchAll(/\[(\d+),"([^"]+)","([^"]+)","([^"]+)",\[/g)]
    .map((match) => [
      Number(match[1]),
      {
        day: Number(match[1]),
        title: match[2],
        grammarTopic: match[3],
        topic: match[4],
      },
    ]),
);

const c2Chapters = new Map(
  [...c2TopicSource.matchAll(/(?:^|\n)\s*(\d+)\s*:\s*\{\s*chapter\s*:\s*"([^"]+)"/g)]
    .map((match) => [Number(match[1]), match[2]]),
);

if (c2ExamRows.size !== 28) {
  throw new Error(`Expected 28 C2 exam-standard rows, found ${c2ExamRows.size}.`);
}

const c2PublicLessons = Array.from({ length: 28 }, (_, index) => {
  const day = index + 1;
  const row = c2ExamRows.get(day);
  if (!row) throw new Error(`Missing C2 exam-standard row for Day ${day}.`);
  return {
    level: "C2",
    day,
    sequence: day,
    chapter: c2Chapters.get(day) || "",
    title: row.title,
    grammar_topic: row.grammarTopic,
    topic: row.title,
  };
});

const germanLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const courseSchedules = Object.fromEntries(
  germanLevels.map((level) => {
    const sourceLessons =
      level === "C2"
        ? c2PublicLessons
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

export { courseSchedules };
export default courseSchedules;
