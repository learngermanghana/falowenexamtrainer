import { courseSchedules } from "./courseSchedule";
import { getAssignmentDictionaryEntry, getCurriculumEntriesForLevel } from "./germanAssignmentCatalog";
import { hasOnlyInAppWorkbookRoutesForLevel, resolveInAppWorkbookRoute } from "./inAppWorkbookRoutes";
import { normalizeLesson } from "./lessonModel";

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const expectInternal = (route) => expect(route).toMatch(/^\/campus\/course\//);

describe("A1 and A2 workbook routes", () => {
  test.each(["A1", "A2"])("%s route map is internal", (level) => {
    expect(hasOnlyInAppWorkbookRoutesForLevel(level)).toBe(true);
  });

  test("known A1 assignments use in-app workbooks", () => {
    const cases = [
      ["A1-2", 4, "/campus/course/a1-day-4-numbers-for-beginners-workbook"],
      ["A1-3", 7, "/campus/course/a1-chapter-3-asking-about-prices-workbook"],
      ["A1-5", 9, "/campus/course/a1-chapter-5-german-cases-workbook"],
      ["A1-6", 10, "/campus/course/a1-day-10-objects-colors-possessive-articles-workbook"],
    ];

    cases.forEach(([assignmentId, assignmentDay, expectedRoute]) => {
      const entry = getAssignmentDictionaryEntry({ level: "A1", assignmentId, assignmentDay });
      expect(entry.workbookRoute).toBe(expectedRoute);
      expectInternal(entry.workbookRoute);
    });
  });

  test("A1 Day 18 uses its in-app chapter routes", () => {
    expect(resolveInAppWorkbookRoute({ level: "A1", day: 18, chapter: "12.1" })).toBe(
      "/campus/course/two-case-prepositions-wechselpraepositionen-day-18"
    );
    expect(resolveInAppWorkbookRoute({ level: "A1", day: 18, chapter: "12.2" })).toBe(
      "/campus/course/a1-12-2-dative-articles-mit-bei-zu"
    );
  });

  test.each(["A1", "A2"])("%s effective curriculum routes are internal", (level) => {
    getCurriculumEntriesForLevel(level).forEach((entry) => {
      const routes = [
        entry.workbookRoute,
        entry.workbook_link,
        ...toArray(entry.resources).flatMap((resource) => [resource.workbookRoute, resource.workbook_link]),
        ...toArray(entry.lesen_hören).flatMap((resource) => [resource.workbookRoute, resource.workbook_link]),
        ...toArray(entry.schreiben_sprechen).flatMap((resource) => [resource.workbookRoute, resource.workbook_link]),
      ].filter(Boolean);
      routes.forEach(expectInternal);
    });
  });

  test.each(["A1", "A2"])("%s lesson workbook buttons are internal", (level) => {
    (courseSchedules[level] || []).forEach((entry) => {
      const lesson = normalizeLesson(entry, level);
      lesson.resources.resourceGroups.forEach((group) => {
        if (group.workbook?.url) expectInternal(group.workbook.url);
      });
    });
  });
});
