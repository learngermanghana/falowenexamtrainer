import { SELF_LEARNING_LESSONS } from "../../../components/SelfLearningLessonRegistry";
import { B2_SELF_LEARNING_COURSE_SCHEDULE } from "./b2SelfLearningCourseSchedule";
import b2Day7GesellschaftlicheVielfalt from "./day7GesellschaftlicheVielfalt";

describe("B2 Day 7 Gesellschaftliche Vielfalt", () => {
  test("uses the canonical Chapter 2.2 topic and grammar focus", () => {
    expect(b2Day7GesellschaftlicheVielfalt).toEqual(
      expect.objectContaining({
        level: "B2",
        day: 7,
        chapter: "2.2",
        title: "Gesellschaftliche Vielfalt",
        grammarFocus: expect.stringContaining("Relativsätze mit Präpositionen"),
      }),
    );
  });

  test("provides matching speaking and writing tasks", () => {
    expect(b2Day7GesellschaftlicheVielfalt.speakingBuilder.question).toMatch(
      /vielfältige Gesellschaft/i,
    );
    expect(b2Day7GesellschaftlicheVielfalt.writingTopic).toMatch(
      /Gesellschaftliche Vielfalt/,
    );
    expect(b2Day7GesellschaftlicheVielfalt.writingTopic).toMatch(
      /Respekt und Teilhabe/,
    );
    expect(b2Day7GesellschaftlicheVielfalt.grammarLesson.examples).toEqual(
      expect.arrayContaining([
        expect.stringContaining("mit denen"),
        expect.stringContaining("von der"),
        expect.stringContaining("über die"),
      ]),
    );
  });

  test("course schedule and lesson registry use the dedicated lesson", () => {
    const scheduleEntry = B2_SELF_LEARNING_COURSE_SCHEDULE.find(
      (entry) => Number(entry.day) === 7,
    );
    const registeredLesson = SELF_LEARNING_LESSONS.B2.find(
      (lesson) => Number(lesson.day) === 7,
    );

    expect(scheduleEntry).toEqual(
      expect.objectContaining({
        chapter: "2.2",
        topic: "Gesellschaftliche Vielfalt",
        grammar_topic: "Relativsätze mit Präpositionen",
      }),
    );
    expect(registeredLesson).toBe(b2Day7GesellschaftlicheVielfalt);
  });
});
