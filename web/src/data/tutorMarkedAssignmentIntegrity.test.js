import fs from "fs";
import path from "path";
import { getCurriculumEntriesForLevel } from "./germanAssignmentCatalog";
import { getConfiguredInAppWorkbookResourceRoute } from "./inAppWorkbookRoutes";
import { getA1Assignment } from "./a1AssignmentRegistry";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import { buildWorkbookRouteIndex, normalizeInAppPath } from "../utils/courseWorkbookRoutes";
import { resolveTutorMarkedWorkbookAssignment } from "../utils/tutorMarkedWorkbookContext";
import { resolveWorkbookSubmissionContext } from "../utils/workbookSubmissionContext";
import { courseSchedules } from "./courseSchedule";
import { resolvePublishedAdvancedTutorAssignment } from "../components/AdvancedTutorMarkedSubmissionPanel";

const ROOT = path.resolve(__dirname, "..");
const COMPONENTS = path.join(ROOT, "components");
const appSource = fs.readFileSync(path.join(ROOT, "App.js"), "utf8");
const courseLessonSource = fs.readFileSync(path.join(COMPONENTS, "CourseLessonPage.js"), "utf8");
const a2ShellSource = fs.readFileSync(path.join(COMPONENTS, "A2StandardTabbedWorkbookPage.js"), "utf8");
const b1ShellSource = fs.readFileSync(path.join(COMPONENTS, "B1StandardWorkbookPage.js"), "utf8");
const workbookRouteIndex = buildWorkbookRouteIndex();

const EXPECTED_COUNTS = { A1: 19, A2: 28, B1: 28, B2: 28, C1: 28 };
const EXPECTED_PUBLISHED_COUNTS = { A1: 19, A2: 28, B1: 28, B2: 4, C1: 7 };

const tutorAssignments = (level) =>
  getCurriculumEntriesForLevel(level).filter(
    (entry) => entry.assignment === true && entry.progressionEligible !== false,
  );

const publishedTutorAssignments = (level) =>
  tutorAssignments(level).filter(
    (entry) => String(entry.contentStatus || "published").toLowerCase() !== "planned",
  );

const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");

const readComponent = (baseName) => {
  for (const extension of [".js", ".jsx"]) {
    const filename = path.join(COMPONENTS, baseName + extension);
    if (fs.existsSync(filename)) return fs.readFileSync(filename, "utf8");
  }
  throw new Error("Missing component source: " + baseName);
};

const collectWorkbookComponentSource = (baseName, seen = new Set(), depth = 0) => {
  if (!baseName || seen.has(baseName) || depth > 4) return "";
  seen.add(baseName);
  const source = readComponent(baseName);
  const nested = [];

  for (const match of source.matchAll(/from\s+"\.\/([^"]*(?:Legacy|V2)[^"]*)"/g)) {
    nested.push(collectWorkbookComponentSource(match[1], seen, depth + 1));
  }

  return [source, ...nested].join("\n");
};

