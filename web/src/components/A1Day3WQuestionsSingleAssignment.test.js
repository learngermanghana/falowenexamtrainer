import fs from "fs";
import path from "path";
import { getLessonsByLevel } from "../data/lessonCatalog";
import { getA1CourseLessonNeighbors, getA1CanonicalLessonForLegacyRoute } from "../data/a1CanonicalLessonCatalog";

test("A1 Day 3 has a single current 1.2 assignment while keeping past deep links readable", () => {
  const lessons = getLessonsByLevel("A1").filter(lesson => Number(lesson.day) === 3);
  expect(lessons).toHaveLength(1);
  expect(lessons[0]).toMatchObject({
    id: "A1-1.2",
    chapter: "1.2",
    submissionRequired: true,
    workbookRoute: "/campus/course/a1-day-3-pronouns-introducing-yourself-workbook",
  });
  expect(getA1CourseLessonNeighbors("0.2").next?.routeKey).toBe("1.2");
  expect(getA1CourseLessonNeighbors("1.2").next?.routeKey).toBe("2");
  expect(getA1CanonicalLessonForLegacyRoute({ day: 3, identity: "1.1-PRACTICE" })?.kind).toBe("practice");
});

test("Day 3 grammar introduces only starter W-words; graded 1.2 workbook stays unchanged", () => {
  const grammar = fs.readFileSync(path.join(__dirname, "A1Day3Kapitel12GrammarNotesPage.js"), "utf8");
  const workbook = fs.readFileSync(path.join(__dirname, "A1Day3PronounsIntroducingYourselfWorkbookPage.js"), "utf8");
  const schedule = fs.readFileSync(path.join(__dirname, "../data/courseSchedule.js"), "utf8");
  expect(grammar).toContain('data-a1-day3-starter-w-questions="true"');
  expect(grammar).toContain('"Wie?"');
  expect(grammar).toContain('"Wo?"');
  expect(grammar).toContain('"Woher?"');
  expect(grammar).toContain("Day 5");
  expect(workbook).toContain('fallbackAssignmentKey="A1-1.2"');
  expect(workbook).toContain("Teil 1 · Lesen");
  expect(workbook).toContain("Teil 2 · Schreiben (Exercise)");
  expect(workbook).toContain("Teil 3 · Hören");
  const day3 = schedule.slice(schedule.indexOf('topic: "Present-Tense Verb Conjugation and First W-Questions"'));
  expect(day3.slice(0, 1200)).not.toContain("a1-day-3-schreiben-sprechen-kapitel-1-1-workbook");
});
