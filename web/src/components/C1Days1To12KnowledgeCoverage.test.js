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
const earlyLessons = lessons.slice(0, 5);
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

  test("every lesson keeps full grammar data for Learn and speaking data for Speak", () => {
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

  test("C1 Days 1-5 contain a complete self-tutoring path", () => {
    earlyLessons.forEach((lesson) => {
      expect(lesson.explanation.length).toBeGreaterThanOrEqual(2);
      expect(lesson.grammarLesson.explanation.length).toBeGreaterThanOrEqual(2);
      expect(lesson.grammarLesson.rules.length).toBeGreaterThanOrEqual(4);
      expect(lesson.grammarLesson.examples.length).toBeGreaterThanOrEqual(4);
      expect(lesson.grammarLesson.miniExercise).toBeTruthy();
      expect(getC1KnowledgeItems(lesson).length).toBeGreaterThanOrEqual(4);
      expect(lesson.speakingTopic).toBeTruthy();
      expect(lesson.writingTopic).toBeTruthy();
      expect(lesson.writingBuilder.structure.length).toBeGreaterThanOrEqual(5);
      expect(lesson.writingBuilder.usefulLines.length).toBeGreaterThanOrEqual(5);
      expect(lesson.tasks.speaking).toBeTruthy();
      expect(lesson.tasks.writing).toBeTruthy();
    });
  });

  test("C1 Days 1-5 give students real speaking content instead of a bare question", () => {
    const day2Branches = require("../data/selfLearningLessons/c1/day2LearningSpeakingGuide").default.speaking.branches;
    const branchSets = [day1.speakingBuilder.branches, day2Branches, day3.speakingBuilder.branches, day4.speakingBuilder.branches, day5.speakingBuilder.branches];
    branchSets.forEach((branches) => {
      expect(branches.length).toBeGreaterThanOrEqual(5);
      expect(branches.every((branch) => branch.title && Array.isArray(branch.keywords) && branch.keywords.length >= 4)).toBe(true);
    });
    expect(day1.speakingBuilder.branches.every((branch) => branch.prompt && branch.example && branch.starter)).toBe(true);
    expect(day2Branches.every((branch) => branch.prompt && branch.example)).toBe(true);
    expect(day3.speakingBuilder.branches.every((branch) => branch.prompt && branch.example && branch.starter)).toBe(true);
  });

  test("shared C1 speaking guide supports gradual removal of help", () => {
    const guideSource = readComponent("C1SpeakGrammarGuide.js");
    expect(guideSource).toContain("1. Mit Hilfe");
    expect(guideSource).toContain("2. Weniger Hilfe");
    expect(guideSource).toContain("3. Prüfungsmodus");
    expect(guideSource).toContain("So kannst du den Punkt entwickeln:");
    expect(guideSource).toContain("Aussage → Grund → Beispiel → Folge");
  });

  test("shared C1 Learn practice owns the grammar lesson while Speak defaults to speaking only", () => {
    const knowledgeSource = readComponent("C1KnowledgeChoicePractice.js");
    const guideSource = readComponent("C1SpeakGrammarGuide.js");
    expect(knowledgeSource).toContain('<C1SpeakGrammarGuide lesson={lesson} showGrammar showSpeaking={false} />');
    expect(guideSource).toContain("showGrammar = false");
    expect(guideSource).toContain("showSpeaking = true");
    expect(guideSource).toContain("Grammar lesson");
  });

  test("all guided C1 speaking blocks keep the shared speaking guide without moving grammar back to Speak", () => {
    const earlySource = readComponent("C1Day1To6GuidedLessonPage.js");
    const middleSource = readComponent("C1Day8To10GuidedLessonPage.js");
    const day12Source = readComponent("C1Day12To14GuidedLessonPage.js");
    expect(earlySource).toContain('import C1SpeakGrammarGuide from "./C1SpeakGrammarGuide"');
    expect(earlySource).toContain("<C1SpeakGrammarGuide lesson={lesson}");
    expect(middleSource).toContain('import C1SpeakGrammarGuide from "./C1SpeakGrammarGuide"');
    expect(middleSource).toContain("<C1SpeakGrammarGuide lesson={lesson}");
    expect(day12Source).toContain('import C1SpeakGrammarGuide from "./C1SpeakGrammarGuide"');
    expect(day12Source).toContain("day === 12 ? <C1SpeakGrammarGuide lesson={lesson} />");
    expect(day12Source).toContain("day === 12 ? <C1KnowledgeChoicePractice lesson={lesson}");
  });

  test("C1 Day 12 Learn and Speak use the intended Freizeit und Kultur grammar", () => {
    const source = JSON.stringify({ grammarFocus: day12.grammarFocus, grammarLesson: day12.grammarLesson, speakingBuilder: day12.speakingBuilder });
    expect(source).toContain("im Hinblick auf");
    expect(source).toContain("insofern");
    expect(source).toContain("einerseits");
    expect(source).toContain("andererseits");
    expect(source).toContain("je ... desto");
    expect(day12.speakingBuilder.branches.length).toBeGreaterThanOrEqual(6);
    expect(day12.speakingBuilder.branches.every((branch) => Boolean(branch.prompt))).toBe(true);
  });
});
