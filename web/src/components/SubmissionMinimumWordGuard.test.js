import {
  __TESTING__,
  blockShortSubmission,
  buildMinimumWordError,
  buildMinimumWordMessage,
  countSubmissionWords,
  hideMinimumWordPanel,
  parseMinimumWordsFromProgressLabel,
  resolveMinimumSubmissionWords,
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

  test("blocks a short canonical A1 submission at the 20-word target and focuses the error", () => {
    document.body.innerHTML = `
      <div data-a1-built-in-submission>
        <form>
          <label>
            Your text
            <textarea>${Array.from({ length: 12 }, (_, index) => `word${index}`).join(" ")}</textarea>
          </label>
          <button type="submit" data-a1-final-submit-button>Submit assignment</button>
        </form>
      </div>
    `;

    const form = document.querySelector("form");
    const textarea = form.querySelector("textarea");
    const button = form.querySelector("button");
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      stopImmediatePropagation: jest.fn(),
    };

    expect(resolveMinimumSubmissionWords({ textarea, control: button })).toBe(20);
    expect(__TESTING__.findSubmissionTextarea(form)).toBe(textarea);
    expect(blockShortSubmission({ event, textarea, minimumWords: 20 })).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();

    const panel = document.querySelector('[data-submission-minimum-word-panel="true"]');
    expect(panel).not.toBeNull();
    expect(panel.getAttribute("role")).toBe("alert");
    expect(panel.textContent).toContain("Please type at least 20 words before submitting.");
    expect(panel.textContent).toContain("Add 8 more words.");
    expect(document.activeElement).toBe(panel);
    expect(panel.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "center" });
    expect(textarea.getAttribute("aria-invalid")).toBe("true");
    expect(textarea.getAttribute("aria-describedby")).toBe(panel.id);
  });

  test("uses a workbook's rendered 40-word target instead of forcing 80", () => {
    document.body.innerHTML = `
      <form>
        <label>
          Your text
          <textarea></textarea>
          <div><div aria-label="Minimum word target: 0 of 40 words"></div></div>
        </label>
        <button type="submit">Submit assignment</button>
      </form>
    `;

    const textarea = document.querySelector("textarea");
    const button = document.querySelector("button");
    expect(parseMinimumWordsFromProgressLabel("Minimum word target: 0 of 40 words")).toBe(40);
    expect(resolveMinimumSubmissionWords({ textarea, control: button })).toBe(40);

    textarea.value = Array.from({ length: 39 }, (_, index) => `word${index}`).join(" ");
    const event = { preventDefault: jest.fn(), stopPropagation: jest.fn(), stopImmediatePropagation: jest.fn() };
    expect(blockShortSubmission({ event, textarea, minimumWords: 40 })).toBe(true);
    expect(document.querySelector('[data-submission-minimum-word-panel="true"]').textContent)
      .toContain("Please type at least 40 words before submitting.");
  });

  test("does not invent a word limit for a non-canonical form without a declared target", () => {
    document.body.innerHTML = `
      <form>
        <textarea></textarea>
        <button type="submit">Submit assignment</button>
      </form>
    `;
    const textarea = document.querySelector("textarea");
    const button = document.querySelector("button");
    expect(resolveMinimumSubmissionWords({ textarea, control: button })).toBeNull();
    expect(__TESTING__.isGuardedTextarea(textarea)).toBe(false);
  });

  test("shows ready status and allows canonical A1 submission at 20 words", () => {
    document.body.innerHTML = `
      <form data-minimum-words="20">
        <label>Your text<textarea></textarea></label>
        <button type="submit" data-a1-final-submit-button>Submit assignment</button>
      </form>
    `;

    const textarea = document.querySelector("textarea");
    textarea.value = Array.from({ length: 20 }, (_, index) => `word${index}`).join(" ");

    const progressState = updateMinimumWordPanel({ textarea, minimumWords: 20 });
    expect(progressState.ready).toBe(true);
    expect(progressState.panel.textContent).toBe("20 / 20 words · Ready to submit.");
    expect(progressState.panel.getAttribute("data-word-target-reached")).toBe("true");

    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      stopImmediatePropagation: jest.fn(),
    };
    expect(blockShortSubmission({ event, textarea, minimumWords: 20 })).toBe(false);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  test("hides the panel after the student leaves the submission controls", () => {
    document.body.innerHTML = "<textarea></textarea>";
    const textarea = document.querySelector("textarea");
    textarea.value = "eins zwei drei";
    const { panel } = updateMinimumWordPanel({ textarea, minimumWords: 80 });
    expect(panel.hidden).toBe(false);

    hideMinimumWordPanel();
    expect(panel.hidden).toBe(true);
  });

  test("uses the corrected-text field and its declared target for resubmission", () => {
    document.body.innerHTML = `
      <section>
        <label>
          Corrected text
          <textarea id="corrected"></textarea>
          <div><div aria-label="Minimum word target: 0 of 20 words"></div></div>
        </label>
        <label>What improved<textarea id="improvement"></textarea></label>
        <div><button type="button">Submit resubmission</button></div>
      </section>
    `;

    const button = document.querySelector("button");
    const corrected = document.querySelector("#corrected");
    expect(__TESTING__.isResubmissionControl(button)).toBe(true);
    expect(__TESTING__.findResubmissionTextarea(button)).toBe(corrected);
    expect(resolveMinimumSubmissionWords({ textarea: corrected, control: button })).toBe(20);
    expect(__TESTING__.isGuardedTextarea(corrected)).toBe(true);
  });
});
