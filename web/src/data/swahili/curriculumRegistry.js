import { SWAHILI_A1_CURRICULUM } from "./a1Curriculum";
import titles from "./a2B1TitleDictionary.json";

export const SWAHILI_LEVELS = ["A1", "A2", "B1"];
export const SWAHILI_CURRICULUM = Object.fromEntries(SWAHILI_LEVELS.map(level => [
  level, (level === "A1" ? SWAHILI_A1_CURRICULUM : titles[level]).map(lesson => {
    const published = level === "A1" ? lesson.status !== "coming-soon" : lesson.status === "workbook";
    const lessonDoc = level === "A1" ? "day-" + lesson.day : level.toLowerCase() + "-day-" + lesson.day;
    return { ...lesson, level, id: "swahili-" + lessonDoc, lessonDoc, published,
      required: published && !lesson.practiceOnly,
      route: level === "A1" ? "/day-" + lesson.day : "/" + level.toLowerCase() + "/day-" + lesson.day };
  })
]));
export const SWAHILI_ASSIGNMENTS = SWAHILI_LEVELS.flatMap(level => SWAHILI_CURRICULUM[level].filter(lesson => lesson.required));
export const reviewDocumentId = (uid, lesson) => lesson.lessonDoc === "day-1" ? uid : uid + "_" + lesson.lessonDoc;
export const isSubmitted = work => Boolean(work && (work.status === "submitted" || (!work.status && work.submittedAt)));
export function summarizeSwahiliLevel(level, records) {
  const lessons = SWAHILI_CURRICULUM[level] || [];
  const published = lessons.filter(lesson => lesson.published);
  const required = published.filter(lesson => lesson.required);
  const record = lesson => records?.find(row => row.lessonDoc === lesson.lessonDoc);
  const known = Array.isArray(records);
  const completed = required.filter(lesson => record(lesson)?.submitted).length;
  const reviewed = required.filter(lesson => record(lesson)?.review?.status === "reviewed").length;
  const scores = required.map(lesson => record(lesson)?.review?.score).filter(Number.isInteger);
  const revision = required.find(lesson => record(lesson)?.review?.status === "needs_revision");
  const next = revision || required.find(lesson => !record(lesson)?.submitted) || published[0] || null;
  return { lessons, published, required, completed, reviewed, known, next,
    average: known && scores.length ? Math.round(scores.reduce((a,b) => a+b,0)/scores.length) : null,
    percent: known && required.length ? Math.round(completed / required.length * 100) : null,
    allSubmitted: known && required.length > 0 && completed === required.length && !revision };
}
