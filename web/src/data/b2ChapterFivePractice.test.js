import { getB2ChapterFivePractice, getB2ChapterFiveReadingEvidence } from "./b2ChapterFivePractice";
import { getB2ChapterFourPractice } from "./b2ChapterFourPractice";
import { getB2ReadingPractice } from "./b2ReadingPractice";
import { getB2SkillFocus } from "./b2SkillCycle";

test.each([21,22,23,24,25])("Day %s contains usable vocabulary and transformations", day => {
  const practice = getB2ChapterFivePractice(day);
  expect(practice.vocabulary).toHaveLength(7);
  expect(new Set(practice.vocabulary.map(([de]) => de)).size).toBe(7);
  expect(practice.transformations.length).toBeGreaterThanOrEqual(6);
  expect(practice.vocabulary.every(row => row.length === 2 && row.every(value => value.trim()))).toBe(true);
  expect(practice.transformations.every(row => row.length === 3 && row.every(value => value.trim()))).toBe(true);
  expect(getB2ChapterFourPractice(day)).toBeNull();
});

test("Chapter 5 is limited to Days 21–25 and preserves skill rotation", () => {
  [20,26,29].forEach(day => expect(getB2ChapterFivePractice(day)).toBeNull());
  expect([21,22,23,24,25].map(getB2SkillFocus)).toEqual(["lesen","hoeren","speak","write","lesen"]);
});

test("Chapter 5 exercises practise the syllabus structures in context", () => {
  const answers = day => getB2ChapterFivePractice(day).transformations.map(row => row[1]).join(" ");
  expect(answers(21)).toContain("könnte");
  expect(answers(21)).toContain("dadurch nachvollziehbar, dass");
  expect(answers(22)).toContain("Je mehr Aufgaben automatisiert werden, desto");
  expect(answers(23)).toContain("über den");
  expect(answers(24)).toContain("sofern");
  expect(answers(25)).toContain("Trotz hoher Besucherzahlen");
});

test.each([21,25])("Day %s reading evidence references existing source paragraphs", day => {
  const practice = getB2ReadingPractice(day);
  practice.questions.forEach((_, index) => {
    const paragraph = getB2ChapterFiveReadingEvidence(day,index);
    expect(Number.isInteger(paragraph)).toBe(true);
    expect(practice.paragraphs[paragraph]).toBeTruthy();
  });
  expect(getB2ChapterFiveReadingEvidence(day,5)).toBeNull();
});
