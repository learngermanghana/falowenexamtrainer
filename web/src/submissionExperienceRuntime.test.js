jest.mock("./firebase", () => ({
  auth: null,
  collection: jest.fn(),
  db: null,
  functions: null,
  getDocs: jest.fn(),
  httpsCallable: jest.fn(),
  limit: jest.fn(),
  onIdTokenChanged: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

jest.mock("./services/resultsApi", () => ({
  fetchStudentResultsHistory: jest.fn(),
}));

import {
  buildHistoricalResubmissionPayload,
  findLatestAssignmentResult,
  moveCompletionChecklistBelowEditor,
} from "./submissionExperienceRuntime";

describe("submission experience runtime", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("calculates the latest failed A1-1.2 result from historical score rows", () => {
    const result = findLatestAssignmentResult(
      [
        {
          assignment: "A1 • Day 3 • Task 2 • A1-1.2",
          score: 29,
          date: "2026-05-21T06:55:23.000Z",
        },
        {
          assignmentId: "A1-1.2",
          score: 20,
          date: "2026-05-01T06:55:23.000Z",
        },
        {
          assignmentId: "A1-1.1",
          score: 90,
          date: "2026-06-01T06:55:23.000Z",
        },
      ],
      "A1-1.2",
    );

    expect(result).toEqual(expect.objectContaining({ normalizedScore: 29 }));
  });

  test("moves the required Teil checklist below the typing box and keeps the gate checkbox synced", () => {
    document.body.innerHTML = `
      <section id="falowen-submit-level-guidance">
        <div>Header</div>
        <div id="original-checklist">
          <strong>Confirm every required Teil · A2 Day 19</strong>
          <label><input type="checkbox" name="falowen-submit-completion-check" data-check-id="teil-2">Teil 2</label>
          <label><input type="checkbox" name="falowen-submit-completion-check" data-check-id="teil-3">Teil 3</label>
        </div>
      </section>
      <form>
        <label id="editor"><span>Your text</span><textarea></textarea></label>
        <button type="submit">Submit final answers</button>
      </form>
    `;

    expect(moveCompletionChecklistBelowEditor(document)).toBe(true);

    const original = document.querySelector('#original-checklist input[data-check-id="teil-2"]');
    const clone = document.querySelector('#falowen-submit-completion-check-below-editor input[data-check-id="teil-2"]');
    const editor = document.getElementById("editor");

    expect(document.getElementById("original-checklist")).toBeHidden();
    expect(editor.nextElementSibling).toHaveAttribute("data-checklist-below-editor", "true");
    expect(clone).not.toHaveAttribute("name");

    clone.click();
    expect(original).toBeChecked();
  });

  test("builds a verified historical resubmission payload for the failed assignment", () => {
    const payload = buildHistoricalResubmissionPayload({
      context: {
        assignmentKey: "A1-1.2",
        assignmentTitle: "A1 • Day 3 • Task 2 • Chapter 1.2",
        level: "A1",
        day: 3,
        chapter: "1.2",
      },
      result: { normalizedScore: 29 },
      profile: { studentCode: "ST-29", name: "Student", className: "A1 Berlin" },
      user: { uid: "uid-29", email: "student@example.com", displayName: "Student" },
      correctedText: "This is the complete corrected answer with all previously missing questions answered in full.",
      improvementSummary: "I completed Q1 to Q9 and corrected the wrong multiple-choice answer.",
    });

    expect(payload).toEqual(
      expect.objectContaining({
        assignmentKey: "A1-1.2",
        previousScore: 29,
        studentCode: "ST-29",
        day: 3,
        chapter: "1.2",
      }),
    );
    expect(payload.submissionText).toContain("complete corrected answer");
  });
});
