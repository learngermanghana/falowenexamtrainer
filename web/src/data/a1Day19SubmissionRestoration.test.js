import { getA1CourseBookCard } from "./a1CourseBookCards";
import { courseSchedules } from "./courseSchedule";

describe("A1 Day 19 required speaking assignment", () => {
  test("requires all three speaking parts through the verified speaking flow", () => {
    const card = getA1CourseBookCard({ displayDay: 19, chapter: "5.9" });
    const lesson = courseSchedules.A1.find((entry) => Number(entry.day) === 19);
    const speakingResource = Array.isArray(lesson?.schreiben_sprechen)
      ? lesson.schreiben_sprechen[0]
      : lesson?.schreiben_sprechen;

    expect(card).toEqual(
      expect.objectContaining({
        assignmentId: "A1-5.9",
        submissionRequired: true,
        progressionEligible: true,
        assessmentType: "tutor-marked",
      }),
    );
    expect(lesson?.assignment).toBe(true);
    expect(lesson?.progressionEligible).toBe(true);
    expect(speakingResource?.assignment).toBe(true);
  });
});
