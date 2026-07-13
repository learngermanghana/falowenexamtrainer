import { applyB2CourseBookContentAlignment } from "./B2CourseBookContentAlignment";

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
  });
});
