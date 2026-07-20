import {
  applyRequestedLessonAiVideoHeader,
  resolveRequestedLessonAiVideo,
  restoreNativeRequestedAiVideoSection,
} from "./RequestedLessonAiVideoHeader";

const buildB2LessonDom = () => {
  document.body.innerHTML = `
    <main class="layout-main">
      <header data-lesson-hero="true"><h1>Gesellschaftliche Vielfalt</h1></header>
      <div role="tablist"></div>
      <section data-native-ai="true">
        <h2>AI video</h2>
        <p>No dedicated AI video has been added yet.</p>
      </section>
    </main>
  `;
};

const buildB1LessonHubDom = () => {
  document.body.innerHTML = `
    <main class="layout-main">
      <div data-lesson-hub-header="true">
        <h1>Medien und Arbeiten im Homeoffice</h1>
      </div>
      <section data-resource-hub="true">Lesson resources</section>
    </main>
  `;
};

const buildB1WorkbookDom = () => {
  document.body.innerHTML = `
    <main class="layout-main">
      <div data-workbook-header="true">
        <h1>B1 Workbook · Medien und Arbeiten im Homeoffice</h1>
      </div>
      <section data-guidance="true">Workbook guidance</section>
    </main>
  `;
};

describe("requested B1 and B2 AI lesson videos", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    restoreNativeRequestedAiVideoSection();
  });

  test("resolves the approved B2 Day 7 Chapter 2.2 video only on the requested lesson", () => {
    expect(
      resolveRequestedLessonAiVideo({
        pathname: "/campus/course/lesson/B2/7",
        search: "?chapter=2.2",
      }),
    ).toEqual(
      expect.objectContaining({
        key: "b2-day7-chapter-2.2-ai-video",
        videoId: "iCvmhacEpSM",
      }),
    );

    expect(
      resolveRequestedLessonAiVideo({
        pathname: "/campus/course/lesson/B2/7",
        search: "?chapter=2.3",
      }),
    ).toBeNull();
  });

  test("resolves the B1 Day 15 AI video only on the lesson hub", () => {
    expect(
      resolveRequestedLessonAiVideo({
        pathname: "/campus/course/lesson/B1/15",
        search: "?chapter=5.15&hub=1",
      }),
    ).toEqual(
      expect.objectContaining({
        key: "b1-day15-lesson-hub-ai-video",
        videoId: "bWiBTVo0EU4",
      }),
    );

    expect(
      resolveRequestedLessonAiVideo({
        pathname: "/campus/course/lesson/B1/15",
        search: "?view=workbook&radio=done",
      }),
    ).toBeNull();

    expect(
      resolveRequestedLessonAiVideo({
        pathname: "/campus/course/lesson/B1/15",
        search: "?view=grammar",
      }),
    ).toBeNull();
  });

  test("replaces the B2 placeholder with the approved embedded AI video", () => {
    buildB2LessonDom();

    expect(
      applyRequestedLessonAiVideoHeader({
        pathname: "/campus/course/lesson/B2/7",
        search: "?chapter=2.2",
      }),
    ).toBe(1);

    const hero = document.querySelector('[data-lesson-hero="true"]');
    const card = document.querySelector('[data-requested-lesson-ai-video="true"]');
    const nativeSection = document.querySelector('[data-native-ai="true"]');

    expect(hero.nextElementSibling).toBe(card);
    expect(nativeSection.style.display).toBe("none");
    expect(card.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/iCvmhacEpSM",
    );
  });

  test("adds the B1 AI video to the lesson hub before the resource cards", () => {
    buildB1LessonHubDom();

    expect(
      applyRequestedLessonAiVideoHeader({
        pathname: "/campus/course/lesson/B1/15",
        search: "?chapter=5.15&hub=1",
      }),
    ).toBe(1);

    const header = document.querySelector('[data-lesson-hub-header="true"]');
    const card = document.querySelector('[data-requested-lesson-ai-video="true"]');
    expect(header.nextElementSibling).toBe(card);
    expect(card.nextElementSibling).toHaveAttribute("data-resource-hub", "true");
    expect(card.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/bWiBTVo0EU4",
    );
  });

  test("does not add the B1 AI video anywhere inside the workbook tabs", () => {
    buildB1WorkbookDom();

    expect(
      applyRequestedLessonAiVideoHeader({
        pathname: "/campus/course/lesson/B1/15",
        search: "?view=workbook&assignmentKey=B1-5.15&radio=done",
      }),
    ).toBe(0);
    expect(document.querySelector('[data-requested-lesson-ai-video="true"]')).toBeNull();
  });

  test("does not inject either video on unrelated lesson routes", () => {
    buildB1WorkbookDom();
    expect(
      applyRequestedLessonAiVideoHeader({
        pathname: "/campus/course/lesson/B1/14",
        search: "?view=workbook",
      }),
    ).toBe(0);
    expect(document.querySelector('[data-requested-lesson-ai-video="true"]')).toBeNull();
  });
});
