import { replaceCourseBookTerminology } from "./CourseBookTerminologyInjector";

describe("replaceCourseBookTerminology", () => {
  test("renames the tutor-marked badge without changing other labels", () => {
    document.body.innerHTML = `
      <div>
        <span>Tutor-marked</span>
        <span>Self-learning</span>
      </div>
    `;

    expect(replaceCourseBookTerminology(document)).toBe(1);
    expect(document.body.textContent).toContain("Tutor Marked Assignment");
    expect(document.body.textContent).toContain("Self-learning");
    expect(document.body.textContent).not.toContain("Tutor-marked");
  });

  test("keeps only clear instructions in the Course Book submit message", () => {
    window.history.pushState({}, "", "/campus/course");
    document.body.innerHTML = `
      <section>
        <h3>Submit your workbook answers</h3>
        <button type="button">Close</button>
        <div>
          <p>Submissions now live inside each workbook in the Course Book. Open the assignment workbook for your lesson.</p>
          <div>
            <button type="button">Open next lesson</button>
            <button type="button">Show assignment lessons</button>
          </div>
        </div>
      </section>
    `;

    replaceCourseBookTerminology(document);

    expect(document.body.textContent).toContain("find the exact assignment number in the Course Book");
    expect(document.body.textContent).toContain("use the Submit tab inside it");

    const buttons = Array.from(document.querySelectorAll("button"));
    const closeButton = buttons.find((button) => button.textContent === "Close");
    const openNextButton = buttons.find((button) => button.textContent === "Open next lesson");
    const showAssignmentsButton = buttons.find((button) => button.textContent === "Show assignment lessons");

    expect(closeButton.style.display).not.toBe("none");
    expect(openNextButton.style.display).toBe("none");
    expect(showAssignmentsButton.style.display).toBe("none");
  });
});
