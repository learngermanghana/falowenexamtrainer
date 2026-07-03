jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ studentProfile: null }),
}));

import {
  isPrepositionCoachTextarea,
  resolvePrepositionCoachLevel,
  selectCoachPhrase,
} from "./PrepositionCaseCoachInjector";

describe("PrepositionCaseCoachInjector helpers", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("finds the main and revised WritingPage fields", () => {
    document.body.innerHTML = `
      <section>
        <select>
          <option>A1</option><option>A2</option><option>B1</option>
          <option selected>B2</option><option>C1</option>
        </select>
        <textarea id="main" placeholder="Paste your finished letter or essay here for marking..."></textarea>
        <textarea id="revised" placeholder="Rewrite your improved letter or essay here."></textarea>
        <textarea id="other" placeholder="Reflection"></textarea>
      </section>
    `;

    expect(isPrepositionCoachTextarea(document.getElementById("main"))).toBe(true);
    expect(isPrepositionCoachTextarea(document.getElementById("revised"))).toBe(true);
    expect(isPrepositionCoachTextarea(document.getElementById("other"))).toBe(false);
    expect(resolvePrepositionCoachLevel(document.getElementById("main"), "A1")).toBe("B2");
  });

  it("finds every guided question and the combined essay", () => {
    document.body.innerHTML = `
      <div data-guided-writing-workspace>
        <header><span>Guided C1 Writing</span></header>
        <textarea id="question" aria-label="Question 1"></textarea>
        <textarea id="combined" aria-label="Your combined text"></textarea>
      </div>
    `;

    const question = document.getElementById("question");
    const combined = document.getElementById("combined");
    expect(isPrepositionCoachTextarea(question)).toBe(true);
    expect(isPrepositionCoachTextarea(combined)).toBe(true);
    expect(resolvePrepositionCoachLevel(question, "B1")).toBe("C1");
  });

  it("uses the profile level only as a fallback", () => {
    document.body.innerHTML = `<textarea id="field" placeholder="Combine what you wrote today and paste it here for level-based analysis..."></textarea>`;
    expect(resolvePrepositionCoachLevel(document.getElementById("field"), "B2")).toBe("B2");
  });

  it("selects the exact phrase without changing the textarea value", () => {
    document.body.innerHTML = `<textarea id="field">Heute arbeiten wir mit einem wichtig Projekt.</textarea>`;
    const textarea = document.getElementById("field");
    const originalValue = textarea.value;
    const start = originalValue.indexOf("mit einem wichtig Projekt");

    expect(
      selectCoachPhrase(textarea, {
        fullStart: start,
        start: start + 4,
        end: start + "mit einem wichtig Projekt".length,
      }),
    ).toBe(true);
    expect(textarea.selectionStart).toBe(start);
    expect(textarea.selectionEnd).toBe(start + "mit einem wichtig Projekt".length);
    expect(textarea.value).toBe(originalValue);
  });
});
