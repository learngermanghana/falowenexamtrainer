import { resolveStudyBuddyRouteContext, STUDY_BUDDY_SUPPORTED_LEVELS } from "./studyBuddyRouteContext";

describe("resolveStudyBuddyRouteContext", () => {
  it("supports all German course levels without assuming one shared page structure", () => {
    expect(STUDY_BUDDY_SUPPORTED_LEVELS).toEqual(["A1", "A2", "B1", "B2", "C1"]);
  });

  it.each([
    [
      "A1 tutor-marked direct workbook",
      "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook",
      "",
      {
        level: "A1",
        day: 12,
        chapter: "8",
        surface: "Workbook",
        routeFamily: "a1-tutor-marked-assignment",
        learningMode: "tutor-marked-assignment",
        assignmentKey: "A1-8",
        catalogKind: "assignment",
      },
    ],
    [
      "A1 self-learning direct workbook",
      "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook",
      "",
      {
        level: "A1",
        day: 3,
        chapter: "1.1",
        surface: "Workbook",
        routeFamily: "a1-self-learning",
        learningMode: "self-learning",
        assignmentKey: null,
        catalogKind: "practice",
      },
    ],
    [
      "A1 canonical tutor-marked chapter",
      "/campus/course/lesson/A1/chapter/1.1",
      "",
      {
        level: "A1",
        day: 2,
        chapter: "1.1",
        routeFamily: "a1-tutor-marked-assignment",
        learningMode: "tutor-marked-assignment",
        assignmentKey: "A1-1.1",
      },
    ],
    [
      "A1 canonical self-practice chapter",
      "/campus/course/lesson/A1/chapter/1.1-practice",
      "",
      {
        level: "A1",
        day: 3,
        chapter: "1.1",
        routeFamily: "a1-self-learning",
        learningMode: "self-learning",
        assignmentKey: null,
      },
    ],
    [
      "A1 legacy tutor-marked lesson",
      "/campus/course/lesson/A1/2",
      "?chapter=1.1&hub=1",
      {
        level: "A1",
        day: 2,
        chapter: "1.1",
        routeFamily: "a1-tutor-marked-assignment",
        learningMode: "tutor-marked-assignment",
        assignmentKey: "A1-1.1",
      },
    ],
    [
      "A1 legacy self-practice lesson",
      "/campus/course/lesson/A1/3",
      "?chapter=1.1-PRACTICE",
      {
        level: "A1",
        day: 3,
        chapter: "1.1",
        routeFamily: "a1-self-learning",
        learningMode: "self-learning",
        assignmentKey: null,
      },
    ],
    [
      "A1 self-learning destination without A1 in its slug",
      "/campus/course/speaking-exams-intro-4-7",
      "",
      {
        level: "A1",
        day: 15,
        chapter: "4.7",
        surface: "Speaking practice",
        routeFamily: "a1-self-learning",
        learningMode: "self-learning",
      },
    ],
    [
      "A2 direct grammar",
      "/campus/course/a2-day-11-comparative-forms-grammar-notes",
      "",
      { level: "A2", day: 11, surface: "Grammar", routeFamily: "direct-level-page" },
    ],
    [
      "B1 canonical workbook",
      "/campus/course/lesson/B1/7",
      "?view=workbook",
      { level: "B1", day: 7, surface: "Workbook", routeFamily: "canonical-lesson" },
    ],
    [
      "B2 direct workbook",
      "/campus/course/b2-day-1-persoenliche-identitaet-und-selbstverstaendnis-workbook",
      "",
      { level: "B2", day: 1, surface: "Workbook", routeFamily: "direct-level-page" },
    ],
    [
      "C1 self learning",
      "/campus/course/c1-self-learning/day-12",
      "",
      { level: "C1", day: 12, surface: "Lesson", routeFamily: "self-learning", learningMode: "self-learning" },
    ],
  ])("resolves %s independently", (_name, pathname, search, expected) => {
    expect(resolveStudyBuddyRouteContext({ pathname, search })).toEqual(expect.objectContaining(expected));
  });

  it("identifies A1 self-learning from the catalog without needing a profile fallback", () => {
    const context = resolveStudyBuddyRouteContext({
      pathname: "/campus/course/verboten-erlaubt-5-9",
    });

    expect(context).toEqual(expect.objectContaining({
      level: "A1",
      day: 19,
      chapter: "5.9",
      routeFamily: "a1-self-learning",
      learningMode: "self-learning",
      catalogKind: "practice",
    }));
  });

  it("lets the route level override the profile level when a learner opens another accessible level", () => {
    const context = resolveStudyBuddyRouteContext({
      pathname: "/campus/course/lesson/B1/7",
      search: "?view=grammar",
      profileLevel: "A2",
    });

    expect(context.level).toBe("B1");
    expect(context.surface).toBe("Grammar");
  });
});
