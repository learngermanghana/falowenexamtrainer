import { getB2ChapterFourPractice, getB2ChapterFourReadingEvidence } from "./b2ChapterFourPractice";
import { getB2ChapterThreePractice } from "./b2ChapterThreePractice";
import { getB2ReadingPractice } from "./b2ReadingPractice";
import { getB2SkillFocus } from "./b2SkillCycle";

test.each([16,17,18,19,20])("Day %s contains complete optional vocabulary and grammar practice", day => {
  const practice = getB2ChapterFourPractice(day);
  expect(practice.vocabulary).toHaveLength(7);
  expect(new Set(practice.vocabulary.map(([de]) => de)).size).toBe(7);
  expect(practice.transformations.length).toBeGreaterThanOrEqual(5);
  expect(practice.vocabulary.every(row => row.length === 2 && row.every(value => value.trim()))).toBe(true);
  expect(practice.transformations.every(row => row.length === 3 && row.every(value => value.trim()))).toBe(true);
  expect(getB2ChapterThreePractice(day)).toBeNull();
});

test("Chapter 4 is confined to Days 16–20 and preserves the skill rotation", () => {
  [15,21,29].forEach(day => expect(getB2ChapterFourPractice(day)).toBeNull());
  expect([16,17,18,19,20].map(getB2SkillFocus)).toEqual(["write","lesen","hoeren","speak","write"]);
});

test("Chapter 4 covers the syllabus grammar with practical examples", () => {
  const answers = day => getB2ChapterFourPractice(day).transformations.map(row => row[1]).join(" ");
  expect(answers(16)).toContain("Dennoch");
  expect(answers(17)).toContain("ohne auf verlässliche Betreuung zu verzichten");
  expect(answers(18)).toContain("anerkannt worden");
  expect(answers(19)).toContain("Trotzdem");
  expect(answers(20)).toContain("auf der");
  expect(answers(20)).toContain("wodurch");
});

test("Day 17 reading evidence references the existing source paragraphs", () => {
  const practice = getB2ReadingPractice(17);
  practice.questions.forEach((_, index) => {
    const paragraph = getB2ChapterFourReadingEvidence(17,index);
    expect(Number.isInteger(paragraph)).toBe(true);
    expect(practice.paragraphs[paragraph]).toBeTruthy();
  });
  expect(getB2ChapterFourReadingEvidence(13,0)).toBeNull();
  expect(getB2ChapterFourReadingEvidence(17,5)).toBeNull();
});
