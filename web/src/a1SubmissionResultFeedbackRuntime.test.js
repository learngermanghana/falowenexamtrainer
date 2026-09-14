jest.mock("./services/interactionFeedback", () => ({
  playFeedbackSound: jest.fn(() => Promise.resolve(true)),
}));

import { playFeedbackSound } from "./services/interactionFeedback";
import {
  A1_SUBMISSION_FAILURE_MESSAGE,
  syncA1SubmissionResultFeedback,
} from "./a1SubmissionResultFeedbackRuntime";

describe("A1 submission result feedback runtime", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = `
      <div data-a1-built-in-submission>
        <div
          id="submission-root"
          data-cloud-draft-persistence="react-owned"
          data-final-submission-state="idle"
          data-final-submission-error=""
        ></div>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("shows a clear failure toast and plays the error sound when final submission fails", () => {
    const root = document.getElementById("submission-root");
    root.setAttribute("data-final-submission-state", "error");
    root.setAttribute("data-final-submission-error", "firestore-error: write failed");

    expect(syncA1SubmissionResultFeedback(root)).toBe(true);

    const toast = document.querySelector('[data-a1-submission-result-toast="error"]');
    expect(toast).not.toBeNull();
    expect(toast.textContent).toContain(A1_SUBMISSION_FAILURE_MESSAGE);
    expect(toast.getAttribute("role")).toBe("alert");
    expect(playFeedbackSound).toHaveBeenCalledWith("error");
  });

  test("does not repeat the same failure feedback until the submission leaves the error state", () => {
    const root = document.getElementById("submission-root");
    root.setAttribute("data-final-submission-state", "error");
    root.setAttribute("data-final-submission-error", "firestore-error: write failed");

    expect(syncA1SubmissionResultFeedback(root)).toBe(true);
    expect(syncA1SubmissionResultFeedback(root)).toBe(false);
    expect(playFeedbackSound).toHaveBeenCalledTimes(1);

    root.setAttribute("data-final-submission-state", "saving");
    expect(syncA1SubmissionResultFeedback(root)).toBe(false);

    root.setAttribute("data-final-submission-state", "error");
    expect(syncA1SubmissionResultFeedback(root)).toBe(true);
    expect(playFeedbackSound).toHaveBeenCalledTimes(2);
  });
});
