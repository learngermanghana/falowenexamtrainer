import { getB2ChapterSixPractice } from "./b2ChapterSixPractice";
import { getB2SkillFocus } from "./b2SkillCycle";
import { getB2MockReviewPlans } from "./b2MockReviewPlans";

test.each([26,27,28])("Day %s has seven collocations and usable model sentences", day => {
  const practice = getB2ChapterSixPractice(day);
  expect(practice.vocabulary).toHaveLength(7);
  expect(new Set(practice.vocabulary.map(([de]) => de)).size).toBe(7);
  expect(practice.transformations.length).toBeGreaterThanOrEqual(5);
  expect(practice.vocabulary.every(row => row.length === 2 && row.every(value => value.trim()))).toBe(true);
  expect(practice.transformations.every(row => row.length === 3 && row.every(value => value.trim()))).toBe(true);
});
test("Chapter 6 excludes the final mock from study exercises", () => {
  expect(getB2ChapterSixPractice(25)).toBeNull();
  expect(getB2ChapterSixPractice(29)).toBeNull();
  expect([26,27,28].map(getB2SkillFocus)).toEqual(["hoeren","speak","write"]);
  expect(getB2SkillFocus(29)).toBeNull();
});
test("Day 29 targets only modules below 15/25, equivalent to 60 percent", () => {
  const plans = getB2MockReviewPlans({ lesen: 14.9, hoeren: 15, schreiben: 12, sprechen: 20 });
  expect(plans.map(plan => plan.key)).toEqual(["lesen","schreiben"]);
  plans.forEach(plan => expect(plan.days).toHaveLength(3));
  expect(getB2MockReviewPlans({ lesen: 15, hoeren: 15, schreiben: 15, sprechen: 15 })).toEqual([]);
  expect(getB2MockReviewPlans({ lesen: undefined, hoeren: null, schreiben: NaN })).toEqual([]);
});
