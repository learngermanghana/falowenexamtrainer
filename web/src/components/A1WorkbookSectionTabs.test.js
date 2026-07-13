import {
  applyA1WorkbookSectionTabs,
  buildA1WorkbookContentGroups,
  findA1WorkbookTeilSections,
  getA1TeilNumber,
  isA1WorkbookLessonPath,
  __TESTING__,
} from "./A1WorkbookSectionTabs";

describe("A1WorkbookSectionTabs", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    __TESTING__.restoreManagedElements(document);
  });

  it("matches only A1 workbook lesson routes", () => {
    expect(isA1WorkbookLessonPath("/campus/course/lesson/A1/11")).toBe(true);
    expect(isA1WorkbookLessonPath("/campus/course/a1-day-11-understanding-time-workbook")).toBe(true);
    expect(isA1WorkbookLessonPath("/campus/course/lesson/B1/11")).toBe(false);
    expect(getA1TeilNumber("Teil 4 · Hören")).toBe(4);
  });

  it("groups continuation cards with the preceding Teil and leaves the next-lesson footer visible", () => {
    document.body.innerHTML = `
      <main class="layout-main">
        <header><h1>A1 Workbook</h1></header>
        <nav data-a1-teil-navigation="true"><button>Overview</button><button>Teil 1 · Lesen</button><button>Teil 2 · Hören</button></nav>
        <section id="teil1"><h2>Teil 1 · Lesen</h2></section>
        <section id="teil2"><h2>Teil 2 · Hören</h2></section>
        <section id="support"><h3>Vocabulary</h3></section>
        <section id="footer"><h3>Ready for the next lesson?</h3></section>
      </main>
    `;

    const main = document.querySelector("main");
    const sections = findA1WorkbookTeilSections(main);
    const groups = buildA1WorkbookContentGroups(main, sections);

    expect(groups).toHaveLength(2);
    expect(groups[0].elements.map((element) => element.id)).toEqual(["teil1"]);
    expect(groups[1].elements.map((element) => element.id)).toEqual(["teil2", "support"]);
  });

  it("shows a compact overview first and only the selected Teil after clicking", () => {
    document.body.innerHTML = `
      <main class="layout-main">
        <div class="header"><button>Back to Course Book</button><h1>A1 · Day 11 Workbook · Understanding Time</h1><button>Assignment</button><button id="native-submit">Submit</button></div>
        <nav data-a1-teil-navigation="true">
          <button>Overview</button>
          <button>Teil 1 · 12-Hour Clock</button>
          <button>Teil 2 · Hören</button>
          <button>Submit</button>
        </nav>
        <section id="teil1"><h2>Teil 1 · 12-Hour Clock</h2><p>Reading questions</p></section>
        <section id="teil2"><h2>Teil 2 · Hören</h2><p>Listening questions</p></section>
        <section id="support"><h3>Vocabulary</h3><p>Support notes</p></section>
        <section id="footer"><h3>Ready for the next lesson?</h3></section>
      </main>
    `;

    expect(
      applyA1WorkbookSectionTabs(document, {
        pathname: "/campus/course/lesson/A1/11",
        search: "?view=workbook",
      })
    ).toBe(true);

    const overview = document.querySelector('[data-a1-workbook-overview="true"]');
    expect(overview).not.toBeNull();
    expect(overview.style.display).toBe("grid");
    expect(document.querySelector("#teil1").style.display).toBe("none");
    expect(document.querySelector("#teil2").style.display).toBe("none");
    expect(document.querySelector("#support").style.display).toBe("none");
    expect(document.querySelector("#footer").style.display).toBe("");

    const navButtons = Array.from(document.querySelectorAll('[data-a1-teil-navigation="true"] button'));
    navButtons.find((button) => button.textContent.startsWith("Teil 1")).click();
    expect(document.querySelector("#teil1").style.display).toBe("");
    expect(document.querySelector("#teil2").style.display).toBe("none");
    expect(document.querySelector("#support").style.display).toBe("none");
    expect(overview.style.display).toBe("none");

    navButtons.find((button) => button.textContent.startsWith("Teil 2")).click();
    expect(document.querySelector("#teil1").style.display).toBe("none");
    expect(document.querySelector("#teil2").style.display).toBe("");
    expect(document.querySelector("#support").style.display).toBe("");

    navButtons.find((button) => button.textContent === "Overview").click();
    expect(overview.style.display).toBe("grid");
    expect(document.querySelector("#teil1").style.display).toBe("none");
    expect(document.querySelector("#teil2").style.display).toBe("none");
  });

  it("opens the native Submit tab and restores hidden content during cleanup", () => {
    const submitSpy = jest.fn();
    document.body.innerHTML = `
      <main class="layout-main">
        <div><h1>A1 Workbook</h1><button id="native-submit">Submit</button></div>
        <nav data-a1-teil-navigation="true"><button>Overview</button><button>Teil 1 · Lesen</button><button>Submit</button></nav>
        <section id="teil1"><h2>Teil 1 · Lesen</h2></section>
      </main>
    `;
    document.querySelector("#native-submit").addEventListener("click", submitSpy);

    applyA1WorkbookSectionTabs(document, {
      pathname: "/campus/course/lesson/A1/11",
      search: "?view=workbook",
    });
    Array.from(document.querySelectorAll('[data-a1-teil-navigation="true"] button'))
      .find((button) => button.textContent === "Submit")
      .click();

    expect(submitSpy).toHaveBeenCalledTimes(1);
    __TESTING__.restoreManagedElements(document);
    expect(document.querySelector("#teil1").style.display).toBe("");
    expect(document.querySelector('[data-a1-workbook-overview="true"]')).toBeNull();
  });
});
