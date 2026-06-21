import { applyCourseBookCurriculumCorrection } from "./courseBookCurriculumCorrections";

describe("Course Book canonical day labels", () => {
  test("maps Numbers to visible Day 4 and canonical route day 6", () => {
    expect(
      applyCourseBookCurriculumCorrection(
        { day: 4, displayDay: 4, chapter: "2", assignmentId: "A1-2", title: "Numbers" },
        { level: "A1", displayDay: 4, chapter: "2", assignmentId: "A1-2" }
      )
    ).toEqual(
      expect.objectContaining({
        day: 6,
        displayDay: 4,
        displayChapter: "2",
        displayLabel: "Day 4 2",
        assignmentId: "A1-2",
      })
    );
  });

  test("keeps both Day 2 task cards visible on Day 2 with separate route days", () => {
    const alphabet = applyCourseBookCurriculumCorrection(
      { day: 2, displayDay: 2, chapter: "0.2", assignmentId: "A1-0.2", title: "German Alphabet" },
      { level: "A1", displayDay: 2, chapter: "0.2", assignmentId: "A1-0.2" }
    );
    const pronouns = applyCourseBookCurriculumCorrection(
      { day: 2, displayDay: 2, chapter: "1.1", assignmentId: "A1-1.1", title: "Personal Pronouns" },
      { level: "A1", displayDay: 2, chapter: "1.1", assignmentId: "A1-1.1" }
    );

    expect(alphabet).toEqual(expect.objectContaining({ day: 2, displayDay: 2, displayChapter: "0.2" }));
    expect(pronouns).toEqual(expect.objectContaining({ day: 3, displayDay: 2, displayChapter: "1.1" }));
  });
});