const componentImportFor = (source, componentName) => {
  const escapedName = escapeRegex(componentName);
  const direct = source.match(
    new RegExp(
      "import\\s+" + escapedName + "\\s+from\\s+[\"']\\.\\/([^\"']+)[\"']",
    ),
  );
  if (direct?.[1]) return direct[1].replace(/^components\//, "");
  return "";
};

const getA2RouteComponent = (pathname) => {
  const routeOffset = appSource.indexOf('path="' + pathname + '"');
  if (routeOffset < 0) return "";
  const snippet = appSource.slice(routeOffset, routeOffset + 420);
  return snippet.match(/<([A-Z][A-Za-z0-9_]*)\s*\/>/)?.[1] || "";
};

const getB1DayComponent = (day) => {
  const mapStart = courseLessonSource.indexOf("const B1_WORKBOOK_PAGES = {");
  const mapEnd = courseLessonSource.indexOf("};", mapStart);
  const mapSource = courseLessonSource.slice(mapStart, mapEnd);
  return mapSource.match(new RegExp("\\b" + day + ":\\s*([A-Za-z0-9_]+)"))?.[1] || "";
};

describe("all tutor-marked A1/A2/B1 assignments", () => {
  test.each(Object.entries(EXPECTED_COUNTS))(
    "%s has the expected complete tutor-marked assignment inventory",
    (level, expectedCount) => {
      const assignments = tutorAssignments(level);
      expect(assignments).toHaveLength(expectedCount);
      expect(new Set(assignments.map((entry) => entry.assignment_id)).size).toBe(expectedCount);
    },
  );

  test.each(Object.entries(EXPECTED_PUBLISHED_COUNTS))(
    "%s exposes only its published tutor-marked assignments",
    (level, expectedCount) => {
      expect(publishedTutorAssignments(level)).toHaveLength(expectedCount);
    },
  );

  test.each(["A1", "A2", "B1"])(
    "%s tutor-marked assignments have canonical route, inline identity and locked submission context",
    (level) => {
      tutorAssignments(level).forEach((entry) => {
        const day = Number(entry.displayDay ?? entry.assignmentDay ?? entry.day);
        const chapter = String(entry.chapter || "").trim();
        const assignmentKey = String(entry.assignment_id || entry.assignmentId || "").trim();

        expect(assignmentKey).toBe(level + "-" + chapter);

        const route = getConfiguredInAppWorkbookResourceRoute({ level, day, chapter });
        expect(route).toMatch(/^\/campus\/course\//);
        expect(route).not.toMatch(/drive\.google\.com|docs\.google\.com/i);

        const target = new URL(route, "https://www.falowen.app");
        const pathname = normalizeInAppPath(target.pathname);
        const match = workbookRouteIndex.get(pathname);
        expect(match).toBeTruthy();
        expect(String(match.level || "").toUpperCase()).toBe(level);

        const inlineAssignments = getInlineCourseAssignments(level, day);
        const inline = inlineAssignments.find(
          (assignment) => assignment.assignmentKey === assignmentKey,
        );
        expect(inline).toBeTruthy();

        const resolvedAssignment = resolveTutorMarkedWorkbookAssignment({
          level,
          day,
          pathname: target.pathname,
          search: target.search,
        });
        expect(resolvedAssignment?.assignmentKey).toBe(assignmentKey);

        const locked = resolveWorkbookSubmissionContext({
          submissionContext: {
            level,
            day,
            assignmentKey,
            canonicalAssignmentKey: assignmentKey,
          },
        });
        expect(locked).toEqual(
          expect.objectContaining({
            level,
            day,
            assignmentKey,
            locked: true,
          }),
        );
      });
    },
  );

  test("A1 self-practice is not accidentally classified as tutor-marked", () => {
    const pathname = "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook";
    expect(workbookRouteIndex.get(pathname)).toBeTruthy();
    expect(
      resolveTutorMarkedWorkbookAssignment({
        level: "A1",
        day: 3,
        pathname,
        search: "",
      }),
    ).toBeNull();
  });

  test("all 19 A1 tutor assignments resolve to the native canonical registry", () => {
    tutorAssignments("A1").forEach((entry) => {
      const assignment = getA1Assignment(entry.assignment_id);
      expect(assignment).toEqual(
        expect.objectContaining({
          assignmentKey: entry.assignment_id,
          day: Number(entry.day),
          chapter: entry.chapter,
          layoutMode: "native",
        }),
      );
    });
  });

  test("all 28 A2 workbook components own the correct canonical Submit context", () => {
    expect(a2ShellSource).toMatch(/const assignmentKey = .*A2-.*chapter/);
    expect(a2ShellSource).toContain("<ContextualAssignmentSubmissionPage submissionContext={submissionContext} />");

    tutorAssignments("A2").forEach((entry) => {
      const day = Number(entry.day);
      const chapter = String(entry.chapter);
      const assignmentKey = String(entry.assignment_id);
      const route = getConfiguredInAppWorkbookResourceRoute({ level: "A2", day, chapter });
      const pathname = normalizeInAppPath(route);
      const componentName = getA2RouteComponent(pathname);

      expect(componentName).toBeTruthy();
      const componentFile = componentImportFor(appSource, componentName);
      expect(componentFile).toBeTruthy();
      const source = collectWorkbookComponentSource(componentFile);

      if (source.includes("A2StandardTabbedWorkbookPage")) {
        expect(source).toContain("day={" + day + "}");
        expect(source).toContain('chapter="' + chapter + '"');
      } else {
        expect(source).toContain(assignmentKey);
        expect(source).toContain("submissionContext");
        expect(source).toMatch(/ContextualAssignmentSubmissionPage|AssignmentSubmissionPage/);
      }
    });
  });

  test.each(["B2", "C1"])(
    "%s published teacher-marked lessons resolve to locked submission contexts",
    (level) => {
      publishedTutorAssignments(level).forEach((entry) => {
        const day = Number(entry.day);
        const assignmentKey = String(entry.assignment_id);
        const resolved = resolvePublishedAdvancedTutorAssignment({ level, day });

        expect(resolved).toEqual(
          expect.objectContaining({
            level,
            day,
            chapter: entry.chapter,
            assignmentKey,
            canonicalAssignmentKey: assignmentKey,
          }),
        );

        expect(
          resolveWorkbookSubmissionContext({ submissionContext: resolved }),
        ).toEqual(
          expect.objectContaining({
            level,
            day,
            assignmentKey,
            locked: true,
          }),
        );

        expect(JSON.stringify(courseSchedules[level] || [])).toContain(assignmentKey);
      });
    },
  );

  test.each(["B2", "C1"])(
    "%s planned teacher assignments stay unavailable until published",
    (level) => {
      tutorAssignments(level)
        .filter((entry) => String(entry.contentStatus || "").toLowerCase() === "planned")
        .forEach((entry) => {
          expect(
            resolvePublishedAdvancedTutorAssignment({
              level,
              day: Number(entry.day),
              canonicalLesson: entry,
            }),
          ).toBeNull();
        });
    },
  );

  test("all 28 B1 workbook components own the correct canonical Submit context", () => {
    expect(b1ShellSource).toContain("assignmentKey: config.assignmentKey");
    expect(b1ShellSource).toContain("canonicalAssignmentKey: config.assignmentKey");

    tutorAssignments("B1").forEach((entry) => {
      const day = Number(entry.day);
      const assignmentKey = String(entry.assignment_id);
      const componentName = getB1DayComponent(day);
      expect(componentName).toBeTruthy();

      const componentFile = componentImportFor(courseLessonSource, componentName);
      expect(componentFile).toBeTruthy();
      const source = collectWorkbookComponentSource(componentFile);

      expect(source).toContain(assignmentKey);
      if (source.includes("B1StandardWorkbookPage")) {
        expect(source).toContain("day: " + day);
      } else {
        expect(source).toContain("submissionContext");
        expect(source).toMatch(/ContextualAssignmentSubmissionPage|AssignmentSubmissionPage/);
      }
    });
  });
});
