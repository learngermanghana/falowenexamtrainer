import fs from "fs";
import path from "path";
import { A1_COURSE_BOOK_CARDS } from "./a1CourseBookCards";
import {
  A1_ASSIGNMENT_ORDER,
  A1_ASSIGNMENT_REGISTRY,
  getA1Assignment,
} from "./a1AssignmentRegistry";
import {
  A1_TEACHER_VIDEO_RESOURCES,
  getA1TeacherVideoResources,
} from "./a1TeacherVideoResources";
import { getWorkbookNavigationTabs } from "../utils/courseWorkbookSubmission";

const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
const componentRoot = path.resolve(__dirname, "../components");

const normalize = (value = "") => String(value || "").trim();
const routePathname = (route = "") => normalize(route).split(/[?#]/)[0];
const isInternalCourseRoute = (route = "") => /^\/campus\/course\//.test(normalize(route));
const isRegisteredRoute = (route = "") => {
  const pathname = routePathname(route);
  if (!pathname) return true;
  if (appSource.includes(`path="${pathname}"`)) return true;
  return (
    appSource.includes('path="/campus/course/lesson/:level/:day"') &&
    /^\/campus\/course\/lesson\/(A1|A2|B1|B2|C1|C2)\/\d+$/i.test(pathname)
  );
};

const cardKey = (day, chapter) => `${Number(day)}:${normalize(chapter)}`;

const readAssignmentComponentSource = (componentName) => {
  const candidates = [
    path.join(componentRoot, `${componentName}.js`),
    path.join(componentRoot, `${componentName}.jsx`),
  ];
  const target = candidates.find((candidate) => fs.existsSync(candidate));
  if (!target) throw new Error(`Missing workbook component source for ${componentName}`);
  return fs.readFileSync(target, "utf8");
};

describe("A1 Course Book health", () => {
  test("keeps the complete canonical A1 Course Book shape", () => {
    expect(A1_COURSE_BOOK_CARDS).toHaveLength(29);

    const countsByDay = new Map();
    A1_COURSE_BOOK_CARDS.forEach((card) => {
      countsByDay.set(Number(card.displayDay), (countsByDay.get(Number(card.displayDay)) || 0) + 1);
      expect(normalize(card.chapter)).not.toBe("");
      expect(normalize(card.title)).not.toBe("");
      expect(normalize(card.lessonId)).not.toBe("");
      expect(normalize(card.workbookRoute)).not.toBe("");
    });

    for (let day = 0; day <= 24; day += 1) {
      expect(countsByDay.get(day) || 0).toBe(day === 2 || day === 3 || day === 16 || day === 18 ? 2 : 1);
    }
  });

  test("keeps every resolved workbook and grammar destination inside registered Falowen routes", () => {
    A1_COURSE_BOOK_CARDS.forEach((card) => {
      [card.workbookRoute, card.grammarPage].filter(Boolean).forEach((route) => {
        expect(route).not.toMatch(/drive\.google\.com|docs\.google\.com/i);
        expect(route).not.toMatch(/^https?:\/\/(?:www\.)?falowen\.app/i);
        expect(isInternalCourseRoute(route)).toBe(true);
        expect(isRegisteredRoute(route)).toBe(true);
      });
    });
  });

  test("keeps tutor-marked Course Book cards and assignment ownership in one-to-one sync", () => {
    const tutorMarkedCards = A1_COURSE_BOOK_CARDS.filter((card) => Boolean(card.submissionRequired));
    expect(tutorMarkedCards).toHaveLength(A1_ASSIGNMENT_ORDER.length);
    expect(new Set(A1_ASSIGNMENT_ORDER).size).toBe(A1_ASSIGNMENT_ORDER.length);
    expect(Object.keys(A1_ASSIGNMENT_REGISTRY).sort()).toEqual([...A1_ASSIGNMENT_ORDER].sort());

    tutorMarkedCards.forEach((card) => {
      const assignment = getA1Assignment(card.assignmentId);
      expect(assignment).not.toBeNull();
      expect(assignment.day).toBe(Number(card.displayDay));
      expect(assignment.chapter).toBe(normalize(card.chapter));
      expect(assignment.workbookRoute).toBe(card.workbookRoute);
      expect(assignment.submissionEnabled).toBe(true);
      expect(assignment.sections.length).toBeGreaterThan(0);
      expect(new Set(assignment.sections.map((section) => section.key)).size).toBe(assignment.sections.length);
    });

    A1_COURSE_BOOK_CARDS.filter((card) => !card.submissionRequired).forEach((card) => {
      expect(getA1Assignment(card.assignmentId)).toBeNull();
    });
  });

  test("keeps Day 12 vocabulary as a reminder rather than a fourth assessed Teil", () => {
    const day12 = getA1Assignment("A1-8");
    expect(day12.sections.map((section) => section.key)).toEqual(["teil-1", "teil-2", "teil-3"]);
    expect(day12.sections.map((section) => section.label).join(" ")).not.toMatch(/Teil 4/i);
  });

  test("keeps canonical teacher lectures mapped to real A1 cards and covers every teaching day", () => {
    const configuredCardKeys = new Set(
      A1_COURSE_BOOK_CARDS.map((card) => cardKey(card.displayDay, card.chapter)),
    );
    const resourceKeys = new Set();

    A1_TEACHER_VIDEO_RESOURCES.forEach((resource) => {
      expect(configuredCardKeys.has(cardKey(resource.day, resource.chapter))).toBe(true);
      expect(resource.url).toMatch(/^https:\/\/youtu\.be\//);
      expect(resourceKeys.has(resource.key)).toBe(false);
      resourceKeys.add(resource.key);
    });

    for (let day = 1; day <= 24; day += 1) {
      expect(getA1TeacherVideoResources(day).length).toBeGreaterThan(0);
    }
  });

  test("keeps retired generic A1 workbook tabs from returning", () => {
    expect(getWorkbookNavigationTabs("A1")).toEqual([]);
  });

  test("keeps tutor-marked workbook source free of known internal or stale learner copy", () => {
    Object.values(A1_ASSIGNMENT_REGISTRY).forEach((assignment) => {
      const source = readAssignmentComponentSource(assignment.component);
      expect(source).not.toMatch(/locked\s+to\s+A1-[\w.-]+/i);
      expect(source).not.toMatch(/tutor-marked assignment\s*[·:-]\s*A1-[\w.-]+/i);
      expect(source).not.toMatch(/\bUse the Assignment tab\b/i);
      expect(source).not.toMatch(/internal\s+assignment/i);
      expect(source).not.toMatch(/official\s+position/i);
    });
  });
});
