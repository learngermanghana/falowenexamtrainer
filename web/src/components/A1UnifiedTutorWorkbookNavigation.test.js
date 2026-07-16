import {
  applyA1UnifiedWorkbookView,
  findA1NativeAssignmentTabList,
  hideA1NativeAssignmentTabs,
  resolveA1SharedSectionState,
  resolveA1UnifiedTutorWorkbookMatch,
  restoreA1NativeAssignmentTabs,
  restoreA1UnifiedWorkbookGroups,
  shouldPreserveA1NativeAssignmentTabs,
} from "./A1UnifiedTutorWorkbookNavigation";
import { buildA1WorkbookContentGroups, findA1WorkbookTeilSections } from "./A1WorkbookSectionTabs";

jest.mock("./ClassWorkbookShareBox", () => () => null);
jest.mock("./CourseWorkbookSubmissionTabs", () => () => null);

describe("A1 unified tutor-marked workbook navigation", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("resolves every configured tutor-marked workbook from curriculum metadata", () => {
    expect(
      resolveA1UnifiedTutorWorkbookMatch({
        pathname: "/campus/course/a1-day-2-german-alphabet-reviewing-workbook",
      }),
    ).toEqual(
      expect.objectContaining({
        level: "A1",
        day: 2,
        resource: expect.objectContaining({ assignmentKey: "A1-0.2", chapter: "0.2" }),
      }),
    );

    expect(
      resolveA1UnifiedTutorWorkbookMatch({
        pathname: "/campus/course/a1-chapter-5-german-cases-workbook",
      }),
    ).toEqual(
      expect.objectContaining({
        level: "A1",
        day: 9,
        resource: expect.objectContaining({ assignmentKey: "A1-5", chapter: "5" }),
      }),
    );

    expect(
      resolveA1UnifiedTutorWorkbookMatch({
        pathname: "/campus/course/two-case-prepositions-wechselpraepositionen-day-18",
        search: "?view=workbook",
      }),
    ).toEqual(
      expect.objectContaining({
        level: "A1",
        day: 18,
        resource: expect.objectContaining({ assignmentKey: "A1-12.1", chapter: "12.1" }),
      }),
    );
  });

  it("supports dynamic A1 workbook links while excluding grammar and learn views", () => {
    expect(
      resolveA1UnifiedTutorWorkbookMatch({
        pathname: "/campus/course/lesson/A1/11",
        search: "?chapter=7",
      }),
    ).toEqual(
      expect.objectContaining({
        level: "A1",
        day: 11,
        resource: expect.objectContaining({ assignmentKey: "A1-7" }),
      }),
    );

    expect(
      resolveA1UnifiedTutorWorkbookMatch({
        pathname: "/campus/course/lesson/A1/11",
        search: "?chapter=7&view=grammar",
      }),
    ).toBeNull();
  });

  it("builds Overview and separated Teil navigation for Day 0.2", () => {
    document.body.innerHTML = `
      <main class="layout-main">
        <div id="alphabet-workbook">
          <div role="tablist">
            <button aria-selected="true">Assignment</button>
            <button aria-selected="false">Submit</button>
          </div>
          <section id="alphabet-teil1"><h2>Teil 1 · Reading and Writing</h2></section>
          <section id="alphabet-teil2"><h2>Teil 2 · Questions</h2></section>
          <section id="alphabet-teil3"><h2>Teil 3 · Hören</h2></section>
        </div>
      </main>
    `;

    const pageRoot = document.querySelector("#alphabet-workbook");
    const state = resolveA1SharedSectionState({ pageRoot, assignmentKey: "A1-0.2" });

    expect(state.pageManaged).toBe(false);
    expect(state.tabs).toEqual([
      expect.objectContaining({ key: "teil-1", number: 1 }),
      expect.objectContaining({ key: "teil-2", number: 2 }),
      expect.objectContaining({ key: "teil-3", number: 3 }),
    ]);
  });

  it("keeps the existing Day 21 page compatible with the same shared nav", () => {
    const state = resolveA1SharedSectionState({
      pageRoot: document.createElement("div"),
      assignmentKey: "A1-13",
    });

    expect(state.pageManaged).toBe(true);
    expect(state.tabs.map((tab) => tab.key)).toEqual(["teil-1", "teil-2", "teil-3"]);
  });

  it("shows only the selected Teil and uses Overview to hide all task groups", () => {
    document.body.innerHTML = `
      <main class="layout-main">
        <div id="workbook">
          <header><h1>A1 workbook</h1></header>
          <section id="teil1"><h2>Teil 1 · Lesen</h2><p>First task</p></section>
          <section id="teil2"><h2>Teil 2 · Schreiben</h2><p>Second task</p></section>
          <section id="teil3"><h2>Teil 3 · Hören</h2><p>Third task</p></section>
        </div>
      </main>
    `;

    const pageRoot = document.querySelector("#workbook");
    const groups = buildA1WorkbookContentGroups(pageRoot, findA1WorkbookTeilSections(pageRoot));

    applyA1UnifiedWorkbookView({ groups, activeView: "overview" });
    expect(document.querySelector("#teil1").style.display).toBe("none");
    expect(document.querySelector("#teil2").style.display).toBe("none");
    expect(document.querySelector("#teil3").style.display).toBe("none");

    applyA1UnifiedWorkbookView({ groups, activeView: "teil-2" });
    expect(document.querySelector("#teil1").style.display).toBe("none");
    expect(document.querySelector("#teil2").style.display).toBe("");
    expect(document.querySelector("#teil3").style.display).toBe("none");

    applyA1UnifiedWorkbookView({ groups, activeView: "assignment" });
    expect(document.querySelector("#teil1").style.display).toBe("");
    expect(document.querySelector("#teil2").style.display).toBe("");
    expect(document.querySelector("#teil3").style.display).toBe("");

    restoreA1UnifiedWorkbookGroups(pageRoot);
    expect(document.querySelector("#teil1").style.display).toBe("");
  });

  it("detects, hides and restores native Assignment and Submit tabs so the shared nav can replace them", () => {
    const pageRoot = document.createElement("div");
    const tabList = document.createElement("div");
    tabList.setAttribute("role", "tablist");
    const assignment = document.createElement("button");
    assignment.textContent = "Assignment";
    assignment.setAttribute("aria-selected", "true");
    const submit = document.createElement("button");
    submit.textContent = "Submit";
    tabList.append(assignment, submit);
    pageRoot.appendChild(tabList);

    expect(findA1NativeAssignmentTabList(pageRoot)).toBe(tabList);
    expect(shouldPreserveA1NativeAssignmentTabs(pageRoot)).toBe(true);
    expect(hideA1NativeAssignmentTabs(pageRoot)).toBe(tabList);
    expect(tabList.style.display).toBe("none");

    restoreA1NativeAssignmentTabs(pageRoot);
    expect(tabList.style.display).toBe("");
  });
});
