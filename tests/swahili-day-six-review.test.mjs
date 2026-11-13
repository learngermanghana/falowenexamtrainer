import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const source = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const teacher = source("../web/src/components/SwahiliTeacherDayOne.jsx");
const day6 = source("../web/src/components/SwahiliDaySixWorkbook.jsx");
const day1 = source("../web/src/components/SwahiliCourseBook.jsx");

test("Day 6 and Day 1 share one guarded teacher review component", () => {
  assert.match(day6, /teacherView\) return isTeacher/);
  assert.match(day6, /<SwahiliTeacherDayOne basePath=\{basePath\} day=\{6\}/);
  assert.match(day1, /<SwahiliTeacherDayOne basePath=\{basePath\}/);
  assert.match(teacher, /reviewDay === 6 \? SWAHILI_DAY_SIX : SWAHILI_DAY_ONE/);
});
test("Reviews use lesson-specific keys and canonical owner validation", () => {
  assert.match(teacher, /reviewDay === 1 \? studentId : `\$\{studentId\}_day-6`/);
  assert.match(teacher, /canonicalSwahiliSubmission\(entry, reviewDay\)/);
  assert.match(teacher, /where\("lessonId", "==", `swahili-day-\$\{reviewDay\}`\)/);
  assert.match(teacher, /orderBy\("submittedAt", "desc"\)/);
  assert.match(teacher, /limit\(25\)/);
  assert.match(teacher, /startAfter\(lastDocument\)/);
  assert.match(teacher, /setDoc\(doc\(db, "swahiliTeacherReviews", reviewDocId\(selected.studentId\)\)/);
  assert.match(day6, /getDoc\(doc\(db, "swahiliTeacherReviews", `\$\{user.uid\}_day-6`\)\)/);
  assert.match(day6, /snapshot.data\(\).lessonId === "swahili-day-6"/);
});
test("Day 6 teacher can see restaurant submissions and students see feedback", () => {
  assert.match(teacher, /selected.writing\?\.likes/);
  assert.match(teacher, /selected.writing\?\.dislikes/);
  assert.match(teacher, /selected.writing\?\.order/);
  assert.match(teacher, /lesson.reading.map/);
  assert.match(day6, /Teacher feedback/);
  assert.match(day6, /\?teacher=1/);
});
