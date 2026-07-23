import { getC1KnowledgeItems } from "./C1KnowledgeChoicePractice";
import day1 from "../data/selfLearningLessons/c1/day1ZieleUndLernweg";
import day2 from "../data/selfLearningLessons/c1/day2KulturUndIdentitaet";
import day3 from "../data/selfLearningLessons/c1/day3MedienUndInformationskompetenz";
import day4 from "../data/selfLearningLessons/c1/day4BeziehungenUndTeamarbeit";
import day5 from "../data/selfLearningLessons/c1/day5BeruflicheEntwicklung";
import day6 from "../data/selfLearningLessons/c1/day6GesundheitUndLebensstil";
import day7 from "../data/selfLearningLessons/c1/day7ReisenUndNachhaltigkeit";
import day8 from "../data/selfLearningLessons/c1/day8WohnenUndStadtentwicklung";
import day9 from "../data/selfLearningLessons/c1/day9KonsumUndWerbung";
import day10 from "../data/selfLearningLessons/c1/day10IntegrationUndGesellschaft";
import day11 from "../data/selfLearningLessons/c1/day11EngagementUndEhrenamt";
import day12 from "../data/selfLearningLessons/c1/day12FreizeitUndKultur";

const lessons = [day1, day2, day3, day4, day5, day6, day7, day8, day9, day10, day11, day12];

describe("C1 Day 1-12 Learn knowledge coverage", () => {
  test("every lesson has multiple clickable knowledge questions with a valid correct option", () => {
    expect(lessons).toHaveLength(12);

    lessons.forEach((lesson, index) => {
      expect(Number(lesson.day)).toBe(index + 1);
      const items = getC1KnowledgeItems(lesson);
      expect(items.length).toBeGreaterThanOrEqual(3);
      items.forEach((item) => {
        expect(item.options).toContain(item.answer);
        expect(item.explanation).toBeTruthy();
      });
    });
  });
});
