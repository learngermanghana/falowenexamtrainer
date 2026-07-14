import { getA1CourseBookCard } from "./a1CourseBookCards";
import {
  A1_DAY23_CHAPTER142_GRAMMAR_ROUTE,
  getConfiguredInAppWorkbookResourceRoute,
  getConfiguredInAppWorkbookRoute,
} from "./inAppWorkbookRoutes";
import {
  A1_DAY23_CHAPTER142_GRAMMAR_PATH,
  shouldRenderWorkbookGuide,
  shouldSuppressGenericWorkbookGuide,
} from "../utils/autoWorkbookGuideRouting";

describe("A1 Day 23 Chapter 14.2 grammar-only lesson", () => {
  const originalPath = window.location.pathname;

  afterEach(() => {
    window.history.replaceState({}, "", originalPath || "/");
  });

  it("remains self-learning and not progression eligible", () => {
    const card = getA1CourseBookCard({ displayDay: 23, chapter: "14.2" });

    expect(card?.assessmentType).toBe("self-practice");
    expect(card?.submissionRequired).toBe(false);
    expect(card?.progressionEligible).toBe(false);
  });

  it("opens the grammar page from the Day 23 lesson link", () => {
    window.history.replaceState({}, "", "/campus/course/lesson/A1/23?chapter=14.2");

    expect(getConfiguredInAppWorkbookRoute({ level: "A1", day: 23, chapter: "14.2" })).toBe(
      A1_DAY23_CHAPTER142_GRAMMAR_ROUTE,
    );
  });

  it("is not registered as an A1 workbook destination", () => {
    expect(getConfiguredInAppWorkbookResourceRoute({ level: "A1", day: 23, chapter: "14.2" })).toBe("");
  });

  it("never receives the generic workbook or assignment guide", () => {
    expect(A1_DAY23_CHAPTER142_GRAMMAR_PATH).toBe(A1_DAY23_CHAPTER142_GRAMMAR_ROUTE);
    expect(shouldSuppressGenericWorkbookGuide(A1_DAY23_CHAPTER142_GRAMMAR_PATH)).toBe(true);
    expect(
      shouldRenderWorkbookGuide({
        pathname: A1_DAY23_CHAPTER142_GRAMMAR_PATH,
        search: "",
        match: { level: "A1", day: 23, resource: { chapter: "14.2", assignment: false } },
      }),
    ).toBe(false);
  });
});
