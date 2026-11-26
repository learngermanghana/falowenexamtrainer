import { getB2ChapterTwoPractice, getB2ChapterTwoReadingEvidence } from "./b2ChapterTwoPractice";
import { getB2ChapterOnePractice } from "./b2ChapterOnePractice";
import { getB2ReadingPractice } from "./b2ReadingPractice";
import { getB2GrammarLesson } from "./b2GrammarLessons";
import { getB2SkillFocus } from "./b2SkillCycle";

test.each([6,7,8,9,10])("Day %s has complete collocations and sentence practice", day => {
  const practice = getB2ChapterTwoPractice(day);
  expect(practice.vocabulary).toHaveLength(7);
  expect(practice.transformations.length).toBeGreaterThanOrEqual(4);
  expect(new Set(practice.vocabulary.map(([de]) => de)).size).toBe(7);
  expect(practice.vocabulary.every(row => row.length === 2 && row.every(value => value.trim()))).toBe(true);
  expect(practice.transformations.every(row => row.length === 3 && row.every(value => value.trim()))).toBe(true);
  expect(getB2ChapterOnePractice(day)).toBeNull();
});

test("Chapter 2 is limited to Days 6–10 and preserves skill rotation", () => {
  expect(getB2ChapterTwoPractice(5)).toBeNull();
  expect(getB2ChapterTwoPractice(11)).toBeNull();
  expect(getB2ChapterTwoPractice(29)).toBeNull();
  expect([6,7,8,9,10].map(getB2SkillFocus)).toEqual(["hoeren","speak","write","lesen","hoeren"]);
});

test("Day 6 explains passive alternatives as specified in the syllabus", () => {
  const focus = getB2GrammarLesson(6).focuses.find(item => item.title.includes("Passiv-Ersatzformen"));
  expect(focus).toBeDefined();
  expect(focus.pattern).toContain("sich");
  expect(focus.pattern).toContain("zu + Infinitiv");
  expect(getB2ChapterTwoPractice(6).transformations.map(row => row[1]).join(" ")).toContain("lässt sich");
});

test("Day 9 reading evidence references existing paragraphs", () => {
  const practice = getB2ReadingPractice(9);
  practice.questions.forEach((_,index) => {
    const paragraph = getB2ChapterTwoReadingEvidence(9,index);
    expect(Number.isInteger(paragraph)).toBe(true);
    expect(practice.paragraphs[paragraph]).toBeTruthy();
  });
  expect(getB2ChapterTwoReadingEvidence(5,0)).toBeNull();
  expect(getB2ChapterTwoReadingEvidence(9,5)).toBeNull();
});
