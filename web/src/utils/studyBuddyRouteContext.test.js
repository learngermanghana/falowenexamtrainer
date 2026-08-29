import { resolveStudyBuddyRouteContext, STUDY_BUDDY_SUPPORTED_LEVELS } from "./studyBuddyRouteContext";

describe("resolveStudyBuddyRouteContext", () => {
  it("supports all German course levels without assuming one shared page structure", () => {
    expect(STUDY_BUDDY_SUPPORTED_LEVELS).toEqual(["A1", "A2", "B1", "B2", "C1"]);
  });

  it.each([
    [
      "A1 direct workbook",
      "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook",
      "",
      { level: "A1", day: 12, surface: "Workbook", routeFamily: "direct-level-page" },
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
      { level: "C1", day: 12, surface: "Lesson", routeFamily: "self-learning" },
    ],
  ])("resolves %s independently", (_name, pathname, search, expected) => {
    expect(resolveStudyBuddyRouteContext({ pathname, search })).toEqual(expect.objectContaining(expected));
  });

  it("uses the student profile only as a fallback for special legacy pages", () => {
    const context = resolveStudyBuddyRouteContext({
      pathname: "/campus/course/speaking-exams-intro-4-7",
      profileLevel: "A1",
    });

    expect(context.level).toBe("A1");
    expect(context.surface).toBe("Speaking practice");
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
