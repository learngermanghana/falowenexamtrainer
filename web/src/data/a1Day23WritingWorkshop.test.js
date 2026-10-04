import { getA1CourseBookCard } from "./a1CourseBookCards";
import {
  A1_DAY23_CHAPTER142_WRITING_ROUTE,
  getConfiguredInAppWorkbookResourceRoute,
  getConfiguredInAppWorkbookRoute,
} from "./inAppWorkbookRoutes";
import {
  A1_DAY23_CHAPTER142_WRITING_PATH,
  shouldRenderWorkbookGuide,
  shouldSuppressGenericWorkbookGuide,
} from "../utils/autoWorkbookGuideRouting";

describe("A1 Day 23 Chapter 14.2 writing workshop", () => {
  const originalPath = window.location.pathname;

  afterEach(() => {
    window.history.replaceState({}, "", originalPath || "/");
  });

  it("stays self-practice and does not gate course progression", () => {
    const card = getA1CourseBookCard({ displayDay: 23, chapter: "14.2" });

    expect(card).toMatchObject({
      title: "Schreiben: E-Mails und Briefe für Alltag und Prüfung",
      assessmentType: "self-practice",
      submissionRequired: false,
      progressionEligible: false,
    });
  });

  it("opens the writing workshop from the Day 23 lesson link", () => {
    window.history.replaceState({}, "", "/campus/course/lesson/A1/23?chapter=14.2");

    expect(getConfiguredInAppWorkbookRoute({ level: "A1", day: 23, chapter: "14.2" })).toBe(
      A1_DAY23_CHAPTER142_WRITING_ROUTE,
    );
  });

  it("remains a self-managed destination rather than a generic workbook route", () => {
    expect(getConfiguredInAppWorkbookResourceRoute({ level: "A1", day: 23, chapter: "14.2" })).toBe("");
    expect(A1_DAY23_CHAPTER142_WRITING_PATH).toBe(A1_DAY23_CHAPTER142_WRITING_ROUTE);
    expect(shouldSuppressGenericWorkbookGuide(A1_DAY23_CHAPTER142_WRITING_PATH)).toBe(true);
    expect(
      shouldRenderWorkbookGuide({
        pathname: A1_DAY23_CHAPTER142_WRITING_PATH,
        search: "",
        match: { level: "A1", day: 23, resource: { chapter: "14.2", assignment: false } },
      }),
    ).toBe(false);
  });
});
