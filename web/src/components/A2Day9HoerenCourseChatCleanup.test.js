import fs from "fs";
import path from "path";

const readWebFile = (relativePath) =>
  fs.readFileSync(path.join(__dirname, "../..", relativePath), "utf8");

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

  test("removes the free chat and Quick starters from A2-C1 coursebook routes", () => {
    const cleanupSource = readWebFile("public/course-speaking-chat-cleanup.js");
    window.history.pushState({}, "", "/campus/course/lesson/B2/4?chapter=1.4");
    document.body.innerHTML = `
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

    window.eval(cleanupSource);
    expect(window.cleanCourseSpeakingChat()).toBe(true);

    expect(document.querySelector('[data-course-inline-practice="speaking"]')).toHaveStyle({ display: "none" });
    expect(document.getElementById("embedded-wrapper")).toHaveStyle({ display: "none" });
    expect(document.getElementById("quick-starters")).toHaveStyle({ display: "none" });
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
