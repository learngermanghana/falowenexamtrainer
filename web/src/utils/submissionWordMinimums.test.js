import { resolveMinimumSubmissionWords } from "../components/SubmissionMinimumWordGuard";
import {
  applySubmissionWordMinimum,
  getSubmissionMinimumWordsForLevel,
  refreshSubmissionWordMinimums,
  resolveSubmissionLevelForElement,
} from "./submissionWordMinimums";

describe("level-based submission word minimums", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("uses 20 words for the canonical A1 workbook submission", () => {
    document.body.innerHTML = `
      <div data-a1-built-in-submission>
        <form>
          <textarea></textarea>
          <button type="submit" data-a1-final-submit-button>Submit assignment</button>
        </form>
      </div>
    `;

    const textarea = document.querySelector("textarea");
    const button = document.querySelector("button");
    expect(resolveSubmissionLevelForElement(textarea)).toBe("A1");
    expect(applySubmissionWordMinimum(textarea)).toBe(20);
    expect(textarea.getAttribute("data-minimum-words")).toBe("20");
    expect(resolveMinimumSubmissionWords({ textarea, control: button })).toBe(20);
  });

  test.each([
    ["A2", 80],
    ["B1", 80],
  ])("keeps the %s assignment minimum at %i words", (level, minimumWords) => {
    document.body.innerHTML = `
      <main>
        <form>
          <select><option selected value="${level}">${level}</option></select>
          <textarea></textarea>
          <button type="submit">Submit assignment</button>
        </form>
      </main>
    `;

    const textarea = document.querySelector("textarea");
    const button = document.querySelector("button");
    expect(getSubmissionMinimumWordsForLevel(level)).toBe(minimumWords);
    expect(applySubmissionWordMinimum(textarea)).toBe(minimumWords);
    expect(resolveMinimumSubmissionWords({ textarea, control: button })).toBe(minimumWords);
  });

  test("updates all textareas when the selected submission level changes", () => {
    document.body.innerHTML = `
      <main>
        <select id="level">
          <option value="A1">A1</option>
          <option selected value="A2">A2</option>
        </select>
        <form><textarea id="answer"></textarea></form>
      </main>
    `;

    const textarea = document.querySelector("#answer");
    refreshSubmissionWordMinimums(document);
    expect(textarea.getAttribute("data-minimum-words")).toBe("80");

    document.querySelector("#level").value = "A1";
    refreshSubmissionWordMinimums(document);
    expect(textarea.getAttribute("data-minimum-words")).toBe("20");
  });

  test("does not overwrite an assignment-specific declared target", () => {
    document.body.innerHTML = `
      <form>
        <select><option selected value="A2">A2</option></select>
        <textarea data-minimum-words="40"></textarea>
      </form>
    `;

    const textarea = document.querySelector("textarea");
    expect(applySubmissionWordMinimum(textarea)).toBe(40);
    expect(textarea.getAttribute("data-minimum-words")).toBe("40");
  });
});
