import { applyCourseBookOrientationVideo } from "./A2CourseBookOrientationVideoInjector";

describe("Course Book Day 0 orientation video", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/campus/course");
    document.body.innerHTML = `
      <section>
        <h2>Course Book</h2>
        <select aria-label="Level">
          <option value="A1" selected>A1</option>
        </select>
      </section>
      <section>
        <h3>Week 1</h3>
        <article>
          <div><span>Day 0</span><strong>Orientation and Knowledge Test</strong></div>
          <button type="button">Go to lesson</button>
        </article>
        <article>
          <div><span>Day 1</span><strong>Greetings</strong></div>
          <button type="button">Go to lesson</button>
        </article>
      </section>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("places the video panel inside the Week 1 Day 0 article", () => {
    expect(applyCourseBookOrientationVideo(document)).toBe(1);

    const dayZeroCard = document.querySelector("article");
    const panel = dayZeroCard.querySelector('[data-course-book-orientation-panel="true"]');

    expect(dayZeroCard).toHaveAttribute("data-course-book-orientation-video", "true");
    expect(panel).not.toBeNull();
    expect(panel.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/qPwxBYlu3CE"
    );
    expect(document.querySelector("section > [data-course-book-orientation-video='true']")).toBeNull();
  });

  it("does not create duplicate panels when reapplied", () => {
    applyCourseBookOrientationVideo(document);
    applyCourseBookOrientationVideo(document);

    expect(document.querySelectorAll('[data-course-book-orientation-panel="true"]')).toHaveLength(1);
  });
});
