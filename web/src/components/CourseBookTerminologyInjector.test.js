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
});
