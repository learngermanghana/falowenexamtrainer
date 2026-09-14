import {
  A1_MINIMUM_WORDS,
  buildA1WordStatus,
  countA1SubmissionWords,
  showA1SubmitError,
  syncA1SubmissionForm,
  validateA1SubmissionForm,
} from "./a1SubmissionConsistencyRuntime";

const makeWords = (count) =>
  Array.from({ length: count }, (_, index) => `wort${index + 1}`).join(" ");

const renderA1Form = ({ wordCount = 13, confirmed = true, teilChecked = true } = {}) => {
  document.body.innerHTML = `
    <div
      data-cloud-draft-persistence="react-owned"
      data-final-submission-state="idle"
      data-final-submission-error=""
      data-draft-conflict="false"
    >
      <form style="display:grid;gap:12px;">
        <div data-test-meta>Assignment details</div>
        <label id="answer-editor">
          <span>Your text *</span>
          <textarea data-minimum-words="20">${makeWords(wordCount)}</textarea>
          <span id="inline-counter">0 / 2,500 characters · 0 words · Minimum 20 words before submitting</span>
        </label>
        <section id="falowen-submit-level-guidance">
          <strong>Required final answers</strong>
          <label><input type="checkbox" name="falowen-submit-completion-check" data-check-id="teil-1" ${teilChecked ? "checked" : ""}> Teil 1</label>
          <label><input type="checkbox" name="falowen-submit-completion-check" data-check-id="teil-2" ${teilChecked ? "checked" : ""}> Teil 2</label>
        </section>
        <div id="quick-keys">
          <span>Quick umlaut keys:</span>
          <div><button type="button">ä</button><button type="button">ö</button></div>
        </div>
        <label id="assignment-confirmation">
          <input type="checkbox" ${confirmed ? "checked" : ""}>
          <span>I checked that this is the correct assignment.</span>
        </label>
        <details><summary>Review details</summary></details>
        <div data-a1-submission-actions>
          <button type="button">Save draft</button>
          <button type="submit" data-a1-final-submit-button disabled>Submit assignment</button>
        </div>
      </form>
    </div>
    <div data-submission-minimum-word-panel="true">28 / 20 words · Ready to submit.</div>
  `;

  const form = document.querySelector("form");
  const textarea = form.querySelector("textarea");
  textarea.value = makeWords(wordCount);
  return { form, textarea };
};

describe("A1 submission consistency runtime", () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    window.requestAnimationFrame = (callback) => callback();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.restoreAllMocks();
  });

  test("uses the textarea whitespace count as the single A1 count", () => {
    expect(A1_MINIMUM_WORDS).toBe(20);
    expect(countA1SubmissionWords("eins   zwei\ndrei\tvier")).toBe(4);
    expect(countA1SubmissionWords("  eins zwei  ")).toBe(2);
    expect(buildA1WordStatus(13)).toBe("13 / 20 words · 7 more words required");
    expect(buildA1WordStatus(20)).toBe("20 / 20 words · Ready to submit");
  });

  test("shows the identical word status under the textarea and in the mobile status bar", () => {
    const { form, textarea } = renderA1Form({ wordCount: 13 });

    const result = syncA1SubmissionForm(form);

    expect(result.wordCount).toBe(13);
    expect(result.wordStatus).toBe("13 / 20 words · 7 more words required");
    expect(textarea.getAttribute("data-submission-word-feedback")).toBe("inline");
    expect(textarea.getAttribute("data-a1-word-count")).toBe("13");

    const inlineCounter = document.getElementById("inline-counter");
    const mobileStatus = form.querySelector('[data-a1-mobile-word-status="true"]');
    expect(inlineCounter.textContent).toContain("13 / 20 words · 7 more words required");
    expect(mobileStatus.textContent).toBe("13 / 20 words · 7 more words required");
    expect(mobileStatus.hidden).toBe(false);
    expect(document.querySelector('[data-submission-minimum-word-panel="true"]').hidden).toBe(true);
  });

  test("puts umlaut keys after the answer editor and keeps Teil checks before assignment confirmation on mobile", () => {
    const { form } = renderA1Form({ wordCount: 20 });

    syncA1SubmissionForm(form);

    const editor = document.getElementById("answer-editor");
    const quickKeys = document.getElementById("quick-keys");
    const guidance = document.getElementById("falowen-submit-level-guidance");
    const confirmation = document.getElementById("assignment-confirmation");

    expect(Number(editor.style.order)).toBeLessThan(Number(quickKeys.style.order));
    expect(Number(quickKeys.style.order)).toBeLessThan(Number(guidance.style.order));
    expect(Number(guidance.style.order)).toBeLessThan(Number(confirmation.style.order));
    expect(Array.from(guidance.querySelectorAll("[data-check-id]")).map((input) => input.dataset.checkId)).toEqual([
      "teil-1",
      "teil-2",
    ]);
  });

  test("keeps Submit clickable below 20 words so validation can show the missing-word error", () => {
    const { form } = renderA1Form({ wordCount: 13, confirmed: true, teilChecked: true });

    syncA1SubmissionForm(form);

    const submit = form.querySelector("[data-a1-final-submit-button]");
    expect(submit.disabled).toBe(false);
    expect(submit.dataset.a1WordCountReady).toBe("false");

    const message = validateA1SubmissionForm(form);
    expect(message).toBe("13 / 20 words · 7 more words required.");

    const error = showA1SubmitError(form, message, { focus: false });
    expect(error.hidden).toBe(false);
    expect(error.textContent).toBe(message);
    expect(error.nextElementSibling).toBe(submit);
    expect(submit.getAttribute("aria-describedby")).toBe(error.id);
  });

  test("still respects the required Teil checklist gate", () => {
    const { form } = renderA1Form({ wordCount: 25, confirmed: true, teilChecked: false });

    syncA1SubmissionForm(form);

    expect(form.querySelector("[data-a1-final-submit-button]").disabled).toBe(true);
  });

  test("requires the correct-assignment confirmation after the word target is reached", () => {
    const { form } = renderA1Form({ wordCount: 20, confirmed: false, teilChecked: true });

    syncA1SubmissionForm(form);

    expect(validateA1SubmissionForm(form)).toBe(
      "Please check ‘I checked that this is the correct assignment.’ before submitting.",
    );
  });
});
