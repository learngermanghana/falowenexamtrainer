import {
  COURSE_COMPLETION_TOTALS,
  buildCourseCompletionProgress,
  getCanonicalCourseRequirements,
  getCourseCompletionMilestone,
  getSelfLearningSectionState,
} from "./courseCompletionJourney";

describe("canonical course completion engine", () => {
  test("uses the canonical required-work totals for A1-C1", () => {
    expect(getCanonicalCourseRequirements("A1")).toHaveLength(COURSE_COMPLETION_TOTALS.A1);
    expect(getCanonicalCourseRequirements("A2")).toHaveLength(COURSE_COMPLETION_TOTALS.A2);
    expect(getCanonicalCourseRequirements("B1")).toHaveLength(COURSE_COMPLETION_TOTALS.B1);
    expect(getCanonicalCourseRequirements("B2")).toHaveLength(COURSE_COMPLETION_TOTALS.B2);
    expect(getCanonicalCourseRequirements("C1")).toHaveLength(COURSE_COMPLETION_TOTALS.C1);
  });

  test("A1 completion stays completed when marked work needs improvement", () => {
    const requirements = getCanonicalCourseRequirements("A1");
    const progressByAssignmentId = {};

    requirements.slice(0, 9).forEach((requirement) => {
      progressByAssignmentId[requirement.assignmentKey] = {
        status: "passed",
        submitted: true,
        passed: true,
        bestScore: 80,
      };
    });
    requirements.slice(9, 11).forEach((requirement) => {
      progressByAssignmentId[requirement.assignmentKey] = {
        status: "failed",
        submitted: true,
        failed: true,
        bestScore: 45,
      };
    });

    const result = buildCourseCompletionProgress({ level: "A1", progressByAssignmentId });

    expect(result.completed).toBe(11);
    expect(result.total).toBe(19);
    expect(result.completionPercent).toBe(58);
    expect(result.passed).toBe(9);
    expect(result.needsImprovement).toBe(2);
    expect(result.masteryPercent).toBe(82);
    expect(result.next?.assignmentKey).toBe(requirements[11].assignmentKey);
  });

  test("submitted work counts as completion before marking without pretending it passed", () => {
    const [first] = getCanonicalCourseRequirements("A2");
    const result = buildCourseCompletionProgress({
      level: "A2",
      progressByAssignmentId: {
        [first.assignmentKey]: { status: "submitted", submitted: true },
      },
    });

    expect(result.completed).toBe(1);
    expect(result.passed).toBe(0);
    expect(result.awaitingReview).toBe(1);
    expect(result.masteryPercent).toBe(0);
  });

  test("B2/C1 require Learn + Speak + Write + Finish and ignore passive activity", () => {
    expect(
      getSelfLearningSectionState({
        learnDone: true,
        quizDone: true,
        speakDone: true,
        writeDone: true,
        completed: true,
        videoWatched: false,
        referencesOpened: false,
      }).completed,
    ).toBe(true);

    expect(
      getSelfLearningSectionState({
        learnDone: true,
        quizDone: true,
        speakDone: true,
        completed: true,
        videoWatched: true,
        referencesOpened: true,
        attendance: true,
        tabsVisited: ["learn", "speak", "write", "finish", "references"],
      }).completed,
    ).toBe(false);

    const result = buildCourseCompletionProgress({
      level: "B2",
      selfLearningProgressByDay: {
        1: { learnDone: true, quizDone: true, speakDone: true, writeDone: true, completed: true },
        2: { learnDone: true, quizDone: true, speakDone: true, completed: true },
      },
    });

    expect(result.completed).toBe(1);
    expect(result.total).toBe(28);
    expect(result.next?.day).toBe(2);
    expect(result.masteryAvailable).toBe(false);
  });

  test("self-learning Learn respects an explicit quiz checkpoint when the lesson has one", () => {
    const incomplete = getSelfLearningSectionState({
      learnNotesDone: true,
      quizDone: false,
      speakDone: true,
      writeDone: true,
      completed: true,
    });
    const complete = getSelfLearningSectionState({
      learnNotesDone: true,
      quizDone: true,
      speakDone: true,
      writeDone: true,
      completed: true,
    });

    expect(incomplete.learn).toBe(false);
    expect(incomplete.completed).toBe(false);
    expect(complete.completed).toBe(true);
  });

  test("reports the 25/50/75/90/100 milestone states", () => {
    expect(getCourseCompletionMilestone(24)).toEqual({ achieved: 0, next: 25 });
    expect(getCourseCompletionMilestone(25)).toEqual({ achieved: 25, next: 50 });
    expect(getCourseCompletionMilestone(58)).toEqual({ achieved: 50, next: 75 });
    expect(getCourseCompletionMilestone(90)).toEqual({ achieved: 90, next: 100 });
    expect(getCourseCompletionMilestone(100)).toEqual({ achieved: 100, next: null });
  });
});