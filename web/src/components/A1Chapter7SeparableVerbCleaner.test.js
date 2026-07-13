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

  it("replaces repeated verb blocks with one compact explanation while preserving the original DOM", () => {
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

  it("organizes the full page and explains morning, afternoon, evening and night in the 12-hour clock", () => {
    const questionCards = Array.from({ length: 12 }, (_, index) => `
      <div class="question-card"><strong>${index + 1}) Question ${index + 1}</strong><button>Answer</button></div>
    `).join("");

    document.body.innerHTML = `
      <main>
        <div class="hero"><a>Back to Course Book</a><h1>A1 Grammar Book</h1><p>Introduction</p></div>
        <section><div><h2>1) Days of the week</h2></div><div>Days table</div></section>
        <section id="time"><div><h2>2) The 12-hour clock in German</h2><p>Old subtitle</p></div><div>Repeated time table</div><div>Repeated note</div></section>
        <section id="half"><div><h2>3) The clear halb rule</h2></div><div>Repeated halb explanation</div></section>
        <section id="quarter"><div><h2>4) Viertel nach and Viertel vor</h2></div><div>Repeated quarter explanation</div></section>
        <section id="verbs"><div><h2>5) Separable verbs</h2></div><div>Repeated verb explanation</div></section>
        <section><div><h2>6) Put everything together</h2></div><div>Combined examples</div></section>
        <section id="mini"><div><h2>7) Mini practice</h2></div><div>Duplicate practice</div></section>
        <section id="test"><div><h2>8) Knowledge test</h2><p>Old test subtitle</p></div><div>${questionCards}</div></section>
        <section id="summary"><div><h2>9) Final summary</h2></div><div>Long repeated summary</div></section>
      </main>
    `;

    expect(applyA1Chapter7SeparableVerbCleanup(document, A1_CHAPTER7_TIME_PATH)).toBe(true);

    const timeText = document.querySelector('[data-a1-compact-time-explanation="true"]').textContent;
    expect(timeText).toContain("morgens");
    expect(timeText).toContain("mittags");
    expect(timeText).toContain("nachmittags");
    expect(timeText).toContain("abends");
    expect(timeText).toContain("nachts");
    expect(timeText).toContain("acht Uhr morgens");
    expect(timeText).toContain("acht Uhr abends");

    expect(document.querySelector("#mini").style.display).toBe("none");
    expect(document.querySelectorAll('[data-a1-hidden-duplicate-question="true"]')).toHaveLength(4);
    expect(Array.from(document.querySelectorAll("#test .question-card")).filter((card) => card.style.display !== "none")).toHaveLength(8);
    expect(document.querySelector("#test p").textContent).toContain("eight focused questions");
    expect(document.querySelector('[data-a1-chapter7-navigation="true"]')).not.toBeNull();
    expect(document.querySelector('[data-a1-compact-summary="true"]').textContent).toContain("Remember these six points");

    restoreA1Chapter7SeparableVerbContent(document);
    expect(document.querySelector("#mini").style.display).toBe("");
    expect(document.querySelectorAll('[data-a1-hidden-duplicate-question="true"]')).toHaveLength(0);
    expect(document.querySelector("#test p").textContent).toBe("Old test subtitle");
  });
});
