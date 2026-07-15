import {
  applyA1UnifiedWorkbookView,
  findA1NativeAssignmentTabList,
  hideA1NativeAssignmentTabs,
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

  it("resolves named tutor-marked routes that the old A1 route regex missed", () => {
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

  it("resolves the exact A1 Day 12 workbook URL and keeps all four Teil sections", () => {
    expect(
      resolveA1UnifiedTutorWorkbookMatch({
        pathname: "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook",
        search: "?assignmentKey=A1-8&assignmentId=A1-8&level=A1",
      }),
    ).toEqual(
      expect.objectContaining({
        level: "A1",
        day: 12,
        resource: expect.objectContaining({ assignmentKey: "A1-8", chapter: "8" }),
      }),
    );

    document.body.innerHTML = `
      <main class="layout-main">
        <div id="day12-workbook">
          <section><h2>Start here</h2></section>
          <section id="day12-teil1"><h2>Teil 1: Lesen · Multiple Choice</h2></section>
          <section id="day12-teil2"><h2>Teil 2: Lesen · Richtig oder Falsch</h2></section>
          <section id="day12-teil3"><h2>Teil 3: Hörverstehen</h2></section>
          <section id="day12-teil4"><h2>Teil 4: Vocabulary reminder</h2></section>
        </div>
      </main>
    `;

    const pageRoot = document.querySelector("#day12-workbook");
    const groups = buildA1WorkbookContentGroups(pageRoot, findA1WorkbookTeilSections(pageRoot));
    expect(groups.map((group) => group.number)).toEqual([1, 2, 3, 4]);
  });

  it("supports the existing dynamic A1 lesson links without replacing them", () => {
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
  });

  it("shows the complete assignment when Assignment is selected", () => {
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
    expect(groups.map((group) => group.number)).toEqual([1, 2, 3]);

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
    expect(document.querySelector("#teil2").style.display).toBe("");
    expect(document.querySelector("#teil3").style.display).toBe("");
  });

  it("recognizes and preserves a workbook's native Assignment and Submit tabs", () => {
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
    expect(tabList.style.display).toBe("");
  });

  it("can still restore a native tab row hidden by an older page version", () => {
    const pageRoot = document.createElement("div");
    const tabList = document.createElement("div");
    tabList.setAttribute("role", "tablist");
    const assignment = document.createElement("button");
    assignment.textContent = "Assignment";
    assignment.setAttribute("aria-selected", "false");
    assignment.click = jest.fn(() => assignment.setAttribute("aria-selected", "true"));
    const submit = document.createElement("button");
    submit.textContent = "Submit";
    tabList.append(assignment, submit);
    pageRoot.appendChild(tabList);

    expect(hideA1NativeAssignmentTabs(pageRoot)).toBe(tabList);
    expect(assignment.click).toHaveBeenCalledTimes(1);
    expect(tabList.style.display).toBe("none");

    restoreA1NativeAssignmentTabs(pageRoot);
    expect(tabList.style.display).toBe("");
  });
});
