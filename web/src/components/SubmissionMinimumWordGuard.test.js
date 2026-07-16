import {
  MINIMUM_SUBMISSION_WORDS,
  __TESTING__,
  blockShortSubmission,
  buildMinimumWordError,
  buildMinimumWordMessage,
  countSubmissionWords,
  updateMinimumWordProgress,
} from "./SubmissionMinimumWordGuard";

describe("SubmissionMinimumWordGuard", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    window.requestAnimationFrame = (callback) => {
      callback();
      return 1;
    };
    Element.prototype.scrollIntoView = jest.fn();
  });

  test("counts normal German and English words consistently", () => {
    expect(countSubmissionWords("Ich schreibe heute eine E-Mail.".trim())).toBe(6);
    expect(countSubmissionWords("don't stop – weiterlernen 2026")).toBe(4);
    expect(countSubmissionWords("   ")).toBe(0);
  });

  test("builds a clear message with the exact number of missing words", () => {
    expect(buildMinimumWordMessage(63)).toBe("63 / 80 words · Add 17 more words before submitting.");
    expect(buildMinimumWordError(79)).toBe(
      "Please type at least 80 words before submitting. You currently have 79 words. Add 1 more word.",
    );
    expect(buildMinimumWordMessage(80)).toBe("80 / 80 words · Ready to submit.");
  });

  test("blocks a short final submission and focuses the visible error", () => {
    document.body.innerHTML = `
      <form>
        <label>
          Your text
          <textarea>${Array.from({ length: 12 }, (_, index) => `word${index}`).join(" ")}</textarea>
        </label>
        <button type="submit">Submit assignment</button>
      </form>
    `;

    const form = document.querySelector("form");
    const textarea = form.querySelector("textarea");
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      stopImmediatePropagation: jest.fn(),
    };

    expect(__TESTING__.findSubmissionTextarea(form)).toBe(textarea);
    expect(blockShortSubmission({ event, textarea })).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();

    const error = form.querySelector('[data-submission-minimum-word-error="true"]');
    expect(error).not.toBeNull();
    expect(error.getAttribute("role")).toBe("alert");
    expect(error.textContent).toContain("Please type at least 80 words before submitting.");
    expect(error.textContent).toContain("Add 68 more words.");
    expect(document.activeElement).toBe(error);
    expect(error.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "center" });
    expect(textarea.getAttribute("aria-invalid")).toBe("true");
  });

  test("updates the prominent counter and allows submission at 80 words", () => {
    document.body.innerHTML = `
      <form>
        <label>
          Your text
          <textarea></textarea>
          <div><div aria-label="Minimum word target: 0 of 20 words"></div></div>
        </label>
        <button type="submit" data-a1-final-submit-button>Submit assignment</button>
      </form>
    `;

    const form = document.querySelector("form");
    const textarea = form.querySelector("textarea");
    textarea.value = Array.from({ length: MINIMUM_SUBMISSION_WORDS }, (_, index) => `word${index}`).join(" ");

    const progressState = updateMinimumWordProgress(textarea);
    expect(progressState.ready).toBe(true);
    expect(form.querySelector('[data-submission-minimum-word-progress="true"]').textContent)
      .toBe("80 / 80 words · Ready to submit.");

    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      stopImmediatePropagation: jest.fn(),
    };
    expect(blockShortSubmission({ event, textarea })).toBe(false);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  test("finds the corrected-text field for a resubmission button", () => {
    document.body.innerHTML = `
      <section>
        <label>Corrected text<textarea id="corrected"></textarea></label>
        <label>What improved<textarea id="improvement"></textarea></label>
        <div><button type="button">Submit resubmission</button></div>
      </section>
    `;

    const button = document.querySelector("button");
    expect(__TESTING__.isResubmissionControl(button)).toBe(true);
    expect(__TESTING__.findResubmissionTextarea(button).id).toBe("corrected");
  });
});
