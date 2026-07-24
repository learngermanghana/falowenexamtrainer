import { syncSubmitCompletionGuide } from "./SubmitPageLevelGuidanceInjector";

describe("A2 submission completion checklist", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <select aria-label="Level">
        <option value="A2" selected>A2</option>
      </select>
      <select aria-label="Assignment">
        <option selected>A2 • Day 16: Wohlbefinden und Entspannung 6.16 • Chapter 6.16</option>
      </select>
      <div id="submission-shell">
        <form>
          <label>Your text<textarea>Final answer with enough words for the assignment submission.</textarea></label>
          <button type="submit">Submit Assignment</button>
        </form>
      </div>
    `;
  });

  test("renders one authoritative checklist and unlocks the real submit button", () => {
    expect(
      syncSubmitCompletionGuide({
        pathname: "/campus/course/a2-day-16-wohlbefinden-und-entspannung-workbook",
        search: "?radio=done&workbookTab=submit&level=A2&assignmentKey=A2-6.16&assignmentId=A2-6.16",
        root: document,
      }),
    ).toBe(true);

    const card = document.getElementById("falowen-submit-level-guidance");
    const button = document.querySelector('button[type="submit"]');
    const checks = Array.from(card.querySelectorAll('input[name="falowen-submit-completion-check"]'));

    expect(card).toHaveTextContent("Required final answers");
    expect(card.previousElementSibling).toBe(document.querySelector("textarea").closest("label"));
    expect(card).not.toHaveTextContent("Confirm every required Teil");
    expect(checks).toHaveLength(3);
    expect(document.querySelectorAll('[data-checklist-below-editor="true"]')).toHaveLength(0);
    expect(button).toBeDisabled();

    checks.forEach((check) => {
      check.checked = true;
    });

    syncSubmitCompletionGuide({
      pathname: "/campus/course/a2-day-16-wohlbefinden-und-entspannung-workbook",
      search: "?radio=done&workbookTab=submit&level=A2&assignmentKey=A2-6.16&assignmentId=A2-6.16",
      root: document,
    });

    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent("Submit final answers");
  });
});
