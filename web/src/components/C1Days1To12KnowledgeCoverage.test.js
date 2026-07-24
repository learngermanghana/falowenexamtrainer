import fs from "fs";
import path from "path";
import { getC1KnowledgeItems } from "./C1KnowledgeChoicePractice";
import { getC1SpeakGrammarData } from "./C1SpeakGrammarGuide";
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

const readComponent = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("C1 Day 1-12 Learn and Speak coverage", () => {
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

  test("every lesson keeps full grammar data for the Speak stage", () => {
    lessons.forEach((lesson) => {
      const guide = getC1SpeakGrammarData(lesson);
      expect(guide.grammarTitle).toBeTruthy();
      expect(guide.grammarFocus).toBeTruthy();
      expect(guide.explanations.length).toBeGreaterThan(0);
      expect(guide.rules.length).toBeGreaterThan(0);
      expect(guide.examples.length).toBeGreaterThan(0);
      expect(guide.question).toBeTruthy();
    });
  });

  test("all C1 guided page blocks mount the shared Speak grammar guide", () => {
    const earlySource = readComponent("C1Day1To6GuidedLessonPage.js");
    const middleSource = readComponent("C1Day8To10GuidedLessonPage.js");
    const day12Source = readComponent("C1Day12To14GuidedLessonPage.js");

    expect(earlySource).toContain('import C1SpeakGrammarGuide from "./C1SpeakGrammarGuide"');
    expect(earlySource).toContain("<C1SpeakGrammarGuide lesson={lesson}");
    expect(middleSource).toContain('import C1SpeakGrammarGuide from "./C1SpeakGrammarGuide"');
    expect(middleSource).toContain("<C1SpeakGrammarGuide lesson={lesson}");
    expect(day12Source).toContain('import C1SpeakGrammarGuide from "./C1SpeakGrammarGuide"');
    expect(day12Source).toContain("day === 12 ? <C1SpeakGrammarGuide lesson={lesson} />");
  });

  test("C1 Day 12 Learn and Speak use the intended Freizeit und Kultur grammar", () => {
    const source = JSON.stringify({
      grammarFocus: day12.grammarFocus,
      grammarLesson: day12.grammarLesson,
      speakingBuilder: day12.speakingBuilder,
    });

    expect(source).toContain("im Hinblick auf");
    expect(source).toContain("insofern");
    expect(source).toContain("einerseits");
    expect(source).toContain("andererseits");
    expect(source).toContain("je ... desto");
    expect(day12.speakingBuilder.branches.length).toBeGreaterThanOrEqual(6);
    expect(day12.speakingBuilder.branches.every((branch) => Boolean(branch.prompt))).toBe(true);
  });
});
