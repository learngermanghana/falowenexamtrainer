import { getB2ChapterOnePractice, getB2ChapterOneReadingEvidence } from "./b2ChapterOnePractice";
import { getB2ReadingPractice } from "./b2ReadingPractice";
import { getB2GrammarLesson } from "./b2GrammarLessons";

test.each([1,2,3,4,5])("Day %s contains usable collocations and transformations", day => {
  const practice = getB2ChapterOnePractice(day);
  expect(practice.vocabulary).toHaveLength(7);
  expect(practice.transformations.length).toBeGreaterThanOrEqual(4);
  expect(new Set(practice.vocabulary.map(([de]) => de)).size).toBe(7);
  for (const row of [...practice.vocabulary, ...practice.transformations]) {
    expect(row.every(value => typeof value === "string" && value.trim().length > 0)).toBe(true);
  }
});
test("chapter content does not leak into later days", () => {
  expect(getB2ChapterOnePractice(6)).toBeNull();
  expect(getB2ChapterOnePractice(29)).toBeNull();
});
test("Day 2 teaches the difference between process and state passive", () => {
  expect(getB2GrammarLesson(2).focuses.map(item => item.title)).toEqual(expect.arrayContaining(["Passiv", "Zustandspassiv", "Modalpassiv"]));
});
test.each([1,5])("Day %s reading evidence points to real paragraphs", day => {
  const practice = getB2ReadingPractice(day);
  practice.questions.forEach((_, index) => {
    const paragraph = getB2ChapterOneReadingEvidence(day,index);
    expect(Number.isInteger(paragraph)).toBe(true);
    expect(practice.paragraphs[paragraph]).toBeTruthy();
  });
});
