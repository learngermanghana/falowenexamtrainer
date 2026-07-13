import {
  A1_CHAPTER7_TIME_PATH,
  applyA1Chapter7SeparableVerbCleanup,
  findSeparableVerbSection,
  isA1Chapter7TimePath,
  restoreA1Chapter7SeparableVerbContent,
} from "./A1Chapter7SeparableVerbCleaner";

describe("A1Chapter7SeparableVerbCleaner", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("matches only the intended Chapter 7 page", () => {
    expect(isA1Chapter7TimePath(A1_CHAPTER7_TIME_PATH)).toBe(true);
    expect(isA1Chapter7TimePath(`${A1_CHAPTER7_TIME_PATH}/`)).toBe(true);
    expect(isA1Chapter7TimePath("/campus/course/lesson/A1/11")).toBe(false);
  });

  it("finds the separable verbs section", () => {
    document.body.innerHTML = `
      <section><h2>4) Viertel nach and Viertel vor</h2></section>
      <section id="target"><div><h2>5) Separable verbs</h2><p>Subtitle</p></div></section>
    `;

    expect(findSeparableVerbSection(document)?.id).toBe("target");
  });

  it("replaces repeated visible blocks with one compact explanation while preserving the original DOM", () => {
    document.body.innerHTML = `
      <main>
        <section id="target">
          <div class="heading"><h2>5) Separable verbs</h2><p>Some German daily routine verbs split.</p></div>
          <div class="old-table">Ten verb examples</div>
          <div class="old-rule">Main rule</div>
          <div class="old-prefixes">Thirteen prefixes</div>
          <div class="old-split-table">Repeated split examples</div>
          <div class="old-step-table">Repeated step explanation</div>
          <div class="old-question">Question explanation</div>
        </section>
      </main>
    `;

    expect(applyA1Chapter7SeparableVerbCleanup(document, A1_CHAPTER7_TIME_PATH)).toBe(true);
    expect(document.querySelectorAll('[data-a1-compact-separable-verbs="true"]')).toHaveLength(1);
    expect(document.querySelectorAll('[data-a1-hidden-duplicate-content="true"]')).toHaveLength(6);
    expect(document.querySelector(".old-table").style.display).toBe("none");

    const compactText = document.querySelector('[data-a1-compact-separable-verbs="true"]').textContent;
    expect(compactText).toContain("conjugated verb is in position 2");
    expect(compactText).toContain("aufstehen");
    expect(compactText).toContain("Most useful prefixes");
    expect(compactText).toContain("Stehst du um sechs Uhr auf?");

    applyA1Chapter7SeparableVerbCleanup(document, A1_CHAPTER7_TIME_PATH);
    expect(document.querySelectorAll('[data-a1-compact-separable-verbs="true"]')).toHaveLength(1);

    restoreA1Chapter7SeparableVerbContent(document);
    expect(document.querySelector('[data-a1-compact-separable-verbs="true"]')).toBeNull();
    expect(document.querySelector(".old-table").style.display).toBe("");
    expect(document.querySelector(".old-table").hasAttribute("aria-hidden")).toBe(false);
  });
});
