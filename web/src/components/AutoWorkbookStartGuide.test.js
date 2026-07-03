import { A1_COURSE_BOOK_CARDS } from "../data/a1CourseBookCards";
import { courseSchedules } from "../data/courseSchedule";
import {
  getConfiguredInAppWorkbookRoute,
  hasOnlyInAppWorkbookRoutesForLevel,
} from "../data/inAppWorkbookRoutes";
import { normalizeLesson } from "../data/lessonModel";
import {
  SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS,
  shouldRenderWorkbookGuide,
} from "../utils/autoWorkbookGuideRouting";
import { buildWorkbookRouteIndex, normalizeInAppPath } from "../utils/courseWorkbookRoutes";

describe("AutoWorkbookStartGuide route matching", () => {
  test("normalizes relative and Falowen-hosted in-app links", () => {
    expect(normalizeInAppPath("/campus/course/a1-workbook/")).toBe("/campus/course/a1-workbook");
    expect(normalizeInAppPath("https://www.falowen.app/campus/course/a2-workbook?source=course")).toBe(
      "/campus/course/a2-workbook"
    );
  });

  test("ignores external workbook links", () => {
    expect(normalizeInAppPath("https://drive.google.com/file/d/workbook/view")).toBe("");
  });

  test("indexes workbook links from every lesson resource shape and keeps the matched resource", () => {
    const readingResource = { workbook_link: "/campus/course/reading-workbook", chapter: "2.1" };
    const writingResource = {
      workbook_link: "https://www.falowen.app/campus/course/writing-workbook",
      chapter: "2.2",
    };
    const entry = {
      day: 7,
      workbook_link: "/campus/course/direct-workbook",
      lesen_hören: [readingResource],
      schreiben_sprechen: writingResource,
    };
    const index = buildWorkbookRouteIndex({ A1: [entry] });
    expect(index.get("/campus/course/direct-workbook")).toEqual({ level: "A1", day: 7, entry, resource: entry });
    expect(index.get("/campus/course/reading-workbook")).toEqual({ level: "A1", day: 7, entry, resource: readingResource });
    expect(index.get("/campus/course/writing-workbook")).toEqual({ level: "A1", day: 7, entry, resource: writingResource });
  });

  test.each(["A1", "A2", "B1"])("%s configured routes are internal", (level) => {
    expect(hasOnlyInAppWorkbookRoutesForLevel(level)).toBe(true);
  });

  test.each(["A1", "A2"])("%s lesson workbook buttons never expose external routes", (level) => {
    (courseSchedules[level] || []).forEach((entry) => {
      normalizeLesson(entry, level).resources.resourceGroups.forEach((group) => {
        if (group.workbook?.url) expect(group.workbook.url).toMatch(/^\/campus\/course\//);
      });
    });
  });

  test("live route index includes the corrected A1 workbook routes", () => {
    const index = buildWorkbookRouteIndex();
    expect(index.has("/campus/course/a1-day-4-numbers-for-beginners-workbook")).toBe(true);
    expect(index.has("/campus/course/a1-chapter-3-asking-about-prices-workbook")).toBe(true);
    expect(index.has("/campus/course/a1-chapter-5-german-cases-workbook")).toBe(true);
    expect(index.has("/campus/course/a1-day-10-objects-colors-possessive-articles-workbook")).toBe(true);
  });

  test("A1 Day 2 Kapitel 1.1 uses its own Assignment and Submit tabs", () => {
    expect(
      SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS.has(
        "/campus/course/a1-day-2-kapitel-1-1-workbook"
      )
    ).toBe(true);
  });

  test("A1 Day 18 Kapitel 12.1 has a workbook view distinct from grammar notes", () => {
    const route = getConfiguredInAppWorkbookRoute({ level: "A1", day: 18, chapter: "12.1" });
    expect(route).toBe(
      "/campus/course/two-case-prepositions-wechselpraepositionen-day-18?view=workbook"
    );
    expect(route).not.toBe(
      "/campus/course/two-case-prepositions-wechselpraepositionen-day-18"
    );
    expect(
      SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS.has(
        "/campus/course/two-case-prepositions-wechselpraepositionen-day-18"
      )
    ).toBe(true);
  });

  test("A1 Day 18 Kapitel 12.2 has a workbook view distinct from grammar notes", () => {
    const route = getConfiguredInAppWorkbookRoute({ level: "A1", day: 18, chapter: "12.2" });
    expect(route).toBe(
      "/campus/course/a1-12-2-dative-articles-mit-bei-zu?view=workbook"
    );
    expect(route).not.toBe(
      "/campus/course/a1-12-2-dative-articles-mit-bei-zu"
    );
    expect(
      SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS.has(
        "/campus/course/a1-12-2-dative-articles-mit-bei-zu"
      )
    ).toBe(true);
  });

  test.each([
    "/campus/course/two-case-prepositions-wechselpraepositionen-day-18",
    "/campus/course/a1-12-2-dative-articles-mit-bei-zu",
  ])("A1 Day 18 grammar page %s does not mount workbook controls", (pathname) => {
    const match = { level: "A1", day: 18 };
    expect(
      shouldRenderWorkbookGuide({ pathname, search: "", match })
    ).toBe(false);
    expect(
      shouldRenderWorkbookGuide({ pathname, search: "?view=workbook", match })
    ).toBe(true);
  });

  test("every canonical tutor-marked A1 workbook route receives submission support", () => {
    const index = buildWorkbookRouteIndex();
    const assignmentWorkbookRoutes = new Map();

    (courseSchedules.A1 || []).forEach((entry) => {
      const resources = [
        entry,
        ...(Array.isArray(entry.lesen_hören) ? entry.lesen_hören : entry.lesen_hören ? [entry.lesen_hören] : []),
        ...(Array.isArray(entry.schreiben_sprechen)
          ? entry.schreiben_sprechen
          : entry.schreiben_sprechen
            ? [entry.schreiben_sprechen]
            : []),
      ];

      resources.forEach((resource) => {
        if (resource?.assignment !== true) return;
        const route = resource.workbook_link || resource.workbookRoute;
        const pathname = normalizeInAppPath(route);
        if (!pathname) return;
        const search = new URL(route, "https://www.falowen.app").search;
        assignmentWorkbookRoutes.set(pathname, search);
      });
    });

    const canonicalTutorMarkedPaths = new Set(
      A1_COURSE_BOOK_CARDS
        .filter((card) => card.submissionRequired)
        .map((card) => normalizeInAppPath(card.workbookRoute))
        .filter(Boolean),
    );

    expect(new Set(assignmentWorkbookRoutes.keys())).toEqual(canonicalTutorMarkedPaths);
    assignmentWorkbookRoutes.forEach((search, pathname) => {
      const match = index.get(pathname);
      expect(match).toBeTruthy();
      expect(shouldRenderWorkbookGuide({ pathname, search, match })).toBe(true);
    });
  });

  test("B1 lesson hub does not render workbook submission controls", () => {
    expect(
      shouldRenderWorkbookGuide({
        pathname: "/campus/course/lesson/B1/2",
        search: "",
        match: { level: "B1", day: 2 },
      })
    ).toBe(false);
  });

  test("B1 workbook view renders the current A2-style submission controls", () => {
    expect(
      shouldRenderWorkbookGuide({
        pathname: "/campus/course/lesson/B1/2",
        search: "?view=workbook",
        match: { level: "B1", day: 2 },
      })
    ).toBe(true);
  });

  test("B1 grammar view does not render workbook submission controls", () => {
    expect(
      shouldRenderWorkbookGuide({
        pathname: "/campus/course/lesson/B1/2",
        search: "?view=grammar",
        match: { level: "B1", day: 2 },
      })
    ).toBe(false);
  });
});
