import {
  alignCourseBookLessonActions,
  applyB2CourseBookContentAlignment,
} from "./B2CourseBookContentAlignment";

describe("B2CourseBookContentAlignment", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("corrects the Day 8 Course Book title, grammar and goal", () => {
    document.body.innerHTML = `
      <select><option value="A1">A1</option><option value="B2" selected>B2</option></select>
      <article>
        <div>
          <div>
            <h3>Politik und Engagement</h3>
            <div>
              <span>Chapter 2.3</span>
              <span>Finale und kausale Nebensätze (damit, um...zu, weil, da)</span>
              <span>Self-learning</span>
            </div>
          </div>
          <a href="/campus/course/lesson/B2/8?chapter=2.3">Open Lesson</a>
        </div>
        <p>Lernen Sie politische Systeme und bürgerschaftliches Engagement kennen.</p>
        <p><strong>Instruction:</strong> Open the lesson.</p>
      </article>
    `;

    expect(applyB2CourseBookContentAlignment(document, "/campus/course")).toBe(1);
    const article = document.querySelector("article");
    expect(article.querySelector("h3").textContent).toBe("Reisen und Mobilität");
    expect(article.textContent).toContain("Vergleiche und Abwägung");
    expect(article.textContent).toContain("Verkehrsmittel vergleichen");
    expect(article.textContent).not.toContain("Politik und Engagement");
    expect(article.getAttribute("data-b2-content-aligned")).toBe("8");
  });

  it("aligns the compact next-lesson card", () => {
    document.body.innerHTML = `
      <select><option value="B2" selected>B2</option></select>
      <section>
        <h3>Day 10: Umwelt und Nachhaltigkeit</h3>
        <a href="/campus/course/lesson/B2/10?chapter=2.5">Open: Umwelt und Nachhaltigkeit</a>
      </section>
    `;

    expect(applyB2CourseBookContentAlignment(document, "/campus/course")).toBe(1);
    expect(document.querySelector("h3").textContent).toBe("Day 10: Konsum und Geld");
    expect(document.querySelector("a").textContent).toBe("Open: Konsum und Geld");
    expect(document.querySelector("a").getAttribute("aria-label")).toBe("Open Konsum und Geld");
  });

  it("restores the native A2 in-flow lesson action layout", () => {
    document.body.innerHTML = `
      <article
        data-course-book-lesson-card-aligned="true"
        style="padding: 14px; position: relative; padding-bottom: 74px"
      >
        <div class="lesson-top">
          <div><h3>A1 lesson</h3></div>
          <div class="lesson-actions">
            <span>Passed</span>
            <span>Best score: 86/100</span>
            <a
              data-course-book-lesson-action-aligned="true"
              href="/campus/course/lesson/A1/1"
              style="position: absolute; right: 14px; bottom: 14px; min-width: 136px; justify-content: center"
            >Start lesson</a>
          </div>
        </div>
        <p>Long lesson description.</p>
      </article>
    `;

    expect(alignCourseBookLessonActions(document, "/campus/course")).toBe(1);
    const article = document.querySelector("article");
    const action = article.querySelector("a");

    expect(article.style.position).toBe("");
    expect(article.style.paddingBottom).toBe("");
    expect(article.getAttribute("data-course-book-lesson-card-aligned")).toBeNull();
    expect(action.style.position).toBe("");
    expect(action.style.right).toBe("");
    expect(action.style.bottom).toBe("");
    expect(action.style.minWidth).toBe("");
    expect(action.style.justifyContent).toBe("center");
    expect(action.getAttribute("data-course-book-lesson-action-aligned")).toBeNull();
    expect(action.closest(".lesson-actions")).not.toBeNull();
    expect(article.lastElementChild.textContent).toContain("Long lesson description");
  });

  it("does not touch a fresh native A2-style lesson card", () => {
    document.body.innerHTML = `
      <article style="padding: 14px">
        <div class="lesson-top">
          <div><h3>A2 lesson</h3></div>
          <div class="lesson-actions">
            <span>Passed</span>
            <a href="/campus/course/lesson/A2/8" style="justify-content: center">Start lesson</a>
          </div>
        </div>
      </article>
    `;

    expect(alignCourseBookLessonActions(document, "/campus/course")).toBe(0);
    const action = document.querySelector("a");
    expect(action.style.position).toBe("");
    expect(action.style.justifyContent).toBe("center");
  });

  it("does not touch the Course Book when another level is selected", () => {
    document.body.innerHTML = `
      <select><option value="A2" selected>A2</option><option value="B2">B2</option></select>
      <article>
        <h3>Politik und Engagement</h3>
        <a href="/campus/course/lesson/B2/8?chapter=2.3">Open Lesson</a>
      </article>
    `;

    expect(applyB2CourseBookContentAlignment(document, "/campus/course")).toBe(0);
    expect(document.querySelector("h3").textContent).toBe("Politik und Engagement");
  });

  it("does not run outside the Course Book route", () => {
    document.body.innerHTML = `
      <select><option value="B2" selected>B2</option></select>
      <article><h3>Politik und Engagement</h3><a href="/campus/course/lesson/B2/8">Open Lesson</a></article>
    `;
    expect(applyB2CourseBookContentAlignment(document, "/campus/course/lesson/B2/8")).toBe(0);
    expect(alignCourseBookLessonActions(document, "/campus/course/lesson/B2/8")).toBe(0);
  });
});
