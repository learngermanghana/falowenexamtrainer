import { buildA1WorkbookContentGroups, findA1WorkbookTeilSections } from "./A1WorkbookSectionTabs";
import {
  applySharedWorkbookView,
  findTutorWorkbookRoot,
  getSharedTutorNavigationTabs,
  restoreSharedWorkbookGroups,
} from "./A1SharedTutorWorkbookNavigation";

jest.mock("./ClassWorkbookShareBox", () => () => null);
jest.mock("./CourseWorkbookSubmissionTabs", () => () => null);

describe("shared A1 tutor workbook navigation", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <main class="layout-main">
        <section data-workbook-supporting-materials-host><h2>Supporting materials</h2></section>
        <div data-a1-unified-tutor-workbook-nav="true"><section><button>Overview</button><button>Submit</button></section></div>
        <div data-a1-unified-submission-host="true">
          <div role="tablist"><button>Assignment</button><button>Submit</button></div>
        </div>
        <div id="day-one-workbook">
          <header>
            <div role="tablist"><button>Assignment</button><button>Submit</button></div>
            <h1>A1 Day 1</h1>
          </header>
          <section id="teil-one" style="display: grid;"><h2>Teil 1 · Reading Text</h2><p>First task</p></section>
          <section id="teil-two" style="display: flex;"><h2>Teil 2 · Multiple-Choice Questions</h2><p>Second task</p></section>
          <section id="next-lesson"><h2>Ready for the next lesson?</h2></section>
        </div>
      </main>
    `;
  });

  it("selects the real workbook instead of the submission or supporting-material hosts", () => {
    const main = document.querySelector("main");
    expect(findTutorWorkbookRoot(main)?.id).toBe("day-one-workbook");
  });

  it("uses the same Overview, Teil, Assignment and Submit navigation for tutor workbooks", () => {
    const workbook = document.querySelector("#day-one-workbook");
    const groups = buildA1WorkbookContentGroups(workbook, findA1WorkbookTeilSections(workbook));

    expect(getSharedTutorNavigationTabs(groups).map((tab) => tab.label)).toEqual([
      "Overview",
      "Teil 1",
      "Teil 2",
      "Assignment",
      "Submit",
    ]);

    applySharedWorkbookView({ groups, activeView: "overview" });
    expect(document.querySelector("#teil-one").style.display).toBe("none");
    expect(document.querySelector("#teil-two").style.display).toBe("none");

    applySharedWorkbookView({ groups, activeView: "teil-1" });
    expect(document.querySelector("#teil-one").style.display).toBe("grid");
    expect(document.querySelector("#teil-two").style.display).toBe("none");

    applySharedWorkbookView({ groups, activeView: "assignment" });
    expect(document.querySelector("#teil-one").style.display).toBe("grid");
    expect(document.querySelector("#teil-two").style.display).toBe("flex");

    restoreSharedWorkbookGroups(workbook);
    expect(document.querySelector("#teil-one").style.display).toBe("grid");
    expect(document.querySelector("#teil-two").style.display).toBe("flex");
  });
});
