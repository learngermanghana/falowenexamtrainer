import {
  MINIMUM_SUBMISSION_WORDS,
  __TESTING__,
  blockShortSubmission,
  buildMinimumWordError,
  buildMinimumWordMessage,
  countSubmissionWords,
  updateMinimumWordPanel,
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
    expect(countSubmissionWords("Ich schreibe heute eine E-Mail.".trim())).toBe(5);
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

  test("blocks a short final submission and focuses the visible error panel", () => {
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

    const panel = document.querySelector('[data-submission-minimum-word-panel="true"]');
    expect(panel).not.toBeNull();
    expect(panel.getAttribute("role")).toBe("alert");
    expect(panel.textContent).toContain("Please type at least 80 words before submitting.");
    expect(panel.textContent).toContain("Add 68 more words.");
    expect(document.activeElement).toBe(panel);
    expect(panel.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "center" });
    expect(textarea.getAttribute("aria-invalid")).toBe("true");
    expect(textarea.getAttribute("aria-describedby")).toBe(panel.id);
  });

  test("shows ready status and allows submission at 80 words", () => {
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

    const progressState = updateMinimumWordPanel({ textarea });
    expect(progressState.ready).toBe(true);
    expect(progressState.panel.textContent).toBe("80 / 80 words · Ready to submit.");
    expect(progressState.panel.getAttribute("data-word-target-reached")).toBe("true");

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
    const corrected = document.querySelector("#corrected");
    expect(__TESTING__.isResubmissionControl(button)).toBe(true);
    expect(__TESTING__.findResubmissionTextarea(button)).toBe(corrected);
    expect(__TESTING__.isGuardedTextarea(corrected)).toBe(true);
  });
});
