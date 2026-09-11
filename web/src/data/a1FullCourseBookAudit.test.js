import fs from "fs";
import path from "path";
import { A1_COURSE_BOOK_CARDS } from "./a1CourseBookCards";
import {
  A1_ASSIGNMENT_ORDER,
  A1_ASSIGNMENT_REGISTRY,
  getA1Assignment,
} from "./a1AssignmentRegistry";
import { A1_GRAMMAR_ROUTE_ENTRIES } from "./a1GrammarRoutes";
import {
  A1_TEACHER_VIDEO_RESOURCES,
  getA1TeacherVideoResources,
  getCanonicalA1TeacherVideoResource,
} from "./a1TeacherVideoResources";
import {
  getConfiguredInAppWorkbookResourceRoute,
  hasOnlyInAppWorkbookRoutesForLevel,
} from "./inAppWorkbookRoutes";
import { validateA1CanonicalSubmissionCompleteness } from "../components/A1CanonicalSubmissionPanel";

const appSource = fs.readFileSync(path.join(process.cwd(), "src", "App.js"), "utf8");
const componentSource = (file) =>
  fs.readFileSync(path.join(process.cwd(), "src", "components", file), "utf8");
const routePathname = (route = "") => String(route || "").trim().split(/[?#]/)[0];
const isMountedCourseRoute = (route = "") => {
  const pathname = routePathname(route);
  if (!pathname) return false;
  if (appSource.includes(`path="${pathname}"`)) return true;
  return (
    appSource.includes('path="/campus/course/lesson/:level/:day"') &&
    /^\/campus\/course\/lesson\/A1\/\d+$/i.test(pathname)
  );
};
const cardKey = (day, chapter) => `${Number(day)}:${String(chapter || "").trim()}`;

describe("A1 full Course Book consolidation", () => {
  test("covers the complete A1 programme from Day 0 through Day 24", () => {
    expect(A1_COURSE_BOOK_CARDS).toHaveLength(29);
    const counts = new Map();
    A1_COURSE_BOOK_CARDS.forEach((card) => {
      counts.set(Number(card.displayDay), (counts.get(Number(card.displayDay)) || 0) + 1);
    });

    for (let day = 0; day <= 24; day += 1) {
      const expected = [2, 3, 16, 18].includes(day) ? 2 : 1;
      expect(counts.get(day) || 0).toBe(expected);
    }
  });

  test("every A1 card resolves through the central in-app workbook table", () => {
    A1_COURSE_BOOK_CARDS.forEach((card) => {
      const configuredRoute = getConfiguredInAppWorkbookResourceRoute({
        level: "A1",
        day: card.displayDay,
        chapter: card.chapter,
      });

      expect(configuredRoute).toBe(card.workbookRoute);
      expect(configuredRoute).toMatch(/^\/campus\/course\//);
      expect(configuredRoute).not.toMatch(/drive\.google\.com|docs\.google\.com/i);
      expect(isMountedCourseRoute(configuredRoute)).toBe(true);
    });

    expect(hasOnlyInAppWorkbookRoutesForLevel("A1")).toBe(true);
  });

  test("every configured A1 grammar route belongs to a real card and mounted page", () => {
    const cardKeys = new Set(
      A1_COURSE_BOOK_CARDS.map((card) => cardKey(card.displayDay, card.chapter)),
    );

    A1_GRAMMAR_ROUTE_ENTRIES.forEach(({ day, chapter, route }) => {
      expect(cardKeys.has(cardKey(day, chapter))).toBe(true);
      expect(route).toMatch(/^\/campus\/course\//);
      expect(route).not.toMatch(/drive\.google\.com|docs\.google\.com/i);
      expect(isMountedCourseRoute(route)).toBe(true);
    });
  });

  test("all tutor-marked cards keep one canonical assignment owner", () => {
    const tutorMarkedCards = A1_COURSE_BOOK_CARDS.filter((card) => card.submissionRequired);
    expect(tutorMarkedCards).toHaveLength(A1_ASSIGNMENT_ORDER.length);
    expect(Object.keys(A1_ASSIGNMENT_REGISTRY).sort()).toEqual([...A1_ASSIGNMENT_ORDER].sort());

    tutorMarkedCards.forEach((card) => {
      const assignment = getA1Assignment(card.assignmentId);
      expect(assignment).toBeTruthy();
      expect(assignment.day).toBe(Number(card.displayDay));
      expect(assignment.chapter).toBe(String(card.chapter));
      expect(assignment.workbookRoute).toBe(card.workbookRoute);
      expect(assignment.submissionEnabled).toBe(true);
    });
  });

  test("every teaching day keeps at least one canonical teacher lecture", () => {
    const cardKeys = new Set(
      A1_COURSE_BOOK_CARDS.map((card) => cardKey(card.displayDay, card.chapter)),
    );

    A1_TEACHER_VIDEO_RESOURCES.forEach((resource) => {
      expect(cardKeys.has(cardKey(resource.day, resource.chapter))).toBe(true);
      expect(resource.url).toMatch(/^https:\/\/youtu\.be\//);
    });

    for (let day = 1; day <= 24; day += 1) {
      expect(getA1TeacherVideoResources(day).length).toBeGreaterThan(0);
    }
  });

  test("the Day 2 alphabet submission cannot omit its Hören section", () => {
    const incomplete = validateA1CanonicalSubmissionCompleteness({
      assignmentKey: "A1-0.2",
      text: "Teil 1:\n1. C\n2. B\n3. A\n4. C\n5. B\n6. A\n7. C",
    });
    expect(incomplete.ok).toBe(false);
    expect(incomplete.message).toContain("Teil 2 · Hören answers 1, 2, 3, 4, 5");

    const complete = validateA1CanonicalSubmissionCompleteness({
      assignmentKey: "A1-0.2",
      text: [
        "Teil 1:",
        "1. C", "2. B", "3. A", "4. C", "5. B", "6. A", "7. C",
        "Teil 2 · Hören:",
        "1. Wasser", "2. Berlin", "3. Anna", "4. neun", "5. Schule",
      ].join("\n"),
    });
    expect(complete).toEqual({ ok: true, message: "" });
  });

  test("the corrected Day 2 section numbering and Day 3 lecture resources stay in place", () => {
    const alphabetWorkbook = componentSource("A1Day3GermanAlphabetReviewingWorkbookPage.js");
    expect(alphabetWorkbook).toContain("Teil 2 · Hören");
    expect(alphabetWorkbook).not.toContain("Teil 3 · Hören");
    expect(alphabetWorkbook).toContain("A1-0.2");

    expect(getCanonicalA1TeacherVideoResource(3, "1.1")?.url).toBe(
      "https://youtu.be/Ygbpt6yC_f4",
    );
    expect(getCanonicalA1TeacherVideoResource(3, "1.2")?.url).toBe(
      "https://youtu.be/9CTJ-2nsY8U",
    );

    const day3Practice = componentSource("A1Day3SchreibenSprechenKapitel11WorkbookPage.js");
    expect(day3Practice).toContain("getCanonicalA1TeacherVideoResource");
    expect(day3Practice).toContain("teacherVideo={A1_DAY3_KAPITEL_11_TEACHER_VIDEO}");
  });

  test("all A1 workbook pages keep the global PDF download injector", () => {
    expect(appSource).toContain('import BookPdfDownloadInjector from "./components/BookPdfDownloadInjector"');
    expect(appSource).toContain("<BookPdfDownloadInjector />");
  });

  test("Day 6 lazy workbook ownership still resolves to the native workbook", () => {
    const day6Route = componentSource("A1WorkbookRoutePage.jsx");
    expect(day6Route).toContain("A1Day6FamilyAndHobbiesWorkbookPage");
    expect(day6Route).toContain("A1-2.3");
  });
});
