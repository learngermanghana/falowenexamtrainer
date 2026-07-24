import {
  getAssignmentKey,
  getRequiredChecklist,
  syncSubmitCompletionGuide,
} from "./SubmitPageLevelGuidanceInjector";

describe("SubmitPageLevelGuidanceInjector completion checklist", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("detects the canonical assignment from a workbook submit link", () => {
    expect(getAssignmentKey("Day 1 · Greetings", "?assignmentKey=A1-0.1")).toBe("A1-0.1");
  });

  test("treats the reading-only part of A1-0.1 differently from its questions", () => {
    expect(getRequiredChecklist("A1", "A1-0.1")).toEqual([
      expect.objectContaining({ id: "teil-1", kind: "read", label: expect.stringMatching(/I read Teil 1/i) }),
      expect.objectContaining({ id: "teil-2", kind: "answer", label: expect.stringMatching(/Teil 2/i) }),
    ]);
  });

  test("detects the exact two required parts for A1 Day 2 Kapitel 1.1", () => {
    expect(getRequiredChecklist("A1", "A1-1.1")).toEqual([
      expect.objectContaining({ id: "teil-1", label: expect.stringMatching(/Teil 1 · Hören/i) }),
      expect.objectContaining({ id: "teil-2", label: expect.stringMatching(/Teil 2 · Schreiben/i) }),
    ]);
  });

  test.each(["A2", "B1"])("requires Teil 2, Teil 3 and Teil 4 for %s assignments", (level) => {
    expect(getRequiredChecklist(level, `${level}-1`)).toEqual([
      expect.objectContaining({ id: "teil-2" }),
      expect.objectContaining({ id: "teil-3" }),
      expect.objectContaining({ id: "teil-4" }),
    ]);
  });

  test("shows and gates the checklist inside the inline A1 workbook submit tab", () => {
    document.body.innerHTML = `
      <div data-a1-built-in-submission data-assignment-key="A1-1.1">
        <form>
          <label>Your text<textarea></textarea></label>
          <button type="submit">Submit assignment</button>
        </form>
      </div>
    `;

    expect(
      syncSubmitCompletionGuide({
        pathname: "/campus/course/a1-day-2-kapitel-1-1-workbook",
        search: "?workbookTab=submit&assignmentKey=A1-1.1&level=A1",
      }),
    ).toBe(true);

    const card = document.querySelector('[data-submission-completion-checklist="true"]');
    const checks = Array.from(card.querySelectorAll('input[name="falowen-submit-completion-check"]'));
    const submitButton = document.querySelector('button[type="submit"]');

    expect(checks).toHaveLength(2);
    expect(card.previousElementSibling).toBe(document.querySelector("textarea").closest("label"));
    expect(card).toHaveTextContent("Teil 1 · Hören");
    expect(card).toHaveTextContent("Teil 2 · Schreiben");
    expect(submitButton).toBeDisabled();

    checks.forEach((check) => {
      check.checked = true;
    });
    syncSubmitCompletionGuide({
      pathname: "/campus/course/a1-day-2-kapitel-1-1-workbook",
      search: "?workbookTab=submit&assignmentKey=A1-1.1&level=A1",
    });

    expect(submitButton).not.toBeDisabled();
    expect(submitButton.dataset.completionChecklistReady).toBe("true");
  });
});
