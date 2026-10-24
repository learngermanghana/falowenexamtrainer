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

describe("grouped A1–B1 submission confirmations", () => {
  test.each(["A1", "A2", "B1"])("%s keeps assignment and required answers in the same panel", (level) => {
    document.body.innerHTML = `
      <select aria-label="Level"><option value="${level}" selected>${level}</option></select>
      <select aria-label="Assignment"><option selected>${level} workbook</option></select>
      <form>
        <label>Your text<textarea>My final answers</textarea></label>
        <span>Autosaved</span>
        <div role="group" aria-label="Confirm your submission" data-submission-consent-group="true">
          <label><input id="assignment-confirmation" type="checkbox">I checked that this is the correct assignment.</label>
          <div data-submission-consent-slot="true"></div>
        </div>
        <button type="submit">Submit Assignment</button>
      </form>`;
    const assignmentCheck = document.getElementById("assignment-confirmation");
    const assignmentLabel = assignmentCheck.parentElement;
    const onChange = jest.fn();
    assignmentCheck.addEventListener("change", onChange);
    const options = { pathname: "/campus/submit", search: `?level=${level}`, root: document };
    syncSubmitCompletionGuide(options);
    const group = document.querySelector('[data-submission-consent-group="true"]');
    const card = document.getElementById("falowen-submit-level-guidance");
    expect(group).toContainElement(card);
    expect(group).toContainElement(assignmentCheck);
    expect(assignmentCheck.parentElement).toBe(assignmentLabel);
    expect(card).not.toHaveTextContent("Completion consent");
    const checks = [...card.querySelectorAll('input[name="falowen-submit-completion-check"]')];
    expect(checks.length).toBeGreaterThan(0);
    expect(document.querySelector('button[type="submit"]')).toBeDisabled();
    assignmentCheck.click();
    expect(onChange).toHaveBeenCalledTimes(1);
    checks.forEach(check => { check.checked = true; });
    syncSubmitCompletionGuide(options);
    expect(document.querySelector('button[type="submit"]')).not.toBeDisabled();
    expect(assignmentCheck).toBeChecked();
    expect(document.querySelectorAll('#falowen-submit-level-guidance')).toHaveLength(1);
    expect([...card.querySelectorAll('input[name="falowen-submit-completion-check"]')].every(check => check.checked)).toBe(true);
  });
});
