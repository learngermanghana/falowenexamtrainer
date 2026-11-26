import { getB2ChapterThreePractice, getB2ChapterThreeReadingEvidence } from "./b2ChapterThreePractice";
import { getB2ChapterOnePractice } from "./b2ChapterOnePractice";
import { getB2ChapterTwoPractice } from "./b2ChapterTwoPractice";
import { getB2ReadingPractice } from "./b2ReadingPractice";
import { getB2GrammarLesson } from "./b2GrammarLessons";
import { getB2SkillFocus } from "./b2SkillCycle";

test.each([11,12,13,14,15])("Day %s has usable collocations and sentence transformations", day => {
  const practice = getB2ChapterThreePractice(day);
  expect(practice.vocabulary).toHaveLength(7);
  expect(new Set(practice.vocabulary.map(([de]) => de)).size).toBe(7);
  expect(practice.transformations.length).toBeGreaterThanOrEqual(5);
  expect(practice.vocabulary.every(row => row.length === 2 && row.every(value => value.trim()))).toBe(true);
  expect(practice.transformations.every(row => row.length === 3 && row.every(value => value.trim()))).toBe(true);
  expect(getB2ChapterOnePractice(day)).toBeNull();
  expect(getB2ChapterTwoPractice(day)).toBeNull();
});

test("Chapter 3 remains limited to Days 11–15 and preserves the skill rotation", () => {
  [10,16,29].forEach(day => expect(getB2ChapterThreePractice(day)).toBeNull());
  expect([11,12,13,14,15].map(getB2SkillFocus)).toEqual(["speak","write","lesen","hoeren","speak"]);
});

test("Day 14 explicitly teaches Konjunktiv I and distinguishes reported claims from facts", () => {
  const focus = getB2GrammarLesson(14).focuses.find(item => item.title === "indirekte Rede und Quellenangaben");
  expect(focus).toBeDefined();
  expect(focus.rules.join(" ")).toContain("er sei");
  expect(focus.rules.join(" ")).toContain("er habe");
  expect(focus.rules.join(" ")).toContain("er werde");
  expect(getB2ChapterThreePractice(14).transformations.map(row => row[1]).join(" ")).toContain("sei klein");
});

test("Day 13 reading evidence references the existing source paragraphs", () => {
  const practice = getB2ReadingPractice(13);
  practice.questions.forEach((_, index) => {
    const paragraph = getB2ChapterThreeReadingEvidence(13,index);
    expect(Number.isInteger(paragraph)).toBe(true);
    expect(practice.paragraphs[paragraph]).toBeTruthy();
  });
  expect(getB2ChapterThreeReadingEvidence(9,0)).toBeNull();
  expect(getB2ChapterThreeReadingEvidence(13,5)).toBeNull();
});
