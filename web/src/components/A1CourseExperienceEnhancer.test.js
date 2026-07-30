import {
  applyA1CourseBookFormatting,
  applyA1LessonFormatting,
  findA1TeilHeadings,
  getA1TeilNumber,
  parseA1LessonRoute,
  resolveA1LessonActionLabel,
  __TESTING__,
} from "./A1CourseExperienceEnhancer";

describe("A1CourseExperienceEnhancer", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("recognizes built and named A1 lesson routes", () => {
    expect(
      parseA1LessonRoute({
        pathname: "/campus/course/lesson/A1/6",
        search: "?chapter=2",
      })
    ).toEqual(expect.objectContaining({ day: 6, chapter: "2" }));

    expect(
      parseA1LessonRoute({
        pathname: "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook",
        pageText: "A1 · Day 16 · Kapitel 10",
      })
    ).toEqual(expect.objectContaining({ day: 16, chapter: "10", isWorkbookPath: true }));
  });

  it("collects unique Teil headings in numerical order", () => {
    document.body.innerHTML = `
      <h2>Teil 2 · Schreiben</h2>
      <h2>Teil 1 · Sprechen</h2>
      <h3>Teil 2 · Duplicate</h3>
    `;

    expect(getA1TeilNumber("Teil 4 · Hören")).toBe(4);
    expect(findA1TeilHeadings(document).map((item) => item.number)).toEqual([1, 2]);
  });

  it("uses start, continue and review labels from lesson status", () => {
    expect(resolveA1LessonActionLabel({ statusText: "Not started" })).toBe("Start lesson");
    expect(resolveA1LessonActionLabel({ statusText: "In progress" })).toBe("Continue lesson");
    expect(resolveA1LessonActionLabel({ statusText: "Passed" })).toBe("Review lesson");
  });

  it("adds the consistent lesson header and dynamic Teil navigation without changing content", () => {
    document.body.innerHTML = `
      <main class="layout-main">
        <div class="lesson-card">
          <button>Back to Course Book</button>
          <h1>A1 · Day 1 Workbook · Greetings</h1>
          <p>Chapter 0.1 · Tutor-marked assignment</p>
          <button role="tab">Assignment</button>
          <button role="tab">Submit</button>
        </div>
        <section><h2>Teil 1 · Reading Text</h2><p>Original reading content</p></section>
        <section><h2>Teil 2 · Multiple-Choice Questions</h2><p>Original questions</p></section>
      </main>
    `;

    expect(
      applyA1LessonFormatting(document, {
        pathname: "/campus/course/lesson/A1/1",
        search: "?chapter=0.1",
      })
    ).toBe(true);

    expect(document.querySelector('[data-a1-lesson-header="true"]')).not.toBeNull();
    expect(document.querySelector('[data-a1-lesson-meta="true"]').textContent).toContain("A1 · Day 1 · Kapitel 0.1");
    expect(Array.from(document.querySelectorAll('[data-a1-teil-navigation="true"] button')).map((button) => button.textContent)).toEqual([
      "Overview",
      "Teil 1 · Reading Text",
      "Teil 2 · Multiple-Choice Questions",
      "Submit",
    ]);
    expect(document.body.textContent).toContain("Original reading content");
    expect(document.body.textContent).toContain("Original questions");
  });

  it("applies one shared action design to every A1 lesson card regardless of the current button label", () => {
    document.body.innerHTML = `
      <select>
        <option value="A1" selected>A1</option>
        <option value="A2">A2</option>
      </select>
      <article>
        <h3>Greetings</h3>
        <span>Chapter 0.1</span>
        <span>Tutor Marked Assignment</span>
        <span>Passed</span>
        <div><a href="/campus/course/lesson/A1/1?chapter=0.1">Open Lesson</a></div>
      </article>
      <article>
        <h3>Personal Pronouns</h3>
        <span>Chapter 1.1</span>
        <span>Self-learning</span>
        <span>In progress</span>
        <div><a href="/campus/course/lesson/A1/2?chapter=1.1">Start lesson</a></div>
      </article>
    `;

    applyA1CourseBookFormatting(document, "/campus/course");

    const cards = Array.from(document.querySelectorAll("article"));
    const actions = Array.from(document.querySelectorAll("article a"));

    cards.forEach((card) => {
      expect(card.getAttribute("data-a1-course-card")).toBe("true");
      expect(card.textContent).toContain("Kapitel");
    });
    actions.forEach((action) => {
      expect(action.getAttribute("data-a1-course-action")).toBe("true");
      expect(action.parentElement.getAttribute("data-a1-course-actions")).toBe("true");
    });

    expect(actions[0].textContent).toBe("Review lesson");
    expect(actions[1].textContent).toBe("Continue lesson");
    expect(cards[0].textContent).toContain("Assignment");
    expect(cards[1].textContent).toContain("Practice");
  });

  it("removes A1-only action attributes and restores the generic label after changing level", () => {
    document.body.innerHTML = `
      <select>
        <option value="A1" selected>A1</option>
        <option value="A2">A2</option>
      </select>
      <article>
        <h3>Greetings</h3>
        <span>Not started</span>
        <div><a href="/campus/course/lesson/A1/1">Open Lesson</a></div>
      </article>
    `;

    const select = document.querySelector("select");
    const action = document.querySelector("a");

    applyA1CourseBookFormatting(document, "/campus/course");
    expect(action.textContent).toBe("Start lesson");
    expect(action.getAttribute("data-a1-course-action")).toBe("true");

    select.value = "A2";
    applyA1CourseBookFormatting(document, "/campus/course");

    expect(action.textContent).toBe("Open Lesson");
    expect(action.hasAttribute("data-a1-course-action")).toBe(false);
    expect(action.parentElement.hasAttribute("data-a1-course-actions")).toBe(false);
  });

  it("installs phone-safety styles that stay scoped to the A1 course book", () => {
    __TESTING__.ensureStyles(document);

    const css = document.getElementById("falowen-a1-course-experience-styles").textContent;
    expect(css).toContain('[data-a1-coursebook="true"]');
    expect(css).toContain("overflow-x: clip");
    expect(css).toContain("env(safe-area-inset-bottom)");
    expect(css).toContain('[data-a1-coursebook="true"] [data-a1-coursebook-tabs="true"]');
    expect(css).toContain("flex-direction: column !important");
    expect(css).toContain("min-height: 44px");
  });
});
