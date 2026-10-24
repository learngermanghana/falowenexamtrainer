import { A1_GRAMMAR_ROUTE_ENTRIES, applyA1GrammarRouteToLesson } from "./a1GrammarRoutes";
import routeConfig from "./inAppWorkbookRoutes.json";
import { normalizeLesson } from "./lessonModel";

const A1_ASSIGNMENT_DAYS = [1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 16, 17, 18, 20, 21, 22];

describe("A1 tutor-marked assignment audit", () => {
  test("every tutor-marked A1 day has an in-app workbook route", () => {
    A1_ASSIGNMENT_DAYS.forEach((day) => {
      const configured = routeConfig?.A1?.[String(day)] || {};
      const routes = Object.values(configured);
      expect(routes.length).toBeGreaterThan(0);
      routes.forEach((route) => {
        expect(route).toMatch(/^\/campus\/course\//);
        expect(route).not.toMatch(/drive\.google\.com|docs\.google\.com/i);
      });
    });
  });

  test("A1 grammar overrides are all internal Falowen routes", () => {
    A1_GRAMMAR_ROUTE_ENTRIES.forEach(({ route }) => {
      expect(route).toMatch(/^\/campus\/course\//);
      expect(route).not.toMatch(/drive\.google\.com|docs\.google\.com/i);
    });
  });

  test("Day 16 chapter 9 no longer uses the legacy Drive grammar PDF", () => {
    const lesson = {
      day: 16,
      chapter: "9_10",
      assignment: true,
      lesen_hören: [
        {
          chapter: "9",
          grammarbook_link: "https://drive.google.com/file/d/legacy/view",
          workbook_link: "/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook",
          assignment: true,
        },
        {
          chapter: "10",
          workbook_link: "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook",
          assignment: true,
        },
      ],
    };

    applyA1GrammarRouteToLesson(lesson);
    const normalized = normalizeLesson(lesson, "A1");

    expect(normalized.resources.resourceGroups[0].grammarBook.url).toBe(
      "/campus/course/food-and-negation-day-16-9-10"
    );
    expect(normalized.resources.resourceGroups[0].workbook.url).toBe(
      "/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook"
    );
    expect(normalized.resources.resourceGroups[1].workbook.url).toBe(
      "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook"
    );
  });
});
