import {
  getCourseBookViewLabel,
  resolveCourseBookSmartProgress,
  resumeMatchesCourseBookEntry,
  summarizeResumeSections,
} from "./courseBookSmartProgress";

describe("Course Book smart progress", () => {
  const entry = { day: 6, chapter: "3.6", topic: "Möbel & Räume" };

  test("uses learner-facing labels for synced sections", () => {
    expect(getCourseBookViewLabel("hoeren")).toBe("Hören");
    expect(getCourseBookViewLabel("schreiben")).toBe("Schreiben");
    expect(getCourseBookViewLabel("write")).toBe("Write");
  });

  test("matches a chapter-specific resume only to the correct card on multi-task days", () => {
    const resume = { day: 16, chapter: "9", activeView: "workbook" };
    expect(
      resumeMatchesCourseBookEntry({
        entry: { day: 16, chapter: "9" },
        resume,
        dayTaskCount: 2,
      }),
    ).toBe(true);
    expect(
      resumeMatchesCourseBookEntry({
        entry: { day: 16, chapter: "10" },
        resume,
        dayTaskCount: 2,
      }),
    ).toBe(false);
  });

  test("does not spread an ambiguous day-only resume across multiple lesson cards", () => {
    expect(
      resumeMatchesCourseBookEntry({
        entry: { day: 16, chapter: "9" },
        resume: { day: 16, activeView: "workbook" },
        dayTaskCount: 2,
      }),
    ).toBe(false);
  });

  test("shows the exact synced section and Radio state for unfinished learning", () => {
    const progress = resolveCourseBookSmartProgress({
      entry,
      dayTaskCount: 1,
      tutorStatus: "notStarted",
      resume: {
        day: 6,
        chapter: "3.6",
        activeView: "hoeren",
        lastRoute: "/campus/course/lesson/A2/6?chapter=3.6&view=hoeren&radio=done",
        radioDone: true,
        completed: false,
        sections: { learn: true, hoeren: false },
      },
    });

    expect(progress).toMatchObject({
      key: "in-progress",
      label: "In progress · Hören",
      radioDone: true,
      continueLabel: "Continue Hören",
      continueUrl: "/campus/course/lesson/A2/6?chapter=3.6&view=hoeren&radio=done",
    });
    expect(progress.sections).toEqual([
      { key: "learn", label: "Learn", completed: true },
      { key: "hoeren", label: "Hören", completed: false },
    ]);
  });

  test("needs-improvement status wins over a synced resume", () => {
    const progress = resolveCourseBookSmartProgress({
      entry,
      tutorStatus: "failed",
      resume: {
        day: 6,
        chapter: "3.6",
        activeView: "submit",
        lastRoute: "/campus/course/lesson/A2/6?chapter=3.6&view=submit",
      },
    });

    expect(progress).toMatchObject({
      key: "needs-improvement",
      label: "Needs improvement",
      continueLabel: "Review & retry",
    });
  });

  test("submitted work shows Waiting for tutor instead of In progress", () => {
    const progress = resolveCourseBookSmartProgress({
      entry,
      tutorStatus: "submitted",
      resume: {
        day: 6,
        chapter: "3.6",
        activeView: "submit",
        lastRoute: "/campus/course/lesson/A2/6?chapter=3.6&view=submit",
      },
    });

    expect(progress).toMatchObject({
      key: "waiting-for-tutor",
      label: "Waiting for tutor",
      continueLabel: "",
      continueUrl: "",
    });
  });

  test("completion wins for passed or self-learning lessons", () => {
    expect(
      resolveCourseBookSmartProgress({ entry, tutorStatus: "passed" }),
    ).toMatchObject({ key: "complete", label: "Completed" });

    expect(
      resolveCourseBookSmartProgress({ entry, selfLearningComplete: true }),
    ).toMatchObject({ key: "complete", label: "Completed" });
  });

  test("keeps an existing draft In progress even before a resume record exists", () => {
    expect(
      resolveCourseBookSmartProgress({ entry, tutorStatus: "inProgress" }),
    ).toMatchObject({
      key: "in-progress",
      label: "In progress",
      continueLabel: "Continue",
    });
  });

  test("returns Not started when no progress source exists", () => {
    expect(resolveCourseBookSmartProgress({ entry })).toMatchObject({
      key: "not-started",
      label: "Not started",
      continueLabel: "Start lesson",
    });
  });

  test("summarizes only boolean section state", () => {
    expect(
      summarizeResumeSections({ learn: true, write: false, score: 90 }),
    ).toEqual([
      { key: "learn", label: "Learn", completed: true },
      { key: "write", label: "Write", completed: false },
    ]);
  });
});
