import { getCurriculumEntriesForLevel } from "./curriculumManifest";
import { courseSchedules } from "./courseSchedule";
import { getConfiguredInAppWorkbookResourceRoute } from "./inAppWorkbookRoutes";
import {
  A2_DAY1_GRAMMAR_ROUTE,
  A2_DAY1_VIDEO,
  A2_DAY1_WORKBOOK_ROUTE,
} from "./a2CurriculumAlignment";

describe("A2 Day 1 Course Book audit", () => {
  test("keeps the canonical Day 1 assignment and current resources at runtime", () => {
    const entry = getCurriculumEntriesForLevel("A2").find(
      (item) => Number(item.day ?? item.assignmentDay) === 1 && String(item.chapter) === "1.1",
    );

    expect(entry).toBeTruthy();
    expect(entry.assignment_id || entry.assignmentId).toBe("A2-1.1");
    expect(entry.title).toBe("Small Talk 1.1 (Exercise)");
    expect(entry.video).toBe(A2_DAY1_VIDEO);
    expect(entry.grammarPage).toBe(A2_DAY1_GRAMMAR_ROUTE);
    expect(entry.workbookRoute).toBe(A2_DAY1_WORKBOOK_ROUTE);
    expect(entry.submissionRequired).toBe(true);
  });

  test("the final A2 schedule does not fall back to the stale Day 1 lecture", () => {
    const lesson = (courseSchedules.A2 || []).find((item) => Number(item.day) === 1);
    const resource = Array.isArray(lesson?.lesen_hören) ? lesson.lesen_hören[0] : lesson?.lesen_hören;

    expect(lesson).toBeTruthy();
    expect(lesson.topic).toBe("Small Talk 1.1 (Exercise)");
    expect(lesson.assignment).toBe(true);
    expect(lesson.assignmentId || lesson.assignment_id).toBe("A2-1.1");
    expect(resource?.video || resource?.youtube_link).toBe(A2_DAY1_VIDEO);
    expect(resource?.grammarbook_link || resource?.grammarPage).toBe(A2_DAY1_GRAMMAR_ROUTE);
    expect(resource?.workbook_link || resource?.workbookRoute).toBe(A2_DAY1_WORKBOOK_ROUTE);
  });

  test("the configured in-app Day 1 workbook still resolves to the audited Small Talk workbook", () => {
    expect(
      getConfiguredInAppWorkbookResourceRoute({ level: "A2", day: 1, chapter: "1.1" }),
    ).toBe(A2_DAY1_WORKBOOK_ROUTE);
  });
});
