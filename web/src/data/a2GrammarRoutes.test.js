import {
  A2_GRAMMAR_ROUTE_ENTRIES,
  applyA2GrammarRouteToLesson,
  getA2GrammarRoute,
  hasOnlyInternalA2GrammarRoutes,
} from "./a2GrammarRoutes";
import { normalizeLesson } from "./lessonModel";

const A2_DAY17_APOTHEKE_ROUTE =
  "/campus/course/a2-day-17-in-die-apotheke-gehen-workbook?view=grammar";

describe("A2 in-app grammar routes", () => {
  test("all configured A2 grammar routes stay inside Falowen", () => {
    expect(hasOnlyInternalA2GrammarRoutes()).toBe(true);
    expect(A2_GRAMMAR_ROUTE_ENTRIES.length).toBeGreaterThan(20);
    A2_GRAMMAR_ROUTE_ENTRIES.forEach(({ route }) => {
      expect(route).toMatch(/^\/campus\/course\//);
      expect(route).not.toMatch(/drive\.google\.com|docs\.google\.com/i);
    });
  });

  test("A2 Day 17 Apotheke uses the A2 grammar context instead of the A1 modal workbook", () => {
    const route = getA2GrammarRoute({ day: 17, chapter: "6.17" });
    expect(route).toBe(A2_DAY17_APOTHEKE_ROUTE);
  });

  test("replaces a stale Drive grammar link by day and chapter", () => {
    const lesson = {
      day: 3,
      chapter: "1.3",
      grammarbook_link: "https://drive.google.com/file/d/legacy/view",
      lesen_hören: {
        chapter: "1.3",
        grammarbook_link: "https://drive.google.com/file/d/legacy/view",
      },
    };

    applyA2GrammarRouteToLesson(lesson);

    expect(lesson.grammarbook_link).toBe(
      "/campus/course/dinge-und-personen-vergleichen-1-3-grammar-notes"
    );
    expect(lesson.lesen_hören.grammarbook_link).toBe(
      "/campus/course/dinge-und-personen-vergleichen-1-3-grammar-notes"
    );
  });

  test("lesson normalization prefers the in-app route over a Drive URL", () => {
    const normalized = normalizeLesson(
      {
        day: 12,
        chapter: "5.12",
        assignment: true,
        lesen_hören: {
          chapter: "5.12",
          grammarbook_link: "https://drive.google.com/file/d/legacy/view",
          workbook_link: "/campus/course/a2-day-12-mein-traumberuf-workbook",
        },
      },
      "A2"
    );

    expect(normalized.resources.resourceGroups[0].grammarBook.url).toBe(
      "/campus/course/mein-traumberuf-5-12-grammar-notes"
    );
  });

  test("keeps focused grammar available for the late A2 workbook days", () => {
    expect(getA2GrammarRoute({ day: 25, chapter: "9.25" })).toBe(
      "/campus/course/a2-day-25-tagesablauf-workbook?view=grammar"
    );
    expect(getA2GrammarRoute({ day: 26, chapter: "10.26" })).toBe(
      "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook?view=grammar"
    );
    expect(getA2GrammarRoute({ day: 27, chapter: "10.27" })).toBe(
      "/campus/course/a2-day-27-digitale-kommunikation-workbook?view=grammar"
    );
  });
});
