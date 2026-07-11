import { getWorkbookNavigationTabs } from "../utils/courseWorkbookSubmission";
import {
  hasExistingA1SubmissionTabs,
  hideLegacyA1SubmitControls,
  resolveA1WorkbookSubmissionMatch,
  restoreLegacyA1SubmitControls,
} from "./WorkbookInlineEnhancements";

jest.mock("./ClassWorkbookShareBox", () => () => null);
jest.mock("./CourseWorkbookSubmissionTabs", () => () => null);

describe("A1 workbook inline submission mounting", () => {
  test("uses only Assignment and Submit tabs for A1", () => {
    expect(getWorkbookNavigationTabs("A1")).toEqual([
      { key: "assignment", label: "Assignment" },
      { key: "submit", label: "Submit" },
    ]);
  });

  test("resolves a normal tutor-marked A1 workbook to its canonical assignment", () => {
    const match = resolveA1WorkbookSubmissionMatch({
      pathname: "/campus/course/a1-day-1-greetings-workbook",
    });

    expect(match).toEqual(
      expect.objectContaining({
        level: "A1",
        day: 1,
        resource: expect.objectContaining({
          assignment: true,
          assignmentKey: "A1-0.1",
          chapter: "0.1",
        }),
      })
    );
  });

  test("selects the correct child assignment on a multi-assignment day", () => {
    const match = resolveA1WorkbookSubmissionMatch({
      pathname: "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook",
    });

    expect(match?.resource).toEqual(
      expect.objectContaining({
        assignmentKey: "A1-10",
        chapter: "10",
      })
    );
  });

  test("covers the Day 21 workbook that previously had only a legacy submit link", () => {
    expect(
      resolveA1WorkbookSubmissionMatch({
        pathname: "/campus/course/a1-day-21-weather-workbook",
      })
    ).toEqual(
      expect.objectContaining({
        level: "A1",
        day: 21,
        resource: expect.objectContaining({ assignmentKey: "A1-13" }),
      })
    );
  });

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
  });

  test("requires workbook mode for shared Day 18 grammar/workbook routes", () => {
    const pathname = "/campus/course/a1-12-2-dative-articles-mit-bei-zu";

    expect(resolveA1WorkbookSubmissionMatch({ pathname })).toBeNull();
    expect(resolveA1WorkbookSubmissionMatch({ pathname, search: "?view=workbook" })?.resource).toEqual(
      expect.objectContaining({
        assignmentKey: "A1-12.2",
        chapter: "12.2",
      })
    );
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
