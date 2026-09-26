import {
  buildLessonResumeDocId,
  buildLessonResumeRoute,
  mergeResumeSectionsIntoProgress,
  normalizeLessonSections,
  pickLatestLessonResume,
} from "./lessonResumeService";

describe("lesson resume service", () => {
  test("builds one canonical document id per level and day", () => {
    expect(buildLessonResumeDocId("A2", 6)).toBe("a2-day-6");
    expect(buildLessonResumeDocId("C2", 28)).toBe("c2-day-28");
  });

  test("builds an exact section route including Radio completion", () => {
    expect(
      buildLessonResumeRoute({
        level: "A2",
        day: 6,
        chapter: "3.6",
        activeView: "hoeren",
        radioDone: true,
      }),
    ).toBe("/campus/course/lesson/A2/6?chapter=3.6&view=hoeren&radio=done");
  });

  test("normalizes self-learning progress into cross-level section state", () => {
    expect(
      normalizeLessonSections({
        learnDone: true,
        lesenDone: false,
        hoerenDone: true,
        speakDone: false,
        writeDone: true,
        completed: false,
      }),
    ).toEqual({
      learn: true,
      lesen: false,
      hoeren: true,
      speak: false,
      write: true,
      finish: false,
    });
  });

  test("hydrates completed cloud sections without erasing newer local completion", () => {
    expect(
      mergeResumeSectionsIntoProgress(
        { learnDone: true, speakDone: false, completed: false },
        { learn: false, speak: true, finish: true },
      ),
    ).toEqual(expect.objectContaining({
      learnDone: true,
      speakDone: true,
      completed: true,
      completedAt: expect.any(String),
    }));
  });

  test("selects the most recently active lesson across devices", () => {
    expect(
      pickLatestLessonResume([
        {
          id: "b2-day-5",
          level: "B2",
          day: 5,
          lastActivityAtClient: "2026-09-25T10:00:00.000Z",
        },
        {
          id: "b2-day-6",
          level: "B2",
          day: 6,
          lastActivityAtClient: "2026-09-26T07:00:00.000Z",
        },
      ]),
    ).toMatchObject({ id: "b2-day-6", day: 6 });
  });
});
