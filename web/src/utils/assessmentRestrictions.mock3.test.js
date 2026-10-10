import { isMockAssessmentRoute } from "./assessmentRestrictions";

test("scored A1 Final Mock 3 is restricted from StudyBuddy assistance", () => {
  expect(isMockAssessmentRoute("/campus/course/a1-final-mock-3")).toBe(true);
  expect(isMockAssessmentRoute("/campus/course/a1-final-mock-exam")).toBe(true);
  expect(isMockAssessmentRoute("/campus/course/a1-mock-2")).toBe(true);
  expect(isMockAssessmentRoute("/campus/course/a1-day-6-family-and-hobbies-workbook")).toBe(false);
});
