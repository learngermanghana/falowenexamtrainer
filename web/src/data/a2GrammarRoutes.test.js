import {
  A2_GRAMMAR_ROUTE_ENTRIES,
  applyA2GrammarRouteToLesson,
  getA2GrammarRoute,
  hasOnlyInternalA2GrammarRoutes,
} from "./a2GrammarRoutes";
import { normalizeLesson } from "./lessonModel";

describe("A2 in-app grammar routes", () => {
  test("all configured A2 grammar routes stay inside Falowen", () => {
    expect(hasOnlyInternalA2GrammarRoutes()).toBe(true);
    expect(A2_GRAMMAR_ROUTE_ENTRIES.length).toBeGreaterThan(20);
    A2_GRAMMAR_ROUTE_ENTRIES.forEach(({ route }) => {
      expect(route).toMatch(/^\/campus\/course\//);
      expect(route).not.toMatch(/drive\.google\.com|docs\.google\.com/i);
    });
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

  test("returns no route for days without a dedicated grammar page", () => {
    expect(getA2GrammarRoute({ day: 25, chapter: "9.25" })).toBe("");
  });
});
