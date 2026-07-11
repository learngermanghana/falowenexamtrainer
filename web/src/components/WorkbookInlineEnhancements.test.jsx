import { getWorkbookNavigationTabs } from "../utils/courseWorkbookSubmission";
import {
  A1_TUTOR_MARKED_ASSIGNMENT_KEYS,
  findWorkbookPageRoot,
  hasExistingA1SubmissionTabs,
  hideLegacyA1SubmitControls,
  resolveA1WorkbookSubmissionMatch,
  restoreLegacyA1SubmitControls,
} from "./WorkbookInlineEnhancements";

jest.mock("./ClassWorkbookShareBox", () => () => null);
jest.mock("./CourseWorkbookSubmissionTabs", () => () => null);

const A1_ASSIGNMENT_WORKBOOK_CASES = [
  ["A1-0.1", "/campus/course/a1-day-1-greetings-workbook", ""],
  ["A1-0.2", "/campus/course/a1-day-2-german-alphabet-reviewing-workbook", ""],
  ["A1-1.1", "/campus/course/a1-day-2-kapitel-1-1-workbook", ""],
  ["A1-1.2", "/campus/course/a1-day-3-pronouns-introducing-yourself-workbook", ""],
  ["A1-2", "/campus/course/a1-day-4-numbers-for-beginners-workbook", ""],
  ["A1-3", "/campus/course/a1-chapter-3-asking-about-prices-workbook", ""],
  ["A1-4", "/campus/course/a1-day-8-countries-and-languages-workbook", ""],
  ["A1-5", "/campus/course/a1-chapter-5-german-cases-workbook", ""],
  ["A1-6", "/campus/course/a1-day-10-objects-colors-possessive-articles-workbook", ""],
  ["A1-7", "/campus/course/a1-day-11-understanding-time-workbook", ""],
  ["A1-8", "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook", ""],
  ["A1-9", "/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook", ""],
  ["A1-10", "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook", ""],
  ["A1-11", "/campus/course/a1-day-17-instructions-and-directions-kapitel-11-workbook", ""],
  ["A1-12.1", "/campus/course/two-case-prepositions-wechselpraepositionen-day-18", "?view=workbook"],
  ["A1-12.2", "/campus/course/a1-12-2-dative-articles-mit-bei-zu", "?view=workbook"],
  ["A1-13", "/campus/course/a1-day-21-weather-workbook", ""],
  ["A1-14.1", "/campus/course/a1-day-22-health-and-body-parts-workbook", ""],
];

describe("A1 workbook inline submission mounting", () => {
  test("uses only Assignment and Submit tabs for A1", () => {
    expect(getWorkbookNavigationTabs("A1")).toEqual([
      { key: "assignment", label: "Assignment" },
      { key: "submit", label: "Submit" },
    ]);
  });

  test("uses the exact canonical tutor-marked A1 assignment keys", () => {
    expect(A1_TUTOR_MARKED_ASSIGNMENT_KEYS).toEqual(A1_ASSIGNMENT_WORKBOOK_CASES.map(([assignmentKey]) => assignmentKey));
  });

  test.each(A1_ASSIGNMENT_WORKBOOK_CASES)(
    "resolves %s to its workbook route",
    (assignmentKey, pathname, search) => {
      const match = resolveA1WorkbookSubmissionMatch({ pathname, search });
      expect(match).toEqual(
        expect.objectContaining({
          level: "A1",
          resource: expect.objectContaining({
            assignment: true,
            assignmentKey,
            canonicalAssignmentKey: assignmentKey,
          }),
        })
      );
    }
  );

  test("does not mount submission tabs on A1 self-practice workbooks", () => {
    expect(
      resolveA1WorkbookSubmissionMatch({
        pathname: "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook",
      })
    ).toBeNull();

    expect(
      resolveA1WorkbookSubmissionMatch({
        pathname: "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook",
      })
    ).toBeNull();

    expect(
      resolveA1WorkbookSubmissionMatch({
        pathname: "/campus/course/letter-writing-intro-german-a1-day-12-3",
      })
    ).toBeNull();
  });

  test("requires workbook mode for shared Day 18 grammar/workbook routes", () => {
    expect(
      resolveA1WorkbookSubmissionMatch({
        pathname: "/campus/course/two-case-prepositions-wechselpraepositionen-day-18",
      })
    ).toBeNull();
    expect(
      resolveA1WorkbookSubmissionMatch({
        pathname: "/campus/course/a1-12-2-dative-articles-mit-bei-zu",
      })
    ).toBeNull();
  });

  test("finds a workbook page beside the global enhancement anchor", () => {
    const main = document.createElement("main");
    main.className = "layout-main";
    const guide = document.createElement("div");
    guide.setAttribute("data-auto-workbook-start-guide", "true");
    const anchor = document.createElement("span");
    anchor.setAttribute("data-workbook-inline-enhancements-anchor", "true");
    const workbookPage = document.createElement("div");
    workbookPage.textContent = "Workbook content";
    main.append(guide, anchor, workbookPage);

    expect(findWorkbookPageRoot(anchor)).toBe(workbookPage);
  });

  test("detects existing Assignment and Submit navigation to avoid duplicate tabs", () => {
    const pageRoot = document.createElement("div");
    const tabList = document.createElement("div");
    tabList.setAttribute("role", "tablist");

    ["Assignment", "Submit"].forEach((label) => {
      const button = document.createElement("button");
      button.textContent = label;
      tabList.appendChild(button);
    });

    pageRoot.appendChild(tabList);
    expect(hasExistingA1SubmissionTabs(pageRoot)).toBe(true);

    tabList.lastChild.remove();
    expect(hasExistingA1SubmissionTabs(pageRoot)).toBe(false);
  });

  test("hides old course-level submit shortcuts but preserves the new Submit tab", () => {
    const pageRoot = document.createElement("div");
    const legacyLink = document.createElement("a");
    legacyLink.href = "/campus/course?submitWork=1";
    legacyLink.textContent = "Submit Assignment";
    const newSubmitTab = document.createElement("button");
    newSubmitTab.textContent = "Submit";
    pageRoot.append(legacyLink, newSubmitTab);

    hideLegacyA1SubmitControls(pageRoot);
    expect(legacyLink.style.display).toBe("none");
    expect(newSubmitTab.style.display).toBe("");

    restoreLegacyA1SubmitControls(pageRoot);
    expect(legacyLink.style.display).toBe("");
  });
});
