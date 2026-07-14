import fs from "fs";
import path from "path";
import { A1_COURSE_BOOK_CARDS, getA1CourseBookCard } from "./a1CourseBookCards";
import { alignA1CurriculumEntries } from "./a1RouteAlignment";
import { courseSchedules } from "./courseSchedule";

const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
const syncScriptSource = fs.readFileSync(
  path.resolve(__dirname, "../../../scripts/applyA1RouteAlignment.js"),
  "utf8",
);

const routePathname = (route = "") => String(route || "").split(/[?#]/)[0];
const isInternalCourseRoute = (route = "") =>
  /^\/campus\/course\//.test(String(route || ""));
const isRegisteredRoute = (route = "") => {
  const pathname = routePathname(route);
  if (!pathname) return true;
  if (appSource.includes(`path="${pathname}"`)) return true;
  return (
    appSource.includes('path="/campus/course/lesson/:level/:day"') &&
    /^\/campus\/course\/lesson\/(A1|A2|B1|B2|C1|C2)\/\d+$/i.test(pathname)
  );
};

const collectRouteFields = (value, routes = []) => {
  if (Array.isArray(value)) {
    value.forEach((entry) => collectRouteFields(entry, routes));
    return routes;
  }
  if (!value || typeof value !== "object") return routes;

  [
    value.grammarPage,
    value.grammarbook_link,
    value.grammar_link,
    value.workbookRoute,
    value.workbook_link,
  ]
    .filter(Boolean)
    .forEach((route) => routes.push(route));

  [value.resources, value.primaryResource, value.lesen_hören, value.schreiben_sprechen]
    .filter(Boolean)
    .forEach((nested) => collectRouteFields(nested, routes));
  return routes;
};

describe("A1 route integrity", () => {
  it("uses only internal registered routes on every displayed A1 Course Book card", () => {
    expect(A1_COURSE_BOOK_CARDS).toHaveLength(29);

    A1_COURSE_BOOK_CARDS.forEach((card) => {
      [card.grammarPage, card.workbookRoute].filter(Boolean).forEach((route) => {
        expect(route).not.toMatch(/drive\.google\.com|docs\.google\.com/i);
        expect(route).not.toMatch(/^https?:\/\/(?:www\.)?falowen\.app/i);
        expect(isInternalCourseRoute(route)).toBe(true);
        expect(isRegisteredRoute(route)).toBe(true);
      });
    });
  });

  it("aligns every resolved A1 grammar and workbook link to an internal app route", () => {
    const resolvedSchedule = alignA1CurriculumEntries(
      courseSchedules.A1.map((entry) => ({ ...entry, level: "A1" })),
    );
    const routes = collectRouteFields(resolvedSchedule);
    expect(routes.length).toBeGreaterThan(20);

    routes.forEach((route) => {
      expect(route).not.toMatch(/drive\.google\.com|docs\.google\.com/i);
      expect(route).not.toMatch(/^https?:\/\/(?:www\.)?falowen\.app/i);
      expect(isInternalCourseRoute(route)).toBe(true);
      expect(isRegisteredRoute(route)).toBe(true);
    });
  });

  it("keeps the previously fragile assignments on their correct in-app routes", () => {
    expect(getA1CourseBookCard({ displayDay: 4, chapter: "2" })?.workbookRoute).toBe(
      "/campus/course/a1-day-4-numbers-for-beginners-workbook",
    );
    expect(getA1CourseBookCard({ displayDay: 7, chapter: "3" })?.workbookRoute).toBe(
      "/campus/course/a1-chapter-3-asking-about-prices-workbook",
    );
    expect(getA1CourseBookCard({ displayDay: 11, chapter: "7" })?.workbookRoute).toBe(
      "/campus/course/a1-day-11-understanding-time-workbook",
    );
    expect(getA1CourseBookCard({ displayDay: 18, chapter: "12.1" })?.workbookRoute).toBe(
      "/campus/course/two-case-prepositions-wechselpraepositionen-day-18?view=workbook",
    );
    expect(getA1CourseBookCard({ displayDay: 18, chapter: "12.2" })?.workbookRoute).toBe(
      "/campus/course/a1-12-2-dative-articles-mit-bei-zu?view=workbook",
    );
  });

  it("keeps A1 chapter 12.3 grammar notes separate from its two-question workbook", () => {
    const card = getA1CourseBookCard({ displayDay: 20, chapter: "12.3" });

    expect(card?.grammarPage).toBe(
      "/campus/course/letter-writing-intro-12-3",
    );
    expect(card?.workbookRoute).toBe(
      "/campus/course/letter-writing-intro-german-a1-day-12-3",
    );
    expect(card?.grammarPage).not.toBe(card?.workbookRoute);
  });

  it("preserves the A1 alignment whenever curriculum files are regenerated", () => {
    expect(syncScriptSource).toContain("alignA1CurriculumEntries");
    expect(syncScriptSource).toContain("getLessonsByLevel");
    expect(syncScriptSource).toContain("web/src/data/a1CourseBookCards.js");
  });
});
