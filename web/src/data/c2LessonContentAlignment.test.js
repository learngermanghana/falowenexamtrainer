import {
  C2_CANONICAL_MASTERY,
  C2_LESSON_CONTENT_ALIGNMENT,
  alignC2CurriculumEntry,
  getC2LessonContentAlignment,
} from "./c2LessonContentAlignment";
import { getCurriculumEntriesForLevel } from "./curriculumManifest";
import { SELF_LEARNING_LESSONS } from "../components/SelfLearningLessonRegistry";
import { getC2ExamStandard } from "./c2ExamStandardContent";
import { getC2TopicKnowledge } from "./c2TopicKnowledge";

const DAYS = Array.from({ length: 28 }, (_, index) => index + 1);

describe("C2 Days 1-28 Course Book alignment", () => {
  it.each(DAYS)("keeps Day %i on the canonical C2 title, topic and grammar", (day) => {
    const canonical = C2_CANONICAL_MASTERY[day];
    const aligned = getC2LessonContentAlignment(day);

    expect(aligned).toEqual(
      expect.objectContaining({
        chapter: canonical.chapter,
        title: canonical.title,
        topic: canonical.topic,
        grammarFocus: canonical.grammarFocus,
        collocationTopic: canonical.title,
      }),
    );
  });

  it.each(DAYS)("gives Day %i exactly six unique collocations from its own aligned lesson", (day) => {
    const aligned = C2_LESSON_CONTENT_ALIGNMENT[day];
    const expressions = aligned.collocations.map(([expression]) => expression.toLowerCase());

    expect(aligned.collocations).toHaveLength(6);
    expect(new Set(expressions).size).toBe(6);
    expect(aligned.collocationTopic).toBe(aligned.title);
    aligned.collocations.forEach((item) => {
      expect(item).toHaveLength(3);
      expect(item.every((value) => typeof value === "string" && value.trim().length > 0)).toBe(true);
    });
  });

  it.each(DAYS)("adds detailed grammar, explained checks and a writing model for Day %i", (day) => {
    const aligned = C2_LESSON_CONTENT_ALIGNMENT[day];

    expect(aligned.grammarNotes).toEqual(
      expect.objectContaining({
        title: aligned.grammarFocus,
        usage: expect.any(String),
        wordOrder: expect.any(String),
        examples: expect.any(Array),
        commonMistakes: expect.any(Array),
      }),
    );
    expect(aligned.grammarNotes.examples.length).toBeGreaterThan(0);
    expect(aligned.grammarNotes.commonMistakes.length).toBeGreaterThan(0);
    expect(aligned.grammarChecks.length).toBeGreaterThan(0);
    aligned.grammarChecks.forEach((check) => {
      expect(check.question).toEqual(expect.any(String));
      expect(check.explanation).toEqual(expect.any(String));
    });
    expect(aligned.writingExercise.prompt).toEqual(expect.any(String));
    expect(aligned.writingExercise.modelAnswer).toEqual(expect.any(String));
    expect(aligned.writingExercise.modelAnswer.length).toBeGreaterThan(20);
  });

  it("keeps the Course Book curriculum and opened C2 lesson on the same source of truth", () => {
    const curriculum = Object.fromEntries(
      getCurriculumEntriesForLevel("C2").map((entry) => [Number(entry.day), entry]),
    );

    DAYS.forEach((day) => {
      const aligned = C2_LESSON_CONTENT_ALIGNMENT[day];
      const lesson = SELF_LEARNING_LESSONS.C2.find((entry) => Number(entry?.day) === day);

      expect(curriculum[day]).toEqual(expect.objectContaining({
        day,
        chapter: aligned.chapter,
        topic: aligned.title,
        grammar_topic: aligned.grammarFocus,
      }));
      expect(lesson).toEqual(expect.objectContaining({
        day,
        chapter: aligned.chapter,
        title: aligned.title,
        topic: aligned.topic,
      }));
      expect(lesson.c2Mastery.collocations).toEqual(aligned.collocations);
    });
  });

  it("uses the new C2 Day 1 circular-economy course and excludes the legacy Identity lesson", () => {
    const day1 = getC2LessonContentAlignment(1);
    const serialized = JSON.stringify(day1);

    expect(day1).toEqual(expect.objectContaining({
      chapter: "1.1",
      title: "Kreislaufwirtschaft und Wegwerfgesellschaft",
      grammarFocus: "Nuancierte Bewertung und Registersteuerung",
      collocationTopic: "Kreislaufwirtschaft und Wegwerfgesellschaft",
    }));
    expect(day1.vocabulary.map(([word]) => word)).toEqual(expect.arrayContaining([
      "die Kreislaufwirtschaft",
      "die Wegwerfgesellschaft",
      "die Reparierbarkeit",
      "die Ressourcenschonung",
    ]));
    expect(day1.collocations.map(([phrase]) => phrase)).toEqual(expect.arrayContaining([
      "Ressourcen schonen",
      "die Lebensdauer verlängern",
      "Abfall vermeiden",
    ]));
    expect(serialized).not.toContain("sprachliche Zugehörigkeit");
    expect(serialized).not.toContain("soziale Distanz markieren");
    expect(serialized).not.toContain("Sprache, Identität und Gesellschaft");
  });

  it.each(DAYS)("gives Day %i current-course topic knowledge rather than legacy mastery content", (day) => {
    const aligned = getC2LessonContentAlignment(day);
    const standard = getC2ExamStandard(day);
    const knowledge = getC2TopicKnowledge(day);

    expect(knowledge).toEqual(expect.objectContaining({
      chapter: expect.any(String),
      core: expect.any(String),
      en: expect.any(String),
      de: expect.any(String),
      example: expect.any(String),
      actors: expect.any(Array),
      tensions: expect.any(Array),
      vocab: expect.any(Array),
      coll: expect.any(Array),
    }));
    expect(knowledge.actors.length).toBeGreaterThanOrEqual(3);
    expect(knowledge.tensions.length).toBeGreaterThanOrEqual(3);
    expect(knowledge.vocab.length).toBeGreaterThanOrEqual(6);
    expect(knowledge.coll.length).toBeGreaterThanOrEqual(4);

    expect(aligned.title).toBe(standard.title);
    expect(aligned.topic).toBe(standard.topic);
    expect(aligned.grammarFocus).toBe(standard.grammarFocus);
    expect(aligned.topicKnowledge).toBe(knowledge);
  });

  it("preserves assignment and progression fields while aligning C2 content", () => {
    const original = {
      level: "C2",
      day: 8,
      assignmentId: "C2-2.1",
      submissionRequired: true,
      progressionEligible: true,
    };
    const aligned = alignC2CurriculumEntry(original);

    expect(aligned).toEqual(expect.objectContaining({
      assignmentId: "C2-2.1",
      submissionRequired: true,
      progressionEligible: true,
      title: C2_CANONICAL_MASTERY[8].title,
    }));
  });
});
