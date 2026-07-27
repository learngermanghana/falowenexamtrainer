import fs from "fs";
import path from "path";

const readWebFile = (relativePath) =>
  fs.readFileSync(path.join(__dirname, "../..", relativePath), "utf8");

const speakingChatFixture = ({ activeTab = "Teil 1", legacyGrammarPanel = false } = {}) => `
  <main>
    <nav data-workbook-tab-navigation>
      <div role="tablist">
        <button role="tab" aria-label="Grammar" aria-selected="${activeTab === "Grammar"}">Grammar</button>
        <button role="tab" aria-label="Teil 1" aria-selected="${activeTab === "Teil 1"}">Teil 1</button>
      </div>
    </nav>
    ${legacyGrammarPanel ? '<section data-a2-standard-legacy-panel="grammar">Grammar notes</section>' : ""}
    <section data-course-inline-practice="speaking">Inline course free chat</section>
    <div id="embedded-wrapper">
      <div id="speaking-page-root">
        <div id="speaking-card">
          <div id="speaking-header">
            <div><h1>Goethe Speaking Exam Coach</h1></div>
          </div>
        </div>
      </div>
    </div>
    <div id="quick-starters"><label>Quick starters</label><button>Starter</button></div>
  </main>
`;

const cleanupSource = readWebFile("public/course-speaking-chat-cleanup.js");

describe("A2/B1 coursebook speaking cleanup", () => {
  beforeAll(() => {
    delete window.__falowenCourseSpeakingChatCleanupInstalled;
    delete window.cleanCourseSpeakingChat;
    delete window.isA2B1GrammarViewActive;
    window.eval(cleanupSource);
  });

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("uses only the approved A2 Day 9 Teil 4 Hören video", () => {
    const source = readWebFile("src/components/A2Day9UrlaubWorkbookPage.js");

    expect(source).toContain('hoerenAudioUrl="https://youtu.be/Q6PjXP6Ccik"');
    expect(source).not.toContain("https://youtu.be/bQlIXyfcUFc");
  });

  test("loads the course speaking cleanup before the React application", () => {
    const indexSource = readWebFile("index.html");
    const cleanupPosition = indexSource.indexOf('/course-speaking-chat-cleanup.js');
    const appPosition = indexSource.indexOf('/src/index.js');

    expect(cleanupPosition).toBeGreaterThan(-1);
    expect(appPosition).toBeGreaterThan(cleanupPosition);
  });

  test("hides Goethe Free Chat on the legacy A2 Day 24 Grammar view", () => {
    window.history.pushState({}, "", "/campus/course/a2-day-24-einen-urlaub-planen-workbook?radio=done");
    document.body.innerHTML = speakingChatFixture({ activeTab: "Grammar", legacyGrammarPanel: true });

    expect(window.isA2B1GrammarViewActive()).toBe(true);
    expect(window.cleanCourseSpeakingChat()).toBe(true);

    expect(document.querySelector('[data-course-inline-practice="speaking"]')).toHaveStyle({ display: "none" });
    expect(document.getElementById("embedded-wrapper")).toHaveStyle({ display: "none" });
    expect(document.getElementById("quick-starters")).toHaveStyle({ display: "none" });
  });

  test("hides Goethe Free Chat on a B1 Grammar tab", () => {
    window.history.pushState({}, "", "/campus/course/lesson/B1/8?view=workbook");
    document.body.innerHTML = speakingChatFixture({ activeTab: "Grammar" });

    expect(window.isA2B1GrammarViewActive()).toBe(true);
    window.cleanCourseSpeakingChat();

    expect(document.querySelector('[data-course-inline-practice="speaking"]')).toHaveStyle({ display: "none" });
    expect(document.getElementById("embedded-wrapper")).toHaveStyle({ display: "none" });
  });

  test.each([
    ["A2", "/campus/course/lesson/A2/21?view=workbook"],
    ["B1", "/campus/course/lesson/B1/17?view=workbook"],
  ])("keeps Goethe Free Chat available in %s Teil 1", (_level, route) => {
    window.history.pushState({}, "", route);
    document.body.innerHTML = speakingChatFixture({ activeTab: "Teil 1" });

    expect(window.isA2B1GrammarViewActive()).toBe(false);
    expect(window.cleanCourseSpeakingChat()).toBe(false);
    expect(document.querySelector('[data-course-inline-practice="speaking"]')).toBeVisible();
    expect(document.getElementById("embedded-wrapper")).toBeVisible();
    expect(document.getElementById("quick-starters")).toBeVisible();
  });

  test("restores a chat hidden by Grammar when the learner returns to Teil 1", () => {
    window.history.pushState({}, "", "/campus/course/a2-day-24-einen-urlaub-planen-workbook?radio=done");
    document.body.innerHTML = speakingChatFixture({ activeTab: "Grammar", legacyGrammarPanel: true });

    window.cleanCourseSpeakingChat();
    const panel = document.querySelector('[data-course-inline-practice="speaking"]');
    expect(panel).toHaveStyle({ display: "none" });
    expect(panel).toHaveAttribute("data-course-free-chat-hidden", "true");

    document.querySelector('[data-a2-standard-legacy-panel="grammar"]').remove();
    document.querySelector('[aria-label="Grammar"]').setAttribute("aria-selected", "false");
    document.querySelector('[aria-label="Teil 1"]').setAttribute("aria-selected", "true");

    expect(window.isA2B1GrammarViewActive()).toBe(false);
    expect(window.cleanCourseSpeakingChat()).toBe(true);
    expect(panel).toBeVisible();
    expect(panel).not.toHaveAttribute("data-course-free-chat-hidden");
  });

  test("does not suppress B2/C1 course speaking views", () => {
    window.history.pushState({}, "", "/campus/course/lesson/B2/4?chapter=1.4");
    document.body.innerHTML = speakingChatFixture({ activeTab: "Grammar" });

    expect(window.isA2B1GrammarViewActive()).toBe(false);
    expect(window.cleanCourseSpeakingChat()).toBe(false);
    expect(document.querySelector('[data-course-inline-practice="speaking"]')).toBeVisible();
  });

  test("does not alter the standalone speaking exam room", () => {
    window.history.pushState({}, "", "/exams/speaking");
    document.body.innerHTML = `
      <main>
        <div id="standalone-speaking"><h1>Goethe Speaking Exam Coach</h1></div>
        <div id="standalone-starters"><label>Quick starters</label></div>
      </main>
    `;

    expect(window.cleanCourseSpeakingChat()).toBe(false);
    expect(document.getElementById("standalone-speaking")).toBeVisible();
    expect(document.getElementById("standalone-starters")).toBeVisible();
  });
});
