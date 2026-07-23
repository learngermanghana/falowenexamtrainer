import {
  A1_CANONICAL_LESSON_CATALOG,
} from "../data/a1CanonicalLessonCatalog";
import { getA1CourseBookCard } from "../data/a1CourseBookCards";
import {
  getA1SelfLearningJourneyResources,
  getA1SelfLearningPracticeForLocation,
} from "./A1CoursePracticeAutoMount";

const practices = A1_CANONICAL_LESSON_CATALOG.filter((lesson) => lesson.kind === "practice");

describe("A1 self-learning journey standardization", () => {
  test("recognizes every published A1 self-practice destination", () => {
    expect(practices.length).toBeGreaterThan(5);

    practices.forEach((practice) => {
      expect(
        getA1SelfLearningPracticeForLocation({ pathname: practice.destination, search: "" }),
      ).toEqual(expect.objectContaining({ routeKey: practice.routeKey, kind: "practice" }));
    });
  });

  test("recognizes every legacy A1 self-practice lesson route", () => {
    practices.forEach((practice) => {
      const legacyUrl = new URL(practice.legacyLessonRoute, "https://www.falowen.app");
      expect(
        getA1SelfLearningPracticeForLocation({
          pathname: legacyUrl.pathname,
          search: legacyUrl.search,
        }),
      ).toEqual(expect.objectContaining({ routeKey: practice.routeKey, kind: "practice" }));
    });
  });

  test("keeps every A1 self-practice outside tutor submission and progression", () => {
    practices.forEach((practice) => {
      expect(practice.assignmentKey).toBeNull();

      // Kapitel 1.2 has both a tutor-marked assignment and a separate route-only
      // self-practice on the same day/chapter, so the generic day/chapter Course
      // Book lookup intentionally belongs to the graded card. The explicit
      // practice catalog identity owns the self-practice route instead.
      if (practice.routeKey === "1.2-practice") {
        expect(practice.destination).toBe("/campus/course/a1-day-3-kapitel-1-2-workbook");
        return;
      }

      const card = getA1CourseBookCard({
        displayDay: practice.day,
        chapter: practice.chapter,
        title: practice.title,
      });

      expect(card).toEqual(
        expect.objectContaining({
          assessmentType: "self-practice",
          submissionRequired: false,
          progressionEligible: false,
        }),
      );
    });
  });

  test("resolves the same shared material shape for every A1 self-practice lesson", () => {
    practices.forEach((practice) => {
      const resources = getA1SelfLearningJourneyResources(practice);
      expect(Object.keys(resources).sort()).toEqual([
        "aiVideo",
        "grammarBook",
        "radio",
        "teacherVideo",
      ]);
      Object.values(resources).forEach((resource) => {
        expect(resource === null || typeof resource === "object").toBe(true);
      });
    });
  });

  test("Day 19 stays self-learning and keeps both configured lesson videos", () => {
    const day19 = practices.find((practice) => Number(practice.day) === 19);
    const resources = getA1SelfLearningJourneyResources(day19);

    expect(resources.teacherVideo?.url).toBe("https://youtu.be/ZfXw4fRQ0Tg");
    expect(resources.aiVideo?.url).toBe("https://youtu.be/gprnEZtMUPM");
  });
});
