// A1 course-book cards use canonical lesson IDs with clearer display titles.

import { getLessonsByLevel, getLessonDisplayData } from "./lessonCatalog.js";
import { applyA1LessonTitleOverride } from "./a1LessonTitleOverrides.js";

const A1_COURSE_BOOK_CARDS = Object.freeze(getLessonsByLevel("A1").map((sourceLesson) => {
  const lesson = applyA1LessonTitleOverride(sourceLesson);
  return Object.freeze({
    lessonId: lesson.id,
    ...getLessonDisplayData(lesson),
    chapter: lesson.chapter,
    title: lesson.title,
    assessmentType: lesson.submissionRequired ? "tutor-marked" : "self-practice",
    assignmentId: lesson.assignmentId,
    resourceSection: lesson.kind || "lesen_hören",
    submissionRequired: lesson.submissionRequired,
    progressionEligible: lesson.progressionEligible,
    ...(Object.prototype.hasOwnProperty.call(lesson, "grammarPage") ? { grammarPage: lesson.grammarPage || "" } : {}),
    ...(Object.prototype.hasOwnProperty.call(lesson, "workbookRoute") ? { workbookRoute: lesson.workbookRoute || "" } : {}),
  });
}));
const normalizeA1Token=(value="")=>String(value||"").trim().toLowerCase().replace(/\s+/g," ");
const getA1CourseBookCard=({displayDay,chapter,assignmentId,title}={})=>{
  const day=Number(displayDay);
  const normalizedChapter=String(chapter||"").trim();
  const normalizedAssignmentId=String(assignmentId||"").trim().toUpperCase();
  const normalizedTitle=normalizeA1Token(title);
  const exact=A1_COURSE_BOOK_CARDS.find((card)=>Number(card.displayDay)===day&&card.chapter===normalizedChapter);
  if(exact)return exact;
  return A1_COURSE_BOOK_CARDS.find((card)=>normalizedAssignmentId&&String(card.assignmentId||"").trim().toUpperCase()===normalizedAssignmentId&&(!Number.isFinite(day)||Number(card.displayDay)===day)&&(!normalizedTitle||normalizeA1Token(card.title)===normalizedTitle))||null;
};
export {A1_COURSE_BOOK_CARDS,getA1CourseBookCard};
