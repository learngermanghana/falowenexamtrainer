import b2Day1 from "../data/selfLearningLessons/b2/day1PersoenlicheIdentitaet";
import b2Day2 from "../data/selfLearningLessons/b2/day2AlltagUndZeitmanagement";
import b2Day3 from "../data/selfLearningLessons/b2/day3ArbeitUndBeruf";
import b2Day4 from "../data/selfLearningLessons/b2/day4BildungUndLernen";
import b2Day5 from "../data/selfLearningLessons/b2/day5GesundheitUndWohlbefinden";

const lessons = [b2Day1, b2Day2, b2Day3, b2Day4, b2Day5];

describe("B2 Days 1-5 self-tutoring content", () => {
  test.each(lessons.map((lesson) => [lesson.day, lesson]))("Day %s has interactive grammar and guided output", (_day, lesson) => {
    const questions = lesson.grammarLesson?.knowledgeTest || lesson.knowledgeTest || [];
    expect(questions.length).toBeGreaterThanOrEqual(4);
    expect(lesson.grammarLesson?.explanation?.length || lesson.explanation?.length || 0).toBeGreaterThan(0);
    expect(lesson.speakingTopic).toBeTruthy();
    expect(lesson.speakingBuilder || lesson.topicQuestions).toBeTruthy();
    expect(lesson.writingBuilder?.structure?.length || 0).toBeGreaterThanOrEqual(4);
    expect(lesson.writingBuilder?.usefulLines?.length || 0).toBeGreaterThanOrEqual(4);
  });
});
