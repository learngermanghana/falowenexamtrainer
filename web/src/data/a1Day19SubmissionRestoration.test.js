import { getA1CourseBookCard } from "./a1CourseBookCards";
import { courseSchedules } from "./courseSchedule";

describe("A1 Day 19 speaking self-learning", () => {
  test("stays outside the tutor-marked assignment submission flow", () => {
    const card = getA1CourseBookCard({ displayDay: 19, chapter: "5.9" });
    const lesson = courseSchedules.A1.find((entry) => Number(entry.day) === 19);
    const speakingResource = Array.isArray(lesson?.schreiben_sprechen)
      ? lesson.schreiben_sprechen[0]
      : lesson?.schreiben_sprechen;

    expect(card).toEqual(
      expect.objectContaining({
        assignmentId: "A1-5.9",
        submissionRequired: false,
        progressionEligible: false,
        assessmentType: "self-practice",
      }),
    );
    expect(lesson?.assignment).toBe(false);
    expect(lesson?.progressionEligible).toBe(false);
    expect(speakingResource?.assignment).toBe(false);
  });
});
