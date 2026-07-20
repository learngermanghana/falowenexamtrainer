import fs from "fs";
import path from "path";

const readWebFile = (relativePath) =>
  fs.readFileSync(path.join(__dirname, "../..", relativePath), "utf8");

const speakingChatFixture = () => `
  <main>
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

describe("A2 Day 9 Hören and coursebook speaking cleanup", () => {
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

  test("removes the large free chat and Quick starters from B2-C1 coursebook routes", () => {
    const cleanupSource = readWebFile("public/course-speaking-chat-cleanup.js");
    window.history.pushState({}, "", "/campus/course/lesson/B2/4?chapter=1.4");
    document.body.innerHTML = speakingChatFixture();

    window.eval(cleanupSource);
    expect(window.cleanCourseSpeakingChat()).toBe(true);

    expect(document.querySelector('[data-course-inline-practice="speaking"]')).toHaveStyle({ display: "none" });
    expect(document.getElementById("embedded-wrapper")).toHaveStyle({ display: "none" });
    expect(document.getElementById("quick-starters")).toHaveStyle({ display: "none" });
  });

  test("keeps the Goethe free chat and Quick starters visible in A2 and B1 Teil 1", () => {
    const cleanupSource = readWebFile("public/course-speaking-chat-cleanup.js");
    const a2WorkbookSource = readWebFile("src/components/A2StandardTabbedWorkbookPage.js");
    const b1WorkbookSource = readWebFile("src/components/B1StandardWorkbookPage.js");

    expect(a2WorkbookSource).toContain('<CourseInlinePracticePanel type="speaking" />');
    expect(b1WorkbookSource).toContain('<CourseInlinePracticePanel type="speaking" />');
    expect(cleanupSource).toContain('const HIDDEN_COURSE_LEVELS = "b2|c1"');
    expect(cleanupSource).toContain('const RESTORED_COURSE_LEVELS = "a2|b1"');
    expect(cleanupSource).not.toContain('const COURSE_LEVELS = "a2|b1|b2|c1"');

    window.history.pushState({}, "", "/campus/course/lesson/A2/21?view=workbook");
    document.body.innerHTML = speakingChatFixture();
    window.eval(cleanupSource);

    expect(window.cleanCourseSpeakingChat()).toBe(false);
    expect(document.querySelector('[data-course-inline-practice="speaking"]')).toBeVisible();
    expect(document.getElementById("embedded-wrapper")).toBeVisible();
    expect(document.getElementById("quick-starters")).toBeVisible();

    window.history.pushState({}, "", "/campus/course/lesson/B1/17?view=workbook");
    document.body.innerHTML = speakingChatFixture();

    expect(window.cleanCourseSpeakingChat()).toBe(false);
    expect(document.querySelector('[data-course-inline-practice="speaking"]')).toBeVisible();
    expect(document.getElementById("embedded-wrapper")).toBeVisible();
    expect(document.getElementById("quick-starters")).toBeVisible();
  });

  test("restores a chat panel hidden before navigating from B2 to A2", () => {
    const cleanupSource = readWebFile("public/course-speaking-chat-cleanup.js");
    window.history.pushState({}, "", "/campus/course/lesson/B2/4?chapter=1.4");
    document.body.innerHTML = speakingChatFixture();
    window.eval(cleanupSource);

    expect(window.cleanCourseSpeakingChat()).toBe(true);
    const panel = document.querySelector('[data-course-inline-practice="speaking"]');
    expect(panel).toHaveStyle({ display: "none" });

    window.history.pushState({}, "", "/campus/course/lesson/A2/21?view=workbook");
    expect(window.cleanCourseSpeakingChat()).toBe(true);
    expect(panel).toBeVisible();
    expect(panel).not.toHaveAttribute("data-course-free-chat-hidden");
  });

  test("does not remove the standalone speaking exam room", () => {
    const cleanupSource = readWebFile("public/course-speaking-chat-cleanup.js");
    window.history.pushState({}, "", "/exams/speaking");
    document.body.innerHTML = `
      <main>
        <div id="standalone-speaking"><h1>Goethe Speaking Exam Coach</h1></div>
        <div id="standalone-starters"><label>Quick starters</label></div>
      </main>
    `;

    window.eval(cleanupSource);
    expect(window.cleanCourseSpeakingChat()).toBe(false);

    expect(document.getElementById("standalone-speaking")).toBeVisible();
    expect(document.getElementById("standalone-starters")).toBeVisible();
  });
});